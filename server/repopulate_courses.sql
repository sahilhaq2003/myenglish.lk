-- COMPLETE COURSE CONTENT POPULATION
-- Ensures every course has modules, and every module has lessons.

-- ==========================================
-- 1. ENSURE MODULES EXIST FOR ALL COURSES
-- ==========================================

-- IELTS Course Modules (Missing in previous seeds)
INSERT INTO modules (id, course_id, title, description, order_index, estimated_hours) VALUES
('module_ielts_listening', 'course_ielts_prep', 'IELTS Listening Mastery', 'Strategies for all 4 distinct sections of the listening test', 1, 8.0),
('module_ielts_reading', 'course_ielts_prep', 'IELTS Reading Strategies', 'Skimming, scanning and detailed reading techniques for academic texts', 2, 8.0),
('module_ielts_writing', 'course_ielts_prep', 'IELTS Writing Tasks 1 & 2', 'Mastering report writing and essay composition', 3, 12.0),
('module_ielts_speaking', 'course_ielts_prep', 'IELTS Speaking Confidence', 'Fluency, vocabulary and structure for the speaking interview', 4, 10.0)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Ensure other course modules exist (just in case)
INSERT INTO modules (id, course_id, title, description, order_index, estimated_hours) VALUES
('module_accent_sounds', 'course_american_accent', 'American English Sounds', 'Master the key sounds of American English', 1, 6.0),
('module_accent_rhythm', 'course_american_accent', 'Rhythm and Intonation', 'Learn natural American speech patterns', 2, 6.0),
('module_conv_basics', 'course_conversational_beginners', 'Conversation Foundations', 'Essential phrases for daily life', 1, 5.0),
('module_conv_social', 'course_conversational_beginners', 'Social Conversations', 'Making friends and small talk', 2, 5.0),
('module_writing_structure', 'course_advanced_writing', 'Essay Structure', 'Master academic and professional writing', 1, 8.0),
('module_writing_style', 'course_advanced_writing', 'Writing Style', 'Develop your unique voice', 2, 8.0)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- ==========================================
-- 2. POPULATE LESSONS FOR EACH MODULE
-- ==========================================

-- ------------------------------------------
-- IELTS LISTENING
-- ------------------------------------------
INSERT INTO lessons (id, module_id, title, description, order_index, lesson_type, content_text, difficulty_level, estimated_minutes) VALUES
('ielts_list_1', 'module_ielts_listening', 'Prediction Skills', 'Learn to predict answers before listening', 1, 'lecture', 
'IELTS Listening: Prediction Strategy

Key Concept:
Before the audio starts, you have 30-45 seconds. Use this time to PREDICT the answer types.

Steps:
1. Read the headings and questions.
2. Identify the word type needed (Noun? Number? Name? Verb?).
3. Look for clues (e.g., "$" means a price is coming).

Example:
"Meeting starts at: _______"
Prediction: A time (e.g., 3:00 PM)

"Cost of entry: $_______"
Prediction: A number (e.g., 15.50)

Practice this prediction skill to improve accuracy!', 'medium', 20),

('ielts_list_2', 'module_ielts_listening', 'Distractors and Signposting', 'How to avoid common traps', 2, 'lecture', 
'IELTS Listening: Handling Distractors

What are Distractors?
The speakers will often correct themselves.
Example:
"The train leaves at 5:00... oh wait, no, slight delay, it leaves at 5:15."
If you wrote 5:00, you are wrong. The answer is 5:15.

Signposting Language:
Listen for words that signal a change or new topic:
- "However..."
- "On the other hand..."
- "Now, let''s move on to..."

Always listen until the speaker finishes the point!', 'hard', 25)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- ------------------------------------------
-- IELTS READING
-- ------------------------------------------
INSERT INTO lessons (id, module_id, title, description, order_index, lesson_type, content_text, difficulty_level, estimated_minutes) VALUES
('ielts_read_1', 'module_ielts_reading', 'Skimming vs Scanning', 'Two essential reading speeds', 1, 'lecture', 
'IELTS Reading: Speed Strategies

1. SKIMMING (For Gist):
- Read the title, first paragraph, and topic sentences.
- Do NOT read every word.
- Goal: Understand the main idea of the passage.

2. SCANNING (For Details):
- Look for keywords (Names, Dates, Numbers, Capital Letters).
- Move your eyes quickly over the text without reading.
- Goal: Find a specific fact.

Use Skimming for headings matching.
Use Scanning for True/False/Not Given questions.', 'medium', 25),

('ielts_read_2', 'module_ielts_reading', 'True/False/Not Given', 'Mastering the hardest question type', 2, 'lecture', 
'True / False / Not Given logic:

TRUE: The informative text strictly agrees with the statement.
FALSE: The text contradicts the statement (says the opposite).
NOT GIVEN: The text does not say if it is true or false.

Example Text: "Bananas are grown in tropical climates."
Statement 1: "Bananas grow in hot places." -> TRUE
Statement 2: "Bananas grow in cold places." -> FALSE
Statement 3: "Bananas are the most popular fruit." -> NOT GIVEN (Text mentions growth, not popularity!)

Be careful with assumptions!', 'hard', 30)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- ------------------------------------------
-- IELTS SPEAKING
-- ------------------------------------------
INSERT INTO lessons (id, module_id, title, description, order_index, lesson_type, content_text, difficulty_level, estimated_minutes) VALUES
('ielts_speak_1', 'module_ielts_speaking', 'Part 1: Introduction Strategy', 'Giving full answers in Part 1', 1, 'lecture', 
'IELTS Speaking Part 1 Tips:

Do not give one-word answers. Always extend your answer with a reason or example.

Question: "Do you like your hometown?"
Bad: "Yes."
Good: "Yes, I really love it. It''s a coastal city with beautiful beaches, so the atmosphere is very relaxing."

Formula: Answer + Reason + Detail.
Practice extending your answers for:
- Work/Study
- Hobbies
- Family', 'medium', 20),

('ielts_speak_2', 'module_ielts_speaking', 'Part 2: The Long Turn', 'Speaking for 2 minutes continuously', 2, 'lecture', 
'Speaking Part 2 Strategy:

You have 1 minute to prepare and 2 minutes to speak.
Use the 1 minute to write KEYWORDS, not sentences.

Structure your talk:
1. Introduction ("I''d like to talk about...")
2. Past context ("This happened when...")
3. Description ("It looked like...")
4. Why it''s important ("The reason I chose this...")

Don''t worry if the examiner stops you. It means time is up!', 'hard', 25)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- ------------------------------------------
-- AMERICAN ACCENT: SOUNDS
-- ------------------------------------------
INSERT INTO lessons (id, module_id, title, description, order_index, lesson_type, content_text, difficulty_level, estimated_minutes) VALUES
('accent_t_1', 'module_accent_sounds', 'The American T Sounds', 'True T vs Flap T vs Stop T', 1, 'lecture', 
'The Multiple Sounds of T in American English:

1. True T: Start of words (Table, Top). Strong burst of air.
2. Flap T: Between vowels (Water, Better). Sounds like a quick /d/. "Ladder" and "Latter" sound almost same!
3. Stop T: End of words (Cat, Hot). Stop the air in your throat, don''t release the puff.

Practice:
- Water (Wah-der)
- Butter (Bud-er)
- City (Si-dee)
- Hot dog (Ha'' dog)', 'medium', 20),

('accent_th_1', 'module_accent_sounds', 'Mastering the TH Sound', 'Voiceless vs Voiced TH', 2, 'lecture', 
'The TH sound requires sticking your tongue between your teeth.

Unvoiced TH (Blow air only):
- Think, Thank, Three, Bath.
- Don''t say "Fink" or "Sink".

Voiced TH (Vibrate vocal cords):
- This, That, Those, Brother.
- Don''t say "Dis" or "Dat".

Drill: "Thirty-three thousand thoughts." / "This is my brother."', 'medium', 20)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- ------------------------------------------
-- AMERICAN ACCENT: RHYTHM
-- ------------------------------------------
INSERT INTO lessons (id, module_id, title, description, order_index, lesson_type, content_text, difficulty_level, estimated_minutes) VALUES
('accent_stress_1', 'module_accent_rhythm', 'Word Stress Rules', 'Which syllable needs power?', 1, 'lecture', 
'American Rhythm relies on STRESS.
Stressed syllables are LOUDER, LONGER, and HIGHER PITCH.

Rules:
- 2-Syllable Nouns: Stress usually 1st (PRE-sent = gift).
- 2-Syllable Verbs: Stress usually 2nd (pre-SENT = to give).

Schwa /ə/:
Unstressed vowels become "uh".
"Banana" -> ba-NA-na -> "buh-NA-nuh".
Focus on the stressed vowel!', 'medium', 15),

('accent_int_1', 'module_accent_rhythm', 'Intonation Patterns', 'Rising and Falling pitch', 2, 'questions', 
'Intonation communicates meaning.

Falling Intonation (Statements / WH-Questions):
- "My name is John." (Down at end)
- "Where are you going?" (Down at end)

Rising Intonation (Yes/No Questions):
- "Are you ready?" (Up at end)
- "Do you like it?" (Up at end)

Practice exaggerating the slide up or down!', 'medium', 15)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- ------------------------------------------
-- CONVERSATIONAL: BASICS
-- ------------------------------------------
INSERT INTO lessons (id, module_id, title, description, order_index, lesson_type, content_text, difficulty_level, estimated_minutes) VALUES
('conv_basic_1', 'module_conv_basics', 'Polite Requests', 'Can, Could, Would', 1, 'lecture', 
'Making requests politely:

Level 1 (Casual): "Open the window." (Too direct?)
Level 2: "Can you open the window?"
Level 3: "Could you open the window?" (Better)
Level 4: "Would you mind opening the window?" (Very polite)

Note: "Would you mind" is followed by VERB-ING!
"Would you mind helpING me?"', 'easy', 15),

('conv_basic_2', 'module_conv_basics', 'Apologizing and Forgiving', 'Saying sorry correctly', 2, 'lecture', 
'Apologizing:
- "I''m sorry." (Basic)
- "I apologize for..." (Formal)
- "My bad." (Slang/Casual)
- "I''m so sorry about that."

Accepting Apology:
- "It''s okay."
- "No worries."
- "Don''t worry about it."
- "Apology accepted." (Formal)', 'easy', 15)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- ------------------------------------------
-- CONVERSATIONAL: SOCIAL
-- ------------------------------------------
INSERT INTO lessons (id, module_id, title, description, order_index, lesson_type, content_text, difficulty_level, estimated_minutes) VALUES
('conv_soc_1', 'module_conv_social', 'Small Talk Topics', 'Weather, Weekend, Work', 1, 'lecture', 
'Small talk keeps conversation flowing.
Safe Topics:
1. Weather: "Lovely day, isn''t it?" / "Looks like rain."
2. Weekend: "Any plans for the weekend?"
3. Context: "This coffee is great." (Waiting in line)

Topics to Avoid (generally):
- Politics
- Religion
- Money/Salary
- Personal health issues

Keep it light and positive!', 'easy', 20),

('conv_soc_2', 'module_conv_social', 'Keeping a Chat Going', 'Follow-up questions', 2, 'lecture', 
'Secret to good conversation: Follow-up Questions.

A: "I went to Paris."
B: "Nice." (Conversation dies)

Better B: "Nice! When did you go?" / "Did you like it?" / "How was the food?"

Strategy: A-R-A
Answer: "I''m good."
Reason: "I just finished a big project."
Ask Back: "How about you?"', 'easy', 20)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- ------------------------------------------
-- ADVANCED WRITING: STRUCTURE
-- ------------------------------------------
INSERT INTO lessons (id, module_id, title, description, order_index, lesson_type, content_text, difficulty_level, estimated_minutes) VALUES
('adv_struct_1', 'module_writing_structure', 'Paragraph Unity', 'TEEL Structure', 1, 'lecture', 
'Academic paragraphs need structure. Use TEEL:

T - Topic Sentence: Main idea of the paragraph.
E - Explanation: Elaborate on the idea.
E - Evidence/Example: Data, quote, or specific instance.
L - Link: Connect back to the thesis or next paragraph.

Example:
(T) Remote work boosts productivity. (E) Employees deal with fewer distractions than in open offices. (E) A 2020 study showed a 13% increase in output. (L) Thus, companies should embrace flexible policies.', 'hard', 25),

('adv_struct_2', 'module_writing_structure', 'Transitions & Flow', 'Cohesive devices', 2, 'lecture', 
'Connect your ideas smoothly.

Addition: Furthermore, Moreover, In addition.
Contrast: However, On the other hand, Conversely.
Result: Therefore, Consequently, As a result.
Example: For instance, Specifically, Notably.

"The project was expensive. HOWEVER, it was necessary. THEREFORE, we approved the budget."', 'hard', 20)
ON DUPLICATE KEY UPDATE title=VALUES(title);
