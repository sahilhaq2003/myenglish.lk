import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage, Type } from '@google/genai';
import { 
  AppPhase, EnglishLevel, LearningPath, ASSESSMENT_QUESTIONS, 
  AIPersona, PERSONAS, MOCK_MODULES, Module 
} from './types';
import { decode, decodeAudioData, createBlob } from './utils/audio';
import { 
  Mic, MicOff, BookOpen, Star, GraduationCap, ArrowRight, CheckCircle2, 
  Settings, User, MapPin, TrendingUp, Info, RotateCcw, MessageSquare, 
  Flame, Award, Layout, Book, Coffee, FileText, Mail, Headphones, 
  ChevronRight, Play, CheckCircle, AlertCircle, Sparkles, LogOut, BarChart3,
  Calendar, ShieldCheck
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area
} from 'recharts';

const MODEL_NAME = 'gemini-2.5-flash-native-audio-preview-09-2025';

const BASE_SYSTEM_INSTRUCTION = `
You are myenglish.lk, a supportive English coach. Your goal is confidence, clarity, and correct grammar.
Style: Friendly, calm, motivating. Never shame or criticize. Keep explanations simple. Use short sentences.
Your tone should be professional yet encouraging.
Language policy: Use ONLY English. If the user speaks or writes in a non-English language, do not switch languages. Politely encourage them to speak in English and ignore non-English content.
`;

// Fix for line 28: Removed 'extends Window' to avoid conflict with the already defined 'aistudio' property on the global Window interface.
interface CustomWindow {
  aistudio: {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  };
}

const App: React.FC = () => {
  // --- Core State ---
  const [phase, setPhase] = useState<AppPhase>(() => {
    const saved = localStorage.getItem('myenglish_phase');
    return saved ? saved as AppPhase : AppPhase.WELCOME;
  });
  const [activeTab, setActiveTab] = useState<'home' | 'learn' | 'practice' | 'progress'>('home');
  const [isLive, setIsLive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [userLevel, setUserLevel] = useState<EnglishLevel | null>(() => {
    const saved = localStorage.getItem('myenglish_userLevel');
    return saved ? saved as EnglishLevel : null;
  });
  const [learningPath, setLearningPath] = useState<LearningPath | null>(() => {
    const saved = localStorage.getItem('myenglish_learningPath');
    return saved ? saved as LearningPath : null;
  });
  const [isThinking, setIsThinking] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<AIPersona | null>(null);
  const [outputTranscription, setOutputTranscription] = useState('');
  const [inputTranscription, setInputTranscription] = useState('');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [languageWarning, setLanguageWarning] = useState<string | null>(null);

  // Heuristic English detector: considers text English if mostly ASCII or contains common English stopwords
  const isLikelyEnglish = (text: string) => {
    const t = (text || '').trim();
    if (!t) return true;
    const asciiCount = [...t].filter(ch => ch.charCodeAt(0) <= 127).length;
    const ratio = asciiCount / t.length;
    const lower = t.toLowerCase();
    const stops = [' the ', ' and ', ' is ', ' are ', ' you ', ' i ', ' to ', ' a ', ' in ', ' of ', ' that ', ' it '];
    const hasStop = stops.some(w => lower.includes(w) || lower.startsWith(w.trim() + ' '));
    return ratio > 0.8 || hasStop;
  };

  useEffect(() => {
    if (languageWarning) {
      const t = setTimeout(() => setLanguageWarning(null), 3000);
      return () => clearTimeout(t);
    }
  }, [languageWarning]);
  
  // --- Gamification State ---
  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('myenglish_points');
    return saved ? parseInt(saved) : 1250;
  });
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('myenglish_streak');
    return saved ? parseInt(saved) : 12;
  });
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem('myenglish_level');
    return saved ? parseInt(saved) : 4;
  });
  const [completedModules, setCompletedModules] = useState<string[]>(() => {
    const saved = localStorage.getItem('myenglish_completedModules');
    return saved ? JSON.parse(saved) : ['m1'];
  });
  const [filterType, setFilterType] = useState<string>('All');
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [moduleContent, setModuleContent] = useState<string>('');
  const [showModuleSession, setShowModuleSession] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  // --- User Profile State ---
  const [userName, setUserName] = useState(() => {
    const saved = localStorage.getItem('myenglish_userName');
    return saved || 'Sarah Johnson';
  });
  const [userEmail, setUserEmail] = useState(() => {
    const saved = localStorage.getItem('myenglish_userEmail');
    return saved || 'sarah.j@example.com';
  });
  const [learningGoal, setLearningGoal] = useState(() => {
    const saved = localStorage.getItem('myenglish_learningGoal');
    return saved || 'Professional Communication';
  });
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(() => {
    const saved = localStorage.getItem('myenglish_dailyGoalMinutes');
    return saved ? parseInt(saved) : 20;
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('myenglish_notificationsEnabled');
    return saved ? saved === 'true' : true;
  });

  // --- Persist to localStorage ---
  useEffect(() => {
    localStorage.setItem('myenglish_phase', phase);
  }, [phase]);

  useEffect(() => {
    if (userLevel) localStorage.setItem('myenglish_userLevel', userLevel);
  }, [userLevel]);

  useEffect(() => {
    if (learningPath) localStorage.setItem('myenglish_learningPath', learningPath);
  }, [learningPath]);

  useEffect(() => {
    localStorage.setItem('myenglish_points', points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem('myenglish_streak', streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('myenglish_level', level.toString());
  }, [level]);

  useEffect(() => {
    localStorage.setItem('myenglish_completedModules', JSON.stringify(completedModules));
  }, [completedModules]);

  useEffect(() => {
    localStorage.setItem('myenglish_userName', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('myenglish_userEmail', userEmail);
  }, [userEmail]);

  useEffect(() => {
    localStorage.setItem('myenglish_learningGoal', learningGoal);
  }, [learningGoal]);

  useEffect(() => {
    localStorage.setItem('myenglish_dailyGoalMinutes', dailyGoalMinutes.toString());
  }, [dailyGoalMinutes]);

  useEffect(() => {
    localStorage.setItem('myenglish_notificationsEnabled', notificationsEnabled.toString());
  }, [notificationsEnabled]);

  // --- Logout Function ---
  const handleLogout = () => {
    // Clear all localStorage data
    localStorage.clear();
    // Reset to welcome phase
    setPhase(AppPhase.WELCOME);
    setShowProfile(false);
    // Reset user data
    setUserLevel(null);
    setLearningPath(null);
    setPoints(1250);
    setStreak(12);
    setLevel(4);
    setCompletedModules(['m1']);
  };

  // --- Audio Refs ---
  const audioContextRef = useRef<AudioContext | null>(null);
  const outAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

  // --- Initialization & API Key Guard ---
  const ensureApiKey = async () => {
    const aistudio = (window as unknown as CustomWindow).aistudio;
    if (aistudio) {
      const hasKey = await aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await aistudio.openSelectKey();
      }
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
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    for (const source of sourcesRef.current) {
      try { source.stop(); } catch(e) {}
    }
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
    setIsLive(false);
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch(e) {}
      sessionRef.current = null;
    }
    setConnectionError(null);
  };

  const playAudio = async (audioData: string) => {
    if (!outAudioContextRef.current) return;
    const outCtx = outAudioContextRef.current;
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

  const createLiveCallbacks = (getSessionPromise: () => Promise<any>) => ({
    onopen: async () => {
      setIsLive(true);
      setConnectionError(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        await initAudio();
        const source = audioContextRef.current!.createMediaStreamSource(stream);
        const processor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
        scriptProcessorRef.current = processor;
        
        processor.onaudioprocess = (e) => {
          const inputData = e.inputBuffer.getChannelData(0);
          const pcmBlob = createBlob(inputData);
          getSessionPromise().then(session => {
            if (session) {
              session.sendRealtimeInput({ media: pcmBlob });
            }
          }).catch(err => {
            console.debug("Session not ready to receive input", err);
          });
        };
        
        source.connect(processor);
        processor.connect(audioContextRef.current!.destination);
      } catch (err) {
        setConnectionError("Microphone access is required for voice learning.");
        setIsLive(false);
      }
    },
    onmessage: async (msg: LiveServerMessage) => {
      // Audio Output handling
      if (msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data && outAudioContextRef.current) {
        const outCtx = outAudioContextRef.current;
        const audioBase64 = msg.serverContent.modelTurn.parts[0].inlineData.data;
        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
        try {
          const buffer = await decodeAudioData(decode(audioBase64), outCtx, 24000, 1);
          const source = outCtx.createBufferSource();
          source.buffer = buffer;
          source.connect(outCtx.destination);
          source.start(nextStartTimeRef.current);
          nextStartTimeRef.current += buffer.duration;
          sourcesRef.current.add(source);
          source.onended = () => sourcesRef.current.delete(source);
        } catch (e) {
          console.error("Audio decoding error:", e);
        }
      }

      // Transcriptions
      if (msg.serverContent?.outputTranscription) {
        setOutputTranscription(prev => (prev + " " + msg.serverContent!.outputTranscription!.text).slice(-500));
      }
      if (msg.serverContent?.inputTranscription) {
        const incoming = msg.serverContent!.inputTranscription!.text;
        if (isLikelyEnglish(incoming)) {
          setInputTranscription(prev => (prev + " " + incoming).slice(-500));
        } else {
          setLanguageWarning('Non-English speech ignored. Please speak in English.');
        }
      }

      // Interruption
      if (msg.serverContent?.interrupted) {
        for (const source of sourcesRef.current) try { source.stop(); } catch(e) {}
        sourcesRef.current.clear();
        nextStartTimeRef.current = 0;
      }
    },
    onerror: async (e: any) => {
      setIsLive(false);
      const errorMessage = e?.message || "A network error occurred. Please check your connection or API key.";
      setConnectionError(errorMessage);
      
      if (errorMessage.toLowerCase().includes("requested entity was not found")) {
        const aistudio = (window as unknown as CustomWindow).aistudio;
        if (aistudio) await aistudio.openSelectKey();
      }
    },
    onclose: () => {
      setIsLive(false);
    },
  });

  // --- Logic Flows ---

  const startAssessment = async () => {
    await ensureApiKey();
    await initAudio();
    setPhase(AppPhase.ASSESSMENT);
    setCurrentQuestionIndex(0);
    connectSession(AppPhase.ASSESSMENT, 0);
  };

  const connectSession = async (currentPhase: AppPhase, qIdx: number = 0, persona?: AIPersona) => {
    stopAudio();
    setConnectionError(null);
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
    
    let instruction = BASE_SYSTEM_INSTRUCTION;
    if (currentPhase === AppPhase.ASSESSMENT) {
      instruction += ` ASSESSMENT MODE: Ask ONLY this question: "${ASSESSMENT_QUESTIONS[qIdx].text}". Listen and observe for English proficiency level. Only respond in English. Ignore non-English input.`;
    } else if (currentPhase === AppPhase.LEARNING_SESSION && persona) {
      instruction += ` ROLEPLAY MODE: You are ${persona.name}, a ${persona.role}. Scenario: ${persona.scenario}. 
      RULES: Stay in character. Respond naturally. Only respond in English. If the user speaks another language, do not switch languages—politely ask them to speak English.`;
    }

    let sessionPromise: Promise<any>;
    try {
      sessionPromise = ai.live.connect({
        model: MODEL_NAME,
        config: { 
          responseModalities: [Modality.AUDIO], 
          systemInstruction: instruction,
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: persona?.voice || 'Kore' } }
          }
        },
        callbacks: createLiveCallbacks(() => sessionPromise)
      });
      sessionRef.current = await sessionPromise;
    } catch (e: any) {
      setConnectionError(e?.message || "Failed to establish a live connection.");
    }
  };

  const nextAssessmentStep = () => {
    if (currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      connectSession(AppPhase.ASSESSMENT, nextIdx);
    } else {
      stopAudio();
      performAnalysis();
    }
  };

  const performAnalysis = async () => {
    setPhase(AppPhase.ANALYZING);
    setIsThinking(true);
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: "Analyze the previous English assessment answers (simulated) and provide a professional English Level (Beginner to Advanced) and a 4-week roadmap.",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              level: { type: Type.STRING, description: 'One of: Beginner, Elementary, Intermediate, Upper-Intermediate, Advanced' },
              weeklyGoals: { type: Type.ARRAY, items: { type: Type.STRING } },
              grammarTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
              speakingFocus: { type: Type.ARRAY, items: { type: Type.STRING } },
              vocabularyThemes: { type: Type.ARRAY, items: { type: Type.STRING } },
              pronunciationFocus: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["level", "weeklyGoals", "grammarTopics", "speakingFocus", "vocabularyThemes", "pronunciationFocus"]
          }
        }
      });
      const data = JSON.parse(response.text || '{}');
      setUserLevel(data.level as EnglishLevel);
      setLearningPath(data);
      setPhase(AppPhase.RESULT);
    } catch (e) {
      setUserLevel(EnglishLevel.INTERMEDIATE);
      setPhase(AppPhase.RESULT);
    } finally {
      setIsThinking(false);
    }
  };

  const startRoleplay = async (persona: AIPersona) => {
    await ensureApiKey();
    await initAudio();
    setCurrentPersona(persona);
    setPhase(AppPhase.LEARNING_SESSION);
    setOutputTranscription('');
    setInputTranscription('');
    connectSession(AppPhase.LEARNING_SESSION, 0, persona);
  };

  const startModuleLearning = async (module: Module) => {
    setCurrentModule(module);
    setShowModuleSession(true);
    setOutputTranscription('');
    setInputTranscription('');
    setModuleContent('');
    
    // Generate AI instruction based on module type
    let moduleInstruction = BASE_SYSTEM_INSTRUCTION;
    
    if (module.type === 'Grammar') {
      moduleInstruction += `\nGRAMMAR LESSON: Teach "${module.title}" at ${module.level} level. 
      - Start with a simple explanation
      - Give 3 clear examples
      - Ask the student to create their own sentence
      - Correct gently if needed
      - Use voice to explain naturally
      - Use ONLY English; ignore non-English input`;
    } else if (module.type === 'Vocabulary') {
      moduleInstruction += `\nVOCABULARY LESSON: Teach "${module.title}" at ${module.level} level.
      - Introduce 5-7 new words with meanings
      - Use each word in a sentence
      - Ask the student to use the words
      - Practice pronunciation together
      - Make it interactive and fun
      - Use ONLY English; ignore non-English input`;
    } else if (module.type === 'Speaking') {
      moduleInstruction += `\nSPEAKING PRACTICE: "${module.title}" at ${module.level} level.
      - Create a natural conversation scenario
      - Encourage the student to speak freely
      - Give pronunciation feedback
      - Correct mistakes gently
      - Build confidence through practice
      - Use ONLY English; ignore non-English input`;
    } else if (module.type === 'Listening') {
      moduleInstruction += `\nLISTENING EXERCISE: "${module.title}" at ${module.level} level.
      - Tell a short story or dialogue
      - Ask comprehension questions
      - Repeat if needed
      - Check understanding
      - Discuss what they heard
      - Use ONLY English; ignore non-English input`;
    } else if (module.type === 'Reading') {
      moduleInstruction += `\nREADING LESSON: "${module.title}" at ${module.level} level.
      - Present a short text (read it aloud)
      - Ask about main ideas
      - Discuss vocabulary
      - Check comprehension
      - Encourage questions
      - Use ONLY English; ignore non-English input`;
    } else if (module.type === 'Writing') {
      moduleInstruction += `\nWRITING PRACTICE: "${module.title}" at ${module.level} level.
      - Explain the writing structure
      - Give a writing prompt
      - Listen to their ideas
      - Provide feedback
      - Help organize thoughts
      - Use ONLY English; ignore non-English input`;
    }

    await ensureApiKey();
    await initAudio();
    
    // Create a temporary persona for the module
    const modulePersona: AIPersona = {
      name: 'Teacher Emma',
      gender: 'female',
      role: `${module.type} Instructor`,
      personality: 'patient and encouraging',
      style: 'normal',
      voice: 'Kore',
      scenario: module.title
    };
    
    setCurrentPersona(modulePersona);
    
    // Start AI session with module-specific instruction
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
    
    try {
      const session = await ai.models.generateLiveContent({
        model: MODEL_NAME,
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstructions: [{ text: moduleInstruction }],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: modulePersona.voice } } },
        }
      });

      sessionRef.current = session;
      setIsLive(true);

      // Send initial greeting
      await session.send({
        text: `Start teaching ${module.title}. Begin with a warm greeting and brief introduction.`
      });

      // Handle responses
      for await (const msg of session.messages()) {
        if (msg.type === Type.SERVER_CONTENT) {
          const serverMsg = msg as LiveServerMessage;
          if (serverMsg.serverContent?.modelTurn?.parts) {
            for (const part of serverMsg.serverContent.modelTurn.parts) {
              if (part.text) {
                setModuleContent(prev => prev + part.text + ' ');
              }
              if (part.inlineData?.data) {
                const decoded = decode(part.inlineData.data);
                await playAudio(decoded);
              }
            }
          }
        }
        if (msg.type === Type.TOOL_CALL) {
          setIsThinking(true);
        }
        if (msg.type === Type.TOOL_CALL_CANCELLATION || msg.type === Type.CONTENT) {
          setIsThinking(false);
        }
      }
    } catch (e: any) {
      console.error("Module session error:", e);
      const errorMessage = e?.message || "Unable to start lesson. Please try again.";
      setConnectionError(errorMessage);
      setShowModuleSession(false);
    }
  };

  // --- UI Components ---

  const WelcomeView = () => (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 sm:px-6 py-10 text-center text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-50" />
      <div className="relative z-10 flex flex-col items-center max-w-3xl w-full">
        <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl mb-8 transform hover:scale-110 transition-transform duration-500">
          <GraduationCap size={56} className="text-white" />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tighter">myenglish.lk</h1>
        <p className="text-lg sm:text-xl text-indigo-200 mb-12 font-medium opacity-90 leading-relaxed">
          Master English with your personal AI coach.<br />
          Experience real-time voice conversations and personalized learning.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button 
            onClick={startAssessment}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Get Started <ArrowRight size={20} />
          </button>
          <button className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white py-5 rounded-2xl font-bold text-lg transition-all">
            Sign In
          </button>
        </div>
        <p className="mt-8 text-white/30 text-sm flex items-center gap-2">
          <ShieldCheck size={16} /> Privacy-first English learning
        </p>
      </div>
    </div>
  );

  const AssessmentView = () => {
    const q = ASSESSMENT_QUESTIONS[currentQuestionIndex];
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="p-4 sm:p-6 bg-white border-b border-gray-100 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Question {q.id} of 5</span>
            <div className="h-1.5 w-32 sm:w-40 md:w-48 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-500" 
                style={{ width: `${(q.id / 5) * 100}%` }} 
              />
            </div>
          </div>
          <button onClick={stopAudio} className="text-gray-400 hover:text-red-500 transition-colors">
            <LogOut size={20} />
          </button>
        </header>

  <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-8 text-center max-w-3xl mx-auto">
          <div className="mb-12">
            <span className="px-4 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
              {q.focus}
            </span>
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
              {q.text}
            </h2>
          </div>

          <div className="flex flex-col items-center gap-8 relative">
            <div className={`p-8 rounded-full transition-all duration-500 ${isLive ? 'bg-indigo-600 shadow-[0_0_50px_rgba(79,70,229,0.4)] animate-pulse' : 'bg-white shadow-lg shadow-gray-200'}`}>
              <Mic size={64} className={isLive ? 'text-white' : 'text-gray-400'} />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-lg font-bold text-gray-900 mb-2">
                {isLive ? "I'm Listening..." : "Connecting Voice Engine..."}
              </p>
              {isLive && (
                <div className="flex gap-1 h-8 items-end">
                  {[1,2,3,4,5,4,3,2,1].map((h, i) => (
                    <div key={i} className="w-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ height: `${h * 15}%`, animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              )}
            </div>
            
            <button 
              onClick={nextAssessmentStep}
              className="mt-8 px-12 py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-xl hover:bg-black transition-all active:scale-95"
            >
              Continue to Next Question
            </button>
          </div>
        </main>
        
        {connectionError && (
          <div className="p-4 bg-red-50 border-t border-red-100 flex items-center justify-center gap-2 text-red-600 font-medium">
            <AlertCircle size={18} /> {connectionError}
          </div>
        )}
      </div>
    );
  };

  const DashboardView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 flex">
      {/* Desktop Sidebar */}
      <aside className="w-72 bg-white/90 backdrop-blur-xl border-r border-slate-100 shadow-xl hidden lg:flex flex-col sticky top-0 h-screen p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg">
            <GraduationCap className="text-white" size={24} />
          </div>
          <span className="font-black text-2xl text-indigo-600 tracking-tight">myenglish.lk</span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'home', icon: Layout, label: 'Dashboard' },
            { id: 'learn', icon: Book, label: 'Learning Path' },
            { id: 'practice', icon: MessageSquare, label: 'AI Practice' },
            { id: 'progress', icon: BarChart3, label: 'Stats & Levels' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all border ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 border-indigo-500' 
                  : 'text-gray-600 hover:bg-slate-50 border-transparent'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="bg-gradient-to-br from-indigo-800 via-indigo-700 to-indigo-600 rounded-[2rem] p-6 text-white shadow-2xl shadow-indigo-200/50">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Flame size={20} />
              </div>
              <span className="text-xs font-bold bg-yellow-400 text-black px-2 py-0.5 rounded-full">PRO</span>
            </div>
            <h4 className="font-bold mb-1">Upgrade to Pro</h4>
            <p className="text-xs text-white/70 mb-4">Unlimited AI conversation and personalized grammar analysis.</p>
            <button className="w-full py-2 bg-white text-indigo-600 rounded-xl text-xs font-bold shadow-lg shadow-black/10">Upgrade Now</button>
          </div>
          
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-500 transition-colors font-medium">
            <LogOut size={20} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/90 backdrop-blur-xl border-b border-slate-100 p-6 flex items-center justify-between sticky top-0 z-10 lg:static shadow-sm">
          <div className="lg:hidden flex items-center gap-2">
             <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white" size={18} />
             </div>
             <span className="font-bold text-xl text-indigo-600">myenglish</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-2xl border border-orange-100 hidden sm:flex">
              <Flame size={20} fill="currentColor" />
              <span className="font-black">{streak} DAY STREAK</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-600 rounded-2xl border border-yellow-100 hidden sm:flex">
              <Award size={20} fill="currentColor" />
              <span className="font-black">{points} XP</span>
            </div>
            <button 
              onClick={() => setShowProfile(true)}
              className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 overflow-hidden hover:bg-indigo-100 transition-all hover:scale-110"
            >
               <User size={20} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-12 pb-24 lg:pb-12">
          {activeTab === 'home' && <HomeContent />}
          {activeTab === 'learn' && <LearnContent />}
          {activeTab === 'practice' && <PracticeContent />}
          {activeTab === 'progress' && <ProgressContent />}
        </div>
      </main>

      {/* Module Learning Overlay */}
      {showModuleSession && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
          <ModuleLearningView />
        </div>
      )}

      {/* Profile Overlay */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
          <ProfileView />
        </div>
      )}

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 lg:hidden flex justify-around p-4 z-20 shadow-2xl">
        {[
          { id: 'home', icon: Layout },
          { id: 'learn', icon: Book },
          { id: 'practice', icon: MessageSquare },
          { id: 'progress', icon: BarChart3 },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`p-3 rounded-2xl transition-all ${activeTab === item.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400'}`}
          >
            <item.icon size={24} />
          </button>
        ))}
      </nav>
    </div>
  );

  const HomeContent = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-gradient-to-br from-slate-900 via-indigo-800 to-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 inline-block">Recommended for You</span>
            <h2 className="text-4xl font-black mb-4 leading-tight">Master Job Interview Fluency with Daniel</h2>
            <p className="text-indigo-100 text-lg mb-8 opacity-90 max-w-lg">
              "Daniel will help you polish your professional English. Practice common interview questions and get real-time corrections."
            </p>
            <button 
              onClick={() => startRoleplay(PERSONAS[1])}
              className="px-8 py-4 bg-white text-indigo-700 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-all active:scale-95 flex items-center gap-2"
            >
              Start Session Now <Play size={20} fill="currentColor" />
            </button>
          </div>
          <div className="hidden lg:flex w-64 h-64 bg-white/10 rounded-full items-center justify-center border border-white/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-700">
             <User size={120} className="text-white/40" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white/90 backdrop-blur-lg p-8 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
            <BookOpen size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Continue Lesson</h3>
          <p className="text-gray-500 mb-6 flex-1">Grammar: Mastering Tenses for Daily Conversation</p>
          <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden mb-4">
             <div className="h-full bg-blue-500" style={{ width: '45%' }} />
          </div>
          <button className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
            Resume <ChevronRight size={18} />
          </button>
        </div>

        <div className="bg-white/90 backdrop-blur-lg p-8 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
            <Award size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Level Up!</h3>
          <p className="text-gray-500 mb-6 flex-1">Earn 250 XP more to reach <strong>Level 5: Intermediate Pro</strong></p>
          <div className="flex -space-x-3 mb-4">
            {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[10px] font-bold">A{i}</div>)}
            <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">+12</div>
          </div>
          <button className="text-purple-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
            View Leaderboard <ChevronRight size={18} />
          </button>
        </div>

        <div className="bg-white/90 backdrop-blur-lg p-8 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-6">
            <Calendar size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Daily Goal</h3>
          <p className="text-gray-500 mb-6 flex-1">Complete one 10-minute voice session to maintain your streak.</p>
          <div className="flex gap-2 mb-4">
             {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
               <div key={i} className={`flex-1 aspect-square rounded-lg flex items-center justify-center font-bold text-xs ${i < 4 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                 {d}
               </div>
             ))}
          </div>
          <button className="text-orange-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
            Set Reminders <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  const LearnContent = () => {
    const filteredModules = filterType === 'All'
      ? MOCK_MODULES 
      : MOCK_MODULES.filter(m => m.type === filterType);

    const categories = ['All', 'Grammar', 'Vocabulary', 'Speaking', 'Listening', 'Reading', 'Writing'];

    return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-8">
        <div>
           <h1 className="text-4xl font-black text-gray-900 mb-2">📚 Your Learning Library</h1>
           <p className="text-gray-500 font-medium">Master English with comprehensive lessons in Grammar, Vocabulary, Speaking, Listening, Reading & Writing.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button 
              key={category}
              onClick={() => setFilterType(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                filterType === category 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                  : 'bg-white border border-gray-100 text-gray-600 hover:border-indigo-200 hover:text-indigo-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredModules.length > 0 ? filteredModules.map(module => (
          <div key={module.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
            <div className="bg-indigo-50 h-40 flex items-center justify-center relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4">
                  {completedModules.includes(module.id) ? (
                    <div className="bg-green-500 text-white p-2 rounded-full shadow-lg"><CheckCircle size={20} /></div>
                  ) : (
                    <div className="bg-white text-indigo-200 p-2 rounded-full shadow-lg"><Star size={20} /></div>
                  )}
               </div>
               <div className="transform group-hover:scale-110 transition-transform duration-500">
                 {module.type === 'Grammar' && <Book size={48} className="text-indigo-300" />}
                 {module.type === 'Vocabulary' && <Sparkles size={48} className="text-indigo-300" />}
                 {module.type === 'Reading' && <BookOpen size={48} className="text-indigo-300" />}
                 {module.type === 'Writing' && <Mail size={48} className="text-indigo-300" />}
                 {module.type === 'Listening' && <Headphones size={48} className="text-indigo-300" />}
                 {module.type === 'Speaking' && <Mic size={48} className="text-indigo-300" />}
               </div>
            </div>
            <div className="p-8 flex flex-col flex-1">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">{module.type} • {module.level}</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{module.title}</h3>
              <p className="text-gray-500 text-sm mb-8 flex-1">{module.description || 'Comprehensive lesson with interactive exercises and practice.'}</p>
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                 <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">{module.progress}% Complete</span>
                 </div>
                 <button 
                   onClick={() => startModuleLearning(module)}
                   className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold group-hover:gradient-bg transition-all shadow-lg shadow-gray-200 hover:scale-105 active:scale-95"
                 >
                    {module.progress === 100 ? 'Review' : module.progress > 0 ? 'Continue' : 'Start'}
                 </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-500 text-lg">No modules found in this category.</p>
          </div>
        )}
      </div>
    </div>
    );
  };

  const PracticeContent = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">AI Roleplay Hub</h1>
        <p className="text-gray-500 text-lg leading-relaxed font-medium">
          Choose a scenario and start speaking. Our AI personas will respond naturally and help you improve with subtle grammar tips.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {PERSONAS.map(persona => (
          <div key={persona.name} className="bg-white rounded-[2.5rem] border border-gray-100 p-1 flex flex-col group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 h-full">
            <div className="bg-slate-50 rounded-[2.2rem] p-8 flex flex-col items-center text-center flex-1">
              <div className="w-24 h-24 gradient-bg rounded-3xl flex items-center justify-center shadow-xl mb-6 transform group-hover:rotate-6 transition-transform">
                <User size={48} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{persona.name}</h3>
              <p className="text-indigo-600 font-bold text-sm mb-4 uppercase tracking-widest">{persona.role}</p>
              
              <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold mb-6 flex items-center gap-2">
                 <MapPin size={12} /> {persona.scenario}
              </div>

              <p className="text-gray-500 text-sm italic mb-8 opacity-80 leading-relaxed">
                "{persona.personality} conversation. Ready to help you with {persona.scenario?.toLowerCase()}."
              </p>

              <button 
                onClick={() => startRoleplay(persona)}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-gray-200"
              >
                Start Speaking <Mic size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ProgressContent = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-4xl font-black text-gray-900">Your Progress</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
           <div className="flex justify-between items-center mb-10">
              <h3 className="font-bold text-xl text-gray-800">Learning Activity (XP)</h3>
              <div className="flex gap-2">
                 <button className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold">Week</button>
                 <button className="px-4 py-1.5 text-gray-400 rounded-full text-xs font-bold">Month</button>
              </div>
           </div>
           <div className="h-80">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={[
                 { day: 'Mon', xp: 450 }, { day: 'Tue', xp: 520 }, { day: 'Wed', xp: 480 },
                 { day: 'Thu', xp: 610 }, { day: 'Fri', xp: 850 }, { day: 'Sat', xp: 740 }, { day: 'Sun', xp: 900 }
               ]}>
                 <defs>
                    <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                       <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                 <YAxis hide />
                 <Tooltip 
                    contentStyle={{borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                    itemStyle={{fontWeight: 'bold', color: '#4f46e5'}}
                 />
                 <Area type="monotone" dataKey="xp" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorXp)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center">
           <h3 className="font-bold text-xl text-gray-800 mb-8 self-start">Proficiency Radar</h3>
           <div className="flex-1 w-full flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
               <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                 { subject: 'Grammar', A: 70 }, { subject: 'Vocabulary', A: 85 },
                 { subject: 'Listening', A: 90 }, { subject: 'Fluency', A: 65 },
                 { subject: 'Pronun', A: 80 }
               ]}>
                 <PolarGrid stroke="#f1f5f9" />
                 <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                 <Radar dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
               </RadarChart>
             </ResponsiveContainer>
           </div>
           <div className="mt-8 text-center">
              <p className="text-gray-400 font-medium text-sm mb-1 uppercase tracking-widest">Current Level</p>
              <h4 className="text-3xl font-black text-indigo-600">{userLevel || 'Intermediate'}</h4>
           </div>
        </div>
      </div>
    </div>
  );

  const LearningSessionView = () => (
    <div className="min-h-screen bg-slate-900 flex flex-col text-white">
      <header className="p-4 sm:p-6 bg-slate-900/50 backdrop-blur-xl border-b border-white/10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { stopAudio(); setPhase(AppPhase.DASHBOARD); }}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10"
          >
            <ChevronRight className="rotate-180" size={20} />
          </button>
          <div>
            <h3 className="font-bold flex items-center gap-2">
              Practice with {currentPersona?.name} 
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse' : 'bg-gray-500'}`} />
            </h3>
            <p className="text-xs text-white/50 font-medium">{currentPersona?.scenario}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10">
            <Settings size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-4 sm:p-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto w-full flex flex-col h-full gap-8">
          {/* Persona Display */}
          <div className="flex flex-col items-center">
             <div className="w-40 h-40 rounded-[2.5rem] bg-indigo-600/20 border-2 border-indigo-500/30 p-1 mb-6 relative">
               <div className="w-full h-full rounded-[2.2rem] bg-indigo-600 flex items-center justify-center overflow-hidden shadow-2xl">
                  <User size={80} className="text-white/40" />
               </div>
               {isLive && (
                 <div className="absolute inset-0 rounded-[2.5rem] border-4 border-white animate-pulse" />
               )}
             </div>
             <p className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-1">{currentPersona?.role}</p>
             <h4 className="text-2xl font-black">{currentPersona?.name}</h4>
          </div>

          {/* Conversation Visualization */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-0 sm:pr-4 px-2 pb-24 sm:pb-28 custom-scrollbar">
            {(inputTranscription || outputTranscription) ? (
              <div className="space-y-4">
                 {inputTranscription && (
                   <div className="flex flex-col items-end">
                      <div className="bg-indigo-600/40 border border-indigo-500/30 px-6 py-4 rounded-3xl rounded-tr-none max-w-[85%] animate-in fade-in slide-in-from-right-4">
                        <p className="text-sm text-indigo-100 font-medium">You</p>
                        <p className="text-white text-lg">{inputTranscription}</p>
                      </div>
                   </div>
                 )}
                 {outputTranscription && (
                   <div className="flex flex-col items-start">
                      <div className="bg-white/10 border border-white/10 px-6 py-4 rounded-3xl rounded-tl-none max-w-[85%] animate-in fade-in slide-in-from-left-4 backdrop-blur-sm">
                        <p className="text-sm text-white/40 font-medium">{currentPersona?.name}</p>
                        <p className="text-white text-lg leading-relaxed">{outputTranscription}</p>
                      </div>
                   </div>
                 )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/10 max-w-sm mb-6">
                   <MessageSquare className="mx-auto mb-4 text-indigo-400" size={32} />
                   <p className="text-white/60 font-medium italic">
                     "Hi! I'm {currentPersona?.name}. Start speaking whenever you're ready. I'll listen and we can talk about {currentPersona?.scenario?.toLowerCase()}."
                   </p>
                 </div>
              </div>
            )}
          </div>
        </div>

          {/* Controls Bar */}
          <div className="sticky bottom-0 left-0 right-0 px-4 sm:px-8 pb-4 sm:pb-8 bg-gradient-to-t from-slate-900/40 to-transparent flex justify-center z-10">
             <div className="bg-slate-800/80 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl sm:rounded-full flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-2xl w-full max-w-2xl">
             <button 
                onClick={() => startRoleplay(currentPersona!)}
                disabled={isLive}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform active:scale-90 ${
                  isLive ? 'bg-gray-600 cursor-not-allowed' : 'bg-indigo-600 shadow-indigo-500/30 hover:bg-indigo-700'
                }`}
              >
               <Mic size={28} />
             </button>
             
             <button 
                onClick={stopAudio}
                disabled={!isLive}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform active:scale-90 ${
                  !isLive ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-500 shadow-red-500/30 hover:bg-red-600'
                }`}
              >
               <MicOff size={28} />
             </button>
             
             <div className="pr-0 sm:pr-6 text-center sm:text-left">
                <p className="text-sm font-bold text-white mb-0.5">{isLive ? 'Live Session Active' : 'Session Paused'}</p>
                <div className="flex items-center gap-1.5">
                   <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                   <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{isLive ? 'AI Listening' : 'Click Mic to Start'}</span>
                </div>
               {languageWarning && (
                <p className="text-[11px] font-medium text-red-400 mt-2">{languageWarning}</p>
               )}
             </div>
           </div>
        </div>
      </main>

      {connectionError && (
        <div className="p-4 bg-red-900/40 text-red-200 text-center border-t border-red-500/20 backdrop-blur-md flex items-center justify-center gap-2">
          <AlertCircle size={16} /> {connectionError}
        </div>
      )}
    </div>
  );

  const AnalyzingView = () => (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-white text-center">
      <div className="relative mb-12">
        <div className="w-24 h-24 border-4 border-indigo-500/20 rounded-full animate-ping absolute inset-0" />
        <div className="w-24 h-24 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin relative" />
      </div>
      <h2 className="text-4xl font-black mb-4">Generating Your Path...</h2>
      <p className="text-indigo-200/60 max-w-sm font-medium">
        Our AI is analyzing your grammar, pronunciation, and fluency to craft your personalized 4-week roadmap.
      </p>
    </div>
  );

  const ResultView = () => (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-white text-center">
      <div className="w-32 h-32 bg-green-500/20 rounded-[2.5rem] flex items-center justify-center mb-8 border-2 border-green-500/30">
        <Award size={64} className="text-green-400" />
      </div>
      <h2 className="text-3xl font-bold mb-2">Assessment Complete!</h2>
      <p className="text-indigo-200/60 mb-10 text-xl font-medium">Your current English level is:</p>
      <div className="inline-block bg-white text-slate-900 px-12 py-6 rounded-[2rem] font-black text-4xl shadow-2xl mb-12 shadow-white/5">
        {userLevel}
      </div>
      <button 
        onClick={() => setPhase(AppPhase.PATH)}
        className="px-12 py-5 bg-indigo-600 rounded-2xl font-bold text-xl hover:bg-indigo-500 transition-all flex items-center gap-3 shadow-xl shadow-indigo-500/20"
      >
        View My Roadmap <ArrowRight size={24} />
      </button>
    </div>
  );

  const RoadmapView = () => (
    <div className="min-h-screen bg-slate-50 flex flex-col p-6 lg:p-12 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full">
         <div className="flex flex-col items-center text-center mb-16">
            <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Your 4-Week Mastery Path</h1>
            <p className="text-xl text-slate-500 font-medium max-w-2xl">
              We've tailored this curriculum specifically for your <span className="text-indigo-600 font-bold">{userLevel}</span> level and goals.
            </p>
         </div>

         <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-8">
               <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 h-full">
                  <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-8 flex items-center gap-2">
                    <TrendingUp size={16} /> Weekly Goals
                  </h3>
                  <div className="space-y-6">
                    {learningPath?.weeklyGoals.map((g, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">{i+1}</div>
                        <p className="text-slate-700 font-bold text-lg leading-snug">{g}</p>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
               <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                  <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Book size={16} /> Grammar Mastery
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {learningPath?.grammarTopics.map(t => (
                      <span key={t} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold">{t}</span>
                    ))}
                  </div>
               </div>
               
               <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                  <h3 className="text-xs font-black text-orange-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Mic size={16} /> Speaking Focus
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {learningPath?.speakingFocus.map(t => (
                      <span key={t} className="px-4 py-2 bg-orange-50 text-orange-700 rounded-xl text-sm font-bold">{t}</span>
                    ))}
                  </div>
               </div>
            </div>
         </div>

         <button 
           onClick={() => setPhase(AppPhase.DASHBOARD)}
           className="w-full mt-16 py-6 gradient-bg text-white rounded-[2.5rem] font-bold text-2xl shadow-2xl hover:scale-[1.01] transition-all flex items-center justify-center gap-4"
         >
           Access My Dashboard <CheckCircle size={28} />
         </button>
      </div>
    </div>
  );

  const ProfileView = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-[2.5rem] shadow-xl p-8 mb-6 border border-indigo-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowProfile(false)}
                  className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all"
                >
                  <ArrowRight size={24} className="rotate-180" />
                </button>
                <div>
                  <h1 className="text-3xl font-black text-gray-900">Profile & Settings</h1>
                  <p className="text-gray-500">Manage your account and preferences</p>
                </div>
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <User size={40} className="text-white" />
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-white rounded-[2.5rem] shadow-xl p-8 mb-6 border border-indigo-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User size={24} className="text-indigo-600" />
              Personal Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Current Level</label>
                <div className="px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-xl font-bold text-indigo-700">
                  {userLevel || 'Not assessed yet'}
                </div>
              </div>
            </div>
          </div>

          {/* Learning Preferences */}
          <div className="bg-white rounded-[2.5rem] shadow-xl p-8 mb-6 border border-indigo-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Settings size={24} className="text-indigo-600" />
              Learning Preferences
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Learning Goal</label>
                <select
                  value={learningGoal}
                  onChange={(e) => setLearningGoal(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option>Professional Communication</option>
                  <option>Academic English</option>
                  <option>Travel & Tourism</option>
                  <option>General Conversation</option>
                  <option>Business English</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Daily Practice Goal: {dailyGoalMinutes} minutes
                </label>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={dailyGoalMinutes}
                  onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>5 min</span>
                  <span>30 min</span>
                  <span>60 min</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Calendar size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Daily Reminders</p>
                    <p className="text-sm text-gray-500">Get notified to practice</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`relative w-14 h-8 rounded-full transition-all ${
                    notificationsEnabled ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      notificationsEnabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-[2.5rem] shadow-xl p-8 mb-6 border border-indigo-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 size={24} className="text-indigo-600" />
              Your Stats
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl">
                <Flame size={32} className="text-orange-500 mb-2" />
                <p className="text-3xl font-black text-orange-700">{streak}</p>
                <p className="text-sm font-medium text-orange-600">Day Streak</p>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl">
                <Award size={32} className="text-yellow-500 mb-2" />
                <p className="text-3xl font-black text-yellow-700">{points}</p>
                <p className="text-sm font-medium text-yellow-600">Total XP</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl">
                <CheckCircle2 size={32} className="text-green-500 mb-2" />
                <p className="text-3xl font-black text-green-700">{completedModules.length}</p>
                <p className="text-sm font-medium text-green-600">Completed</p>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl">
                <TrendingUp size={32} className="text-indigo-500 mb-2" />
                <p className="text-3xl font-black text-indigo-700">{level}</p>
                <p className="text-sm font-medium text-indigo-600">Level</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setShowProfile(false)}
              className="py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-all"
            >
              Save Changes
            </button>
            <button
              onClick={handleLogout}
              className="py-4 bg-red-50 text-red-600 rounded-2xl font-bold text-lg shadow-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={20} />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ModuleLearningView = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-[2.5rem] shadow-xl p-8 mb-6 border border-indigo-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  stopAudio();
                  setShowModuleSession(false);
                  setCurrentModule(null);
                }}
                className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all"
              >
                <ArrowRight size={24} className="rotate-180" />
              </button>
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{currentModule?.type} Lesson</span>
                <h1 className="text-3xl font-black text-gray-900">{currentModule?.title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold">
                {currentModule?.level}
              </div>
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                {currentModule?.type === 'Grammar' && <Book size={24} />}
                {currentModule?.type === 'Vocabulary' && <Sparkles size={24} />}
                {currentModule?.type === 'Speaking' && <Mic size={24} />}
                {currentModule?.type === 'Listening' && <Headphones size={24} />}
                {currentModule?.type === 'Reading' && <BookOpen size={24} />}
                {currentModule?.type === 'Writing' && <FileText size={24} />}
              </div>
            </div>
          </div>
          
          {/* Progress */}
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                style={{ width: `${currentModule?.progress || 0}%` }}
              />
            </div>
            <span className="text-sm font-bold text-gray-600">{currentModule?.progress}%</span>
          </div>
        </div>

        {/* AI Teacher Card */}
        <div className="bg-white rounded-[2.5rem] shadow-xl p-10 mb-6 border border-indigo-100">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <User size={40} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{currentPersona?.name}</h3>
              <p className="text-gray-500">{currentPersona?.role}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => startModuleLearning(currentModule!)}
                disabled={isLive}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-all ${
                  isLive 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-gradient-to-br from-green-500 to-emerald-600 hover:scale-110 hover:from-green-600 hover:to-emerald-700'
                }`}
              >
                <Mic size={28} className="text-white" />
              </button>
              <button
                onClick={() => stopAudio()}
                disabled={!isLive}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-all ${
                  !isLive 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-red-500 hover:scale-110 hover:bg-red-600'
                }`}
              >
                <MicOff size={28} className="text-white" />
              </button>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="bg-indigo-50 rounded-2xl p-6 min-h-[300px] max-h-[500px] overflow-y-auto">
            {moduleContent ? (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{moduleContent}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare size={32} className="text-indigo-500" />
                </div>
                <p className="text-gray-500 font-medium">Click the microphone to start your AI lesson</p>
                <p className="text-sm text-gray-400 mt-2">Your AI teacher will guide you through {currentModule?.title}</p>
              </div>
            )}
            
            {isThinking && (
              <div className="flex items-center gap-2 mt-4 text-indigo-600">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-sm font-medium ml-2">Teacher is thinking...</span>
              </div>
            )}
          </div>

          {/* Input Transcription */}
          {inputTranscription && (
            <div className="mt-6 bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <User size={20} className="text-gray-600" />
                <span className="text-sm font-bold text-gray-700">You said:</span>
              </div>
              <p className="text-gray-800">{inputTranscription}</p>
            </div>
          )}

          {/* Connection Error */}
          {connectionError && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <AlertCircle size={24} className="text-red-500" />
                <div className="flex-1">
                  <p className="text-red-800 font-medium">{connectionError}</p>
                  <button 
                    onClick={() => {
                      setConnectionError(null);
                      startModuleLearning(currentModule!);
                    }}
                    className="text-red-600 text-sm font-bold mt-2 hover:underline"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              if (!completedModules.includes(currentModule!.id)) {
                setCompletedModules([...completedModules, currentModule!.id]);
                setPoints(points + 50);
              }
              stopAudio();
              setShowModuleSession(false);
              setCurrentModule(null);
            }}
            className="py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={24} />
            Complete Lesson
          </button>
          <button
            onClick={() => {
              stopAudio();
              setShowModuleSession(false);
              setCurrentModule(null);
            }}
            className="py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold text-lg shadow-sm hover:bg-gray-200 transition-all"
          >
            Save & Exit
          </button>
        </div>
      </div>
    </div>
  );

  // --- Router ---
  switch(phase) {
    case AppPhase.WELCOME: return <WelcomeView />;
    case AppPhase.ASSESSMENT: return <AssessmentView />;
    case AppPhase.ANALYZING: return <AnalyzingView />;
    case AppPhase.RESULT: return <ResultView />;
    case AppPhase.PATH: return <RoadmapView />;
    case AppPhase.DASHBOARD: return <DashboardView />;
    case AppPhase.LEARNING_SESSION: return <LearningSessionView />;
    default: return <WelcomeView />;
  }
};

export default App;
