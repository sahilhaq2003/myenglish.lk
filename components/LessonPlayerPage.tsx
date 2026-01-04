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
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const isAiSpeakingRef = useRef(false);
    const isClosingSessionRef = useRef(false);
    const transcriptionContainerRef = useRef<HTMLDivElement>(null);

    const userEmail = localStorage.getItem('myenglish_userEmail');
    const timerRef = useRef<NodeJS.Timeout | null>(null);

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

        const systemInstruction = `You are a friendly, expert English teacher.
        
CURRENT LESSON: "${lesson.title}"
OBJECTIVE: ${lesson.description}
CONTENT: ${lesson.content_text}

INSTRUCTIONS:
1. STRICT ADHERENCE: Teach ONLY the content provided in the "CONTENT" section above. Do not teach unrelated topics.
2. When the user says "Start", begin the lesson immediately.
3. TEACH CONTINUOUSLY: Explain concepts, give examples (based on the content), and guide the student.
4. Speak naturally, with pauses and clear pronunciation.
5. If the user asks a question, answer it, then IMMEDIATELY return to the lesson content.
6. Target a 20-minute comprehensive lesson flow.

IMPORTANT: Do not stop teaching unless asked. Keep the flow going like a real lecture/class. Your goal is to help the user master THIS SPECIFIC LESSON.`;

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
                            const thresholdSeconds = durationSeconds * 0.5;
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

            <main className="flex-1 pt-24 pb-8 px-4 sm:px-8 max-w-7xl mx-auto w-full flex flex-col items-center">
                {/* Header Section */}
                <div className="w-full text-center mb-8 relative z-10 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50/50 dark:bg-indigo-500/10 backdrop-blur-md border border-indigo-100 dark:border-indigo-500/20 rounded-full text-xs font-bold mb-6 text-indigo-600 dark:text-indigo-400 uppercase tracking-widest shadow-sm">
                        <Sparkles size={12} />
                        {lesson.lesson_type} • {lesson.difficulty_level}
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight text-slate-900 dark:text-white drop-shadow-sm">
                        {lesson.title}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                        {lesson.description}
                    </p>
                </div>

                {/* Navigation Back */}
                {/* Navigation Back */}
                <div className="w-full max-w-4xl mb-8 flex justify-start z-20 relative">
                    <button
                        onClick={() => {
                            if ((lesson as any).course_id) {
                                navigate(`/learning/course/${(lesson as any).course_id}`);
                            } else {
                                navigate(-1);
                            }
                        }}
                        className="group flex items-center gap-3 pl-2 pr-6 py-2.5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 flex items-center justify-center transition-all">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        </div>
                        <span className="font-bold text-sm tracking-wide">Back to Modules</span>
                    </button>
                </div>

                {/* Voice Interaction Area */}
                <div className="w-full max-w-4xl flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden flex flex-col relative h-[650px] ring-1 ring-slate-900/5">
                    {/* Visualizer Header */}
                    <div className="p-6 border-b border-border bg-muted/30 backdrop-blur-md absolute top-0 left-0 right-0 z-10 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]' : 'bg-gray-400'}`} />
                                <span className="font-bold text-sm tracking-wide">
                                    {isLive ? (hasStarted ? "AI TEACHING LIVE" : "LISTENING FOR 'START'") : "VIRTUAL CLASSROOM"}
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="hidden md:flex items-center gap-2 text-xs font-bold font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/50">
                                    <Clock size={12} className="opacity-70" />
                                    <span>
                                        {Math.floor(timeSpent / 60).toString().padStart(2, '0')}:
                                        {(timeSpent % 60).toString().padStart(2, '0')}
                                    </span>
                                </div>
                                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-500/20 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                                    {Math.round(progressPercentage)}% Complete
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-linear"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>

                    {/* Transcription / Content Area */}
                    <div
                        ref={transcriptionContainerRef}
                        className="flex-1 overflow-y-auto p-8 pt-28 pb-32 space-y-6 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm"
                    >
                        {!isLive ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-500">
                                <div className="w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-2">
                                    <Sparkles size={48} className="text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Ready to Learn?</h3>
                                    <p className="text-muted-foreground max-w-md">
                                        Join the live voice class. The AI teacher will guide you through the entire lesson interactively.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 max-w-3xl mx-auto h-full flex flex-col">
                                {!hasStarted && (
                                    <div className="flex justify-center mb-8">
                                        <div className="bg-gradient-to-r from-rose-500 to-red-600 text-white px-8 py-4 rounded-full font-bold animate-pulse shadow-lg flex items-center gap-3 transform hover:scale-105 transition-transform">
                                            <Mic size={20} />
                                            Please say "START" to begin the lesson
                                        </div>
                                    </div>
                                )}

                                {/* Dedicated Transcription Box */}
                                <div className="flex-1 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl overflow-hidden flex flex-col relative backdrop-blur-md">
                                    <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white dark:from-slate-900 via-white/80 dark:via-slate-900/80 to-transparent z-10" />

                                    <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-4 pt-4 relative">
                                        {outputTranscription ? (
                                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                                <div className="flex items-center gap-3 mb-4 sticky top-0 bg-white/90 dark:bg-slate-900/90 py-2 z-10 backdrop-blur-sm rounded-lg">
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                                                        <Sparkles size={12} fill="currentColor" />
                                                        AI Teacher
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground font-mono">{debugStatus}</span>
                                                </div>
                                                <p className="text-xl md:text-2xl leading-relaxed text-black dark:text-white font-medium whitespace-pre-wrap font-sans">
                                                    {outputTranscription}
                                                    {isAiSpeakingRef.current && (
                                                        <span className="inline-block ml-2 w-2 h-4 bg-indigo-500 animate-pulse align-middle" />
                                                    )}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
                                                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center animate-pulse">
                                                    <Volume2 size={32} className="text-indigo-500" />
                                                </div>
                                                <div>
                                                    <p className="text-lg text-foreground font-bold">
                                                        {isAiSpeakingRef.current ? "Teacher is speaking..." : "Waiting for teacher..."}
                                                    </p>
                                                    {isAiSpeakingRef.current && (
                                                        <p className="text-sm text-indigo-600 font-medium mt-2 animate-pulse">
                                                            (Listening to audio stream...)
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground mt-2 font-mono">Status: {debugStatus}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-slate-900 via-white/80 dark:via-slate-900/80 to-transparent z-10 pointer-events-none" />

                                    {/* User Input Overlay - Compact */}
                                    {inputTranscription && (
                                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-bottom-2 bg-slate-50/50 dark:bg-slate-800/50 -mx-8 -mb-8 p-6 text-sm">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">You Said</span>
                                            </div>
                                            <p className="text-slate-700 dark:text-slate-300 font-medium">{inputTranscription}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Controls */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background/90 to-transparent">
                        <div className="flex items-center justify-center gap-6">
                            {!isLive ? (
                                <button
                                    onClick={startVoiceSession}
                                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-lg shadow-xl shadow-indigo-500/30 hover:scale-105 transition-all flex items-center gap-3"
                                >
                                    <Mic size={24} />
                                    Enter Classroom
                                </button>
                            ) : (
                                <div className="flex items-center gap-6">
                                    <div className="flex items-end gap-4 p-2 bg-card border border-border rounded-full shadow-2xl">
                                        <button
                                            onClick={stopAudio}
                                            className="w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all"
                                            title="End Session"
                                        >
                                            <MicOff size={24} />
                                        </button>
                                        <div className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex gap-1 h-4 items-end">
                                                    {[...Array(5)].map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={`w-1 bg-indigo-500 rounded-full transition-all duration-100 ${isAiSpeakingRef.current ? 'animate-pulse h-full' : 'h-1'}`}
                                                            style={{ height: isAiSpeakingRef.current ? `${Math.random() * 100}%` : '4px' }}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="font-bold text-sm text-muted-foreground uppercase tracking-widest">
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
                                            navigate('/dashboard'); // Go back to dashboard after completing
                                        }}
                                        className={`px-6 py-4 rounded-full font-bold text-lg shadow-xl flex items-center gap-2 transition-all ${isCompletionEnabled
                                            ? 'bg-green-500 hover:bg-green-600 text-white hover:scale-105 animate-pulse'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        {isCompletionEnabled ? <CheckCircle2 size={24} /> : <Loader2 size={24} className="animate-spin" />}
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
            </main>
            <Footer />
        </div>
    );
}

// Helpers from App.tsx/Lessons
const isLikelyEnglish = (text: string) => {
    // Simple heuristic or actual logic
    return /^[a-zA-Z0-9\s.,!?'"-]+$/.test(text);
};
