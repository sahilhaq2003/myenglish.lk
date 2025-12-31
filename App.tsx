import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate, NavLink, Outlet } from 'react-router-dom';
import { GoogleGenAI, Modality, LiveServerMessage, Type } from '@google/genai';
import {
  AppPhase, EnglishLevel, LearningPath, ASSESSMENT_QUESTIONS,
  AIPersona, PERSONAS, MOCK_MODULES, Module
} from './types';
import { ThemeToggle } from './components/ThemeToggle';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { CoursesPage } from './components/CoursesPage';
import { PricingPage } from './components/PricingPage';
import { ProfilePage } from './components/ProfilePage';

import { decode, decodeAudioData, createBlob } from './utils/audio';
import { getLessonContent, LessonContent } from './lessons';
import {
  Mic, MicOff, BookOpen, Star, GraduationCap, ArrowRight, CheckCircle2,
  Settings, User, MapPin, TrendingUp, Info, RotateCcw, MessageSquare,
  Flame, Award, Layout, Book, Coffee, FileText, Mail, Headphones,
  Volume2, Keyboard, X, ChevronRight, Play, Pause, AlertCircle, Loader2,
  LogOut, BarChart3, Calendar, ShieldCheck, Clock, HelpCircle, CheckCircle, Sparkles
} from 'lucide-react';
import { useTheme } from './context/ThemeContext';

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const isAuthenticated = localStorage.getItem('myenglish_token') === 'logged_in';
  if (!isAuthenticated) {
    return <Navigate to="/signup" replace />;
  }
  return children;
};


import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area
} from 'recharts';

const MODEL_NAME = 'models/gemini-2.0-flash-exp';

const DEFAULT_LEARNING_PATH: LearningPath = {
  level: EnglishLevel.INTERMEDIATE,
  weeklyGoals: [
    'Build a solid grammar base with present/past tenses and connectors.',
    'Expand practical vocabulary for work, travel, and daily life.',
    'Practice speaking with clear pronunciation and natural rhythm.',
    'Consolidate learning with writing, listening, and fluency drills.'
  ],
  grammarTopics: [
    'Present vs Past Tenses',
    'Present Perfect Basics',
    'Linking Words (and, but, because)',
    'Question Forms & Negatives',
    'Common Prepositions'
  ],
  speakingFocus: [
    'Clear self-introductions',
    'Daily routines and habits',
    'Past experience storytelling',
    'Polite requests and responses'
  ],
  vocabularyThemes: [
    'Workplace basics',
    'Travel & navigation',
    'Food & restaurants',
    'Common phrasal verbs'
  ],
  pronunciationFocus: [
    'Word stress in 2-3 syllable words',
    'Common vowel contrasts (ship/sheep)',
    'Ending sounds (t, d, s)',
    'Connected speech for clarity'
  ]
};

const BASE_SYSTEM_INSTRUCTION = `
You are myenglish.lk, a supportive English coach. Your goal is confidence, clarity, and correct grammar.

AUDIO & INTERACTION RULES:
- IGNORE background noise.
- Only stop speaking if the user clearly interrupts with words.
- If the user is silent or just making noise, CONTINUE speaking your full response.
- Do NOT stop mid-sentence.

RESPONSE STYLE:
- Keep responses SHORT and CONCISE (2-3 sentences max unless teaching)
- Speak naturally and conversationally
- Be friendly, calm, and motivating
- Never shame or criticize
- Use simple, clear language
- Respond QUICKLY - don't overthink

CONVERSATION FLOW:
- Listen actively and respond immediately
- Do not feel the need to ask a question at the end of every turn
- Allow the user to absorb the information
- Only ask a question if it is necessary for the specific exercise
- Celebrate progress with genuine enthusiasm
- CRITICAL: Never stop speaking in the middle of a sentence. valid JSON response.
- If you are listing items, limit to 3 items maximum.

LANGUAGE POLICY:
- Use ONLY English
- If user speaks another language, politely say: "Let's practice in English together!"
- Ignore non-English content and redirect to English

TEACHING APPROACH:
- Explain concepts clearly and briefly
- Give 2-3 examples maximum
- Check understanding with questions
- Encourage practice immediately
- Keep the energy positive and upbeat
`;

// Fix for line 28: Removed 'extends Window' to avoid conflict with the already defined 'aistudio' property on the global Window interface.
interface CustomWindow {
  aistudio: {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  };
}

const App: React.FC = () => {
  // --- Page Navigation State ---
  const navigate = useNavigate();
  const location = useLocation();

  // Sync Phase with Route to support browser navigation (Back/Forward)
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      if (phase !== AppPhase.WELCOME) {
        setPhase(AppPhase.WELCOME);
        // Clean up audio if returning home
        stopAudio();
      }
    } else if (path === '/assessment') {
      if (phase !== AppPhase.ASSESSMENT) setPhase(AppPhase.ASSESSMENT);
    } else if (path === '/analyzing') {
      if (phase !== AppPhase.ANALYZING) setPhase(AppPhase.ANALYZING);
    } else if (path === '/result') {
      if (phase !== AppPhase.RESULT) setPhase(AppPhase.RESULT);
    } else if (path === '/roadmap') {
      if (phase !== AppPhase.PATH) setPhase(AppPhase.PATH);
    } else if (path === '/dashboard') {
      if (phase !== AppPhase.DASHBOARD) setPhase(AppPhase.DASHBOARD);
    } else if (path === '/learning-session') {
      if (phase !== AppPhase.LEARNING_SESSION) setPhase(AppPhase.LEARNING_SESSION);
    }
  }, [location.pathname]);

  // --- Core State ---
  const [phase, setPhase] = useState<AppPhase>(() => {
    const saved = localStorage.getItem('myenglish_phase');
    return saved ? saved as AppPhase : AppPhase.WELCOME;
  });
  const [activeTab, setActiveTab] = useState<'home' | 'learn' | 'practice' | 'progress'>(() => {
    const saved = localStorage.getItem('myenglish_activeTab');
    return saved ? saved as 'home' | 'learn' | 'practice' | 'progress' : 'home';
  });
  const [isLive, setIsLive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [userLevel, setUserLevel] = useState<EnglishLevel | null>(() => {
    const saved = localStorage.getItem('myenglish_userLevel');
    return saved ? saved as EnglishLevel : null;
  });
  const [learningPath, setLearningPath] = useState<LearningPath | null>(() => {
    const saved = localStorage.getItem('myenglish_learningPath');
    try {
      return saved ? JSON.parse(saved) as LearningPath : null;
    } catch (e) {
      return null;
    }
  });

  // --- Settings State ---
  const [aiSpeakingRate, setAiSpeakingRate] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [showSettings, setShowSettings] = useState(false); // For the settings modal
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
  const [showLessonView, setShowLessonView] = useState(() => {
    const saved = localStorage.getItem('myenglish_showLessonView');
    return saved === 'true';
  });
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [showPracticeResults, setShowPracticeResults] = useState(false);

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
    if (
      phase === AppPhase.ASSESSMENT &&
      (currentQuestionIndex < 0 || currentQuestionIndex >= ASSESSMENT_QUESTIONS.length)
    ) {
      setCurrentQuestionIndex(0);
    }
  }, [phase, currentQuestionIndex]);

  useEffect(() => {
    localStorage.setItem('myenglish_activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('myenglish_showLessonView', showLessonView.toString());
  }, [showLessonView]);

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
    // Reset to welcome phase and navigate to home page
    setPhase(AppPhase.WELCOME);
    navigate('/');
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
  const isAiSpeakingRef = useRef(false);
  const transcriptionContainerRef = useRef<HTMLDivElement>(null);

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
      try { source.stop(); } catch (e) { }
    }
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
    setIsLive(false);
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch (e) { }
      sessionRef.current = null;
    }
    setConnectionError(null);
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

  const createLiveCallbacks = (getSessionPromise: () => Promise<any>) => ({
    onopen: async () => {
      setIsLive(true);
      setConnectionError(null);
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
          // Prevent barge-in interruptions: Ignore input until AI finishes its ENTIRE turn
          if (isAiSpeakingRef.current) return;
          // Guard against sending if stopped
          if (!scriptProcessorRef.current) return;

          const inputData = e.inputBuffer.getChannelData(0);
          const pcmBlob = createBlob(inputData);
          getSessionPromise().then(session => {
            // Check carefully if session is open before sending
            if (session && scriptProcessorRef.current) {
              try {
                // Only send if not closed
                if (!session.closed) { // Hypothetical property, but try/catch catches it mostly
                  session.sendRealtimeInput({ media: pcmBlob });
                }
              } catch (e) {
                // Debug log only, suppress spam
              }
            }
          }).catch(err => {
            // Ignore session not ready errors in loop
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
      if (msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
        isAiSpeakingRef.current = true; // AI is speaking
        const audioBase64 = msg.serverContent.modelTurn.parts[0].inlineData.data;
        await playAudio(audioBase64);
      }

      // Transcriptions
      if (msg.serverContent?.outputTranscription) {
        // Direct append, let the UI handle wrapping. API sends partial chunks.
        setOutputTranscription(prev => (prev + msg.serverContent!.outputTranscription!.text).slice(-2000));
      }
      if (msg.serverContent?.inputTranscription) {
        const incoming = msg.serverContent!.inputTranscription!.text;
        if (isLikelyEnglish(incoming)) {
          setInputTranscription(prev => (prev + " " + incoming).slice(-2000));
        } else {
          setLanguageWarning('Non-English speech ignored. Please speak in English.');
        }
      }

      // Interruption
      if (msg.serverContent?.interrupted) {
        isAiSpeakingRef.current = false; // Reset on interruption
        for (const source of sourcesRef.current) try { source.stop(); } catch (e) { }
        sourcesRef.current.clear();
        nextStartTimeRef.current = 0;
      }

      // Turn Complete
      if (msg.serverContent?.turnComplete) {
        isAiSpeakingRef.current = false; // Allow input again
        setIsThinking(false);
      }
    },
    onerror: async (e: any) => {
      setIsLive(false);
      const errorMessage = e?.message || "Connection lost. Please try again.";
      setConnectionError(errorMessage);
      console.error("Live API Error:", e);

      if (errorMessage.toLowerCase().includes("requested entity was not found")) {
        const aistudio = (window as unknown as CustomWindow).aistudio;
        if (aistudio) await aistudio.openSelectKey();
      }
    },
    onclose: () => {
      setIsLive(false);
      console.log("Session closed");
      stopAudio(); // Ensure cleanup happens when server closes connection
    },
  });

  // Auto-scroll transcription to bottom
  useEffect(() => {
    if (transcriptionContainerRef.current) {
      // Ensure DOM has updated before scrolling
      requestAnimationFrame(() => {
        if (transcriptionContainerRef.current) {
          transcriptionContainerRef.current.scrollTo({
            top: transcriptionContainerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      });
    }
  }, [inputTranscription, outputTranscription]);

  // --- Logic Flows ---

  const startAssessment = async () => {
    await ensureApiKey();
    await initAudio();
    setPhase(AppPhase.ASSESSMENT);
    setCurrentQuestionIndex(0);
    connectSession(AppPhase.ASSESSMENT, 0);
  };

  const connectSession = async (currentPhase: AppPhase, qIdx: number = 0, persona?: AIPersona) => {
    // If we're already connected in the same phase, don't reconnect (unless it's the start)
    // For Assessment, we use loose phase matching or just rely on sessionRef existance + send message logic
    // But connectSession is general.

    // Logic: If already live and same phase, return?
    // But Assessment needs to send a new message.

    // We will handle the "Stay Connected" logic in nextAssessmentStep. 
    // connectSession will REMAIN a "force connect" function.
    // So nextAssessmentStep will avoid calling this if possible.

    stopAudio();
    setConnectionError(null);

    const apiKey = import.meta.env.VITE_API_KEY || '';
    if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
      setConnectionError('API key not configured. Please set VITE_API_KEY in your .env file. Get your key from https://aistudio.google.com/apikey');
      return;
    }

    const ai = new GoogleGenAI({ apiKey });

    let instruction = BASE_SYSTEM_INSTRUCTION;
    if (currentPhase === AppPhase.ASSESSMENT) {
      // Generic instruction for persistent session
      instruction += ` ASSESSMENT MODE: You are an English Examiner. I will provide you with specific questions to ask the user via system text commands. 
      WHEN STARTING: Ask the first question: "${ASSESSMENT_QUESTIONS[0].text}".
      SUBSEQUENT STEPS: When I send you a text command starting with "NEXT_QUESTION:", immediately ask that question friendly and naturally.
      
      INTERACTION FLOW:
      1. ASK: Ask the specific question provided.
      2. LISTEN: Wait for the user to answer.
      3. GUIDE: After the user answers, give a SHORT, friendly acknowledgement (e.g., "Great explanation," "Thank you," "Got it"), and then CLEARLY say: "Please click the Next button to continue."
      
      RULES:
      - Be warm, encouraging, and professional.
      - "NEXT_QUESTION:" messages are from the SYSTEM, not the user. Ignore them as conversation, just follow the instruction.
      `;
    } else if (currentPhase === AppPhase.LEARNING_SESSION && persona) {
      instruction += ` ROLEPLAY MODE: You are ${persona.name}, a ${persona.role}. Scenario: ${persona.scenario}. 
      RULES: Stay in character. Respond naturally. Only respond in English. If the user speaks another language, do not switch languages—politely ask them to speak English.
      
      SPEAKING STYLE GUIDELINES:
      - Speed: ${aiSpeakingRate === 'normal' ? 'SLOW_AND_CLEAR' : aiSpeakingRate.toUpperCase()}
      - Tone: ROBUST AND STEADY. Avoid fluctuating pitch (up and down). Keep your voice grounded and consistent. Do not sound too excited or "sing-songy".
      - ${aiSpeakingRate === 'slow' ? 'Speak EXTREMELY SLOWLY. Pause significantly between every phrase. Articulate every syllable individually.' : aiSpeakingRate === 'fast' ? 'Speak at a standard conversational pace.' : 'Speak SLOWLY, STABLY, and clearly. Articulate every word distinctively. Maintain a consistent volume and pitch.'}
      `;
    }

    let sessionPromise: Promise<any>;
    try {
      sessionPromise = ai.live.connect({
        model: MODEL_NAME,
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: instruction,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: persona?.voice || 'Kore' } }
          },
          temperature: 0.7,
          maxOutputTokens: 2048,
          topP: 0.9,
          topK: 40
        },
        callbacks: createLiveCallbacks(() => sessionPromise)
      });
      sessionRef.current = await sessionPromise;
    } catch (e: any) {
      setConnectionError(e?.message || "Failed to establish a live connection.");
    }
  };

  const nextAssessmentStep = async () => {
    if (currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);

      // FAST PATH: If session is already active, just send the next question as text
      if (sessionRef.current && isLive) {
        const nextQ = ASSESSMENT_QUESTIONS[nextIdx].text;
        console.log("Sending next question via active session:", nextQ);
        try {
          // Send text to model to prompt the next question without reconnecting
          await sessionRef.current.send({ parts: [{ text: `NEXT_QUESTION: ${nextQ}` }] });
          return;
        } catch (e) {
          console.error("Failed to send next question, reconnecting...", e);
          // Fall through to reconnect
        }
      }

      // Fallback: Full Reconnect (Slower)
      connectSession(AppPhase.ASSESSMENT, nextIdx);
    } else {
      stopAudio();
      performAnalysis();
    }
  };

  const performAnalysis = async () => {
    setPhase(AppPhase.ANALYZING);
    navigate('/analyzing');
    setIsThinking(true);

    const apiKey = import.meta.env.VITE_API_KEY || '';
    if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
      setConnectionError('API key not configured. Please set VITE_API_KEY in your .env file.');
      setUserLevel(DEFAULT_LEARNING_PATH.level);
      setLearningPath(DEFAULT_LEARNING_PATH);
      setPhase(AppPhase.RESULT);
      navigate('/result');
      setIsThinking(false);
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: "Analyze the previous English assessment answers (simulated) and provide a professional English Level (Beginner to Advanced) and a 4-week roadmap.",
        config: {
          maxOutputTokens: 8192,
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
      const level = (data?.level as EnglishLevel) || DEFAULT_LEARNING_PATH.level;
      const path: LearningPath = {
        level,
        weeklyGoals: data?.weeklyGoals?.length ? data.weeklyGoals : DEFAULT_LEARNING_PATH.weeklyGoals,
        grammarTopics: data?.grammarTopics?.length ? data.grammarTopics : DEFAULT_LEARNING_PATH.grammarTopics,
        speakingFocus: data?.speakingFocus?.length ? data.speakingFocus : DEFAULT_LEARNING_PATH.speakingFocus,
        vocabularyThemes: data?.vocabularyThemes?.length ? data.vocabularyThemes : DEFAULT_LEARNING_PATH.vocabularyThemes,
        pronunciationFocus: data?.pronunciationFocus?.length ? data.pronunciationFocus : DEFAULT_LEARNING_PATH.pronunciationFocus,
      };
      setUserLevel(level);
      setLearningPath(path);
      setPhase(AppPhase.RESULT);
      navigate('/result');
    } catch (e) {
      setUserLevel(DEFAULT_LEARNING_PATH.level);
      setLearningPath(DEFAULT_LEARNING_PATH);
      setPhase(AppPhase.RESULT);
      navigate('/result');
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

    // Generate AI instruction based on module type with specific teaching personas
    let moduleInstruction = BASE_SYSTEM_INSTRUCTION;
    let teacherName = 'Professor Alex';
    let teacherPersonality = 'enthusiastic and supportive';

    if (module.type === 'Grammar') {
      teacherName = 'Professor Alex';
      teacherPersonality = 'patient, clear, and methodical';
      moduleInstruction += `\n
GRAMMAR TEACHER PERSONA: You are Professor Alex, a friendly and patient grammar expert who makes complex rules simple and fun.

⚠️ CRITICAL INSTRUCTION: START TEACHING IMMEDIATELY!
- As soon as the session begins, introduce yourself and START the lesson
- DO NOT wait for the student to speak first
- Begin with your greeting and immediately start explaining the topic
- Keep the conversation flowing - you are the teacher leading the lesson

TEACHING STYLE:
- Speak warmly and encouragingly, like a supportive mentor
- Use analogies and real-world examples to explain grammar concepts
- Break down complex rules into simple, digestible steps
- Celebrate student progress with genuine enthusiasm
- Use humor when appropriate to make learning enjoyable

LESSON: "${module.title}" at ${module.level} level

TEACHING SEQUENCE (FOLLOW THIS EXACTLY):
1. WARM GREETING: Start immediately with a friendly welcome
   "Hello! I'm Professor Alex, and today we're going to master ${module.title}. This is going to be fun and easier than you think!"

2. SIMPLE EXPLANATION: Immediately explain the grammar rule
   - Use everyday language, not technical jargon
   - Give a clear, memorable definition
   - Explain WHY this grammar matters in real conversations
   - Keep the explanation CONCISE (max 3-4 sentences). Do NOT give a long lecture.

3. VISUAL EXAMPLES: Provide 3-4 clear examples
   - Start with simple sentences
   - Progress to more complex usage
   - Use relatable, real-life situations
   - Highlight the grammar pattern in each example
   - Say each example clearly and explain it

4. CHECK UNDERSTANDING: Ask a question
   - "Does that make sense so far?"
   - "Can you see the pattern?"
   - Wait for student response

5. INTERACTIVE PRACTICE: Engage the student
   - "Now, I want you to try. Can you create a sentence using ${module.title}?"
   - Listen carefully to their response
   - Praise what they did right first
   - Gently correct mistakes with explanation
   - Ask follow-up questions to deepen understanding

6. MORE EXAMPLES: Continue teaching
   - Provide additional examples
   - Explain variations and exceptions
   - Keep the lesson moving forward

7. REAL-WORLD APPLICATION: Show practical usage
   - "You'll use this when..."
   - Give scenarios: job interviews, casual conversations, emails
   - Make it relevant to their goals

8. PRACTICE QUESTIONS: Ask 2-3 practice questions
   - Create scenarios for them to respond to
   - Give feedback on each response
   - Encourage and guide

9. QUICK REVIEW: Summarize key points
   - "So remember, the key is..."
   - End with encouragement and next steps

COMMUNICATION RULES:
- YOU lead the lesson - don't wait for student to initiate
- Speak naturally and conversationally (not like reading a textbook)
- Use pauses for emphasis and clarity
- Vary your tone to maintain engagement
- Don't overwhelm with questions; allow the student to process
- Check understanding occasionally, but not constantly
- Use ONLY English; if student speaks another language, gently redirect: "Let's practice in English together!"
- Be patient with mistakes - they're learning opportunities!
- Be patient with mistakes - they're learning opportunities!
- Keep talking and teaching, BUT keep turns short (under 20 seconds) to ensure you finish your sentences.
- NEVER stop mid-sentence. If you have a lot to say, say the first part, then ask "Shall I continue?"
- COMPLETENESS: Always finish your thought. Do not leave a sentence hanging.

EXAMPLE OPENING (START WITH THIS):
"Hi there! I'm Professor Alex, your grammar guide. Today's topic is ${module.title}, and I promise we'll make this crystal clear. Ready to dive in? Great! Let me start with a simple explanation... [then immediately begin explaining the grammar concept]"`;
    } else if (module.type === 'Vocabulary') {
      teacherName = 'Ms. Sophia';
      teacherPersonality = 'energetic, creative, and memorable';
      moduleInstruction += `\n
VOCABULARY TEACHER PERSONA: You are Ms. Sophia, an enthusiastic vocabulary expert who makes words come alive through stories, associations, and creative mnemonics.

⚠️ CRITICAL INSTRUCTION: START TEACHING IMMEDIATELY!
- As soon as the session begins, introduce yourself with energy and START teaching
- DO NOT wait for the student to speak first
- Begin with your enthusiastic greeting and immediately start teaching words
- Present each word clearly, explain it, and ask the student to practice
- Keep the energy high and the lesson moving forward

TEACHING STYLE:
- Speak with energy and passion for words
- Create memorable associations and stories for each word
- Use vivid descriptions and imagery
- Make vocabulary learning feel like discovering treasures
- Connect words to students' lives and interests

LESSON: "${module.title}" at ${module.level} level

TEACHING SEQUENCE:
1. EXCITING INTRODUCTION:
   "Welcome! I'm Ms. Sophia, and I LOVE words! Today we're exploring ${module.title}. Get ready to add some powerful new words to your vocabulary!"

2. WORD-BY-WORD TEACHING (5-7 words):
   For each word:
   a) INTRODUCE: Say the word clearly, spell it
   b) DEFINE: Give simple, clear meaning
   c) STORY/ASSOCIATION: Create a memorable story or image
      "Imagine this..." or "Think of it like..."
   d) EXAMPLE SENTENCE: Use it in a relatable context
   e) SYNONYMS/ANTONYMS: Connect to words they know
   f) PRONUNCIATION PRACTICE: Have them repeat it

3. INTERACTIVE USAGE:
   - Ask student to use each word in their own sentence
   - Create a mini-story using multiple new words
   - Play word association games
   - Ask which words they find most useful

4. MEMORY TECHNIQUES:
   - Share mnemonics or memory tricks
   - Create word families (related words)
   - Use visual imagery
   - Connect to their personal experiences

5. REAL-LIFE CONTEXTS:
   "You'll hear this word when..."
   "Use this word to sound more professional/natural/confident"

6. PRACTICE & REVIEW:
   - Quick quiz: "What was the word that means...?"
   - Encourage them to use words in conversation
   - Suggest ways to practice outside the lesson

COMMUNICATION STYLE:
- Speak with enthusiasm and variety in tone
- Use descriptive language and imagery
- Make each word feel special and important
- Celebrate when they use words correctly
- Create a sense of achievement with each new word learned
- Use ONLY English; make learning fun and immersive!

EXAMPLE OPENING:
"Hello, word explorer! I'm Ms. Sophia, and I'm thrilled to teach you ${module.title}! These words are going to make your English so much richer. Let's start with our first word - it's a really cool one!"`;

    } else if (module.type === 'Speaking') {
      teacherName = 'Coach Marcus';
      teacherPersonality = 'confident, encouraging, and motivating';
      moduleInstruction += `\n
SPEAKING COACH PERSONA: You are Coach Marcus, a dynamic speaking coach who builds confidence and fluency through practice, encouragement, and constructive feedback.

⚠️ CRITICAL INSTRUCTION: START COACHING IMMEDIATELY!
- As soon as the session begins, greet the student with energy and START the practice
- DO NOT wait for the student - YOU initiate the conversation
- Begin with your motivating greeting, then immediately ask warm-up questions
- Keep asking questions and creating speaking opportunities
- Lead the conversation - you are the coach guiding the practice

TEACHING STYLE:
- Speak with confidence and energy to inspire students
- Create a safe, judgment-free practice environment
- Focus on fluency first, accuracy second
- Give specific, actionable feedback
- Celebrate every attempt, no matter how small
- Build speaking stamina gradually

LESSON: "${module.title}" at ${module.level} level

COACHING SEQUENCE:
1. MOTIVATING WELCOME:
   "Hey there! I'm Coach Marcus, your speaking partner. Today we're working on ${module.title}. Remember: every word you speak is progress. Let's build your confidence together!"

2. WARM-UP EXERCISE:
   - Start with easy, low-pressure questions
   - "Tell me about your day" or "What do you enjoy doing?"
   - Get them comfortable speaking
   - Praise their effort immediately

3. TOPIC INTRODUCTION:
   - Explain today's speaking focus clearly
   - Share why this skill matters
   - "This will help you when..."
   - Set clear, achievable goals for the session

4. GUIDED PRACTICE:
   - Present a scenario or topic
   - Model good examples first
   - Ask open-ended questions to encourage speaking
   - Listen actively and respond naturally
   - Don't interrupt - let them finish thoughts

5. CONSTRUCTIVE FEEDBACK:
   - Start with what they did WELL
   - "I loved how you used..."
   - "Your pronunciation of... was excellent"
   - Then offer ONE specific improvement
   - "Let's work on..." (not "You're wrong")
   - Demonstrate the correction
   - Have them try again

6. FLUENCY BUILDING:
   - Encourage longer responses
   - "Tell me more about that"
   - "What else can you say?"
   - Focus on communication, not perfection
   - Reduce hesitation through practice

7. CONFIDENCE BOOST:
   - End with a success moment
   - Highlight their progress
   - "You're speaking more confidently already!"
   - Give homework: "Practice saying..."

FEEDBACK PRINCIPLES:
- Positive reinforcement for every attempt
- Specific praise: "Great use of that phrase!"
- Gentle corrections: "Good! Another way to say that is..."
- Focus on communication, not just grammar
- Build on their strengths
- Make mistakes feel normal and helpful

COMMUNICATION APPROACH:
- Speak clearly but naturally (not too slow)
- Use encouraging body language in your tone
- Ask follow-up questions to extend conversation
- Share your own examples to model
- Create realistic conversation scenarios
- Use ONLY English; immersion builds fluency!

EXAMPLE OPENING:
"Welcome, speaking champion! I'm Coach Marcus. Today's focus is ${module.title}. I want you to speak freely - don't worry about mistakes, just communicate. Ready? Let's warm up with a simple question..."`;

    } else if (module.type === 'Listening') {
      teacherName = 'Dr. Nina';
      teacherPersonality = 'clear, patient, and attentive';
      moduleInstruction += `\n
LISTENING TEACHER PERSONA: You are Dr. Nina, a skilled listening comprehension expert who trains students to understand English in various contexts, accents, and speeds.

⚠️ CRITICAL INSTRUCTION: START TEACHING IMMEDIATELY!
- As soon as the session begins, introduce yourself and START the listening exercise
- DO NOT wait for the student to speak first
- Begin with your greeting, set up the listening task, then immediately tell your story
- After the story, ask comprehension questions
- Lead the entire listening lesson actively

TEACHING STYLE:
- Speak clearly and at varied speeds
- Use different tones and emotions in stories
- Check comprehension frequently
- Repeat and rephrase when needed
- Build listening stamina gradually
- Make listening active, not passive

LESSON: "${module.title}" at ${module.level} level

TEACHING SEQUENCE:
1. WELCOMING INTRODUCTION:
   "Hello! I'm Dr. Nina, your listening guide. Today we're practicing ${module.title}. Good listening is a skill we can develop together. Let's begin!"

2. PRE-LISTENING PREPARATION:
   - Set the context: "I'm going to tell you about..."
   - Give a listening task: "Listen for..."
   - Activate prior knowledge: "What do you know about...?"
   - Prepare key vocabulary if needed

3. FIRST LISTENING (Main Ideas):
   - Tell a short story, dialogue, or passage (1-2 minutes)
   - Speak naturally but clearly
   - Use expression and emotion
   - Vary your pace slightly
   - Include natural pauses

4. COMPREHENSION CHECK:
   - Ask main idea questions:
     "What was the story about?"
     "Who were the main characters?"
     "What happened?"
   - Listen to their response
   - Praise correct understanding
   - Clarify misunderstandings gently

5. SECOND LISTENING (Details):
   - "Let me tell it again. This time, listen for..."
   - Repeat the same content
   - Ask detail questions:
     "What did [character] say about...?"
     "When did this happen?"
     "Why did they...?"

6. VOCABULARY & PHRASES:
   - Highlight key words or phrases used
   - "Did you hear the word...?"
   - Explain meanings in context
   - Have them repeat important phrases

7. DISCUSSION & REFLECTION:
   - Ask opinion questions
   - "What do you think about...?"
   - "Have you experienced something similar?"
   - Encourage them to speak about what they heard

8. LISTENING STRATEGIES:
   - Share tips: "When you don't understand everything, listen for..."
   - Teach to focus on keywords
   - Explain it's okay to miss some words
   - Build confidence in partial understanding

LISTENING CONTENT IDEAS:
- Short personal stories
- Dialogues between characters
- News-style reports
- Descriptions of places or events
- Instructions or directions
- Conversations with different emotions

COMMUNICATION APPROACH:
- Vary your speaking speed (but stay clear)
- Use natural intonation and emotion
- Pause at natural points
- Repeat key information
- Check understanding frequently
- Be patient - listening is challenging!
- Use ONLY English; build their listening stamina!

EXAMPLE OPENING:
"Welcome! I'm Dr. Nina. Today's listening practice is ${module.title}. I'll tell you a story, and I want you to listen carefully. Don't worry if you don't catch every word - focus on the main ideas. Ready? Here we go..."`;

    } else if (module.type === 'Reading') {
      teacherName = 'Professor James';
      teacherPersonality = 'scholarly, clear, and analytical';
      moduleInstruction += `\n
READING TEACHER PERSONA: You are Professor James, an experienced reading comprehension expert who helps students understand texts, build vocabulary, and develop critical thinking skills.

⚠️ CRITICAL INSTRUCTION: START TEACHING IMMEDIATELY!
- As soon as the session begins, introduce yourself and START the reading lesson
- DO NOT wait for the student to speak first
- Begin with your greeting, introduce the text, then immediately start reading aloud
- After reading, ask questions and discuss the text
- Lead the entire reading comprehension lesson

TEACHING STYLE:
- Read aloud with clear pronunciation and expression
- Break down complex texts into manageable parts
- Teach reading strategies explicitly
- Connect text to student's knowledge
- Build vocabulary in context
- Encourage active reading

LESSON: "${module.title}" at ${module.level} level

TEACHING SEQUENCE:
1. ENGAGING INTRODUCTION:
   "Good day! I'm Professor James, your reading instructor. Today we're exploring ${module.title}. Reading well opens doors to knowledge. Let's discover together!"

2. PRE-READING PHASE:
   - Introduce the topic and text type
   - "Today we're reading about..."
   - Activate background knowledge
   - "What do you already know about...?"
   - Preview key vocabulary (3-5 words)
   - Set a reading purpose: "As we read, think about..."

3. FIRST READING (Read Aloud):
   - Read the text clearly and expressively
   - Use natural pacing and intonation
   - Pause at punctuation
   - Emphasize key words
   - Make the text come alive
   - Text length: 150-300 words (adjust for level)

4. INITIAL COMPREHENSION:
   - Ask main idea questions:
     "What is this text about?"
     "What's the main point?"
   - Listen to their understanding
   - Praise correct interpretations
   - Guide if they missed key points

5. DETAILED ANALYSIS:
   - Read again, section by section
   - Stop to discuss important parts
   - Ask specific questions:
     "What does the author mean by...?"
     "Why did [character/person] do...?"
   - Explain difficult sentences
   - Discuss new vocabulary in context

6. VOCABULARY BUILDING:
   - Highlight 5-7 key words from the text
   - Explain meanings using context
   - Show how to guess meaning from context
   - Have them use words in sentences
   - Connect to words they know

7. CRITICAL THINKING:
   - Ask opinion questions:
     "Do you agree with...?"
     "What would you do if...?"
   - "What's your opinion about...?"
   - Encourage personal connections
   - Discuss implications or lessons

8. READING STRATEGIES:
   - Teach specific skills:
     "When you see an unknown word, look at..."
     "To find the main idea, look for..."
   - Share tips for independent reading
   - Build confidence for reading alone

READING TEXT IDEAS:
- Short stories with clear narratives
- Informational articles (science, culture, history)
- Biographical sketches
- News articles (simplified)
- How-to guides or instructions
- Opinion pieces or editorials

COMMUNICATION APPROACH:
- Read with expression and clarity
- Explain complex ideas simply
- Check understanding frequently
- Encourage questions
- Make connections to real life
- Build reading confidence
- Use ONLY English; immerse in written language!

EXAMPLE OPENING:
"Hello! Professor James here. Today's reading is about ${module.title}. I'll read it aloud first, and I want you to listen and follow along mentally. Then we'll discuss what we read. Ready? Let's begin..."`;

    } else if (module.type === 'Writing') {
      teacherName = 'Ms. Rachel';
      teacherPersonality = 'creative, organized, and constructive';
      moduleInstruction += `\n
WRITING TEACHER PERSONA: You are Ms. Rachel, a supportive writing coach who helps students organize thoughts, structure ideas, and express themselves clearly in writing.

⚠️ CRITICAL INSTRUCTION: START TEACHING IMMEDIATELY!
- As soon as the session begins, introduce yourself warmly and START the writing lesson
- DO NOT wait for the student to speak first
- Begin with your greeting, explain the writing task, then guide them through it
- Ask questions to help them brainstorm and organize ideas
- Lead the writing process step-by-step

TEACHING STYLE:
- Guide through the writing process step-by-step
- Focus on ideas first, grammar second
- Provide constructive, specific feedback
- Celebrate creative expression
- Teach writing as thinking
- Build confidence in written communication

LESSON: "${module.title}" at ${module.level} level

TEACHING SEQUENCE:
1. INSPIRING WELCOME:
   "Hello! I'm Ms. Rachel, your writing coach. Today we're working on ${module.title}. Writing is thinking on paper - let's organize your thoughts and express them clearly!"

2. WRITING TASK INTRODUCTION:
   - Explain the writing goal clearly
   - "Today you'll learn to write..."
   - Show why this writing skill matters
   - "You'll use this when..."
   - Set clear expectations

3. STRUCTURE EXPLANATION:
   - Break down the writing format:
     "This type of writing has [X] parts..."
   - Explain each section's purpose
   - Give a simple template or outline
   - Show a model example (read it aloud)

4. BRAINSTORMING PHASE:
   - Help generate ideas
   - "What ideas do you have about...?"
   - Ask guiding questions
   - "What do you want to say about...?"
   - List their ideas together
   - Organize thoughts logically

5. GUIDED WRITING:
   - Start with the first part
   - "Let's begin with the opening. What would you say?"
   - Listen to their spoken ideas
   - Help them form sentences
   - "That's a great idea! How would you write that?"
   - Guide organization and flow

6. CONSTRUCTIVE FEEDBACK:
   - Praise strong ideas and clear expression
   - "I love how you explained..."
   - "Your opening is very engaging!"
   - Offer specific improvements:
     "This sentence could be clearer if..."
     "Let's add more detail about..."
   - Focus on one or two key improvements

7. REVISION & REFINEMENT:
   - Help them improve their writing
   - "Let's make this sentence stronger"
   - Suggest better word choices
   - Check grammar and structure together
   - Celebrate improvements

8. WRITING TIPS & STRATEGIES:
   - Share practical advice:
     "Always start with your main idea"
     "Use connecting words like 'however,' 'therefore'"
     "Read your writing aloud to check flow"
   - Give templates for future use
   - Encourage regular practice

WRITING TOPICS BY TYPE:
- Emails (formal/informal)
- Paragraphs (descriptive, narrative, opinion)
- Essays (introduction, body, conclusion)
- Stories (beginning, middle, end)
- Instructions (step-by-step)
- Summaries (main points)

COMMUNICATION APPROACH:
- Be encouraging and patient
- Focus on communication, not perfection
- Help them think through ideas verbally first
- Guide, don't dictate
- Make writing feel achievable
- Celebrate every improvement
- Use ONLY English; build written fluency!

EXAMPLE OPENING:
"Welcome, writer! I'm Ms. Rachel. Today we're learning ${module.title}. Writing is easier when you have a plan. Let's break it down together. First, let me explain the structure, then we'll brainstorm your ideas. Ready?"`;
    }

    await ensureApiKey();
    await initAudio();

    // Create a specific persona for the module
    const modulePersona: AIPersona = {
      name: teacherName,
      gender: module.type === 'Vocabulary' || module.type === 'Writing' ? 'female' :
        module.type === 'Listening' ? 'female' : 'male',
      role: `${module.type} Teacher`,
      personality: teacherPersonality,
      style: 'normal',
      voice: 'Kore',
      scenario: module.title
    };

    setCurrentPersona(modulePersona);

    // Start AI session with module-specific instruction
    const apiKey = import.meta.env.VITE_API_KEY || '';
    console.log("Debug: API Key loaded:", apiKey ? "Yes (Length: " + apiKey.length + ")" : "No");

    if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
      setConnectionError('API key not configured. Please set VITE_API_KEY in your .env file. Get your key from https://aistudio.google.com/apikey');
      setShowModuleSession(false);
      return;
    }

    const ai = new GoogleGenAI({ apiKey });

    let sessionPromise: Promise<any>;
    try {
      sessionPromise = ai.live.connect({
        model: MODEL_NAME,
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: moduleInstruction,
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: modulePersona.voice } }
          },
          temperature: 0.7,
          maxOutputTokens: 2048,
          topP: 0.9,
          topK: 40
        },
        callbacks: createLiveCallbacks(() => sessionPromise)
      });
      sessionRef.current = await sessionPromise;
      setIsLive(true);
    } catch (e: any) {
      console.error('Module session error:', e);
      const errorMessage = e?.message || 'Unable to start lesson. Please try again.';
      setConnectionError(errorMessage);
      setShowModuleSession(false);
    }
  };

  // --- UI Components ---

  const WelcomeView = () => (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 sm:px-6 py-10 text-center text-foreground relative overflow-hidden">
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
      <div className="relative z-10 flex flex-col items-center max-w-3xl w-full">
        <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl mb-8 transform hover:scale-110 transition-transform duration-500">
          <GraduationCap size={56} className="text-white" />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tighter">myenglish.lk</h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-12 font-medium opacity-90 leading-relaxed">
          Master English with your personal AI coach.<br />
          Experience real-time voice conversations and personalized learning.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button
            onClick={startAssessment}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-5 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Get Started <ArrowRight size={20} />
          </button>
          <button
            onClick={() => alert("Demo Mode: Please click 'Get Started' to interpret the app demo.")}
            className="flex-1 bg-secondary border border-border hover:bg-muted text-secondary-foreground py-5 rounded-2xl font-bold text-lg transition-all"
          >
            Sign In
          </button>
        </div>
        <p className="mt-8 text-muted-foreground/50 text-sm flex items-center gap-2">
          <ShieldCheck size={16} /> Privacy-first English learning
        </p>
      </div>
    </div>
  );

  const AssessmentView = () => {
    const q = ASSESSMENT_QUESTIONS[currentQuestionIndex] || ASSESSMENT_QUESTIONS[0];
    return (
      <div className="min-h-screen bg-muted flex flex-col">
        <header className="p-4 sm:p-6 bg-card border-b border-border flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-bold text-primary uppercase tracking-widest">Question {q.id} of 5</span>
            <div className="h-1.5 w-32 sm:w-40 md:w-48 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
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
            <span className="px-4 py-1 bg-indigo-50 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
              {q.focus}
            </span>
            <h2 className="text-4xl font-bold text-foreground leading-tight">
              {q.text}
            </h2>
          </div>

          <div className="flex flex-col items-center gap-8 relative">
            <div className={`p-8 rounded-full transition-all duration-500 ${isLive ? 'bg-primary shadow-[0_0_50px_hsl(var(--primary)/0.4)] animate-pulse' : 'bg-card shadow-lg shadow-gray-200'}`}>
              <Mic size={64} className={isLive ? 'text-white' : 'text-gray-400'} />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-lg font-bold text-foreground mb-2">
                {isLive ? "I'm Listening..." : "Connecting Voice Engine..."}
              </p>
              {isLive && (
                <div className="flex gap-1 h-8 items-end">
                  {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((h, i) => (
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

  const DashboardLayout = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 dark:from-slate-950 dark:via-zinc-950 dark:to-slate-900 flex transition-colors duration-500">
      {/* Desktop Sidebar */}
      <aside className="w-72 bg-card/90 dark:bg-slate-900/80 backdrop-blur-xl border-r border-border dark:border-white/5 shadow-xl hidden lg:flex flex-col sticky top-0 h-screen p-6 z-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <GraduationCap className="text-white" size={24} />
          </div>
          <span className="font-black text-2xl text-gray-900 dark:text-white tracking-tight">myenglish.lk</span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'home', icon: Layout, label: 'Dashboard', path: '/dashboard' },
            { id: 'learn', icon: Book, label: 'Learning Path', path: '/dashboard/learn' },
            { id: 'practice', icon: MessageSquare, label: 'AI Practice', path: '/dashboard/practice' },
            { id: 'progress', icon: BarChart3, label: 'Stats & Levels', path: '/dashboard/progress' },
          ].map(item => (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.id === 'home'}
              className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all border ${isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 border-indigo-500'
                : 'text-gray-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 dark:hover:text-slate-200 border-transparent'
                }`}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-[2rem] p-6 text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                  <Flame size={20} className="text-yellow-300" fill="currentColor" />
                </div>
                <span className="text-[10px] font-black bg-yellow-400 text-black px-2 py-0.5 rounded-full uppercase tracking-wider">PRO</span>
              </div>
              <h4 className="font-bold mb-1 text-lg">Upgrade to Pro</h4>
              <p className="text-xs text-indigo-100/80 mb-4 leading-relaxed">Unlimited AI conversation and personalized grammar analysis.</p>
              <button
                onClick={() => navigate('/pricing')}
                className="w-full py-2.5 bg-white text-indigo-700 rounded-xl text-xs font-bold shadow-lg hover:bg-indigo-50 transition-colors"
              >
                Upgrade Now
              </button>
            </div>
          </div>

          <div className="border-t border-border dark:border-white/5 pt-4 mt-2">
            <button
              onClick={() => navigate('/profile')}
              className="w-full flex items-center gap-3 px-2 mb-3 hover:bg-slate-100 dark:hover:bg-white/5 p-2 rounded-xl transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 flex items-center justify-center text-primary overflow-hidden group-hover:border-indigo-500 transition-colors">
                <img
                  src={`https://ui-avatars.com/api/?name=${localStorage.getItem('myenglish_userName') || 'User'}&background=random`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground dark:text-white truncate group-hover:text-primary transition-colors">{userName || 'User'}</p>
                <p className="text-xs text-muted-foreground dark:text-slate-500 truncate">{userEmail || 'user@example.com'}</p>
              </div>
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl">
              <LogOut size={20} /> Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 p-6 flex items-center justify-between sticky top-0 z-10 lg:static shadow-sm">
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white" size={18} />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">myenglish</span>
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-2xl border border-orange-100 dark:border-orange-500/20 hidden sm:flex">
              <Flame size={20} fill="currentColor" />
              <span className="font-black">{streak} DAY STREAK</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-2xl border border-yellow-100 dark:border-yellow-500/20 hidden sm:flex">
              <Award size={20} fill="currentColor" />
              <span className="font-black">{points} XP</span>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 flex items-center justify-center text-primary overflow-hidden hover:border-indigo-500 transition-all"
            >
              <img
                src={`https://ui-avatars.com/api/?name=${localStorage.getItem('myenglish_userName') || 'User'}&background=random`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-12 pb-24 lg:pb-12 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          <Outlet />
        </div>
      </main>

      {/* Detailed Lesson View Overlay */}
      {showLessonView && <DetailedLessonView />}

      {/* Module Learning Overlay */}
      {showModuleSession && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
          <ModuleLearningView />
        </div>
      )}

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 lg:hidden flex justify-around p-4 z-50 shadow-2xl safe-area-pb">
        {[
          { id: 'home', icon: Layout, path: '/dashboard' },
          { id: 'learn', icon: Book, path: '/dashboard/learn' },
          { id: 'practice', icon: MessageSquare, path: '/dashboard/practice' },
          { id: 'progress', icon: BarChart3, path: '/dashboard/progress' },
        ].map(item => (
          <NavLink
            key={item.id}
            to={item.path}
            end={item.id === 'home'}
            className={({ isActive }) => `p-3 rounded-2xl transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400'}`}
          >
            <item.icon size={24} />
          </NavLink>
        ))}
      </nav>
    </div>
  );

  const HomeContent = () => {
    const [enrolledCourses, setEnrolledCourses] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [showUnenrollModal, setShowUnenrollModal] = React.useState(false);
    const [unenrollCourse, setUnenrollCourse] = React.useState<{id: string, title: string} | null>(null);
    const [unenrollInput, setUnenrollInput] = React.useState('');
    const [unenrollError, setUnenrollError] = React.useState('');

    const fetchEnrolledCourses = async () => {
      const userEmail = localStorage.getItem('myenglish_userEmail');
      if (!userEmail) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3001/api/enrollments?email=${encodeURIComponent(userEmail)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch enrolled courses');
        }
        const data = await response.json();
        setEnrolledCourses(data);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleUnenroll = (courseId: string, courseTitle: string) => {
      setUnenrollCourse({ id: courseId, title: courseTitle });
      setShowUnenrollModal(true);
      setUnenrollInput('');
      setUnenrollError('');
    };

    const confirmUnenroll = async () => {
      if (unenrollInput.toLowerCase() !== 'unenrolled') {
        setUnenrollError('Please type "unenrolled" exactly to confirm');
        return;
      }

      const userEmail = localStorage.getItem('myenglish_userEmail');
      if (!userEmail || !unenrollCourse) return;

      try {
        const response = await fetch(`http://localhost:3001/api/enrollments/${unenrollCourse.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: userEmail }),
        });

        if (!response.ok) {
          throw new Error('Failed to unenroll from course');
        }

        setShowUnenrollModal(false);
        setUnenrollCourse(null);
        setUnenrollInput('');
        fetchEnrolledCourses();
        
        // Show success notification
        alert('Successfully unenrolled from the course');
      } catch (error) {
        console.error('Error unenrolling from course:', error);
        setUnenrollError('Failed to unenroll. Please try again.');
      }
    };

    const cancelUnenroll = () => {
      setShowUnenrollModal(false);
      setUnenrollCourse(null);
      setUnenrollInput('');
      setUnenrollError('');
    };

    React.useEffect(() => {
      fetchEnrolledCourses();
    }, []);

    return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden group border border-white/5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <span className="text-[10px] font-bold bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 inline-block border border-white/10">Recommended for You</span>
            <h2 className="text-4xl font-black mb-4 leading-tight tracking-tight">Master Job Interview Fluency with Daniel</h2>
            <p className="text-indigo-200 text-lg mb-8 opacity-90 max-w-lg leading-relaxed">
              "Daniel will help you polish your professional English. Practice common interview questions and get real-time corrections."
            </p>
            <button
              onClick={() => startRoleplay(PERSONAS[1])}
              className="px-8 py-4 bg-white text-indigo-950 rounded-2xl font-bold text-lg shadow-xl shadow-black/20 hover:scale-105 transition-all active:scale-95 flex items-center gap-2 group/btn"
            >
              Start Session Now <Play size={20} fill="currentColor" className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="hidden lg:flex w-64 h-64 bg-white/5 rounded-full items-center justify-center border border-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform duration-700 relative shadow-2xl shadow-black/20">
            <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-xl" />
            <User size={100} className="text-white/80 relative z-10" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* My Enrolled Courses Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-foreground">📚 My Courses</h2>
            <p className="text-muted-foreground font-medium">Continue your learning journey</p>
          </div>
          <button 
            onClick={() => {
              navigate('/');
              setTimeout(() => {
                const coursesSection = document.getElementById('courses');
                if (coursesSection) {
                  coursesSection.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }}
            className="px-4 py-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
          >
            Browse All Courses →
          </button>
        </div>

        {isLoading ? (
          <div className="bg-card rounded-2xl border border-border p-16 text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your courses...</p>
          </div>
        ) : enrolledCourses.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-16 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen size={40} className="text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">No Courses Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start your learning journey by enrolling in courses that match your goals.
            </p>
            <button
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  const coursesSection = document.getElementById('courses');
                  if (coursesSection) {
                    coursesSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 transition-all inline-flex items-center gap-2"
            >
              Explore Courses
              <ChevronRight size={20} />
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="group bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={course.course_thumbnail}
                    alt={course.course_title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-bold shadow-lg">
                    {course.course_level}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="w-full bg-white/20 backdrop-blur-sm h-2 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-white rounded-full shadow-lg" style={{ width: `${course.progress || 0}%` }} />
                    </div>
                    <p className="text-white text-xs font-bold">
                      {course.progress || 0}% Complete • {course.completed_lessons || 0}/{course.course_lessons} lessons
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                    {course.course_category}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {course.course_title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {course.course_description}
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {course.course_instructor?.charAt(0) || 'I'}
                    </div>
                    <span className="text-sm text-muted-foreground">{course.course_instructor}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate('/dashboard/learn')}
                      className="flex-1 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                    >
                      Continue Learning
                      <Play size={16} />
                    </button>
                    <button
                      onClick={() => handleUnenroll(course.course_id, course.course_title)}
                      className="px-4 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl font-bold transition-all"
                      title="Unenroll from course"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-white/5 flex flex-col hover:border-blue-500/20 transition-colors group">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <BookOpen size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Continue Lesson</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 flex-1 text-sm leading-relaxed">Grammar: Mastering Tenses for Daily Conversation</p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }} />
          </div>
          <button
            onClick={() => navigate('/dashboard/learn')}
            className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-2 hover:gap-3 transition-all text-sm"
          >
            Resume <ChevronRight size={16} />
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-white/5 flex flex-col hover:border-purple-500/20 transition-colors group">
          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Award size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Level Up!</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 flex-1 text-sm leading-relaxed">Earn 250 XP more to reach <strong className="text-slate-900 dark:text-white">Level 5: Intermediate Pro</strong></p>
          <div className="flex -space-x-3 mb-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300 shadow-sm">A{i}</div>)}
            <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">+12</div>
          </div>
          <button
            onClick={() => navigate('/dashboard/progress')}
            className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-2 hover:gap-3 transition-all text-sm"
          >
            View Leaderboard <ChevronRight size={16} />
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-white/5 flex flex-col hover:border-orange-500/20 transition-colors group">
          <div className="w-12 h-12 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Calendar size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Daily Goal</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 flex-1 text-sm leading-relaxed">Complete one 10-minute voice session to maintain your streak.</p>
          <div className="flex gap-2 mb-4">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div key={i} className={`flex-1 aspect-square rounded-lg flex items-center justify-center font-bold text-xs ${i < 4 ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                {d}
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="text-orange-600 dark:text-orange-400 font-bold flex items-center gap-2 hover:gap-3 transition-all text-sm"
          >
            Set Reminders <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Professional Unenroll Confirmation Modal */}
      {showUnenrollModal && unenrollCourse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center">
                <AlertCircle size={24} className="text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Confirm Unenrollment</h3>
            </div>
            
            <p className="text-muted-foreground mb-2">
              You are about to unenroll from:
            </p>
            <p className="text-lg font-bold text-foreground mb-6">
              "{unenrollCourse.title}"
            </p>
            
            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>Your progress will be permanently deleted. Type <strong>"unenrolled"</strong> to confirm.</span>
              </p>
            </div>

            <div className="space-y-2 mb-6">
              <label className="block text-sm font-bold text-foreground mb-2">
                Type "unenrolled" to confirm
              </label>
              <input
                type="text"
                value={unenrollInput}
                onChange={(e) => {
                  setUnenrollInput(e.target.value);
                  setUnenrollError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmUnenroll();
                  if (e.key === 'Escape') cancelUnenroll();
                }}
                placeholder="Type here..."
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-primary focus:outline-none text-foreground font-medium"
                autoFocus
              />
              {unenrollError && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle size={14} />
                  {unenrollError}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelUnenroll}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground rounded-xl font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmUnenroll}
                disabled={unenrollInput.toLowerCase() !== 'unenrolled'}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed dark:disabled:bg-slate-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-600/20 disabled:shadow-none"
              >
                Unenroll
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  };

  const LearnContent = () => {
    const filteredModules = filterType === 'All'
      ? MOCK_MODULES
      : MOCK_MODULES.filter(m => m.type === filterType);

    const categories = ['All', 'Grammar', 'Vocabulary', 'Speaking', 'Listening', 'Reading', 'Writing'];

    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-4xl font-black text-foreground mb-2">📚 Your Learning Library</h1>
            <p className="text-muted-foreground font-medium">Master English with comprehensive lessons in Grammar, Vocabulary, Speaking, Listening, Reading & Writing.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilterType(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${filterType === category
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                  : 'bg-card border border-border text-gray-600 hover:border-indigo-200 hover:text-primary'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredModules.length > 0 ? filteredModules.map(module => (
            <div key={module.id} className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
              {/* Beautiful Gradient Header with Icons */}
              <div className={`h-48 flex items-center justify-center relative overflow-hidden ${module.type === 'Grammar' ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500' :
                module.type === 'Vocabulary' ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500' :
                  module.type === 'Speaking' ? 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500' :
                    module.type === 'Listening' ? 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500' :
                      module.type === 'Reading' ? 'bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500' :
                        'bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-500'
                }`}>
                {/* Decorative Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
                </div>

                {/* Completion Badge */}
                <div className="absolute top-4 right-4 z-10">
                  {completedModules.includes(module.id) ? (
                    <div className="bg-white/90 backdrop-blur-sm text-green-600 p-2.5 rounded-full shadow-lg">
                      <CheckCircle size={20} />
                    </div>
                  ) : (
                    <div className="bg-white/20 backdrop-blur-sm text-white p-2.5 rounded-full">
                      <Star size={20} />
                    </div>
                  )}
                </div>

                {/* Large Icon with Animation */}
                <div className="relative z-10 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
                    {module.type === 'Grammar' && <Book size={64} className="text-white drop-shadow-lg" />}
                    {module.type === 'Vocabulary' && <Sparkles size={64} className="text-white drop-shadow-lg" />}
                    {module.type === 'Reading' && <BookOpen size={64} className="text-white drop-shadow-lg" />}
                    {module.type === 'Writing' && <Mail size={64} className="text-white drop-shadow-lg" />}
                    {module.type === 'Listening' && <Headphones size={64} className="text-white drop-shadow-lg" />}
                    {module.type === 'Speaking' && <Mic size={64} className="text-white drop-shadow-lg" />}
                  </div>
                </div>

                {/* Floating Particles Effect */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-pulse"></div>
                  <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-white rounded-full opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">{module.type} • {module.level}</span>
                <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{module.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 flex-1">{module.description || 'Comprehensive lesson with interactive exercises and practice.'}</p>

                {/* Lesson Info */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {module.estimatedTime && (
                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold flex items-center gap-1 border border-blue-100 dark:border-blue-500/20">
                      <Clock size={12} /> {module.estimatedTime} min
                    </span>
                  )}
                  {module.lessons && (
                    <span className="px-3 py-1 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold border border-purple-100 dark:border-purple-500/20">
                      {module.lessons} lessons
                    </span>
                  )}
                  {module.difficulty && (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${module.difficulty === 'easy' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-100 dark:border-green-500/20' :
                      module.difficulty === 'medium' ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-100 dark:border-yellow-500/20' :
                        'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20'
                      }`}>
                      {module.difficulty}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 dark:text-slate-500">{module.progress}% Complete</span>
                  </div>
                  <div className="flex gap-2">
                    {getLessonContent(module.id) && (
                      <button
                        onClick={() => {
                          const lesson = getLessonContent(module.id);
                          if (lesson) {
                            setCurrentLesson(lesson);
                            setCurrentModule(module);
                            setShowLessonView(true);
                          }
                        }}
                        className="px-4 py-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-primary dark:text-indigo-400 rounded-xl text-sm font-bold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all border border-indigo-100 dark:border-indigo-500/20"
                        title="View Lesson Details"
                      >
                        <BookOpen size={16} className="inline" />
                      </button>
                    )}
                    <button
                      onClick={() => startModuleLearning(module)}
                      className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-bold group-hover:gradient-bg transition-all shadow-lg shadow-gray-200 dark:shadow-black/20 hover:scale-105 active:scale-95"
                    >
                      {module.progress === 100 ? 'Review' : module.progress > 0 ? 'Continue' : 'Start'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-20">
              <p className="text-muted-foreground text-lg">No modules found in this category.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const PracticeContent = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-foreground mb-4 tracking-tight">AI Roleplay Hub</h1>
        <p className="text-muted-foreground text-lg leading-relaxed font-medium">
          Choose a scenario and start speaking. Our AI personas will respond naturally and help you improve with subtle grammar tips.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {PERSONAS.map(persona => {
          // Generate unique avatar URL for each persona using DiceBear API
          const getAvatarUrl = (name: string) => {
            const seed = name.toLowerCase().replace(/\s+/g, '-');
            // Using modern 'notionists' style - clean, professional, minimalist
            return `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`;
          };

          return (
            <div key={persona.name} className="bg-card rounded-[2.5rem] border border-border p-1 flex flex-col group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 h-full">
              <div className="bg-muted rounded-[2.2rem] p-8 flex flex-col items-center text-center flex-1">
                {/* Avatar Image */}
                <div className="relative w-28 h-28 rounded-full overflow-hidden shadow-2xl mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ring-4 ring-indigo-100">
                  <img
                    src={getAvatarUrl(persona.name)}
                    alt={persona.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">{persona.name}</h3>
                <p className="text-primary font-bold text-sm mb-4 uppercase tracking-widest">{persona.role}</p>

                <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold mb-6 flex items-center gap-2">
                  <MapPin size={12} /> {persona.scenario}
                </div>

                <p className="text-muted-foreground text-sm italic mb-8 opacity-80 leading-relaxed">
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
          );
        })}
      </div>
    </div>
  );

  const ProgressContent = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-4xl font-black text-foreground">Your Progress</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card p-10 rounded-[2.5rem] shadow-sm border border-border">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-bold text-xl text-gray-800">Learning Activity (XP)</h3>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 bg-indigo-50 text-primary rounded-full text-xs font-bold">Week</button>
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
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold', color: '#4f46e5' }}
                />
                <Area type="monotone" dataKey="xp" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorXp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-10 rounded-[2.5rem] shadow-sm border border-border flex flex-col items-center">
          <h3 className="font-bold text-xl text-gray-800 mb-8 self-start">Proficiency Radar</h3>
          <div className="flex-1 w-full flex items-center justify-center min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                { subject: 'Grammar', A: 70 }, { subject: 'Vocabulary', A: 85 },
                { subject: 'Listening', A: 90 }, { subject: 'Fluency', A: 65 },
                { subject: 'Pronun', A: 80 }
              ]}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                <Radar dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 text-center">
            <p className="text-gray-400 font-medium text-sm mb-1 uppercase tracking-widest">Current Level</p>
            <h4 className="text-3xl font-black text-primary">{userLevel || 'Intermediate'}</h4>
          </div>
        </div>
      </div>
    </div>
  );

  const LearningSessionView = () => (
    <div className="min-h-screen bg-background flex flex-col text-foreground">
      <header className="p-4 sm:p-6 bg-background/50 backdrop-blur-xl border-b border-border flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => { stopAudio(); setPhase(AppPhase.DASHBOARD); }}
            className="w-10 h-10 rounded-full bg-secondary hover:bg-muted flex items-center justify-center transition-all border border-border"
          >
            <ChevronRight className="rotate-180" size={20} />
          </button>
          <div>
            <h3 className="font-bold flex items-center gap-2">
              Practice with {currentPersona?.name}
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse' : 'bg-gray-500'}`} />
            </h3>
            <p className="text-xs text-muted-foreground font-medium">{currentPersona?.scenario}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-3 rounded-xl border border-border transition-all ${showSettings ? 'bg-primary text-white' : 'bg-secondary hover:bg-muted'}`}>
            <Settings size={20} />
          </button>

          {/* Settings Popover */}
          {showSettings && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-card rounded-2xl border border-border shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                    <MessageSquare size={14} /> AI Speaking Rate
                  </h4>
                  <div className="flex bg-muted p-1 rounded-lg">
                    {(['slow', 'normal', 'fast'] as const).map((rate) => (
                      <button
                        key={rate}
                        onClick={() => {
                          setAiSpeakingRate(rate);
                          // Optionally reconnect if live to apply immediately, but for now user might need to restart
                        }}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-md capitalize transition-all ${aiSpeakingRate === rate ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        {rate}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 leading-tight">
                    Note: Restart the session to apply changes.
                  </p>
                </div>
              </div>
            </div>
          )}
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
          <div
            ref={transcriptionContainerRef}
            className="flex-1 overflow-y-auto space-y-6 pr-0 sm:pr-4 px-2 pb-24 sm:pb-28 custom-scrollbar"
          >
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
                    <div className="bg-secondary/40 border border-border px-6 py-4 rounded-3xl rounded-tl-none max-w-[85%] animate-in fade-in slide-in-from-left-4 backdrop-blur-sm">
                      <p className="text-sm text-muted-foreground font-medium">{currentPersona?.name}</p>
                      <p className="text-foreground text-lg leading-relaxed">{outputTranscription}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="p-6 bg-secondary/20 rounded-3xl border border-border max-w-sm mb-6">
                  <MessageSquare className="mx-auto mb-4 text-primary" size={32} />
                  <p className="text-muted-foreground font-medium italic">
                    "Hi! I'm {currentPersona?.name}. Start speaking whenever you're ready. I'll listen and we can talk about {currentPersona?.scenario?.toLowerCase()}."
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls Bar */}
        <div className="sticky bottom-0 left-0 right-0 px-4 sm:px-8 pb-4 sm:pb-8 bg-gradient-to-t from-background/40 to-transparent flex justify-center z-10">
          <div className="bg-card/80 backdrop-blur-2xl border border-border p-4 rounded-2xl sm:rounded-full flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-2xl w-full max-w-2xl">
            <button
              onClick={() => startRoleplay(currentPersona!)}
              disabled={isLive}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform active:scale-90 ${isLive ? 'bg-gray-600 cursor-not-allowed' : 'bg-indigo-600 shadow-indigo-500/30 hover:bg-indigo-700'
                }`}
            >
              <Mic size={28} />
            </button>

            <button
              onClick={stopAudio}
              disabled={!isLive}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform active:scale-90 ${!isLive ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-500 shadow-red-500/30 hover:bg-red-600'
                }`}
            >
              <MicOff size={28} />
            </button>

            <div className="pr-0 sm:pr-6 text-center sm:text-left">
              <p className="text-sm font-bold text-foreground mb-0.5">{isLive ? 'Live Session Active' : 'Session Paused'}</p>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{isLive ? 'AI Listening' : 'Click Mic to Start'}</span>
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-foreground text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent opacity-50" />
      <div className="relative z-10">
        <div className="relative mb-12">
          <div className="w-32 h-32 border-4 border-indigo-500/20 rounded-full animate-ping absolute inset-0" />
          <div className="w-32 h-32 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin relative flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-purple-400 border-r-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
        </div>
        <h2 className="text-5xl font-black mb-6 text-foreground bg-clip-text">
          Generating Your Path...
        </h2>
        <p className="text-muted-foreground max-w-md font-medium text-lg leading-relaxed">
          Our AI is analyzing your grammar, pronunciation, and fluency to craft your personalized 4-week roadmap.
        </p>
        <div className="mt-8 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );

  const ResultView = () => (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-foreground text-center">
      <div className="w-32 h-32 bg-green-500/20 rounded-[2.5rem] flex items-center justify-center mb-8 border-2 border-green-500/30">
        <Award size={64} className="text-green-400" />
      </div>
      <h2 className="text-3xl font-bold mb-2">Assessment Complete!</h2>
      <p className="text-muted-foreground mb-10 text-xl font-medium">Your current English level is:</p>
      <div className="inline-block bg-card text-foreground px-12 py-6 rounded-[2rem] font-black text-4xl shadow-2xl mb-12 shadow-primary/5 border border-border">
        {userLevel}
      </div>
      <button
        onClick={() => { setPhase(AppPhase.PATH); navigate('/roadmap'); }}
        className="px-12 py-5 bg-indigo-600 rounded-2xl font-bold text-xl hover:bg-indigo-500 transition-all flex items-center gap-3 shadow-xl shadow-indigo-500/20"
      >
        View My Roadmap <ArrowRight size={24} />
      </button>
    </div>
  );

  const RoadmapView = () => (
    <div className="min-h-screen bg-muted flex flex-col p-6 lg:p-12 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex flex-col items-center text-center mb-16">
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Your 4-Week Mastery Path</h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl">
            We've tailored this curriculum specifically for your <span className="text-primary font-bold">{userLevel}</span> level and goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div className="bg-card p-10 rounded-[3rem] shadow-sm border border-border h-full">
              <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-8 flex items-center gap-2">
                <TrendingUp size={16} /> Weekly Goals
              </h3>
              <div className="space-y-6">
                {(learningPath?.weeklyGoals || DEFAULT_LEARNING_PATH.weeklyGoals).map((g, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-primary flex items-center justify-center font-bold text-sm shrink-0">{i + 1}</div>
                    <p className="text-slate-700 font-bold text-lg leading-snug">{g}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="bg-card p-8 rounded-[2.5rem] shadow-sm border border-border">
              <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Book size={16} /> Grammar Mastery
              </h3>
              <div className="flex flex-wrap gap-2">
                {(learningPath?.grammarTopics || DEFAULT_LEARNING_PATH.grammarTopics).map(t => (
                  <span key={t} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold">{t}</span>
                ))}
              </div>
            </div>

            <div className="bg-card p-8 rounded-[2.5rem] shadow-sm border border-border">
              <h3 className="text-xs font-black text-orange-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Mic size={16} /> Speaking Focus
              </h3>
              <div className="flex flex-wrap gap-2">
                {(learningPath?.speakingFocus || DEFAULT_LEARNING_PATH.speakingFocus).map(t => (
                  <span key={t} className="px-4 py-2 bg-orange-50 text-orange-700 rounded-xl text-sm font-bold">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => { setPhase(AppPhase.DASHBOARD); navigate('/dashboard'); }}
          className="w-full mt-16 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-[2.5rem] font-bold text-2xl shadow-2xl hover:scale-[1.01] transition-all flex items-center justify-center gap-4"
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
          <div className="bg-card rounded-[2.5rem] shadow-xl p-8 mb-6 border border-indigo-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowProfile(false)}
                  className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all"
                >
                  <ArrowRight size={24} className="rotate-180" />
                </button>
                <div>
                  <h1 className="text-3xl font-black text-foreground">Profile & Settings</h1>
                  <p className="text-muted-foreground">Manage your account and preferences</p>
                </div>
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <User size={40} className="text-white" />
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-card rounded-[2.5rem] shadow-xl p-8 mb-6 border border-indigo-100">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <User size={24} className="text-primary" />
              Personal Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
          <div className="bg-card rounded-[2.5rem] shadow-xl p-8 mb-6 border border-indigo-100">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Settings size={24} className="text-primary" />
              Learning Preferences
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Learning Goal</label>
                <select
                  value={learningGoal}
                  onChange={(e) => setLearningGoal(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>5 min</span>
                  <span>30 min</span>
                  <span>60 min</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Calendar size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Daily Reminders</p>
                    <p className="text-sm text-muted-foreground">Get notified to practice</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`relative w-14 h-8 rounded-full transition-all ${notificationsEnabled ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-card rounded-full transition-transform ${notificationsEnabled ? 'translate-x-7' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-card rounded-[2.5rem] shadow-xl p-8 mb-6 border border-indigo-100">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <BarChart3 size={24} className="text-primary" />
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
                <p className="text-sm font-medium text-primary">Level</p>
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

  const DetailedLessonView = () => {
    if (!currentLesson || !currentModule) return null;

    const handlePracticeSubmit = () => {
      setShowPracticeResults(true);
    };

    const getPracticeScore = () => {
      let correct = 0;
      let total = 0;
      currentLesson.content.practice.forEach((p, idx) => {
        if (p.type === 'multiple-choice' || p.type === 'fill-blank') {
          total++;
          if (practiceAnswers[idx]?.toLowerCase().trim() === p.correctAnswer?.toLowerCase().trim()) {
            correct++;
          }
        }
      });
      return { correct, total, percentage: total > 0 ? Math.round((correct / total) * 100) : 0 };
    };

    const score = showPracticeResults ? getPracticeScore() : null;

    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 overflow-y-auto">
        <div className="min-h-screen bg-muted p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-card rounded-[2.5rem] shadow-xl p-8 mb-6 border border-indigo-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setShowLessonView(false);
                      setCurrentLesson(null);
                      setPracticeAnswers({});
                      setShowPracticeResults(false);
                    }}
                    className="w-12 h-12 bg-secondary hover:bg-muted rounded-xl flex items-center justify-center transition-all"
                  >
                    <X size={24} />
                  </button>
                  <div>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">{currentModule.type} Lesson</span>
                    <h1 className="text-3xl font-black text-foreground">{currentLesson.title}</h1>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold">
                    {currentModule.level}
                  </div>
                  {currentLesson.estimatedTime && (
                    <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold flex items-center gap-2">
                      <Clock size={16} /> {currentLesson.estimatedTime} min
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lesson Content */}
            <div className="space-y-6">
              {/* Introduction */}
              <div className="bg-card rounded-[2rem] shadow-lg p-8 border border-indigo-100">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Info size={24} className="text-primary" />
                  Introduction
                </h2>
                <p className="text-foreground/80 text-lg leading-relaxed">{currentLesson.content.introduction}</p>
              </div>

              {/* Explanation */}
              <div className="bg-card rounded-[2rem] shadow-lg p-8 border border-indigo-100">
                <h2 className="text-2xl font-bold text-foreground mb-4">Explanation</h2>
                <div className="prose prose-lg max-w-none text-foreground/80 whitespace-pre-line leading-relaxed">
                  {currentLesson.content.explanation}
                </div>
              </div>

              {/* Examples */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[2rem] shadow-lg p-8 border border-indigo-100">
                <h2 className="text-2xl font-bold text-foreground mb-4">Examples</h2>
                <div className="space-y-4">
                  {currentLesson.content.examples.map((example, idx) => (
                    <div key={idx} className="bg-card rounded-xl p-4 border border-indigo-100">
                      <p className="text-foreground leading-relaxed">{example}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practice Exercises */}
              <div className="bg-card rounded-[2rem] shadow-lg p-8 border border-indigo-100">
                <h2 className="text-2xl font-bold text-foreground mb-6">Practice Exercises</h2>
                <div className="space-y-6">
                  {currentLesson.content.practice.map((exercise, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-6 border border-border">
                      <div className="flex items-start gap-3 mb-4">
                        <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                          {idx + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-foreground font-semibold mb-3">{exercise.question}</p>

                          {exercise.type === 'multiple-choice' && exercise.options && (
                            <div className="space-y-2">
                              {exercise.options.map((option, optIdx) => (
                                <label key={optIdx} className="flex items-center gap-3 p-3 bg-card rounded-lg border-2 cursor-pointer hover:border-indigo-300 transition-all" style={{
                                  borderColor: showPracticeResults
                                    ? (option === exercise.correctAnswer ? '#10b981' : practiceAnswers[idx] === option ? '#ef4444' : '#e5e7eb')
                                    : practiceAnswers[idx] === option ? '#6366f1' : '#e5e7eb'
                                }}>
                                  <input
                                    type="radio"
                                    name={`practice-${idx}`}
                                    value={option}
                                    checked={practiceAnswers[idx] === option}
                                    onChange={(e) => setPracticeAnswers({ ...practiceAnswers, [idx]: e.target.value })}
                                    disabled={showPracticeResults}
                                    className="w-4 h-4 text-primary"
                                  />
                                  <span className="flex-1">{option}</span>
                                  {showPracticeResults && option === exercise.correctAnswer && (
                                    <CheckCircle size={20} className="text-green-500" />
                                  )}
                                  {showPracticeResults && practiceAnswers[idx] === option && option !== exercise.correctAnswer && (
                                    <X size={20} className="text-red-500" />
                                  )}
                                </label>
                              ))}
                            </div>
                          )}

                          {exercise.type === 'fill-blank' && (
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={practiceAnswers[idx] || ''}
                                onChange={(e) => setPracticeAnswers({ ...practiceAnswers, [idx]: e.target.value })}
                                disabled={showPracticeResults}
                                placeholder="Type your answer here..."
                                className="w-full px-4 py-3 bg-card border-2 rounded-lg focus:outline-none focus:border-indigo-500 transition-all"
                                style={{
                                  borderColor: showPracticeResults
                                    ? (practiceAnswers[idx]?.toLowerCase().trim() === exercise.correctAnswer?.toLowerCase().trim() ? '#10b981' : '#ef4444')
                                    : '#e5e7eb'
                                }}
                              />
                              {showPracticeResults && (
                                <div className="p-3 rounded-lg" style={{
                                  backgroundColor: practiceAnswers[idx]?.toLowerCase().trim() === exercise.correctAnswer?.toLowerCase().trim() ? '#d1fae5' : '#fee2e2'
                                }}>
                                  <p className="text-sm font-semibold" style={{
                                    color: practiceAnswers[idx]?.toLowerCase().trim() === exercise.correctAnswer?.toLowerCase().trim() ? '#065f46' : '#991b1b'
                                  }}>
                                    {practiceAnswers[idx]?.toLowerCase().trim() === exercise.correctAnswer?.toLowerCase().trim()
                                      ? '✓ Correct!'
                                      : `✗ Correct answer: ${exercise.correctAnswer}`}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {exercise.type === 'speaking' && (
                            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                              <p className="text-sm text-indigo-700 mb-2">💬 Practice speaking this out loud:</p>
                              <p className="text-gray-800 font-medium mb-3">{exercise.question}</p>
                              {exercise.hints && exercise.hints.length > 0 && (
                                <div className="flex items-start gap-2 mt-3">
                                  <HelpCircle size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                                  <p className="text-xs text-primary">{exercise.hints[0]}</p>
                                </div>
                              )}
                            </div>
                          )}

                          {exercise.type === 'writing' && (
                            <div className="space-y-3">
                              <textarea
                                value={practiceAnswers[idx] || ''}
                                onChange={(e) => setPracticeAnswers({ ...practiceAnswers, [idx]: e.target.value })}
                                disabled={showPracticeResults}
                                placeholder="Write your answer here..."
                                rows={4}
                                className="w-full px-4 py-3 bg-card border-2 rounded-lg focus:outline-none focus:border-indigo-500 transition-all resize-none"
                              />
                              {exercise.hints && exercise.hints.length > 0 && (
                                <div className="flex items-start gap-2">
                                  <HelpCircle size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                                  <p className="text-xs text-primary">{exercise.hints[0]}</p>
                                </div>
                              )}
                            </div>
                          )}

                          {exercise.hints && exercise.hints.length > 1 && !showPracticeResults && (
                            <button
                              onClick={() => {
                                // Show hint (could be enhanced)
                                alert(`Hint: ${exercise.hints?.[1] || exercise.hints[0]}`);
                              }}
                              className="mt-2 text-xs text-primary hover:text-indigo-700 font-medium flex items-center gap-1"
                            >
                              <HelpCircle size={14} /> Show Hint
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {!showPracticeResults ? (
                  <button
                    onClick={handlePracticeSubmit}
                    className="mt-6 w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-all"
                  >
                    Submit Answers
                  </button>
                ) : (
                  <div className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                    <div className="text-center mb-4">
                      <h3 className="text-2xl font-black text-green-700 mb-2">Practice Results</h3>
                      <div className="text-5xl font-black text-green-600 mb-2">
                        {score?.percentage}%
                      </div>
                      <p className="text-green-700 font-semibold">
                        You got {score?.correct} out of {score?.total} questions correct!
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setPracticeAnswers({});
                          setShowPracticeResults(false);
                        }}
                        className="flex-1 py-3 bg-card text-primary rounded-lg font-bold hover:bg-indigo-50 transition-all border-2 border-indigo-200"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={() => {
                          setShowLessonView(false);
                          setCurrentLesson(null);
                          setPracticeAnswers({});
                          setShowPracticeResults(false);
                          if (currentModule) {
                            startModuleLearning(currentModule);
                          }
                        }}
                        className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold hover:scale-105 transition-all"
                      >
                        Start AI Practice
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-[2rem] shadow-lg p-8 border border-purple-100">
                <h2 className="text-2xl font-bold text-foreground mb-4">Summary</h2>
                <p className="text-foreground/80 text-lg leading-relaxed">{currentLesson.content.summary}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ModuleLearningView = () => (
    <div className="min-h-screen bg-muted p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-card rounded-[2.5rem] shadow-xl p-8 mb-6 border border-indigo-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  stopAudio();
                  setShowModuleSession(false);
                  setCurrentModule(null);
                }}
                className="w-12 h-12 bg-secondary hover:bg-muted rounded-xl flex items-center justify-center transition-all"
              >
                <ArrowRight size={24} className="rotate-180" />
              </button>
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">{currentModule?.type} Lesson</span>
                <h1 className="text-3xl font-black text-foreground">{currentModule?.title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold">
                {currentModule?.level}
              </div>
              <div className="w-12 h-12 bg-indigo-100 text-primary rounded-xl flex items-center justify-center">
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
            <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                style={{ width: `${currentModule?.progress || 0}%` }}
              />
            </div>
            <span className="text-sm font-bold text-muted-foreground">{currentModule?.progress}%</span>
          </div>
        </div>

        {/* AI Teacher Card */}
        <div className="bg-card rounded-[2.5rem] shadow-xl p-10 mb-6 border border-indigo-100">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <User size={40} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground mb-1">{currentPersona?.name}</h3>
              <p className="text-muted-foreground">{currentPersona?.role}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => startModuleLearning(currentModule!)}
                disabled={isLive}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-all ${isLive
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-br from-green-500 to-emerald-600 hover:scale-110 hover:from-green-600 hover:to-emerald-700'
                  }`}
              >
                <Mic size={28} className="text-white" />
              </button>
              <button
                onClick={() => stopAudio()}
                disabled={!isLive}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-all ${!isLive
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-red-500 hover:scale-110 hover:bg-red-600'
                  }`}
              >
                <MicOff size={28} className="text-white" />
              </button>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="bg-muted rounded-2xl p-6 min-h-[300px] max-h-[500px] overflow-y-auto">
            {/* AI Teacher's Speech (Output Transcription) */}
            {outputTranscription ? (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-foreground">{currentPersona?.name} (AI Teacher)</span>
                    <p className="text-xs text-muted-foreground">Speaking now...</p>
                  </div>
                </div>
                <div className="bg-card rounded-xl p-5 border-l-4 border-indigo-500 shadow-sm">
                  <p className="text-foreground text-lg leading-relaxed whitespace-pre-wrap">{outputTranscription}</p>
                </div>
              </div>
            ) : !isLive ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare size={32} className="text-indigo-500" />
                </div>
                <p className="text-muted-foreground font-medium">Click the microphone to start your AI lesson</p>
                <p className="text-sm text-muted-foreground mt-2">Your AI teacher will guide you through {currentModule?.title}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 animate-pulse shadow-lg">
                  <Mic size={40} className="text-white" />
                </div>
                <p className="text-foreground font-bold text-2xl mb-3">🎤 Ready to Start!</p>
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-2xl mb-4 shadow-xl">
                  <p className="text-xl font-black">Say "START" to begin</p>
                </div>
                <p className="text-muted-foreground text-sm max-w-md">
                  Your AI teacher {currentPersona?.name} is listening. Just say the word <span className="font-bold text-foreground">"start"</span> and your lesson will begin!
                </p>
              </div>
            )}

            {isThinking && (
              <div className="flex items-center gap-2 mt-4 text-primary">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-sm font-medium ml-2">Teacher is thinking...</span>
              </div>
            )}
          </div>

          {/* Input Transcription (What you said) */}
          {inputTranscription && (
            <div className="mt-6 bg-secondary/10 rounded-2xl p-6 border-l-4 border-secondary">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <span className="text-sm font-bold text-foreground">You said:</span>
              </div>
              <p className="text-foreground/90 text-lg leading-relaxed">{inputTranscription}</p>
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

  // --- Navigation Handlers ---
  const handleNavigate = (page: string) => {
    if (page === 'home' || page === '/') {
      navigate('/');
    } else if (page === '/courses' || page === 'courses') {
      setActiveTab('learn');
      navigate('/dashboard');
    } else if (page === '/speaking' || page === 'speaking') {
      setActiveTab('practice');
      navigate('/dashboard');
    } else if (page === '/dashboard' || page === 'dashboard') {
      navigate('/dashboard');
    } else {
      // Default fallback
      if (page.startsWith('/')) navigate(page);
      else navigate('/' + page);
    }
  };

  const handleExploreCourses = () => {
    navigate('/courses');
  };

  const handleEnrollCourse = (courseId: string) => {
    console.log('Enrolling in course:', courseId);
    // TODO: Implement course enrollment logic
  };

  const handleCourseClick = (courseId: string) => {
    console.log('Viewing course:', courseId);
    // TODO: Implement course detail view
  };

  // --- Router ---
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<HomePage onGetStarted={() => navigate('/signup')} onExploreCourses={handleExploreCourses} onSignIn={() => navigate('/login')} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/courses" element={<CoursesPage onEnroll={() => navigate('/login')} onCourseClick={(id) => console.log('View course', id)} onSignIn={() => navigate('/login')} onGetStarted={() => navigate('/signup')} />} />
        <Route path="/pricing" element={<PricingPage onGetStarted={() => navigate('/signup')} onSignIn={() => navigate('/login')} />} />
        <Route path="/assessment" element={<ProtectedRoute>{AssessmentView()}</ProtectedRoute>} />
        <Route path="/analyzing" element={<ProtectedRoute>{AnalyzingView()}</ProtectedRoute>} />
        <Route path="/result" element={<ProtectedRoute>{ResultView()}</ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute>{RoadmapView()}</ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute>{DashboardLayout()}</ProtectedRoute>}>
          <Route index element={HomeContent()} />
          <Route path="learn" element={LearnContent()} />
          <Route path="practice" element={PracticeContent()} />
          <Route path="progress" element={ProgressContent()} />
        </Route>
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/learning-session" element={<ProtectedRoute>{LearningSessionView()}</ProtectedRoute>} />
        <Route path="*" element={<HomePage onGetStarted={() => navigate('/signup')} onExploreCourses={handleExploreCourses} onSignIn={() => navigate('/login')} />} />
      </Routes>
    </div>
  );
};

export default App;
