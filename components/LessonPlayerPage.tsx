import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Clock, CheckCircle2, Loader2, Volume2, Mic, MicOff,
    MessageSquare, User, AlertCircle, Sparkles, X, ChevronRight, Settings
} from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { decode, decodeAudioData, createBlob } from '../utils/audio';

const MODEL_NAME = 'models/gemini-2.0-flash-exp';

// Mapping of Lesson IDs to Presentation URLs (Google Drive Preview Links)
const PRESENTATION_URLS: Record<string, string> = {
    'l_efb_01_01': 'https://drive.google.com/file/d/1paR8iUgPD9Upwu4rSqf-Q22grwBY3nmk/preview',
    'l_efb_01_02': 'https://drive.google.com/file/d/1veHAywJjL9-yEM1he3oC_AiZIUujdv9q/preview',
    'l_efb_01_03': 'https://drive.google.com/file/d/1MzhQpd5h8cB-lTMeYrSisVEK4uI0DmXi/preview'
};

interface Lesson {
    id: string;
    title: string;
    description: string;
    content_text: string;
    lesson_type: string;
    difficulty_level: string;
    estimated_minutes: number;
    learning_objectives: string[];
}

export function LessonPlayerPage() {
    const { lessonId } = useParams<{ lessonId: string }>();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeSpent, setTimeSpent] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    // Voice Session State
    const [isLive, setIsLive] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [inputTranscription, setInputTranscription] = useState("");
    const [outputTranscription, setOutputTranscription] = useState("");
    const [hasStarted, setHasStarted] = useState(false);

    // Progress for Completion
    const [sessionProgress, setSessionProgress] = useState(0);
    const [isCompletionEnabled, setIsCompletionEnabled] = useState(false);
    const [debugStatus, setDebugStatus] = useState("Ready"); // Debugging status
    const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Audio Refs (matching App.tsx implementation)
    const audioContextRef = useRef<AudioContext | null>(null);
    const outAudioContextRef = useRef<AudioContext | null>(null);
    const nextStartTimeRef = useRef(0);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const sessionRef = useRef<any>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const isAiSpeakingRef = useRef(false);
    const isClosingSessionRef = useRef(false);
    const transcriptionContainerRef = useRef<HTMLDivElement>(null);

    const userEmail = localStorage.getItem('myenglish_userEmail');
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Check if current lesson has a presentation
    const presentationUrl = lessonId ? PRESENTATION_URLS[lessonId] : undefined;

    // Initial cleanup effect
    useEffect(() => {
        return () => stopAudio();
    }, []);

    // Auto-scroll transcription
    useEffect(() => {
        if (transcriptionContainerRef.current) {
            requestAnimationFrame(() => {
                if (transcriptionContainerRef.current) {
                    transcriptionContainerRef.current.scrollTo({
                        top: transcriptionContainerRef.current.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            });
        }

        // Check for "start" command
        if (!hasStarted && inputTranscription.toLowerCase().includes('start')) {
            startLessonContent();
        }
    }, [inputTranscription, outputTranscription]);

    const fetchLesson = async () => {
        try {
            const url = userEmail
                ? `/api/learning/lessons/${lessonId}?user_email=${userEmail}`
                : `/api/learning/lessons/${lessonId}`;

            const response = await fetch(url);
            const data = await response.json();
            setLesson(data);
        } catch (error) {
            console.error('Error fetching lesson:', error);
        } finally {
            setLoading(false);
        }
    };

    const initAudio = async () => {
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                outAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            if (audioContextRef.current.state === 'suspended') await audioContextRef.current.resume();
            if (outAudioContextRef.current?.state === 'suspended') await outAudioContextRef.current.resume();
        } catch (e) {
            console.error("Audio initialization failed:", e);
        }
    };

    const stopAudio = () => {
        console.log('🛑 Stopping audio and closing session...');
        isClosingSessionRef.current = true;

        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.onaudioprocess = null;
            try { scriptProcessorRef.current.disconnect(); } catch (e) { }
            scriptProcessorRef.current = null;
        }

        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => {
                try { track.stop(); } catch (e) { }
            });
            mediaStreamRef.current = null;
        }

        for (const source of sourcesRef.current) {
            try { source.stop(); } catch (e) { }
        }
        sourcesRef.current.clear();
        nextStartTimeRef.current = 0;
        setIsLive(false);

        if (sessionRef.current) {
            const sessionToClose = sessionRef.current;
            sessionRef.current = null;
            try { sessionToClose.close(); } catch (e) { }
            isClosingSessionRef.current = false;
        } else {
            isClosingSessionRef.current = false;
        }
    };

    const playAudio = async (audioData: string) => {
        if (!outAudioContextRef.current) return;
        const outCtx = outAudioContextRef.current;
        if (outCtx.state === 'suspended') await outCtx.resume();
        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
        try {
            const buffer = await decodeAudioData(decode(audioData), outCtx, 24000, 1);
            const source = outCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(outCtx.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(source);
            source.onended = () => sourcesRef.current.delete(source);
        } catch (e) {
            console.error("Audio playback error:", e);
        }
    };

    const startVoiceSession = async () => {
        if (!lesson) return;

        stopAudio();
        setConnectionError(null);
        setHasStarted(false);
        setInputTranscription("");
        setOutputTranscription("");

        const apiKey = localStorage.getItem('VITE_API_KEY') || import.meta.env.VITE_API_KEY;
        if (!apiKey) {
            setConnectionError("API Key missing. Please check settings.");
            return;
        }

        const ai = new GoogleGenAI({ apiKey });


        const SLIDE_PLANS: Record<string, string> = {
            'l_efb_01_01': `
SLIDE 1: Title Slide - "What is English?" (Introduction). Welcome the student.
SLIDE 2: "Global Language" - Mention 1.5 Billion speakers. Map visual.
SLIDE 3: "Why Learn English?" - Travel, Business, Entertainment.
SLIDE 4: "The Basics" - Brief mention of Alphabet/Vowels (Preview).
SLIDE 5: "Summary & Next Steps" - Encouragement.
`,
            'l_efb_01_02': `
SLIDE 1: Title & Introduction - "The English Alphabet". 26 Letters overview.
SLIDE 2: Letters A to H - Pronunciation and examples (Apple, Ball...).
SLIDE 3: Letters I to Q - Pronunciation and examples (Ice cream, Jug...).
SLIDE 4: Letters R to Z - Pronunciation and examples (Rat, Sun, Zebra...).
SLIDE 5: Summary - Vowels (A,E,I,O,U) vs Consonants Introduction.
`,
            'l_efb_01_03': `
SLIDE 1: Title Slide - "Vowels and Consonants". Welcome & Introduction to Sounds.
SLIDE 2: Vowels vs. Consonants - A, E, I, O, U vs the rest.
SLIDE 3: Short Vowel Sounds - Cat, Bed, Pig, Hot, Bus. Practice together.
SLIDE 4: Long Vowel Sounds - Cake, Feet, Bike, Bone, Cube. Practice together.
SLIDE 5: Common Consonant Blends - CH (Chair), SH (Ship), TH (This/Think).
SLIDE 6: Practice & Summary - Putting it all together. Final words.
`
        };

        const slidePlan = lesson ? SLIDE_PLANS[lesson.id] : null;

        const systemInstruction = `You are a friendly, expert English teacher.
        
CURRENT LESSON: "${lesson.title}"
OBJECTIVE: ${lesson.description}
CONTENT: ${lesson.content_text}

${slidePlan ? `SPECIFIC SLIDE STRUCTURE (FOLLOW THIS ORDER EXACTLY):
${slidePlan}
` : ''}

INSTRUCTIONS:
1. STRICT ADHERENCE: Teach ONLY the content provided in the "CONTENT" section above${slidePlan ? " and the KEY SLIDE POINTS from the structure above" : ""}.
2. When the user says "Start", begin the lesson immediately.
3. TEACH CONTINUOUSLY: Explain concepts, give examples (based on the content), and guide the student.
4. Speak naturally, with pauses and clear pronunciation.
5. If the user asks a question, answer it, then IMMEDIATELY return to the lesson content.
6. Target a 20-minute comprehensive lesson flow.
${presentationUrl ? `7. PRESENTATION MODE (CRITICAL - EXECUTE THIS ORDER): 
   - START with the first topic immediately.
   - TEACH NATURALLY: Do NOT announce "Slide 1", "Page 2", or "Next slide". Just teach the topic.
   - PACING & DEPTH: You MUST fill approximately ${lesson.estimated_minutes} minutes. DO NOT RUSH.
     - Expand on each slide point with detailed explanations, real-world examples, and stories.
     - Spend roughly ${(lesson.estimated_minutes / 5).toFixed(0)} minutes per slide topic.
   - TEACHING STYLE: Act like a real professor. Define new words clearly. Repeat critical concepts for retention. Use an encouraging, energetic tone.
   - TRANSITIONS: When finishing a topic, move naturally to the next one (e.g., "Moving on...", "Now let's look at...", "Another important aspect is...") corresponding to the structure above.
   - Assume the user is following along visually.
   - LOCK ONTO THE SLIDE TOPICS: Your teaching must MIRROR the "SPECIFIC SLIDE STRUCTURE". Do not jump ahead. Do not skip back.
   - VISUAL AWARENESS: Speak as if you are looking at the content with the user.
   - STEP-BY-STEP: Finish explaining Topic 1 completely before moving to Topic 2.` : ''}

IMPORTANT: Do not stop teaching unless asked. Keep the flow going. Don't say "Next slide". Fill the time. BE A GREAT TEACHER.`;

        try {
            const sessionPromise = ai.live.connect({
                model: MODEL_NAME,
                config: {
                    responseModalities: [Modality.AUDIO],
                    systemInstruction,
                    outputAudioTranscription: {},
                    inputAudioTranscription: {},
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
                    },
                },
                callbacks: {
                    onopen: async () => {
                        setIsLive(true);
                        setDebugStatus("Connected");
                        try {
                            const stream = await navigator.mediaDevices.getUserMedia({
                                audio: {
                                    echoCancellation: true,
                                    noiseSuppression: true,
                                    autoGainControl: true,
                                    sampleRate: 16000,
                                    channelCount: 1
                                }
                            });
                            mediaStreamRef.current = stream;
                            await initAudio();
                            const source = audioContextRef.current!.createMediaStreamSource(stream);
                            const processor = audioContextRef.current!.createScriptProcessor(1024, 1, 1);
                            scriptProcessorRef.current = processor;

                            processor.onaudioprocess = (e) => {
                                if (isAiSpeakingRef.current) return;
                                if (!scriptProcessorRef.current) return;
                                if (isClosingSessionRef.current) return;

                                const inputData = e.inputBuffer.getChannelData(0);
                                const pcmBlob = createBlob(inputData);

                                sessionPromise.then(session => {
                                    if (isClosingSessionRef.current || !session || !scriptProcessorRef.current || sessionRef.current !== session) return;
                                    try {
                                        session.sendRealtimeInput({ media: pcmBlob });
                                    } catch (e) { }
                                }).catch(() => { });
                            };

                            source.connect(processor);
                            processor.connect(audioContextRef.current!.destination);

                            // Start Progress Tracking
                            setSessionProgress(0);
                            setIsCompletionEnabled(false);
                            if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);

                            const durationSeconds = (lesson?.estimated_minutes || 2) * 60;
                            const thresholdSeconds = durationSeconds * 0.1;
                            let secondsElapsed = 0;

                            sessionTimerRef.current = setInterval(() => {
                                secondsElapsed += 1;
                                const progress = Math.min(100, (secondsElapsed / durationSeconds) * 100);
                                setSessionProgress(progress);
                                if (secondsElapsed >= thresholdSeconds) setIsCompletionEnabled(true);
                            }, 1000);

                        } catch (err) {
                            setConnectionError("Microphone access is required.");
                            setIsLive(false);
                        }
                    },
                    onmessage: async (msg: LiveServerMessage) => {
                        setDebugStatus("Receiving...");
                        if (msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
                            isAiSpeakingRef.current = true;
                            const audioBase64 = msg.serverContent.modelTurn.parts[0].inlineData.data;
                            await playAudio(audioBase64);
                        }

                        if (msg.serverContent?.outputTranscription) {
                            const text = msg.serverContent.outputTranscription.text;
                            // console.log("Transcription:", text);
                            setOutputTranscription(prev => (prev + text).slice(-10000));
                        }
                        if (msg.serverContent?.inputTranscription) {
                            const incoming = msg.serverContent!.inputTranscription!.text;
                            setInputTranscription(prev => (prev + " " + incoming).slice(-2000));
                        }

                        if (msg.serverContent?.interrupted) {
                            // isAiSpeakingRef.current = false;
                            // for (const source of sourcesRef.current) try { source.stop(); } catch (e) { }
                            // sourcesRef.current.clear();
                            // nextStartTimeRef.current = 0;
                            console.log("Interruption ignored in LessonPlayerPage");
                        }

                        if (msg.serverContent?.turnComplete) {
                            isAiSpeakingRef.current = false;
                        }
                    },
                    onclose: () => {
                        setIsLive(false);
                        stopAudio();
                    },
                    onerror: (e) => {
                        console.error("Session error:", e);
                        setIsLive(false);
                        setConnectionError("Connection lost.");
                    }
                }
            });

            sessionRef.current = await sessionPromise;
        } catch (e: any) {
            setConnectionError(e?.message || "Failed to start session.");
            setIsLive(false);
        }
    };

    const startLessonContent = async () => {
        if (!sessionRef.current || hasStarted) return;
        setHasStarted(true);
        console.log("Starting lesson content...");

        try {
            await sessionRef.current.send({
                parts: [{ text: "The user has said START. Begin the comprehensive lesson lecture now. Speak continuously and naturally, strictly following the provided content." }]
            });
        } catch (e) {
            console.error("Failed to send start trigger", e);
        }
    };

    useEffect(() => {
        if (lessonId) {
            fetchLesson();
        }
        return () => stopAudio();
    }, [lessonId]);

    useEffect(() => {
        if (isLive) {
            timerRef.current = setInterval(() => {
                setTimeSpent(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isLive]);

    // Calculate progress
    const progressPercentage = lesson ? Math.min(100, (timeSpent / (lesson.estimated_minutes * 60)) * 100) : 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!lesson) return null;

    return (
        <div className="min-h-screen bg-background flex flex-col text-foreground">
            <Header
                onGetStarted={() => navigate('/assessment')}
                onSignIn={() => navigate('/login')}
                onExploreCourses={() => navigate('/courses')}
            />

            <main className="flex-1 pt-20 sm:pt-24 pb-4 sm:pb-8 px-4 sm:px-8 w-full flex flex-col items-center">
                {/* Header Section */}
                <div className="w-full text-center mb-6 sm:mb-8 relative z-10 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 bg-indigo-50/50 dark:bg-indigo-500/10 backdrop-blur-md border border-indigo-100 dark:border-indigo-500/20 rounded-full text-[10px] sm:text-xs font-bold mb-4 sm:mb-6 text-indigo-600 dark:text-indigo-400 uppercase tracking-widest shadow-sm">
                        <Sparkles size={12} />
                        {lesson.lesson_type} • {lesson.difficulty_level}
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 sm:mb-6 tracking-tight text-slate-900 dark:text-white drop-shadow-sm">
                        {lesson.title}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                        {lesson.description}
                    </p>
                </div>

                {/* Navigation Back */}
                <div className="w-full max-w-7xl mb-6 sm:mb-8 flex justify-start z-20 relative">
                    <button
                        onClick={() => {
                            if ((lesson as any).course_id) {
                                navigate(`/learning/course/${(lesson as any).course_id}`);
                            } else {
                                navigate(-1);
                            }
                        }}
                        className="group flex items-center gap-2 sm:gap-3 pl-1.5 sm:pl-2 pr-4 sm:pr-6 py-2 sm:py-2.5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 flex items-center justify-center transition-all">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform sm:w-4 sm:h-4" />
                        </div>
                        <span className="font-bold text-xs sm:text-sm tracking-wide">Back to Modules</span>
                    </button>
                </div>

                {/* Content Container - Handles Split View */}
                <div className={`w-full max-w-7xl grid gap-6 ${presentationUrl ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 justify-items-center'}`}>

                    {/* Presentation Side (Left) */}
                    {presentationUrl && (
                        <div className="w-full min-h-[500px] h-[calc(100vh-280px)] sm:h-[650px] bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative animate-in slide-in-from-left-4 duration-700">
                            <div className="absolute top-0 left-0 right-0 p-4 bg-muted/30 backdrop-blur-md border-b border-border z-10 flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4v16" /><rect x="10" y="4" width="10" height="16" rx="2" /></svg>
                                </span>
                                <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Presentation Slides</span>
                            </div>
                            <iframe
                                src={presentationUrl}
                                className="w-full h-full pt-14"
                                allow="autoplay"
                                title="Lesson Presentation"
                            />
                        </div>
                    )}

                    {/* Voice Interaction Area (Right or Center) */}
                    <div className={`w-full ${!presentationUrl ? 'max-w-4xl' : ''} bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden flex flex-col relative min-h-[500px] h-[calc(100vh-280px)] sm:h-[650px] ring-1 ring-slate-900/5 animate-in slide-in-from-bottom-8 duration-700 delay-100`}>
                        {/* Visualizer Header */}
                        <div className="p-4 sm:p-6 border-b border-border bg-muted/30 backdrop-blur-md absolute top-0 left-0 right-0 z-10 flex flex-col gap-3 sm:gap-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]' : 'bg-gray-400'}`} />
                                    <span className="font-bold text-xs sm:text-sm tracking-wide">
                                        {isLive ? (hasStarted ? "AI TEACHING LIVE" : "LISTENING FOR 'START'") : "VIRTUAL CLASSROOM"}
                                    </span>
                                    {/* AI Teacher Badge Moved Here */}
                                    <div className="flex items-center gap-2 px-2 py-0.5 sm:px-3 sm:py-1 bg-indigo-600 text-white rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm ml-2">
                                        <Sparkles size={10} className="sm:w-3 sm:h-3" fill="currentColor" />
                                        AI Teacher
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <div className="hidden sm:flex items-center gap-2 text-xs font-bold font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/50">
                                        <Clock size={12} className="opacity-70" />
                                        <span>
                                            {Math.floor(timeSpent / 60).toString().padStart(2, '0')}:
                                            {(timeSpent % 60).toString().padStart(2, '0')}
                                        </span>
                                    </div>
                                    <div className="text-[10px] sm:text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-500/20 flex items-center gap-1.5 sm:gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                                        {Math.round(progressPercentage)}% Complete
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full h-1 sm:h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-linear"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        </div>

                        {/* Transcription / Content Area */}
                        <div
                            ref={transcriptionContainerRef}
                            className="flex-1 overflow-y-auto p-4 sm:p-8 pt-24 sm:pt-28 pb-28 sm:pb-32 space-y-4 sm:space-y-6 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm"
                        >
                            {!isLive ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 animate-in fade-in zoom-in duration-500 px-4">
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-2">
                                        <Sparkles size={40} className="sm:w-12 sm:h-12 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold mb-2">Ready to Learn?</h3>
                                        <p className="text-sm sm:text-base text-muted-foreground max-w-md">
                                            Join the live voice class. The AI teacher will guide you through the entire lesson interactively.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 sm:space-y-8 max-w-3xl mx-auto h-full flex flex-col">
                                    {!hasStarted && (
                                        <div className="flex justify-center mb-4 sm:mb-8">
                                            <button
                                                onClick={startLessonContent}
                                                className="bg-gradient-to-r from-rose-500 to-red-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold animate-pulse shadow-lg flex items-center gap-2 sm:gap-3 transform hover:scale-105 transition-transform text-sm sm:text-base cursor-pointer hover:shadow-xl active:scale-95"
                                            >
                                                <Mic size={18} className="sm:w-5 sm:h-5" />
                                                Say "START" or Click to Begin
                                            </button>
                                        </div>
                                    )}

                                    {/* Dedicated Transcription Box */}
                                    <div className="flex-1 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl overflow-hidden flex flex-col relative backdrop-blur-md">
                                        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white dark:from-slate-900 via-white/80 dark:via-slate-900/80 to-transparent z-10" />

                                        <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 custom-scrollbar pr-2 sm:pr-4 pt-4 relative">
                                            {outputTranscription ? (
                                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">

                                                    <p className="text-base sm:text-lg md:text-xl leading-relaxed text-black dark:text-white font-medium whitespace-pre-wrap font-sans">
                                                        {outputTranscription}
                                                        {isAiSpeakingRef.current && (
                                                            <span className="inline-block ml-2 w-2 h-4 bg-indigo-500 animate-pulse align-middle" />
                                                        )}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
                                                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center animate-pulse">
                                                        <Volume2 size={24} className="sm:w-8 sm:h-8 text-indigo-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-base sm:text-lg text-foreground font-bold">
                                                            {isAiSpeakingRef.current ? "Teacher is speaking..." : "Waiting for teacher..."}
                                                        </p>
                                                        {isAiSpeakingRef.current && (
                                                            <p className="text-xs sm:text-sm text-indigo-600 font-medium mt-2 animate-pulse">
                                                                (Listening to audio stream...)
                                                            </p>
                                                        )}
                                                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 font-mono">Status: {debugStatus}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-slate-900 via-white/80 dark:via-slate-900/80 to-transparent z-10 pointer-events-none" />

                                        {/* User Input Overlay - Compact */}
                                        {inputTranscription && (
                                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-bottom-2 bg-slate-50/50 dark:bg-slate-800/50 -mx-4 sm:-mx-8 -mb-4 sm:-mb-8 p-4 sm:p-6 text-xs sm:text-sm">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">You Said</span>
                                                </div>
                                                <p className="text-slate-700 dark:text-slate-300 font-medium">{inputTranscription}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bottom Controls */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-background via-background/90 to-transparent">
                            <div className="flex items-center justify-center gap-4 sm:gap-6">
                                {!isLive ? (
                                    <button
                                        onClick={startVoiceSession}
                                        className="px-6 py-3 sm:px-8 sm:py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-base sm:text-lg shadow-xl shadow-indigo-500/30 hover:scale-105 transition-all flex items-center gap-2 sm:gap-3"
                                    >
                                        <Mic size={20} className="sm:w-6 sm:h-6" />
                                        Enter Classroom
                                    </button>
                                ) : (
                                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full sm:w-auto">
                                        <div className="flex items-end gap-3 sm:gap-4 p-1.5 sm:p-2 bg-card border border-border rounded-full shadow-2xl w-full sm:w-auto justify-between sm:justify-start">
                                            <button
                                                onClick={stopAudio}
                                                className="w-12 h-12 sm:w-14 sm:h-14 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all shrink-0"
                                                title="End Session"
                                            >
                                                <MicOff size={20} className="sm:w-6 sm:h-6" />
                                            </button>
                                            <div className="px-4 sm:px-6 py-3 sm:py-4 flex-1 sm:flex-none">
                                                <div className="flex items-center gap-2 sm:gap-3 justify-center">
                                                    <div className="flex gap-1 h-3 sm:h-4 items-end">
                                                        {[...Array(5)].map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className={`w-1 bg-indigo-500 rounded-full transition-all duration-100 ${isAiSpeakingRef.current ? 'animate-pulse h-full' : 'h-1'}`}
                                                                style={{ height: isAiSpeakingRef.current ? `${Math.random() * 100}%` : '4px' }}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="font-bold text-xs sm:text-sm text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                                                        {isAiSpeakingRef.current ? "Teacher Speaking..." : "Listening..."}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Complete Button */}
                                        <button
                                            disabled={!isCompletionEnabled}
                                            onClick={async () => {
                                                if (lesson) {
                                                    try {
                                                        await fetch(`/api/learning/lessons/${lesson.id}/complete`, {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({
                                                                user_email: userEmail,
                                                                time_spent: Math.round(timeSpent / 60),
                                                                quiz_score: 100
                                                            })
                                                        });
                                                    } catch (e) { console.error(e); }
                                                }
                                                stopAudio();
                                                if ((lesson as any).course_id) {
                                                    navigate(`/learning/course/${(lesson as any).course_id}`);
                                                } else {
                                                    navigate('/dashboard');
                                                }
                                            }}
                                            className={`px-6 py-3 sm:px-6 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-xl flex items-center justify-center gap-2 transition-all w-full sm:w-auto ${isCompletionEnabled
                                                ? 'bg-green-500 hover:bg-green-600 text-white hover:scale-105 animate-pulse'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            {isCompletionEnabled ? <CheckCircle2 size={20} className="sm:w-6 sm:h-6" /> : <Loader2 size={20} className="animate-spin sm:w-6 sm:h-6" />}
                                            {isCompletionEnabled ? 'Complete' : `${Math.round(sessionProgress)}%`}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Connection Error Toast */}
                    {connectionError && (
                        <div className="mt-4 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-full flex items-center gap-2 animate-in slide-in-from-bottom-2">
                            <AlertCircle size={16} />
                            <span className="font-bold text-sm">{connectionError}</span>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
