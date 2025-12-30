import { EnglishLevel, Module } from './types';

export interface LessonContent {
  id: string;
  moduleId: string;
  title: string;
  content: {
    introduction: string;
    explanation: string;
    examples: string[];
    practice: {
      type: 'multiple-choice' | 'fill-blank' | 'speaking' | 'writing';
      question: string;
      options?: string[];
      correctAnswer?: string;
      hints?: string[];
    }[];
    summary: string;
  };
  estimatedTime: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
}

export const LESSON_CONTENT: Record<string, LessonContent> = {
  // Grammar Lessons
  'g1': {
    id: 'g1',
    moduleId: 'g1',
    title: 'Parts of Speech - Nouns, Verbs, Adjectives, Adverbs',
    content: {
      introduction: 'Understanding parts of speech is fundamental to mastering English. Each word in a sentence has a specific role.',
      explanation: `**Nouns** name people, places, things, or ideas. Examples: cat, London, happiness.
**Verbs** express actions or states. Examples: run, is, think.
**Adjectives** describe nouns. Examples: beautiful, tall, smart.
**Adverbs** describe verbs, adjectives, or other adverbs. Examples: quickly, very, well.`,
      examples: [
        'The **quick** (adjective) **cat** (noun) **runs** (verb) **quickly** (adverb).',
        '**Sarah** (noun) **is** (verb) **very** (adverb) **intelligent** (adjective).',
        '**Students** (noun) **study** (verb) **hard** (adverb) for their **exams** (noun).'
      ],
      practice: [
        {
          type: 'multiple-choice',
          question: 'What part of speech is "beautifully" in: "She sings beautifully"?',
          options: ['Noun', 'Verb', 'Adjective', 'Adverb'],
          correctAnswer: 'Adverb',
          hints: ['It describes how she sings']
        },
        {
          type: 'fill-blank',
          question: 'Complete: "The _____ (adjective) student _____ (verb) _____ (adverb)."',
          correctAnswer: 'smart, studies, carefully',
          hints: ['Think of a describing word, an action word, and a word describing how']
        }
      ],
      summary: 'Nouns name things, verbs show actions, adjectives describe nouns, and adverbs describe verbs or adjectives.'
    },
    estimatedTime: 15,
    difficulty: 'easy'
  },
  
  'g2': {
    id: 'g2',
    moduleId: 'g2',
    title: 'English Tenses - Past, Present, Future',
    content: {
      introduction: 'Tenses help us express when something happens. Mastering tenses is crucial for clear communication.',
      explanation: `**Present Tense**: Actions happening now or regularly.
- Simple Present: "I study English every day."
- Present Continuous: "I am studying right now."

**Past Tense**: Actions that happened before.
- Simple Past: "I studied yesterday."
- Past Continuous: "I was studying when you called."

**Future Tense**: Actions that will happen.
- Simple Future: "I will study tomorrow."
- Future Continuous: "I will be studying at 3 PM."`,
      examples: [
        '**Present**: "She **works** at a hospital." (habitual action)',
        '**Past**: "She **worked** there last year." (completed action)',
        '**Future**: "She **will work** there next month." (planned action)'
      ],
      practice: [
        {
          type: 'multiple-choice',
          question: 'Which sentence is in the past tense?',
          options: ['I go to school', 'I went to school', 'I will go to school', 'I am going to school'],
          correctAnswer: 'I went to school',
          hints: ['Look for the past form of "go"']
        },
        {
          type: 'speaking',
          question: 'Tell me about what you did yesterday using past tense.',
          hints: ['Use verbs in past form like "went", "ate", "saw"']
        }
      ],
      summary: 'Present = now, Past = before, Future = later. Pay attention to verb forms!'
    },
    estimatedTime: 25,
    difficulty: 'medium'
  },

  // Vocabulary Lessons
  'v1': {
    id: 'v1',
    moduleId: 'v1',
    title: 'Daily New Words - Essential Vocabulary',
    content: {
      introduction: 'Building vocabulary is like building a house - start with the foundation words you use every day.',
      explanation: `Today we'll learn 10 essential words:
1. **Accomplish** (verb) - to complete successfully
2. **Benefit** (noun) - an advantage or profit
3. **Challenge** (noun) - a difficult task
4. **Develop** (verb) - to grow or improve
5. **Essential** (adjective) - absolutely necessary
6. **Frequent** (adjective) - happening often
7. **Generate** (verb) - to produce or create
8. **Improve** (verb) - to make better
9. **Maintain** (verb) - to keep in good condition
10. **Opportunity** (noun) - a chance for advancement`,
      examples: [
        'I want to **accomplish** my goal of speaking English fluently.',
        'Learning English has many **benefits** for your career.',
        'This **challenge** will help you **develop** your skills.',
        'Practice is **essential** for **improving** your English.'
      ],
      practice: [
        {
          type: 'fill-blank',
          question: 'Choose the right word: "This is a great _____ to learn new skills."',
          options: ['accomplish', 'benefit', 'opportunity', 'challenge'],
          correctAnswer: 'opportunity',
          hints: ['It means a chance']
        },
        {
          type: 'writing',
          question: 'Write a sentence using at least 3 of today\'s words.',
          hints: ['Try: "I want to develop my skills to accomplish my goals."']
        }
      ],
      summary: 'Practice these words daily. Use them in sentences to remember them better!'
    },
    estimatedTime: 20,
    difficulty: 'easy'
  },

  'v2': {
    id: 'v2',
    moduleId: 'v2',
    title: 'Travel & Tourism Vocabulary',
    content: {
      introduction: 'Planning a trip? Master these essential travel words to navigate airports, hotels, and restaurants confidently.',
      explanation: `**Airport Vocabulary**:
- Check-in, boarding pass, luggage, passport, customs
- Departure, arrival, gate, terminal, security

**Hotel Vocabulary**:
- Reservation, check-in, check-out, room service, reception
- Single room, double room, suite, amenities

**Restaurant Vocabulary**:
- Menu, appetizer, main course, dessert, bill/check
- Waiter/waitress, tip, reservation, cuisine`,
      examples: [
        'I need to **check in** at the airport 2 hours before my flight.',
        'The hotel **reception** will help you with your **reservation**.',
        'Please bring me the **menu** and I\'ll make a **reservation** for dinner.'
      ],
      practice: [
        {
          type: 'multiple-choice',
          question: 'What do you show at the airport before boarding?',
          options: ['Menu', 'Boarding pass', 'Reservation', 'Tip'],
          correctAnswer: 'Boarding pass',
          hints: ['It\'s the document that lets you get on the plane']
        },
        {
          type: 'speaking',
          question: 'Practice: "I would like to make a reservation for a single room, please."',
          hints: ['Speak clearly and politely']
        }
      ],
      summary: 'Travel vocabulary helps you communicate confidently when exploring new places!'
    },
    estimatedTime: 30,
    difficulty: 'medium'
  },

  // Speaking Lessons
  's1': {
    id: 's1',
    moduleId: 's1',
    title: 'Job Interview Practice - Common Questions',
    content: {
      introduction: 'Ace your next job interview with confidence! Practice answering common interview questions naturally.',
      explanation: `**Common Interview Questions**:
1. "Tell me about yourself."
   - Keep it professional, mention relevant experience
   - Example: "I'm a software developer with 5 years of experience..."

2. "Why do you want this job?"
   - Show enthusiasm and alignment with company values
   - Example: "I'm excited about this role because..."

3. "What are your strengths?"
   - Be specific, give examples
   - Example: "I'm detail-oriented, which helped me..."

4. "Where do you see yourself in 5 years?"
   - Show ambition but stay realistic
   - Example: "I hope to grow within the company..."`,
      examples: [
        '**Good Answer**: "I\'m passionate about technology and have been developing web applications for 5 years. I enjoy solving complex problems and working in teams."',
        '**Avoid**: "Um, I don\'t know, I just need a job."',
        '**Better**: "I\'m looking for a role where I can grow my skills while contributing to meaningful projects."'
      ],
      practice: [
        {
          type: 'speaking',
          question: 'Practice: "Tell me about yourself." (Speak for 1-2 minutes)',
          hints: ['Start with your current role, mention experience, highlight relevant skills']
        },
        {
          type: 'speaking',
          question: 'Practice: "Why should we hire you?"',
          hints: ['Connect your skills to the job requirements, show enthusiasm']
        }
      ],
      summary: 'Prepare answers, practice speaking clearly, and show confidence. You\'ve got this!'
    },
    estimatedTime: 40,
    difficulty: 'hard'
  },

  // Reading Lessons
  'r1': {
    id: 'r1',
    moduleId: 'r1',
    title: 'Short Stories - Reading Comprehension',
    content: {
      introduction: 'Reading short stories improves vocabulary, grammar, and comprehension. Let\'s read together!',
      explanation: `**Reading Strategy**:
1. **Skim first**: Read quickly to get the main idea
2. **Read carefully**: Pay attention to details
3. **Look for context clues**: Use surrounding words to understand new vocabulary
4. **Ask questions**: Who? What? When? Where? Why?

**Story: "The Lost Key"**
Sarah was walking home from work when she noticed something shiny on the ground. It was a key! She picked it up and looked around, but no one was nearby. The key looked old and special, with intricate designs carved into it. Sarah decided to take it to the police station the next day.`,
      examples: [
        '**Main Idea**: Sarah finds a key and decides to return it.',
        '**Vocabulary from context**: "Intricate" means detailed or complex (from "designs carved into it")',
        '**Comprehension Question**: Why did Sarah decide to take the key to the police station?'
      ],
      practice: [
        {
          type: 'multiple-choice',
          question: 'What is the main idea of the story?',
          options: ['Sarah lost her key', 'Sarah found a key and will return it', 'Sarah works at a police station', 'Sarah likes shiny things'],
          correctAnswer: 'Sarah found a key and will return it',
          hints: ['Look at what Sarah does with the key']
        },
        {
          type: 'writing',
          question: 'Write 2-3 sentences about what you think happens next in the story.',
          hints: ['Be creative! What could the key unlock?']
        }
      ],
      summary: 'Reading regularly improves your English naturally. Try reading 10 minutes every day!'
    },
    estimatedTime: 25,
    difficulty: 'medium'
  },

  // Writing Lessons
  'w1': {
    id: 'w1',
    moduleId: 'w1',
    title: 'Sentence Formation - Building Correct Sentences',
    content: {
      introduction: 'A good sentence has a clear subject and verb. Let\'s learn to build sentences correctly!',
      explanation: `**Sentence Structure**:
- **Subject** (who/what) + **Verb** (action) + **Object** (what receives the action)

**Simple Sentence Examples**:
- "I study English." (Subject: I, Verb: study, Object: English)
- "She reads books." (Subject: She, Verb: reads, Object: books)
- "They play football." (Subject: They, Verb: play, Object: football)

**Common Mistakes to Avoid**:
- Missing subject: "Is studying" ❌ → "She is studying" ✅
- Wrong word order: "English I study" ❌ → "I study English" ✅
- Missing verb: "I English" ❌ → "I study English" ✅`,
      examples: [
        '**Correct**: "The students learn grammar."',
        '**Incorrect**: "Students grammar learn." (Wrong word order)',
        '**Correct**: "My friend speaks three languages."',
        '**Incorrect**: "My friend three languages." (Missing verb)'
      ],
      practice: [
        {
          type: 'fill-blank',
          question: 'Complete: "_____ (subject) _____ (verb) _____ (object) every morning."',
          correctAnswer: 'I, exercise, / She, drinks, coffee / They, read, newspapers',
          hints: ['Think: Who does what?']
        },
        {
          type: 'writing',
          question: 'Write 5 simple sentences about your daily routine.',
          hints: ['Use: I + verb + object. Example: "I wake up at 7 AM."']
        }
      ],
      summary: 'Remember: Subject + Verb + Object. Practice building sentences every day!'
    },
    estimatedTime: 20,
    difficulty: 'easy'
  }
};

// Get lesson content by module ID
export const getLessonContent = (moduleId: string): LessonContent | undefined => {
  return LESSON_CONTENT[moduleId];
};

// Get all lessons for a module type
export const getLessonsByType = (type: Module['type']): LessonContent[] => {
  const typePrefix = type === 'Grammar' ? 'g' : 
                     type === 'Vocabulary' ? 'v' :
                     type === 'Speaking' ? 's' :
                     type === 'Listening' ? 'l' :
                     type === 'Reading' ? 'r' :
                     type === 'Writing' ? 'w' : '';
  return Object.values(LESSON_CONTENT).filter(lesson => lesson.moduleId.startsWith(typePrefix));
};

