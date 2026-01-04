-- Create unique lessons for ALL homepage courses
-- Maps homepage course IDs to learning platform courses

-- =====================================================
-- COURSE ID MAPPING:
-- Homepage ID 1 → course_beginner_english (Complete English Grammar Mastery)
-- Homepage ID 2 → course_ielts_prep (IELTS 8+ Band Guaranteed)
-- =====================================================

-- First, add/update the courses
INSERT INTO courses (`id`, `title`, `description`, `level`, `instructor_name`, `duration_weeks`, `price`) VALUES
('course_american_accent', 'American Accent Training', 'Perfect your American pronunciation with AI-powered feedback', 'Intermediate', 'David Miller', 6, 79.00),
('course_conversational_beginners', 'English for Beginners', 'A complete guide to starting your English journey', 'Beginner', 'Lisa Anderson', 10, 0.00),
('course_advanced_writing', 'Advanced Writing & Composition', 'Enhance your writing skills for academic and professional success', 'Advanced', 'Prof. Robert Lee', 10, 89.00),
('course_beginner_english', 'Complete English Grammar Mastery', 'Master all essential grammar rules from basics to advanced', 'Intermediate', 'Dr. Sarah Johnson', 12, 0.00),
('course_ielts_prep', 'IELTS 8+ Band Guaranteed', 'Comprehensive preparation for Academic and General Training', 'Advanced', 'AI Tutor Emma', 14, 49.99)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`), `duration_weeks` = VALUES(`duration_weeks`), `description` = VALUES(`description`), `updated_at` = CURRENT_TIMESTAMP;

-- Use REPLACE INTO for modules
REPLACE INTO modules (`id`, `course_id`, `title`, `description`, `order_index`) VALUES
-- American Accent Training
('module_accent_01', 'course_american_accent', 'Module 1: American Accent Basics', 'Understanding the fundamentals of American pronunciation', 1),
('module_accent_02', 'course_american_accent', 'Module 2: American Sounds (Consonants)', 'Mastering consonant sounds and difficult pairs', 2),
('module_accent_03', 'course_american_accent', 'Module 3: American Vowel Sounds', 'Perfecting the unique American vowels', 3),
('module_accent_04', 'course_american_accent', 'Module 4: The American R Sound', 'Conquering the most distinct American sound', 4),
('module_accent_05', 'course_american_accent', 'Module 5: Stress, Rhythm & Intonation', 'Learning the music of American English', 5),
('module_accent_06', 'course_american_accent', 'Module 6: Connected Speech', 'Linking, reductions, and natural flow', 6),
('module_accent_07', 'course_american_accent', 'Module 7: The Schwa Sound (ə)', 'The most common sound in English', 7),
('module_accent_08', 'course_american_accent', 'Module 8: American Pronunciation in Daily Life', 'Applying accent to rreal-world scenarios', 8),
('module_accent_09', 'course_american_accent', 'Module 9: Speed, Clarity & Fluency', 'Balancing clear articulation with natural speed', 9),
('module_accent_10', 'course_american_accent', 'Module 10: Accent Reduction Techniques', 'Strategies to minimize native language influence', 10),
('module_accent_11', 'course_american_accent', 'Module 11: Listening & Imitation Training', 'Using media to refine your ear and voice', 11),
('module_accent_12', 'course_american_accent', 'Module 12: Professional American English', 'Accent for business and professional settings', 12),
('module_accent_13', 'course_american_accent', 'Module 13: Final Practice & Assessment', 'Evaluation and future improvement plan', 13),

-- English for Beginners
('module_efb_01', 'course_conversational_beginners', 'Module 1: Getting Started with English', 'Introduction to the basics of English', 1),
('module_efb_02', 'course_conversational_beginners', 'Module 2: Basic Words & Sentences', 'Building your first vocabulary and sentences', 2),
('module_efb_03', 'course_conversational_beginners', 'Module 3: Greetings & Introductions', 'How to say hello and introduce yourself', 3),
('module_efb_04', 'course_conversational_beginners', 'Module 4: Numbers, Time & Dates', 'Counting and understanding time', 4),
('module_efb_05', 'course_conversational_beginners', 'Module 5: Basic Grammar', 'The foundation of English grammar', 5),
('module_efb_06', 'course_conversational_beginners', 'Module 6: Talking About Yourself', 'Expressing identity, family, and hobbies', 6),
('module_efb_07', 'course_conversational_beginners', 'Module 7: Speaking Practice', 'Interactive speaking exercises', 7),
('module_efb_08', 'course_conversational_beginners', 'Module 8: Listening & Reading', 'Developing comprehension skills', 8),
('module_efb_09', 'course_conversational_beginners', 'Module 9: Real-Life English', 'English for daily situations', 9),
('module_efb_10', 'course_conversational_beginners', 'Module 10: Review & Practice', 'Consolidate your learning', 10),

-- Complete English Grammar Mastery
('module_cegm_01', 'course_beginner_english', 'Module 1: Foundations of Grammar', 'Parts of Speech, Nouns, Pronouns', 1),
('module_cegm_02', 'course_beginner_english', 'Module 2: Verbs & Tenses', 'Mastering verb forms and time', 2),
('module_cegm_03', 'course_beginner_english', 'Module 3: Subject–Verb Agreement', 'Ensuring grammatical correctness', 3),
('module_cegm_04', 'course_beginner_english', 'Module 4: Sentence Structure', 'Phrases, clauses, and sentence types', 4),
('module_cegm_05', 'course_beginner_english', 'Module 5: Questions & Negatives', 'Forming questions and negative statements', 5),
('module_cegm_06', 'course_beginner_english', 'Module 6: Adjectives & Adverbs', 'Describing and modifying words', 6),
('module_cegm_07', 'course_beginner_english', 'Module 7: Prepositions & Conjunctions', 'Connecting ideas and indicating relationships', 7),
('module_cegm_08', 'course_beginner_english', 'Module 8: Modals & Conditionals', 'Expressing possibility and hypothetical situations', 8),
('module_cegm_09', 'course_beginner_english', 'Module 9: Voice & Speech', 'Active/Passive voice and Reported Speech', 9),
('module_cegm_10', 'course_beginner_english', 'Module 10: Advanced Grammar Concepts', 'Complex structures for advanced learners', 10),
('module_cegm_11', 'course_beginner_english', 'Module 11: Common Errors & Corrections', 'Fixing frequent mistakes', 11),
('module_cegm_12', 'course_beginner_english', 'Module 12: Grammar in Real Life', 'Applying grammar to speaking and writing', 12),
('module_cegm_13', 'course_beginner_english', 'Module 13: Practice & Mastery', 'Final review and assessment', 13),

-- IELTS Preparation Modules (13 Modules)
('module_ielts_01', 'course_ielts_prep', 'Module 1: IELTS Overview & Strategy', 'Understanding format, scoring, and planning', 1),
('module_ielts_02', 'course_ielts_prep', 'Module 2: Listening Skills', 'Mastering the 4 sections of listening', 2),
('module_ielts_03', 'course_ielts_prep', 'Module 3: Reading Skills', 'Acedemic & General reading strategies', 3),
('module_ielts_04', 'course_ielts_prep', 'Module 4: Writing Task 1', 'Graphs, Charts, Letters, and Processes', 4),
('module_ielts_05', 'course_ielts_prep', 'Module 5: Writing Task 2', 'Essay writing mastery', 5),
('module_ielts_06', 'course_ielts_prep', 'Module 6: Speaking Part 1', 'Interview and personal questions', 6),
('module_ielts_07', 'course_ielts_prep', 'Module 7: Speaking Part 2', 'The cue card / Long turn', 7),
('module_ielts_08', 'course_ielts_prep', 'Module 8: Speaking Part 3', 'Discussion and abstract ideas', 8),
('module_ielts_09', 'course_ielts_prep', 'Module 9: Vocabulary for IELTS', 'High-band lexical resources', 9),
('module_ielts_10', 'course_ielts_prep', 'Module 10: Grammar for IELTS', 'Complex structures for high scores', 10),
('module_ielts_11', 'course_ielts_prep', 'Module 11: Mock Tests & Evaluation', 'Full practice tests', 11),
('module_ielts_12', 'course_ielts_prep', 'Module 12: Band Score Improvement', 'Strategies to level up your score', 12),
('module_ielts_13', 'course_ielts_prep', 'Module 13: Final Preparation', 'Exam day tips and final revision', 13),

-- Advanced Writing
('module_writing_01', 'course_advanced_writing', 'Module 1: Advanced Writing Foundations', 'Foundational concepts for advanced writing', 1),
('module_writing_02', 'course_advanced_writing', 'Module 2: Sentence Mastery', 'Mastering sentence structure and style', 2),
('module_writing_03', 'course_advanced_writing', 'Module 3: Paragraph Development', 'Creating coherent and unified paragraphs', 3),
('module_writing_04', 'course_advanced_writing', 'Module 4: Essay & Article Writing', 'Structuring essays and articles effectively', 4),
('module_writing_05', 'course_advanced_writing', 'Module 5: Academic Writing Excellence', 'Research, citations, and academic rigor', 5),
('module_writing_06', 'course_advanced_writing', 'Module 6: Professional & Business Writing', 'Reports, proposals, and professional communication', 6),
('module_writing_07', 'course_advanced_writing', 'Module 7: Creative & Expressive Writing', 'Narrative techniques and storytelling', 7),
('module_writing_08', 'course_advanced_writing', 'Module 8: Persuasive Writing', 'Building arguments and rhetorical devices', 8),
('module_writing_09', 'course_advanced_writing', 'Module 9: Editing & Revision Mastery', 'Refining and polishing your work', 9),
('module_writing_10', 'course_advanced_writing', 'Module 10: Vocabulary & Style Enhancement', 'Advanced vocabulary and tone', 10),
('module_writing_11', 'course_advanced_writing', 'Module 11: Writing for Digital Platforms', 'Web writing, SEO, and social media', 11),
('module_writing_12', 'course_advanced_writing', 'Module 12: Exam & Competitive Writing', 'Timed writing and exam strategies', 12),
('module_writing_13', 'course_advanced_writing', 'Module 13: Capstone Writing Project', 'Final project execution and review', 13);


-- =====================================================
-- LESSONS (Using REPLACE INTO)
-- =====================================================

-- American Accent Training
REPLACE INTO lessons (`id`, `module_id`, `title`, `description`, `order_index`, `lesson_type`, `content_text`, `difficulty_level`, `estimated_minutes`, `learning_objectives`) VALUES
-- Module 1
('l_acc_01_01', 'module_accent_01', 'What Is an American Accent?', 'Overview of key characteristics', 1, 'lecture', 'The American accent is characterized by rhoticity (pronouncing the R), specific vowel shifts, and a relaxed mouth position.', 'easy', 15, '["Define American accent traits"]'),
('l_acc_01_02', 'module_accent_01', 'American vs British', 'Key differences', 2, 'lecture', 'Comparing "Water" (Am: Wa-der vs Br: Wa-tuh) and "Car" (Am: Carr vs Br: Cah).', 'easy', 15, '["Distinguish Am vs Br English"]'),
('l_acc_01_03', 'module_accent_01', 'Mouth & Tongue Positions', 'Physical mechanics', 3, 'practice', 'Relax your jaw. Keep the tongue flat for vowels. American English is spoken from the chest, not the nose.', 'medium', 20, '["Adjust mouth position"]'),
('l_acc_01_04', 'module_accent_01', 'Listening & Imitation', 'First steps', 4, 'practice', 'Listen to this clip and repeat exactly what you hear. Focus on the melody.', 'medium', 20, '["Practice imitation"]'),

-- Module 2
('l_acc_02_01', 'module_accent_02', 'Voiced vs Voiceless', 'Vibration in the throat', 1, 'lecture', 'Voiced (Z, V, B, D) vs Voiceless (S, F, P, T). Feel your throat vibrate.', 'medium', 20, '["Identify voiced sounds"]'),
('l_acc_02_02', 'module_accent_02', 'Problem Sounds', 'TH, V, W', 2, 'practice', 'The TH sound: Tongue between teeth. V vs W: Vest vs West.', 'hard', 25, '["Master difficult consonants"]'),
('l_acc_02_03', 'module_accent_02', 'Ending Consonants', 'Don\'t swallow the end', 3, 'practice', 'Clear endings differ from many Asian/European languages. CaT, DoG.', 'medium', 20, '["Pronounce endings clearly"]'),
('l_acc_02_04', 'module_accent_02', 'Sound Pair Practice', 'Minimal pairs', 4, 'quiz', 'Ship vs Sheep. Bat vs Pat. Fan vs Van.', 'medium', 15, '["Distinguish similar sounds"]'),

-- Module 3
('l_acc_03_01', 'module_accent_03', 'Short & Long Vowels', 'Duration matters', 1, 'lecture', 'Bit vs Beat. Cot vs Caught. The length changes the meaning.', 'medium', 20, '["Produce vowel lengths"]'),
('l_acc_03_02', 'module_accent_03', 'Relaxed Vowels', 'The American sound', 2, 'practice', 'Short "i" in "sit" and "bit". Keep muscles relaxed.', 'medium', 20, '["Relax vowel sounds"]'),
('l_acc_03_03', 'module_accent_03', 'Vowel Reduction', 'Unstressed syllables', 3, 'lecture', 'In "photograph", the O is clear. In "photography", it becomes a schwa.', 'hard', 25, '["Reduce unstressed vowels"]'),
('l_acc_03_04', 'module_accent_03', 'Common Vowel Mistakes', 'Correction drills', 4, 'practice', 'Fixing typical errors for non-native speakers.', 'medium', 20, '["Correct vowel errors"]'),

-- Module 4
('l_acc_04_01', 'module_accent_04', 'Strong R Practice', 'The Rhotic R', 1, 'practice', 'Curl the tongue back but don\'t touch the roof of the mouth. Rrrrrr.', 'hard', 25, '["Produce strong R"]'),
('l_acc_04_02', 'module_accent_04', 'R Positions', 'Start, Middle, End', 2, 'practice', 'Red (start), Bird (middle), Car (end). All are pronounced strongly.', 'hard', 25, '["Pronounce R in all positions"]'),
('l_acc_04_03', 'module_accent_04', 'R-Controlled Vowels', 'ar, er, ir, or, ur', 3, 'lecture', 'Car, Her, Bird, For, Fur. The vowel merges with the R.', 'hard', 25, '["Master R-controlled vowels"]'),
('l_acc_04_04', 'module_accent_04', 'Minimal Pairs', 'R vs L', 4, 'quiz', 'Rice vs Lice. Road vs Load. Pray vs Play.', 'hard', 20, '["Distinguish R and L"]'),

-- Module 5
('l_acc_05_01', 'module_accent_05', 'Word Stress', 'Primary stress', 1, 'lecture', 'PHO-to-graph vs pho-TO-graphy. Stress changes meaning and understanding.', 'medium', 20, '["Apply word stress"]'),
('l_acc_05_02', 'module_accent_05', 'Sentence Stress', 'Content vs Function', 2, 'lecture', 'Stress Nouns/Verbs (Content). Glide over is/the/a (Function).', 'medium', 20, '["Apply sentence stress"]'),
('l_acc_05_03', 'module_accent_05', 'Intonation Patterns', 'Rising and Falling', 3, 'practice', 'Statements fall at the end. Yes/No questions rise.', 'medium', 20, '["Use intonation"]'),
('l_acc_05_04', 'module_accent_05', 'Sounding Natural', 'Avoiding robot voice', 4, 'practice', 'Connecting stress and rhythm to sound fluid, not choppy.', 'medium', 20, '["Speak naturally"]'),

-- Module 6
('l_acc_06_01', 'module_accent_06', 'Linking Sounds', 'Consonant to Vowel', 1, 'lecture', 'Run_away -> "Runnaway". Pick_it_up -> "Pickitup".', 'hard', 25, '["Link words"]'),
('l_acc_06_02', 'module_accent_06', 'Reductions', 'Wanna, Gonna', 2, 'practice', 'Going to -> Gonna. Want to -> Wanna. Native speakers use these CONSTANTLY.', 'medium', 20, '["Use reductions"]'),
('l_acc_06_03', 'module_accent_06', 'Contractions', 'I\'m, You\'re, It\'s', 3, 'practice', 'Using "I am" sounds formal/robotic. Use "I\'m" for natural speech.', 'easy', 15, '["Use contractions"]'),
('l_acc_06_04', 'module_accent_06', 'Smooth Speech', 'Flow drills', 4, 'practice', 'Read this paragraph without stopping between every word.', 'hard', 25, '["Speak smoothly"]'),

-- Module 7
('l_acc_07_01', 'module_accent_07', 'What is Schwa?', 'The "uh" sound', 1, 'lecture', 'The most common sound in English. Used in unstressed syllables.', 'medium', 20, '["Identify schwa"]'),
('l_acc_07_02', 'module_accent_07', 'Weak Sounds', 'Disappearing vowels', 2, 'practice', 'Chocolate -> "Choc-lit". Vegetable -> "Veg-ta-ble".', 'hard', 20, '["Pronounce weak forms"]'),
('l_acc_07_03', 'module_accent_07', 'Natural Speed', 'Schwa in sentences', 3, 'practice', '"I can go" -> "I kn go". The "can" becomes a schwa.', 'hard', 25, '["Use schwa in sentences"]'),
('l_acc_07_04', 'module_accent_07', 'Common Words', 'The, A, Of, To', 4, 'practice', 'These function words usually have the schwa sound in sentences.', 'medium', 20, '["Pronounce function words"]'),

-- Module 8
('l_acc_08_01', 'module_accent_08', 'Everyday Convo', 'Casual chat', 1, 'interactive', 'Hey, how\'s it going? What\'re you up to?', 'easy', 20, '["Speak casually"]'),
('l_acc_08_02', 'module_accent_08', 'Workplace English', 'Meeting speak', 2, 'interactive', 'Professional but clear. "Could you clarify that point?"', 'medium', 25, '["Speak professionally"]'),
('l_acc_08_03', 'module_accent_08', 'Phone & Online', 'Voice only', 3, 'interactive', 'Enunciating more clearly when visual cues are missing.', 'hard', 20, '["Speak clearly on phone"]'),
('l_acc_08_04', 'module_accent_08', 'Shadowing 1', 'Daily life', 4, 'practice', 'Repeat after the speaker in a coffee shop scenario.', 'medium', 20, '["Shadow daily speech"]'),

-- Module 9
('l_acc_09_01', 'module_accent_09', 'Natural Speed', 'Not too fast', 1, 'lecture', 'Fluency is about flow, not speed. Don\'t rush.', 'medium', 20, '["Control speaking rate"]'),
('l_acc_09_02', 'module_accent_09', 'Clear vs Fast', 'Clarity first', 2, 'practice', 'Better to be slow and clear than fast and mumbled.', 'easy', 15, '["Prioritize clarity"]'),
('l_acc_09_03', 'module_accent_09', 'Pausing', 'Chunking ideas', 3, 'practice', 'Pause at commas and periods. Pause for emphasis.', 'medium', 20, '["Use pauses effectively"]'),
('l_acc_09_04', 'module_accent_09', 'Fluency Drills', 'Continuous speaking', 4, 'interactive', 'Talk for 1 minute on a topic without stopping.', 'hard', 25, '["Improve fluency"]'),

-- Module 10
('l_acc_10_01', 'module_accent_10', 'Native Influence', 'Identifying habits', 1, 'lecture', 'How your mother tongue affects your English (e.g., syllabic timing vs stress timing).', 'medium', 20, '["Identify native interference"]'),
('l_acc_10_02', 'module_accent_10', 'Muscle Memory', 'Retraining the mouth', 2, 'practice', 'Exaggerated physical exercises makes normal speaking easier.', 'hard', 25, '["Retrain mouth muscles"]'),
('l_acc_10_03', 'module_accent_10', 'Self-Correction', 'Hearing yourself', 3, 'practice', 'Record yourself and compare to a native model.', 'hard', 25, '["Correct own errors"]'),
('l_acc_10_04', 'module_accent_10', 'Daily Plan', 'Routine building', 4, 'lecture', '15 mins/day is better than 2 hours once a week.', 'easy', 15, '["Create practice routine"]'),

-- Module 11
('l_acc_11_01', 'module_accent_11', 'Movies & TV', 'Hollywood accent', 1, 'interactive', 'Analyzing a scene from a movie.', 'fun', 25, '["Analyze movie clips"]'),
('l_acc_11_02', 'module_accent_11', 'News & Podcasts', 'Standard broadcast', 2, 'interactive', 'Mimicking the "Newscaster" neutral accent.', 'medium', 25, '["Mimic broadcast style"]'),
('l_acc_11_03', 'module_accent_11', 'Shadowing 2', 'Advaced shadowing', 3, 'practice', 'Simultaneous speaking with the audio.', 'hard', 30, '["Shadow continuously"]'),
('l_acc_11_04', 'module_accent_11', 'Copy Techniques', 'Acting the part', 4, 'practice', 'Adopt a "persona" to help switch accents.', 'medium', 20, '["Use acting techniques"]'),

-- Module 12
('l_acc_12_01', 'module_accent_12', 'Presentations', 'Public speaking', 1, 'practice', 'Delivering a slide deck with American pronunciation.', 'hard', 30, '["Present confidently"]'),
('l_acc_12_02', 'module_accent_12', 'Interviews', 'High stakes', 2, 'interactive', 'Answering interview questions clearly.', 'hard', 25, '["Ace interviews"]'),
('l_acc_12_03', 'module_accent_12', 'Customer Service', 'Polite & Clear', 3, 'interactive', 'Handling difficult conversations with clarity.', 'medium', 25, '["Communicate with customers"]'),
('l_acc_12_04', 'module_accent_12', 'Confidence', 'Believing in your voice', 4, 'lecture', 'Confidence improves clarity. Faking it helps.', 'medium', 15, '["Build speaking confidence"]'),

-- Module 13
('l_acc_13_01', 'module_accent_13', 'Full Practice', 'Conversation simulation', 1, 'interactive', 'A 5-minute simulated conversation covering all topics.', 'hard', 30, '["Integrate all skills"]'),
('l_acc_13_02', 'module_accent_13', 'Pronunciation Test', 'Assessment', 2, 'quiz', 'Testing distinct sounds and stress patterns.', 'hard', 30, '["Assess progress"]'),
('l_acc_13_03', 'module_accent_13', 'Before & After', 'Comparison', 3, 'practice', 'Re-record your baseline text and compare.', 'medium', 20, '["Measure improvement"]'),
('l_acc_13_04', 'module_accent_13', 'Future Plan', 'Maintenance', 4, 'lecture', 'How to keep improving after the course.', 'easy', 15, '["Plan future learning"]');

-- English for Beginners
REPLACE INTO lessons (`id`, `module_id`, `title`, `description`, `order_index`, `lesson_type`, `content_text`, `difficulty_level`, `estimated_minutes`, `learning_objectives`) VALUES
('l_efb_01_01', 'module_efb_01', 'What is English?', 'Overview of the English language', 1, 'lecture', 'English is a global language spoken by over 1.5 billion people. It opens doors to travel, business, and entertainment.', 'easy', 10, '["Understand importance of English"]'),
('l_efb_01_02', 'module_efb_01', 'English Alphabet (A–Z)', 'Learn the 26 letters', 2, 'lecture', 'The English alphabet has 26 letters, from A to Z. A, B, C, D, E...', 'easy', 15, '["Recognize all letters"]'),
('l_efb_01_03', 'module_efb_01', 'Vowels and Consonants', 'A, E, I, O, U and others', 3, 'lecture', 'There are 5 vowels (A, E, I, O, U) and 21 consonants in English.', 'easy', 15, '["Distinguish vowels"]'),
('l_efb_01_04', 'module_efb_01', 'Basic Pronunciation', 'Saying words correctly', 4, 'practice', 'Practice simple sounds: Cat, Bat, Sat. Dog, Log, Fog.', 'easy', 20, '["Pronounce basic sounds"]'),
('l_efb_02_01', 'module_efb_02', 'Common English Words', 'Essential vocabulary', 1, 'lecture', 'Go, Come, Eat, Sleep, Drink, Walk, Run.', 'easy', 15, '["Learn common verbs"]'),
('l_efb_02_02', 'module_efb_02', 'Simple Sentences', 'Building blocks', 2, 'lecture', 'I eat apple. You drink water. She walks home.', 'easy', 15, '["Construct simple sentences"]'),
('l_efb_02_03', 'module_efb_02', 'Yes / No Questions', 'Start asking questions', 3, 'lecture', 'Do you like coffee? Yes, I do. / No, I do not.', 'easy', 15, '["Ask yes/no questions"]'),
('l_efb_02_04', 'module_efb_02', 'Daily Use Words', 'Words for every day', 4, 'lecture', 'Table, Chair, House, Car, Phone, Computer.', 'easy', 15, '["Learn daily objects"]'),
('l_efb_03_01', 'module_efb_03', 'Greetings', 'Hello, Hi, Good Morning', 1, 'interactive', 'Hello! Hi! Good Morning! Good Night!', 'easy', 15, '["Greet people"]'),
('l_efb_03_02', 'module_efb_03', 'Introducing Yourself', 'My name is...', 2, 'interactive', 'Hello, my name is John. I am from Sri Lanka.', 'easy', 20, '["Introduce yourself"]'),
('l_efb_03_03', 'module_efb_03', 'Asking Names', 'What is your name?', 3, 'interactive', 'What is your name? Nice to meet you.', 'easy', 15, '["Ask for names"]'),
('l_efb_03_04', 'module_efb_03', 'Polite Words', 'Please, Sorry, Thank You', 4, 'lecture', 'Always say Please and Thank You. Say Sorry when you make a mistake.', 'easy', 10, '["Use polite expressions"]'),
('l_efb_04_01', 'module_efb_04', 'Numbers (1–100)', 'Counting in English', 1, 'lecture', 'One, Two, Three... Ten. Eleven, Twelve... Twenty.', 'easy', 20, '["Count to 100"]'),
('l_efb_04_02', 'module_efb_04', 'Days of the Week', 'Monday to Sunday', 2, 'lecture', 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.', 'easy', 10, '["Name days of week"]'),
('l_efb_04_03', 'module_efb_04', 'Months of the Year', 'January to December', 3, 'lecture', 'January, February, March...', 'easy', 10, '["Name months"]'),
('l_efb_04_04', 'module_efb_04', 'Telling the Time', 'What time is it?', 4, 'lecture', 'It is 5 o\'clock. It is half past three.', 'easy', 15, '["Tell basic time"]'),
('l_efb_05_01', 'module_efb_05', 'Nouns', 'People, Places, Things', 1, 'lecture', 'Noun is a name of a person, place or thing.', 'medium', 15, '["Identify nouns"]'),
('l_efb_05_02', 'module_efb_05', 'Pronouns', 'I, You, He, She', 2, 'lecture', 'I am happy. She is tall. They are playing.', 'medium', 15, '["Use pronouns"]'),
('l_efb_05_03', 'module_efb_05', 'Verbs', 'Basic Action Words', 3, 'lecture', 'Run, Jump, Sing, Dance.', 'medium', 15, '["Identify verbs"]'),
('l_efb_05_04', 'module_efb_05', 'Articles', 'A, An, The', 4, 'lecture', 'A cat. An apple. The sun.', 'medium', 15, '["Use articles correctly"]'),
('l_efb_06_01', 'module_efb_06', 'My Name & Age', 'Personal details', 1, 'interactive', 'My name is Sarah. I am 25 years old.', 'easy', 15, '["State age and name"]'),
('l_efb_06_02', 'module_efb_06', 'My Family', 'Father, Mother, Sister', 2, 'interactive', 'I have a brother. My mother is a teacher.', 'easy', 15, '["Describe family"]'),
('l_efb_06_03', 'module_efb_06', 'My Hobbies', 'What I like to do', 3, 'interactive', 'I like reading. I love playing cricket.', 'easy', 15, '["Talk about hobbies"]'),
('l_efb_06_04', 'module_efb_06', 'My Daily Routine', 'Morning to Night', 4, 'interactive', 'I wake up at 6 AM. I go to work.', 'medium', 20, '["Describe routine"]'),
('l_efb_07_01', 'module_efb_07', 'Simple Conversations', 'Chatting with friends', 1, 'interactive', 'Hi, how are you? I am fine.', 'medium', 20, '["Maintain basic conversation"]'),
('l_efb_07_02', 'module_efb_07', 'Asking & Answering', 'Question practice', 2, 'interactive', 'Where do you live? I live in Colombo.', 'medium', 20, '["Exchange information"]'),
('l_efb_07_03', 'module_efb_07', 'Role Play', 'Shop, School, Home', 3, 'interactive', 'Roleplay scenarios in common places.', 'medium', 25, '["Roleplay simple scenarios"]'),
('l_efb_07_04', 'module_efb_07', 'Pronunciation Practice', 'Sound clear', 4, 'practice', 'Repeat after me: The rain in Spain.', 'medium', 20, '["Improve pronunciation"]'),
('l_efb_08_01', 'module_efb_08', 'Listening to Simple English', 'Audio exercises', 1, 'interactive', 'Listen to the audio and answer.', 'easy', 15, '["Understand spoken English"]'),
('l_efb_08_02', 'module_efb_08', 'Reading Short Sentences', 'Reading practice', 2, 'lecture', 'Read the sentences aloud.', 'easy', 15, '["Read simple text"]'),
('l_efb_08_03', 'module_efb_08', 'Understanding Simple Stories', 'Story time', 3, 'lecture', 'Mary had a little lamb.', 'easy', 20, '["Comprehend stories"]'),
('l_efb_08_04', 'module_efb_08', 'Picture-Based Learning', 'Visual vocabulary', 4, 'quiz', 'What do you see in the picture?', 'easy', 15, '["Connect words to images"]'),
('l_efb_09_01', 'module_efb_09', 'English at Home', 'Household words', 1, 'interactive', 'Kitchen, Bedroom, Cooking, Cleaning.', 'medium', 20, '["Use home vocabulary"]'),
('l_efb_09_02', 'module_efb_09', 'English at School', 'Classroom language', 2, 'interactive', 'Teacher, Student, Book, Pen.', 'medium', 20, '["Use school vocabulary"]'),
('l_efb_09_03', 'module_efb_09', 'English at Work (Basic)', 'Office words', 3, 'interactive', 'Meeting, Email, Boss, Colleague.', 'medium', 20, '["Use work vocabulary"]'),
('l_efb_09_04', 'module_efb_09', 'English in Public Places', 'Park, Bus, Shop', 4, 'interactive', 'Ticket, Seat, Price, Open, Close.', 'medium', 20, '["Navigate public spaces"]'),
('l_efb_10_01', 'module_efb_10', 'Revision Lessons', ' Recap', 1, 'lecture', 'Let\'s review what we learned.', 'medium', 25, '["Review key concepts"]'),
('l_efb_10_02', 'module_efb_10', 'Practice Quizzes', 'Test yourself', 2, 'quiz', 'Quiz on Modules 1-9.', 'medium', 20, '["Self-assessment"]'),
('l_efb_10_03', 'module_efb_10', 'Speaking Tests', 'Final speaking check', 3, 'interactive', 'Oral proficiency test.', 'hard', 25, '["Test speaking skills"]'),
('l_efb_10_04', 'module_efb_10', 'Final Practice', 'Complete course review', 4, 'quiz', 'Final exam for the course.', 'hard', 30, '["Complete certification"]');

-- Complete English Grammar Mastery
REPLACE INTO lessons (`id`, `module_id`, `title`, `description`, `order_index`, `lesson_type`, `content_text`, `difficulty_level`, `estimated_minutes`, `learning_objectives`) VALUES
('l_cegm_01_01', 'module_cegm_01', 'Parts of Speech – Overview', 'The building blocks of English', 1, 'lecture', 'The 8 parts of speech: Noun, Verb, Adjective, Adverb, Pronoun, Preposition, Conjunction, Interjection.', 'easy', 20, '["Identify 8 parts of speech"]'),
('l_cegm_01_02', 'module_cegm_01', 'Nouns (Types & Usage)', 'Common, Proper, Abstract, Collective', 2, 'lecture', 'Nouns name people, places, things, or ideas. Proper nouns are capitalized.', 'easy', 20, '["Classify nouns"]'),
('l_cegm_01_03', 'module_cegm_01', 'Pronouns', 'Subject, Object, Possessive', 3, 'lecture', 'I, me, mine. He, him, his. They replace nouns to avoid repetition.', 'easy', 20, '["Use pronouns correctly"]'),
('l_cegm_01_04', 'module_cegm_01', 'Articles & Determiners', 'A, An, The', 4, 'lecture', '"A" and "An" are indefinite. "The" is definite. Use "an" before vowel sounds.', 'medium', 20, '["Master article usage"]'),
('l_cegm_02_01', 'module_cegm_02', 'Verbs Overview', 'Main vs Helping Verbs', 1, 'lecture', 'Main verbs show action. Auxiliary (helping) verbs help form tenses (is, are, have).', 'medium', 20, '["Distinguish verb types"]'),
('l_cegm_02_02', 'module_cegm_02', 'Present Tenses', 'Simple, Continuous, Perfect', 2, 'lecture', 'Simple: I eat. Continuous: I am eating. Perfect: I have eaten.', 'medium', 25, '["Form present tenses"]'),
('l_cegm_02_03', 'module_cegm_02', 'Past Tenses', 'Simple, Continuous, Perfect', 3, 'lecture', 'Simple: I ate. Continuous: I was eating. Perfect: I had eaten.', 'medium', 25, '["Form past tenses"]'),
('l_cegm_02_04', 'module_cegm_02', 'Future Forms', 'Will, Going To', 4, 'lecture', 'Will: Predictions/Snap decisions. Going to: Plans. Present Continuous: Arrangements.', 'medium', 20, '["Express future"]'),
('l_cegm_02_05', 'module_cegm_02', 'Irregular Verbs', 'Common irregular forms', 5, 'practice', 'Go-Went-Gone. See-Saw-Seen. Be-Was-Been.', 'hard', 25, '["Memorize irregular verbs"]'),
('l_cegm_03_01', 'module_cegm_03', 'Singular & Plural Rules', 'The basic rule', 1, 'lecture', 'He runs (singular). They run (plural). The verb must agree with the subject.', 'medium', 20, '["Apply S-V agreement"]'),
('l_cegm_03_02', 'module_cegm_03', 'Common Agreement Errors', 'Tricky cases', 2, 'quiz', 'Everyone IS (not are). The list of items IS long.', 'medium', 20, '["Spot common errors"]'),
('l_cegm_03_03', 'module_cegm_03', 'Collective Nouns', 'Group words', 3, 'lecture', 'The team IS winning (acting as one). The team ARE arguing (individuals).', 'hard', 20, '["Handle collective nouns"]'),
('l_cegm_03_04', 'module_cegm_03', 'Indefinite Pronouns', 'Someone, Anybody, None', 4, 'lecture', 'Someone IS knocking. Both ARE happy.', 'hard', 20, '["Use indefinite pronouns"]'),
('l_cegm_04_01', 'module_cegm_04', 'Types of Sentences', 'Declarative, Interrogative, etc.', 1, 'lecture', 'Statements, Questions, Commands, Exclamations.', 'easy', 15, '["Identify sentence types"]'),
('l_cegm_04_02', 'module_cegm_04', 'Phrase vs Clause', 'Understanding the difference', 2, 'lecture', 'A clause has a subject and verb. A phrase does not.', 'medium', 20, '["Distinguish phrases/clauses"]'),
('l_cegm_04_03', 'module_cegm_04', 'Sentence Complexity', 'Simple, Compound, Complex', 3, 'lecture', 'Simple: I ran. Compound: I ran and he walked. Complex: I ran because I was late.', 'medium', 25, '["Build complex sentences"]'),
('l_cegm_04_04', 'module_cegm_04', 'Word Order', 'SVO Rules', 4, 'lecture', 'Subject + Verb + Object. Adjectives before nouns.', 'easy', 15, '["Maintain correct word order"]'),
('l_cegm_05_01', 'module_cegm_05', 'Yes/No Questions', 'Do, Does, Did', 1, 'lecture', 'Do you like tea? Did you go?', 'easy', 15, '["Form yes/no questions"]'),
('l_cegm_05_02', 'module_cegm_05', 'WH-Questions', 'Who, What, Where, When', 2, 'lecture', 'Where do you live? Why are you sad?', 'easy', 15, '["Form open questions"]'),
('l_cegm_05_03', 'module_cegm_05', 'Question Tags', 'Is it? Aren\'t you?', 3, 'lecture', 'You are happy, aren\'t you? She didn\'t go, did she?', 'medium', 20, '["Use question tags"]'),
('l_cegm_05_04', 'module_cegm_05', 'Negative Sentences', 'Not, Never', 4, 'lecture', 'I do NOT like it. He NEVER goes there.', 'easy', 15, '["Form negatives"]'),
('l_cegm_06_01', 'module_cegm_06', 'Adjectives', 'Order and Comparison', 1, 'lecture', 'Order: Opinion, Size, Age, Shape, Color, Origin, Material.', 'medium', 20, '["Order adjectives"]'),
('l_cegm_06_02', 'module_cegm_06', 'Adverbs', 'Manner, Time, Place', 2, 'lecture', 'She sings BEAUTIFULLY (manner). He came YESTERDAY (time).', 'medium', 20, '["Use adverbs"]'),
('l_cegm_06_03', 'module_cegm_06', 'Comp. & Superlative', 'Better, Best', 3, 'lecture', 'Big, Bigger, Biggest. Good, Better, Best.', 'easy', 20, '["Compare things"]'),
('l_cegm_06_04', 'module_cegm_06', 'Common Mistakes', 'Good vs Well', 4, 'quiz', 'I am GOOD. I play WELL.', 'medium', 15, '["Avoid modifer errors"]'),
('l_cegm_07_01', 'module_cegm_07', 'Prepositions', 'Time, Place, Movement', 1, 'lecture', 'IN 2024, ON Monday, AT 5pm. IN London, ON the table, AT home.', 'medium', 25, '["Master prepositions"]'),
('l_cegm_07_02', 'module_cegm_07', 'Prepositional Phrases', 'Fixed expressions', 2, 'lecture', 'Interested IN, Good AT, Afraid OF.', 'hard', 25, '["Learn fixed phrases"]'),
('l_cegm_07_03', 'module_cegm_07', 'Coord. Conjunctions', 'FANBOYS', 3, 'lecture', 'For, And, Nor, But, Or, Yet, So.', 'medium', 20, '["Connect ideas"]'),
('l_cegm_07_04', 'module_cegm_07', 'Subord. Conjunctions', 'Because, Although, If', 4, 'lecture', 'Although it rained, we went out.', 'medium', 20, '["Create complex clauses"]'),
('l_cegm_08_01', 'module_cegm_08', 'Modal Verbs', 'Can, Could, Should', 1, 'lecture', 'Can (ability), Should (advice), Must (necessity).', 'medium', 20, '["Use modals"]'),
('l_cegm_08_02', 'module_cegm_08', 'Uses of Modals', 'Permission, Probability', 2, 'lecture', 'May I? (Permission). It might rain (Probability).', 'medium', 20, '["Express nuances"]'),
('l_cegm_08_03', 'module_cegm_08', 'Zero & 1st Conditional', 'Real situations', 3, 'lecture', 'Zero: If you heat ice, it melts. 1st: If it rains, I will stay home.', 'medium', 25, '["Use real conditionals"]'),
('l_cegm_08_04', 'module_cegm_08', '2nd & 3rd Conditional', 'Unreal situations', 4, 'lecture', '2nd: If I won the lotto, I would travel. 3rd: If I had studied, I would have passed.', 'hard', 25, '["Use unreal conditionals"]'),
('l_cegm_09_01', 'module_cegm_09', 'Active vs Passive', 'Focus on action', 1, 'lecture', 'Active: John ate the apple. Passive: The apple was eaten by John.', 'medium', 25, '["Form passive voice"]'),
('l_cegm_09_02', 'module_cegm_09', 'Using Passive', 'When and why', 2, 'lecture', 'Use passive when the actor is unknown or unimportant.', 'medium', 20, '["Use passive appropriately"]'),
('l_cegm_09_03', 'module_cegm_09', 'Direct Speech', 'Quoting exact words', 3, 'lecture', 'He said, "I am busy."', 'easy', 15, '["Punctuate direct speech"]'),
('l_cegm_09_04', 'module_cegm_09', 'Reported Speech', 'Backshifting tenses', 4, 'lecture', 'He said (that) he WAS busy.', 'hard', 25, '["Convert to reported speech"]'),
('l_cegm_10_01', 'module_cegm_10', 'Gerunds & Infinitives', 'Start forms', 1, 'lecture', 'I enjoy SWIMMING (gerund). I want TO SWIM (infinitive).', 'hard', 25, '["Choose gerund or infinitive"]'),
('l_cegm_10_02', 'module_cegm_10', 'Relative Clauses', 'Who, Which, That', 2, 'lecture', 'The man WHO called. The book WHICH I read.', 'hard', 25, '["Link info with clauses"]'),
('l_cegm_10_03', 'module_cegm_10', 'Count/Uncount Nouns', 'Usage rules', 3, 'lecture', 'Water (uncountable). Cups (countable).', 'medium', 20, '["Classify nouns"]'),
('l_cegm_10_04', 'module_cegm_10', 'Quantifiers', 'Much, Many, Few', 4, 'lecture', 'Much water. Many cups. A few friends. A little time.', 'medium', 20, '["Express quantity"]'),
('l_cegm_11_01', 'module_cegm_11', 'Confused Words', 'Their/There/They\'re', 1, 'quiz', 'Its vs It\'s. Effect vs Affect.', 'medium', 20, '["Distinguish similar words"]'),
('l_cegm_11_02', 'module_cegm_11', 'Tense Errors', 'Time confusions', 2, 'quiz', 'I have seen him yesterday (Wrong) -> I saw him yesterday.', 'medium', 20, '["Correct tense usage"]'),
('l_cegm_11_03', 'module_cegm_11', 'Preposition Errors', 'Usage traps', 3, 'quiz', 'Married WITH (Wrong) -> Married TO.', 'medium', 20, '["Fix preposition errors"]'),
('l_cegm_11_04', 'module_cegm_11', 'Spoken vs Written', 'Formal vs Informal', 4, 'lecture', 'Gonna/Wanna are for speaking only.', 'easy', 15, '["Adjust register"]'),
('l_cegm_12_01', 'module_cegm_12', 'Grammar for Speaking', 'Fluency', 1, 'interactive', 'Using contractions and natural flow.', 'medium', 25, '["Speak naturally"]'),
('l_cegm_12_02', 'module_cegm_12', 'Grammar for Writing', 'Accuracy', 2, 'practice', 'Proofreading for errors.', 'hard', 30, '["Write accurately"]'),
('l_cegm_12_03', 'module_cegm_12', 'Grammar for Exams', 'IELTS/TOEFL Tips', 3, 'lecture', 'High-scoring grammatical structures.', 'hard', 25, '["Ace grammar tests"]'),
('l_cegm_12_04', 'module_cegm_12', 'Professional Grammar', 'Business context', 4, 'lecture', 'Polite requests and formal tone.', 'medium', 20, '["Maintain professional tone"]'),
('l_cegm_13_01', 'module_cegm_13', 'Grammar Exercises', 'Mixed bag', 1, 'quiz', 'Comprehensive grammar drill.', 'medium', 30, '["Test overall knowledge"]'),
('l_cegm_13_02', 'module_cegm_13', 'Error Correction', 'Find the mistake', 2, 'practice', 'Identify and fix errors in text.', 'hard', 30, '["Edit text"]'),
('l_cegm_13_03', 'module_cegm_13', 'Quizzes & Tests', 'Sectional tests', 3, 'quiz', 'Final check of all sections.', 'hard', 40, '["Prepare for assessment"]'),
('l_cegm_13_04', 'module_cegm_13', 'Final Assessment', 'Certification Exam', 4, 'quiz', 'The final exam for the course.', 'hard', 60, '["Achieve certification"]');

-- IELTS Preparation (DETAILED)
REPLACE INTO lessons (`id`, `module_id`, `title`, `description`, `order_index`, `lesson_type`, `content_text`, `difficulty_level`, `estimated_minutes`, `learning_objectives`) VALUES
('l_ielts_01_01', 'module_ielts_01', 'What is IELTS?', 'Test format and types', 1, 'lecture', 'Academic vs General. 4 papers: Listening, Reading, Writing, Speaking.', 'easy', 15, '["Understand IELTS"]'),
('l_ielts_01_02', 'module_ielts_01', 'Band Scores Explained', 'How scoring works', 2, 'lecture', '9-band scale. Marking criteria for Writing and Speaking.', 'easy', 15, '["Know scoring criteria"]'),
('l_ielts_01_03', 'module_ielts_01', 'Test Format & Timing', 'Time management', 3, 'lecture', 'Listening (30m), Reading (60m), Writing (60m), Speaking (11-14m).', 'easy', 15, '["Manage time"]'),
('l_ielts_01_04', 'module_ielts_01', 'Common Mistakes', 'What to avoid', 4, 'lecture', 'Spelling errors, word count, off-topic answers.', 'medium', 20, '["Avoid common pitfalls"]'),
('l_ielts_02_01', 'module_ielts_02', 'Listening Format', '4 Sections', 1, 'lecture', 'Section 1: Social dialogue. Section 2: Social monologue. 3: Academic dialogue. 4: Academic lecture.', 'medium', 20, '["Navigate listening sections"]'),
('l_ielts_02_02', 'module_ielts_02', 'Question Types', 'MCQ, Map, Form filling', 2, 'practice', 'Practice specific question types. Watch out for distractors.', 'hard', 25, '["Handle various question types"]'),
('l_ielts_02_03', 'module_ielts_02', 'Predicting Answers', 'Anticipation skills', 3, 'lecture', 'Use the 30 seconds to read ahead and predict word types.', 'hard', 20, '["Predict answers"]'),
('l_ielts_02_04', 'module_ielts_02', 'Spelling & Accuracy', 'Zero tolerance', 4, 'quiz', 'Spelling dictation practice. Singular vs Plural.', 'medium', 15, '["Improve accuracy"]'),
('l_ielts_03_01', 'module_ielts_03', 'Reading Strategies', 'Skimming & Scanning', 1, 'lecture', 'Skim for gist, Scan by keywords. Don\'t read every word.', 'medium', 20, '["Skim and scan"]'),
('l_ielts_03_02', 'module_ielts_03', 'Question Types', 'True/False/Not Given', 2, 'practice', 'Distinguishing False from Not Given.', 'hard', 25, '["Master T/F/NG"]'),
('l_ielts_03_03', 'module_ielts_03', 'Matching Headings', 'Paragraph structure', 3, 'practice', 'Identify main ideas of paragraphs.', 'hard', 25, '["Match headings"]'),
('l_ielts_03_04', 'module_ielts_03', 'Time Management', '20 mins per passage', 4, 'lecture', 'Don\'t get stuck. Move on if unsure.', 'medium', 15, '["Manage reading time"]'),
('l_ielts_04_01', 'module_ielts_04', 'Task 1 Academic', 'Describing Data', 1, 'lecture', 'Line graphs, Bar charts, Pie charts. Overview is crucial.', 'medium', 25, '["Analyze data"]'),
('l_ielts_04_02', 'module_ielts_04', 'Task 1 Structure', 'Intro, Overview, Details', 2, 'lecture', 'Paraphrase question, write clear overview, group details logically.', 'hard', 25, '["Structure Task 1"]'),
('l_ielts_04_03', 'module_ielts_04', 'Task 1 General', 'Letter Writing', 3, 'lecture', 'Formal vs Informal tone. Purpose of the letter.', 'medium', 20, '["Write letters"]'),
('l_ielts_04_04', 'module_ielts_04', 'Process & Maps', 'Diagrams', 4, 'practice', 'Describing stages of a process or changes in a map.', 'hard', 25, '["Describe processes"]'),
('l_ielts_05_01', 'module_ielts_05', 'Essay Structure', '4 Paragraphs', 1, 'lecture', 'Intro, Body 1, Body 2, Conclusion. 250 words minimum.', 'medium', 25, '["Structure essays"]'),
('l_ielts_05_02', 'module_ielts_05', 'Opinion Essays', 'Agree/Disagree', 2, 'lecture', 'State your opinion clearly in the intro and conclusion.', 'hard', 30, '["Write opinion essays"]'),
('l_ielts_05_03', 'module_ielts_05', 'Discussion Essays', 'Discuss both views', 3, 'lecture', 'Analyze both sides before giving your opinion.', 'hard', 30, '["Write discussion essays"]'),
('l_ielts_05_04', 'module_ielts_05', 'Idea Generation', 'Brainstorming', 4, 'interactive', 'Techniques to generate ideas quickly.', 'medium', 20, '["Brainstorm effectively"]'),
('l_ielts_06_01', 'module_ielts_06', 'Introduction', 'First impressions', 1, 'interactive', 'ID check, Name, Hometown. Keep it natural.', 'easy', 15, '["Start confidently"]'),
('l_ielts_06_02', 'module_ielts_06', 'Common Topics', 'Work, Study, Home', 2, 'interactive', 'Prepare vocabulary for common themes.', 'medium', 20, '["Discuss daily topics"]'),
('l_ielts_06_03', 'module_ielts_06', 'Fluency Tips', 'Extend answers', 3, 'lecture', 'Don\'t say just "Yes". Add "because..."', 'medium', 15, '["Speak fluently"]'),
('l_ielts_06_04', 'module_ielts_06', 'Practice Part 1', 'Simulated interview', 4, 'interactive', 'Answer a set of Part 1 questions.', 'medium', 20, '["Practice Part 1"]'),
('l_ielts_07_01', 'module_ielts_07', 'Cue Card Strategy', '1 minute prep', 1, 'lecture', 'How to use the 1 minute effectively. Note-taking.', 'medium', 20, '["Plan Part 2"]'),
('l_ielts_07_02', 'module_ielts_07', 'Structure', '2 minutes speaking', 2, 'lecture', 'Intro, Details, Story/Example, Conclusion.', 'hard', 25, '["Speak for 2 mins"]'),
('l_ielts_07_03', 'module_ielts_07', 'Using Examples', 'Personal stories', 3, 'interactive', 'Tell a story to keep talking.', 'medium', 20, '["Use narratives"]'),
('l_ielts_07_04', 'module_ielts_07', 'Practice Part 2', 'Describe a person/place', 4, 'interactive', 'Record your 2-minute talk.', 'hard', 25, '["Practice Part 2"]'),
('l_ielts_08_01', 'module_ielts_08', 'Part 3 Overview', 'Abstract discussion', 1, 'lecture', 'Linked to Part 2 topic but general. More formal.', 'hard', 20, '["Understand Part 3"]'),
('l_ielts_08_02', 'module_ielts_08', 'Giving Opinions', 'Complex language', 2, 'interactive', '"Create detailed arguments. Use "Specifically", "Generally".', 'hard', 25, '["Express complex opinions"]'),
('l_ielts_08_03', 'module_ielts_08', 'Comparing & Analyzing', 'Past vs Present', 3, 'interactive', 'Compare trends and speculate about future.', 'hard', 25, '["Analyze and compare"]'),
('l_ielts_08_04', 'module_ielts_08', 'Advanced Techniques', 'Stalling tactics', 4, 'lecture', 'What to say when you need time to think.', 'medium', 15, '["Manage difficulty"]'),
('l_ielts_09_01', 'module_ielts_09', 'Topic Vocabulary', 'Environment, Tech, Ed', 1, 'lecture', 'Essential words for common essay topics.', 'medium', 25, '["Build topic vocab"]'),
('l_ielts_09_02', 'module_ielts_09', 'Academic Words', 'AWL List', 2, 'lecture', 'Analyze, Evaluate, Significant, Factor.', 'hard', 25, '["Use academic words"]'),
('l_ielts_09_03', 'module_ielts_09', 'Collocations', 'Word partners', 3, 'quiz', 'Make a decision (not do). Solve a problem.', 'medium', 20, '["Use collocations"]'),
('l_ielts_09_04', 'module_ielts_09', 'Synonyms', 'Avoid repetition', 4, 'quiz', 'Important -> Crucial, Vital, Essential.', 'medium', 20, '["Paraphrase effectively"]'),
('l_ielts_10_01', 'module_ielts_10', 'Complex Sentences', 'Subordinate clauses', 1, 'lecture', 'Using Although, While, Whereas to show contrast.', 'hard', 25, '["Use complex sentences"]'),
('l_ielts_10_02', 'module_ielts_10', 'Tense Accuracy', 'Perfect tenses', 2, 'quiz', 'Present Perfect for recent impacts.', 'medium', 20, '["Master tenses"]'),
('l_ielts_10_03', 'module_ielts_10', 'Passive Voice', 'Academic tone', 3, 'lecture', 'Process diagrams require passive voice.', 'hard', 20, '["Use passive voice"]'),
('l_ielts_10_04', 'module_ielts_10', 'Common Errors', 'Articles and Prepositions', 4, 'quiz', 'Fixing common grammatical mistakes.', 'medium', 20, '["Fix grammar errors"]'),
('l_ielts_11_01', 'module_ielts_11', 'Listening Mock', 'Full Test', 1, 'quiz', 'Complete 40-question listening test.', 'hard', 40, '["Simulate listening test"]'),
('l_ielts_11_02', 'module_ielts_11', 'Reading Mock', 'Full Test', 2, 'quiz', 'Complete 40-question reading test.', 'hard', 60, '["Simulate reading test"]'),
('l_ielts_11_03', 'module_ielts_11', 'Writing Evaluation', 'Self-check', 3, 'practice', 'Write Task 1 and 2 under timed conditions.', 'hard', 60, '["Simulate writing test"]'),
('l_ielts_11_04', 'module_ielts_11', 'Speaking Mock', 'Full Interview', 4, 'interactive', 'Simulate Parts 1, 2, and 3.', 'hard', 20, '["Simulate speaking test"]'),
('l_ielts_12_01', 'module_ielts_12', 'Band 5 to 6', 'Bridging the gap', 1, 'lecture', 'Address all parts of the task. Connect ideas.', 'medium', 25, '["Reach Band 6"]'),
('l_ielts_12_02', 'module_ielts_12', 'Band 6 to 7', 'Advanced skills', 2, 'lecture', 'Less common vocabulary. Error-free sentences.', 'hard', 25, '["Reach Band 7"]'),
('l_ielts_12_03', 'module_ielts_12', 'Band 7 to 8+', 'Native-like', 3, 'lecture', 'Nuance, style, and total fluency.', 'hard', 25, '["Reach Band 8"]'),
('l_ielts_12_04', 'module_ielts_12', 'Feedback Plan', 'Self-correction', 4, 'interactive', 'How to analyze your own mistakes.', 'medium', 20, '["Analyze progress"]'),
('l_ielts_13_01', 'module_ielts_13', '7-Day Plan', 'Countdown', 1, 'lecture', 'Schedule for the final week.', 'easy', 15, '["Plan final week"]'),
('l_ielts_13_02', 'module_ielts_13', 'Exam Day Tips', 'Logistics', 2, 'lecture', 'What to bring, when to arrive, stay calm.', 'easy', 15, '["Prepare for exam day"]'),
('l_ielts_13_03', 'module_ielts_13', 'Stress Management', 'Mental game', 3, 'lecture', 'Breathing and focus techniques.', 'easy', 15, '["Manage stress"]');

-- Advanced Writing
REPLACE INTO lessons (`id`, `module_id`, `title`, `description`, `order_index`, `lesson_type`, `content_text`, `difficulty_level`, `estimated_minutes`, `learning_objectives`) VALUES
-- Module 1
('l_writ_01_01', 'module_writing_01', 'Purpose, Audience & Tone', 'Understanding the core pillars of writing', 1, 'lecture', 'Every piece of writing has a purpose and an indented audience. Tone conveys your attitude.', 'easy', 20, '["Identify purpose", "Analyze audience"]'),
('l_writ_01_02', 'module_writing_01', 'Writing Styles', 'Academic, Professional, Creative', 2, 'lecture', 'Different context require different styles. Academic is formal, Creative is expressive.', 'medium', 20, '["Distinguish writing styles"]'),
('l_writ_01_03', 'module_writing_01', 'Critical Thinking in Writing', 'Analyzing before writing', 3, 'lecture', 'Good writing starts with clear thinking. Question assumptions and evaluate evidence.', 'hard', 25, '["Apply critical thinking"]'),
('l_writ_01_04', 'module_writing_01', 'Writing with Clarity', 'Precision in language', 4, 'practice', 'Avoid ambiguity. Be specific and direct in your word choices.', 'medium', 20, '["Write clearly"]'),

-- Module 2
('l_writ_02_01', 'module_writing_02', 'Advanced Sentence Structures', 'Complex and compound sentences', 1, 'lecture', 'Varying sentence structure keeps readers engaged. Use subordination effectively.', 'hard', 25, '["Build complex sentences"]'),
('l_writ_02_02', 'module_writing_02', 'Variety & Rhythm', 'Creating flow', 2, 'lecture', 'Sentence length impacts rhythm. Short sentences create punch; long ones create flow.', 'medium', 20, '["Control sentence rhythm"]'),
('l_writ_02_03', 'module_writing_02', 'Emphasis Techniques', 'Highlighting key ideas', 3, 'lecture', 'Use placement, repetition, and isolation to emphasize important points.', 'medium', 20, '["Use emphasis"]'),
('l_writ_02_04', 'module_writing_02', 'Eliminating Wordiness', 'Concise writing', 4, 'practice', 'Cut the clutter. Remove unnecessary words that do not add meaning.', 'medium', 20, '["Write concisely"]'),

-- Module 3
('l_writ_03_01', 'module_writing_03', 'Topic Sentences', 'Anchoring your paragraphs', 1, 'lecture', 'A strong topic sentence states the main idea of the paragraph clearly.', 'easy', 15, '["Write topic sentences"]'),
('l_writ_03_02', 'module_writing_03', 'Coherence & Flow', 'Smooth transitions', 2, 'lecture', 'Use transition words to link sentences and ideas smoothly.', 'medium', 20, '["Ensure coherence"]'),
('l_writ_03_03', 'module_writing_03', 'Logical Progression', 'Ordering ideas', 3, 'lecture', 'Organize details logically: chronological, spatial, or order of importance.', 'medium', 20, '["Organize ideas"]'),
('l_writ_03_04', 'module_writing_03', 'Openings & Closings', 'Strong starts and ends', 4, 'practice', 'Hook the reader immediately. Conclude with impact.', 'medium', 20, '["Craft strong ends"]'),

-- Module 4
('l_writ_04_01', 'module_writing_04', 'Argumentative Essays', 'Persuading readers', 1, 'lecture', 'Make a claim and support it with evidence and reasoning.', 'hard', 30, '["Write arguments"]'),
('l_writ_04_02', 'module_writing_04', 'Analytical Essays', 'Breaking it down', 2, 'lecture', 'Analyze a text or concept by examining its parts.', 'hard', 30, '["Write analysis"]'),
('l_writ_04_03', 'module_writing_04', 'Opinion & Feature Articles', 'Writing for media', 3, 'lecture', 'Engage readers with voice and perspective in articles.', 'medium', 25, '["Write features"]'),
('l_writ_04_04', 'module_writing_04', 'Thesis Statements', 'The core argument', 4, 'practice', 'Crafting a debatable and specific thesis statement.', 'hard', 25, '["Draft thesis statements"]'),

-- Module 5
('l_writ_05_01', 'module_writing_05', 'Research-Based Writing', 'Using sources', 1, 'lecture', 'Integrate credible sources to support your points.', 'hard', 30, '["Conduct research"]'),
('l_writ_05_02', 'module_writing_05', 'Paraphrasing & Summarizing', 'Using others\' ideas', 2, 'practice', 'Restate ideas in your own words without plagiarism.', 'medium', 25, '["Paraphrase correctly"]'),
('l_writ_05_03', 'module_writing_05', 'Citations (APA/MLA)', 'Giving credit', 3, 'lecture', 'Follow standard formatting for in-text citations and references.', 'medium', 25, '["Cite sources"]'),
('l_writ_05_04', 'module_writing_05', 'Avoiding Plagiarism', 'Academic integrity', 4, 'quiz', 'Understand what constitutes plagiarism and how to avoid it.', 'easy', 15, '["Avoid plagiarism"]'),

-- Module 6
('l_writ_06_01', 'module_writing_06', 'Reports & Proposals', 'Structuring business docs', 1, 'lecture', 'Standard sections: Executive summary, methodology, findings, recommendations.', 'medium', 25, '["Write reports"]'),
('l_writ_06_02', 'module_writing_06', 'Emails & Memos', 'Professional correspondence', 2, 'interactive', 'Clear, concise, and polite business communication.', 'easy', 15, '["Write professional emails"]'),
('l_writ_06_03', 'module_writing_06', 'Executive Summaries', 'High-level overviews', 3, 'practice', 'Summarizing complex documents for decision makers.', 'hard', 20, '["Write summaries"]'),
('l_writ_06_04', 'module_writing_06', 'Technical Writing', 'Explaining complexity', 4, 'lecture', 'Making technical information accessible to specific audiences.', 'hard', 25, '["Simplify technicalities"]'),

-- Module 7
('l_writ_07_01', 'module_writing_07', 'Narrative Techniques', 'Telling a story', 1, 'lecture', 'Plot, character, setting, and conflict.', 'medium', 25, '["Use narrative elements"]'),
('l_writ_07_02', 'module_writing_07', 'Descriptive Writing', 'Show, don\'t tell', 2, 'practice', 'Using sensory details to create vivid mental images.', 'medium', 25, '["Write descriptively"]'),
('l_writ_07_03', 'module_writing_07', 'Storytelling Structures', 'Arcs and beats', 3, 'lecture', 'The Hero\'s Journey and other classic structures.', 'medium', 25, '["Structure stories"]'),
('l_writ_07_04', 'module_writing_07', 'Voice Development', 'Finding your style', 4, 'interactive', 'Experimenting with different tones and voices.', 'medium', 20, '["Develop unique voice"]'),

-- Module 8
('l_writ_08_01', 'module_writing_08', 'Building Arguments', 'Logic and reasoning', 1, 'lecture', 'Constructing a solid line of reasoning.', 'hard', 25, '["Build arguments"]'),
('l_writ_08_02', 'module_writing_08', 'Evidence & Examples', 'Proving your point', 2, 'lecture', 'Selecting the most persuasive evidence.', 'medium', 20, '["Support claims"]'),
('l_writ_08_03', 'module_writing_08', 'Rhetorical Devices', 'Sizzle and pop', 3, 'lecture', 'Metaphors, analogies, and rhetorical questions.', 'medium', 20, '["Use rhetoric"]'),
('l_writ_08_04', 'module_writing_08', 'Writing for Influence', 'Call to action', 4, 'practice', 'Persuading the reader to think or act differently.', 'hard', 25, '["Persuade readers"]'),

-- Module 9
('l_writ_09_01', 'module_writing_09', 'Self-Editing', 'Reviewing your work', 1, 'lecture', 'Techniques to distance yourself and see errors.', 'medium', 20, '["Edit self"]'),
('l_writ_09_02', 'module_writing_09', 'Grammar Refinement', 'Polishing syntax', 2, 'quiz', 'Catching subtle grammar and punctuation errors.', 'medium', 20, '["Fix grammar"]'),
('l_writ_09_03', 'module_writing_09', 'Proofreading', 'Final check', 3, 'practice', 'Scanning for typos and formatting issues.', 'easy', 15, '["Proofread effectively"]'),
('l_writ_09_04', 'module_writing_09', 'Using Feedback', 'Constructive criticism', 4, 'lecture', 'How to interpret and apply feedback from others.', 'easy', 15, '["Apply feedback"]'),

-- Module 10
('l_writ_10_01', 'module_writing_10', 'Advanced Vocabulary', 'Precision words', 1, 'lecture', 'Using precise vocabulary instead of generic words.', 'medium', 20, '["Expand vocabulary"]'),
('l_writ_10_02', 'module_writing_10', 'Collocations & Idioms', 'Natural phrasing', 2, 'practice', 'Words that naturally go together.', 'medium', 20, '["Use collocations"]'),
('l_writ_10_03', 'module_writing_10', 'Formal vs Informal', 'Register control', 3, 'lecture', 'Knowing when to simple and when to be sophisticated.', 'easy', 15, '["Control code-switching"]'),
('l_writ_10_04', 'module_writing_10', 'Tone Consistency', 'Maintaining mood', 4, 'practice', 'Ensuring tone remains consistent throughout the piece.', 'medium', 20, '["Maintain tone"]'),

-- Module 11
('l_writ_11_01', 'module_writing_11', 'Blog & Web Writing', 'Scannable content', 1, 'lecture', 'Writing for the screen: headings, bullets, short paragraphs.', 'easy', 20, '["Write for web"]'),
('l_writ_11_02', 'module_writing_11', 'SEO Writing', 'Search visibility', 2, 'lecture', 'Keywords, meta tags, and value for readers.', 'medium', 25, '["Write for SEO"]'),
('l_writ_11_03', 'module_writing_11', 'Social Media', 'Engagement', 3, 'practice', 'Crafting captions and short-form content.', 'easy', 15, '["Write social copy"]'),
('l_writ_11_04', 'module_writing_11', 'UX Writing', 'Microcopy', 4, 'lecture', 'Guiding users through interfaces clearly.', 'hard', 20, '["Write microcopy"]'),

-- Module 12
('l_writ_12_01', 'module_writing_12', 'Timed Writing', 'Speed and quality', 1, 'lecture', 'Strategies for writing under pressure.', 'hard', 20, '["Write under time"]'),
('l_writ_12_02', 'module_writing_12', 'Academic Exams', 'IELTS/TOEFL', 2, 'practice', 'Specific formats for standardized tests.', 'hard', 25, '["Prepare for exams"]'),
('l_writ_12_03', 'module_writing_12', 'Structured Answers', 'Answering the prompt', 3, 'lecture', 'Directly addressing exam questions.', 'medium', 20, '["Structure exam answers"]'),
('l_writ_12_04', 'module_writing_12', 'High-Score Techniques', 'Bonus points', 4, 'lecture', 'What examiners look for in top-tier essays.', 'hard', 20, '["Score high"]'),

-- Module 13
('l_writ_13_01', 'module_writing_13', 'Project Planning', 'Research & Outline', 1, 'practice', 'Planning a long-form writing project.', 'medium', 30, '["Plan project"]'),
('l_writ_13_02', 'module_writing_13', 'Drafting', 'Writing the first version', 2, 'practice', 'Getting it all down on paper.', 'hard', 60, '["Draft project"]'),
('l_writ_13_03', 'module_writing_13', 'Editing', 'Refining the draft', 3, 'practice', 'Self-review and improvement.', 'hard', 45, '["Edit project"]'),
('l_writ_13_04', 'module_writing_13', 'Final Polish', 'Submission ready', 4, 'practice', 'Formatting and final checks.', 'medium', 30, '["Finalize project"]');
