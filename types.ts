
export enum AppPhase {
  WELCOME = 'WELCOME',
  ASSESSMENT = 'ASSESSMENT',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  PATH = 'PATH',
  DASHBOARD = 'DASHBOARD',
  LEARNING_SESSION = 'LEARNING_SESSION'
}

export enum EnglishLevel {
  BEGINNER = 'Beginner',
  ELEMENTARY = 'Elementary',
  INTERMEDIATE = 'Intermediate',
  UPPER_INTERMEDIATE = 'Upper-Intermediate',
  ADVANCED = 'Advanced'
}

export interface AIPersona {
  name: string;
  gender: 'male' | 'female';
  role: string;
  personality: string;
  style: 'slow' | 'normal' | 'confident';
  voice: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
  scenario?: string;
}

export interface LearningPath {
  level: EnglishLevel;
  weeklyGoals: string[];
  grammarTopics: string[];
  speakingFocus: string[];
  vocabularyThemes: string[];
  pronunciationFocus: string[];
}

export interface AssessmentQuestion {
  id: number;
  text: string;
  focus: string;
}

export interface Module {
  id: string;
  title: string;
  type: 'Grammar' | 'Vocabulary' | 'Reading' | 'Writing' | 'Listening' | 'Speaking';
  level: EnglishLevel;
  progress: number;
  icon: string;
  description?: string;
  estimatedTime?: number; // in minutes
  lessons?: number; // number of lessons in this module
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface GrammarTopic {
  id: string;
  title: string;
  description: string;
  level: EnglishLevel;
  lessons: string[];
}

export interface VocabularySets {
  id: string;
  title: string;
  theme: string;
  words: { word: string; meaning: string; example: string }[];
  level: EnglishLevel;
}

export interface ListeningContent {
  id: string;
  title: string;
  type: 'dialogue' | 'podcast' | 'video';
  accent: 'British' | 'American' | 'Australian';
  level: EnglishLevel;
  questions: string[];
}

export interface WritingExercise {
  id: string;
  title: string;
  type: 'sentence' | 'paragraph' | 'essay' | 'email';
  level: EnglishLevel;
  prompt: string;
  sampleAnswer?: string;
}

export interface SpeakingContent {
  id: string;
  title: string;
  scenario: string;
  level: EnglishLevel;
  dialoguePoints: string[];
}

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  { id: 1, text: "Please introduce yourself in English. Tell me your name and what you do.", focus: "Simple Introduction" },
  { id: 2, text: "What do you usually do in the morning?", focus: "Grammar Check (Present Tense)" },
  { id: 3, text: "What did you do yesterday?", focus: "Past Tense Check" },
  { id: 4, text: "Can you describe your favorite place?", focus: "Vocabulary Check" },
  { id: 5, text: "Please read this sentence: 'I am learning English to improve my future.'", focus: "Pronunciation Check" }
];

export const PERSONAS: AIPersona[] = [
  { name: 'Emma', gender: 'female', role: 'Friendly English teacher', personality: 'supportive and patient', style: 'slow', voice: 'Kore', scenario: 'Daily Greeting' },
  { name: 'Daniel', gender: 'male', role: 'Office colleague', personality: 'professional and helpful', style: 'normal', voice: 'Puck', scenario: 'Job Interview' },
  { name: 'Sophia', gender: 'female', role: 'Travel guide', personality: 'fun and energetic', style: 'confident', voice: 'Zephyr', scenario: 'Ordering Food' },
  { name: 'Alex', gender: 'male', role: 'Shop Assistant', personality: 'polite and quick', style: 'confident', voice: 'Fenrir', scenario: 'Buying Clothes' },
  { name: 'Lily', gender: 'female', role: 'Language Partner', personality: 'casual and friendly', style: 'normal', voice: 'Kore', scenario: 'Hobby Discussion' }
];

export const MOCK_MODULES: Module[] = [
  // Grammar Modules
  { id: 'g1', title: 'Parts of Speech', type: 'Grammar', level: EnglishLevel.BEGINNER, progress: 60, icon: 'Book', description: 'Nouns, Verbs, Adjectives, Adverbs - Master the building blocks of English', estimatedTime: 15, lessons: 5, difficulty: 'easy' },
  { id: 'g2', title: 'English Tenses Mastery', type: 'Grammar', level: EnglishLevel.ELEMENTARY, progress: 45, icon: 'Clock', description: 'Past, Present, Future Tenses - Express time accurately', estimatedTime: 25, lessons: 8, difficulty: 'medium' },
  { id: 'g3', title: 'Sentence Structure', type: 'Grammar', level: EnglishLevel.INTERMEDIATE, progress: 30, icon: 'Layout', description: 'Simple, Compound, Complex Sentences - Build better sentences', estimatedTime: 20, lessons: 6, difficulty: 'medium' },
  { id: 'g4', title: 'Prepositions & Conjunctions', type: 'Grammar', level: EnglishLevel.INTERMEDIATE, progress: 20, icon: 'Link', description: 'Master connecting words - in, on, at, and, but, because', estimatedTime: 18, lessons: 7, difficulty: 'medium' },
  { id: 'g5', title: 'Punctuation & Grammar Rules', type: 'Grammar', level: EnglishLevel.UPPER_INTERMEDIATE, progress: 15, icon: 'FileText', description: 'Professional writing standards - commas, semicolons, apostrophes', estimatedTime: 30, lessons: 10, difficulty: 'hard' },
  
  // Vocabulary Modules
  { id: 'v1', title: 'Daily New Words', type: 'Vocabulary', level: EnglishLevel.BEGINNER, progress: 0, icon: 'Sparkles', description: 'Learn 10 essential words daily - Build your vocabulary foundation', estimatedTime: 20, lessons: 30, difficulty: 'easy' },
  { id: 'v2', title: 'Travel & Tourism Vocab', type: 'Vocabulary', level: EnglishLevel.ELEMENTARY, progress: 25, icon: 'MapPin', description: 'Airport, hotel, restaurant vocabulary - Travel with confidence', estimatedTime: 30, lessons: 12, difficulty: 'medium' },
  { id: 'v3', title: 'Business English', type: 'Vocabulary', level: EnglishLevel.INTERMEDIATE, progress: 35, icon: 'BarChart3', description: 'Professional workplace terms - Excel in business communication', estimatedTime: 35, lessons: 15, difficulty: 'medium' },
  { id: 'v4', title: 'School & Education Terms', type: 'Vocabulary', level: EnglishLevel.INTERMEDIATE, progress: 0, icon: 'BookOpen', description: 'Academic and educational vocabulary - Succeed in studies', estimatedTime: 25, lessons: 10, difficulty: 'medium' },
  { id: 'v5', title: 'Technology & Innovation', type: 'Vocabulary', level: EnglishLevel.UPPER_INTERMEDIATE, progress: 10, icon: 'Zap', description: 'Modern tech vocabulary - Stay current with technology', estimatedTime: 30, lessons: 12, difficulty: 'hard' },
  { id: 'v6', title: 'Idioms & Phrases', type: 'Vocabulary', level: EnglishLevel.INTERMEDIATE, progress: 40, icon: 'MessageSquare', description: 'Native speaker expressions - Sound like a native', estimatedTime: 25, lessons: 20, difficulty: 'hard' },
  { id: 'v7', title: 'Synonyms & Antonyms', type: 'Vocabulary', level: EnglishLevel.ELEMENTARY, progress: 50, icon: 'RefreshCw', description: 'Similar and opposite words - Expand your word choices', estimatedTime: 20, lessons: 8, difficulty: 'easy' },
  
  // Speaking & Pronunciation Modules
  { id: 's1', title: 'Job Interview Practice', type: 'Speaking', level: EnglishLevel.INTERMEDIATE, progress: 0, icon: 'User', description: 'AI-powered interview roleplay - Ace your next interview', estimatedTime: 40, lessons: 10, difficulty: 'hard' },
  { id: 's2', title: 'Travel Conversations', type: 'Speaking', level: EnglishLevel.ELEMENTARY, progress: 15, icon: 'Plane', description: 'Airport, hotel, and tourist scenarios - Speak confidently abroad', estimatedTime: 30, lessons: 8, difficulty: 'medium' },
  { id: 's3', title: 'Shopping & Trading', type: 'Speaking', level: EnglishLevel.BEGINNER, progress: 20, icon: 'ShoppingCart', description: 'Bargaining and purchasing dialogue - Shop like a local', estimatedTime: 25, lessons: 6, difficulty: 'easy' },
  { id: 's4', title: 'Daily Life Conversations', type: 'Speaking', level: EnglishLevel.ELEMENTARY, progress: 30, icon: 'Coffee', description: 'Natural everyday discussions - Chat naturally', estimatedTime: 20, lessons: 15, difficulty: 'easy' },
  { id: 's5', title: 'Pronunciation Correction', type: 'Speaking', level: EnglishLevel.BEGINNER, progress: 40, icon: 'Volume2', description: 'AI feedback on pronunciation - Speak clearly', estimatedTime: 30, lessons: 12, difficulty: 'medium' },
  { id: 's6', title: 'Intonation & Stress', type: 'Speaking', level: EnglishLevel.INTERMEDIATE, progress: 25, icon: 'Music', description: 'Master natural English rhythm - Sound like a native', estimatedTime: 35, lessons: 10, difficulty: 'hard' },
  
  // Listening Modules
  { id: 'l1', title: 'English Dialogues', type: 'Listening', level: EnglishLevel.BEGINNER, progress: 35, icon: 'Headphones', description: 'Everyday conversation audio - Understand real conversations', estimatedTime: 20, lessons: 20, difficulty: 'easy' },
  { id: 'l2', title: 'Podcast Comprehension', type: 'Listening', level: EnglishLevel.INTERMEDIATE, progress: 20, icon: 'Radio', description: 'Listen and comprehend - Improve listening skills', estimatedTime: 30, lessons: 15, difficulty: 'medium' },
  { id: 'l3', title: 'British English Accent', type: 'Listening', level: EnglishLevel.INTERMEDIATE, progress: 15, icon: 'Globe', description: 'British pronunciation exposure - Understand UK English', estimatedTime: 25, lessons: 10, difficulty: 'medium' },
  { id: 'l4', title: 'American English Accent', type: 'Listening', level: EnglishLevel.INTERMEDIATE, progress: 10, icon: 'Globe', description: 'American pronunciation exposure - Understand US English', estimatedTime: 25, lessons: 10, difficulty: 'medium' },
  { id: 'l5', title: 'Australian English', type: 'Listening', level: EnglishLevel.UPPER_INTERMEDIATE, progress: 0, icon: 'Globe', description: 'Australian accent training - Master Aussie English', estimatedTime: 30, lessons: 8, difficulty: 'hard' },
  
  // Reading Modules
  { id: 'r1', title: 'Short Stories', type: 'Reading', level: EnglishLevel.ELEMENTARY, progress: 45, icon: 'BookOpen', description: 'Engaging short fiction - Read for pleasure and learning', estimatedTime: 25, lessons: 20, difficulty: 'easy' },
  { id: 'r2', title: 'News Articles', type: 'Reading', level: EnglishLevel.INTERMEDIATE, progress: 30, icon: 'Newspaper', description: 'Current events reading - Stay informed in English', estimatedTime: 30, lessons: 15, difficulty: 'medium' },
  { id: 'r3', title: 'Blog Posts & Articles', type: 'Reading', level: EnglishLevel.INTERMEDIATE, progress: 25, icon: 'FileText', description: 'Diverse topic reading - Explore various subjects', estimatedTime: 25, lessons: 18, difficulty: 'medium' },
  { id: 'r4', title: 'Skimming & Scanning', type: 'Reading', level: EnglishLevel.INTERMEDIATE, progress: 40, icon: 'Eye', description: 'Speed reading techniques - Read faster and smarter', estimatedTime: 20, lessons: 8, difficulty: 'hard' },
  
  // Writing Modules
  { id: 'w1', title: 'Sentence Formation', type: 'Writing', level: EnglishLevel.BEGINNER, progress: 55, icon: 'PenTool', description: 'Build correct sentences - Master sentence structure', estimatedTime: 20, lessons: 10, difficulty: 'easy' },
  { id: 'w2', title: 'Paragraph Writing', type: 'Writing', level: EnglishLevel.ELEMENTARY, progress: 35, icon: 'FileText', description: 'Structured paragraph composition - Write clearly', estimatedTime: 30, lessons: 12, difficulty: 'medium' },
  { id: 'w3', title: 'Professional Email Writing', type: 'Writing', level: EnglishLevel.INTERMEDIATE, progress: 10, icon: 'Mail', description: 'Formal business communication - Write professional emails', estimatedTime: 35, lessons: 10, difficulty: 'medium' },
  { id: 'w4', title: 'Essay Writing', type: 'Writing', level: EnglishLevel.UPPER_INTERMEDIATE, progress: 5, icon: 'BookOpen', description: 'Long-form essay composition - Write compelling essays', estimatedTime: 45, lessons: 8, difficulty: 'hard' },
  { id: 'w5', title: 'Informal Writing', type: 'Writing', level: EnglishLevel.ELEMENTARY, progress: 20, icon: 'MessageSquare', description: 'Casual messages and notes - Write naturally', estimatedTime: 15, lessons: 6, difficulty: 'easy' },
];
