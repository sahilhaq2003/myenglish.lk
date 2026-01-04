-- MyEnglish.lk - AI Learning Platform Database Schema
-- Complete database structure for AI-powered adaptive learning

-- =====================================================
-- 1. COURSES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    level ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
    thumbnail_url VARCHAR(500),
    price DECIMAL(10, 2) DEFAULT 0.00,
    duration_weeks INT DEFAULT 4,
    instructor_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_level (level),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 2. MODULES TABLE (Each course has multiple modules)
-- =====================================================
CREATE TABLE IF NOT EXISTS modules (
    id VARCHAR(50) PRIMARY KEY,
    course_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INT NOT NULL DEFAULT 0,
    estimated_hours DECIMAL(4, 2) DEFAULT 1.00,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_course (course_id),
    INDEX idx_order (order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 3. LESSONS TABLE (AI-powered lessons)
-- =====================================================
CREATE TABLE IF NOT EXISTS lessons (
    id VARCHAR(50) PRIMARY KEY,
    module_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INT NOT NULL DEFAULT 0,
    
    -- Lesson Content
    lesson_type ENUM('lecture', 'practice', 'quiz', 'interactive') DEFAULT 'lecture',
    content_text LONGTEXT,  -- AI-generated lecture content
    ai_prompt TEXT,  -- Prompt used to generate this lesson
    
    -- AI Configuration
    difficulty_level ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    adaptive_enabled BOOLEAN DEFAULT TRUE,
    voice_enabled BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    estimated_minutes INT DEFAULT 15,
    learning_objectives JSON,  -- Array of learning objectives
    prerequisites JSON,  -- Array of prerequisite lesson IDs
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
    INDEX idx_module (module_id),
    INDEX idx_order (order_index),
    INDEX idx_type (lesson_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 4. USER LESSON PROGRESS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_lesson_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    lesson_id VARCHAR(50) NOT NULL,
    
    -- Progress Status
    status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
    completion_percentage INT DEFAULT 0,
    
    -- Timestamps
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Learning Data
    time_spent_minutes INT DEFAULT 0,
    attempts_count INT DEFAULT 0,
    quiz_score DECIMAL(5, 2),  -- If lesson has quiz
    
    -- AI Adaptation Data
    current_difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    struggle_points JSON,  -- Array of topics user struggled with
    notes TEXT,  -- User's notes
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_user_lesson (user_email, lesson_id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    INDEX idx_user (user_email),
    INDEX idx_status (status),
    INDEX idx_completion (completed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 5. LESSON INTERACTIONS TABLE (AI Q&A History)
-- =====================================================
CREATE TABLE IF NOT EXISTS lesson_interactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lesson_id VARCHAR(50) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    
    -- Interaction Data
    interaction_type ENUM('question', 'clarification', 'example_request', 'feedback') DEFAULT 'question',
    user_input TEXT NOT NULL,
    ai_response LONGTEXT NOT NULL,
    
    -- Context
    difficulty_at_time ENUM('easy', 'medium', 'hard'),
    was_helpful BOOLEAN,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    INDEX idx_lesson (lesson_id),
    INDEX idx_user (user_email),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 6. MODULE PROGRESS (Aggregate view)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_module_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    module_id VARCHAR(50) NOT NULL,
    
    lessons_total INT DEFAULT 0,
    lessons_completed INT DEFAULT 0,
    completion_percentage DECIMAL(5, 2) DEFAULT 0.00,
    
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_user_module (user_email, module_id),
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
    INDEX idx_user (user_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 7. COURSE PROGRESS (Aggregate view)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_course_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    course_id VARCHAR(50) NOT NULL,
    
    modules_total INT DEFAULT 0,
    modules_completed INT DEFAULT 0,
    lessons_total INT DEFAULT 0,
    lessons_completed INT DEFAULT 0,
    completion_percentage DECIMAL(5, 2) DEFAULT 0.00,
    
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_user_course (user_email, course_id),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_user (user_email),
    INDEX idx_completion (completion_percentage)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- SEED DATA: Sample Courses and Modules
-- =====================================================

-- Insert Sample Courses
INSERT INTO courses (id, title, description, level, price, duration_weeks, instructor_name) VALUES
('course_beginner_english', 'English for Beginners', 'Start your English learning journey with AI-powered interactive lessons', 'Beginner', 0.00, 8, 'AI Tutor Alex'),
('course_business_english', 'Business English Pro', 'Master professional communication with AI-generated business scenarios', 'Intermediate', 29.99, 12, 'AI Tutor Daniel'),
('course_ielts_prep', 'IELTS Preparation', 'Prepare for IELTS exam with adaptive AI practice', 'Advanced', 49.99, 16, 'AI Tutor Emma')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Insert Sample Modules for Beginner Course
INSERT INTO modules (id, course_id, title, description, order_index, estimated_hours) VALUES
('module_basics_grammar', 'course_beginner_english', 'Grammar Foundations', 'Learn essential grammar rules through AI-guided lessons', 1, 10.0),
('module_basics_vocabulary', 'course_beginner_english', 'Essential Vocabulary', 'Build your vocabulary with AI-generated word lists and examples', 2, 8.0),
('module_basics_conversation', 'course_beginner_english', 'Daily Conversations', 'Practice real-life conversations with AI roleplay', 3, 12.0)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Insert Sample Modules for Business Course
INSERT INTO modules (id, course_id, title, description, order_index, estimated_hours) VALUES
('module_business_emails', 'course_business_english', 'Professional Email Writing', 'Master business email communication', 1, 6.0),
('module_business_meetings', 'course_business_english', 'Meeting & Presentations', 'Excel in business meetings and presentations', 2, 8.0),
('module_business_negotiations', 'course_business_english', 'Negotiations & Deals', 'Learn negotiation language and techniques', 3, 10.0)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Sample Lesson (to be expanded with AI generation)
INSERT INTO lessons (id, module_id, title, description, order_index, lesson_type, content_text, difficulty_level, estimated_minutes) VALUES
('lesson_grammar_basics_1', 'module_basics_grammar', 'Parts of Speech Introduction', 'Learn about nouns, verbs, adjectives with AI examples', 1, 'lecture', 'Welcome to Grammar Basics! Today we will learn about the fundamental building blocks of English grammar...', 'easy', 20)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;
