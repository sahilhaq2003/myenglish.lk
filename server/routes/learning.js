/**
 * MyEnglish.lk - AI Learning Platform API Routes
 * Backend endpoints for courses, modules, lessons, and progress tracking
 */

import express from 'express';
import mysql from 'mysql2/promise';

const router = express.Router();

// Database connection (reuse from main server)
const getDBConnection = () => {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'myenglish_db',
        port: parseInt(process.env.DB_PORT) || 3306
    });
};

// =====================================================
// COURSES API
// =====================================================

/**
 * GET /api/learning/courses
 * Get all active courses (or only enrolled courses for a user)
 */
router.get('/courses', async (req, res) => {
    try {
        const { user_email, enrolled_only } = req.query;
        const connection = await getDBConnection();

        let query = `
            SELECT c.*, 
                   COUNT(DISTINCT m.id) as modules_count,
                   COUNT(DISTINCT l.id) as lessons_count
            FROM courses c
            LEFT JOIN modules m ON c.id = m.course_id
            LEFT JOIN lessons l ON m.id = l.module_id
        `;

        if (enrolled_only === 'true' && user_email) {
            query += `
                INNER JOIN enrollments e ON c.id = e.course_id 
                WHERE e.email = ? AND c.is_active = TRUE
            `;
        } else {
            query += ' WHERE c.is_active = TRUE';
        }

        query += ' GROUP BY c.id ORDER BY c.created_at DESC';

        const [courses] = await connection.execute(
            query,
            enrolled_only === 'true' && user_email ? [user_email] : []
        );

        await connection.end();
        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Failed to fetch courses' });
    }
});

/**
 * GET /api/learning/courses/:id
 * Get detailed course information with modules
 */
router.get('/courses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { user_email } = req.query;
        const connection = await getDBConnection();

        // Get course details
        const [courses] = await connection.execute(
            'SELECT * FROM courses WHERE id = ?',
            [id]
        );

        if (courses.length === 0) {
            await connection.end();
            return res.status(404).json({ message: 'Course not found' });
        }

        const course = courses[0];

        // Get modules with lesson count
        const [modules] = await connection.execute(`
            SELECT m.*, 
                   COUNT(l.id) as lessons_count,
                   SUM(l.estimated_minutes) as total_minutes
            FROM modules m
            LEFT JOIN lessons l ON m.id = l.module_id
            WHERE m.course_id = ?
            GROUP BY m.id
            ORDER BY m.order_index ASC
        `, [id]);

        course.modules = modules;

        // If user_email provided, get their progress
        if (user_email) {
            const [progress] = await connection.execute(`
                SELECT * FROM user_course_progress 
                WHERE user_email = ? AND course_id = ?
            `, [user_email, id]);

            course.user_progress = progress[0] || null;
        }

        await connection.end();
        res.json(course);
    } catch (error) {
        console.error('Error fetching course details:', error);
        res.status(500).json({ message: 'Failed to fetch course details' });
    }
});

// =====================================================
// MODULES API
// =====================================================

/**
 * GET /api/learning/modules/:id/lessons
 * Get all lessons in a module with user progress
 */
router.get('/modules/:id/lessons', async (req, res) => {
    try {
        const { id } = req.params;
        const { user_email } = req.query;
        const connection = await getDBConnection();

        // Get lessons
        let query = `
            SELECT l.*
            FROM lessons l
            WHERE l.module_id = ?
            ORDER BY l.order_index ASC
        `;

        const [lessons] = await connection.execute(query, [id]);

        // If user_email provided, get progress for each lesson
        if (user_email && lessons.length > 0) {
            const lessonIds = lessons.map(l => l.id);
            const placeholders = lessonIds.map(() => '?').join(',');

            const [progress] = await connection.execute(`
                SELECT * FROM user_lesson_progress 
                WHERE user_email = ? AND lesson_id IN (${placeholders})
            `, [user_email, ...lessonIds]);

            // Merge progress into lessons
            const progressMap = {};
            progress.forEach(p => {
                progressMap[p.lesson_id] = p;
            });

            lessons.forEach(lesson => {
                lesson.user_progress = progressMap[lesson.id] || {
                    status: 'not_started',
                    completion_percentage: 0
                };
            });
        }

        await connection.end();
        res.json(lessons);
    } catch (error) {
        console.error('Error fetching module lessons:', error);
        res.status(500).json({ message: 'Failed to fetch lessons' });
    }
});

// =====================================================
// LESSONS API
// =====================================================

/**
 * GET /api/learning/lessons/:id
 * Get detailed lesson content
 */
router.get('/lessons/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { user_email } = req.query;
        const connection = await getDBConnection();

        // Get lesson with module info
        const [lessons] = await connection.execute(`
            SELECT l.*, m.course_id, m.title as module_title, m.order_index as module_order
            FROM lessons l
            JOIN modules m ON l.module_id = m.id
            WHERE l.id = ?
        `, [id]);

        if (lessons.length === 0) {
            await connection.end();
            return res.status(404).json({ message: 'Lesson not found' });
        }

        const lesson = lessons[0];

        // Check Access Control
        if (user_email) {
            const [users] = await connection.execute('SELECT subscription_status, trial_end_at FROM users WHERE email = ?', [user_email]);
            if (users.length > 0) {
                const user = users[0];
                const isPro = user.subscription_status === 'pro';
                const isTrial = user.subscription_status === 'trial' && new Date() < new Date(user.trial_end_at);
                const isUnlocked = isPro || isTrial;

                // FREE USER RESTRICTION
                if (!isUnlocked) {
                    // Rule: Can access only first 2 lessons of the first module.
                    // Assuming module_order 1 is the first module.
                    // Assuming order_index 1 and 2 are the first lessons.

                    const isFirstModule = lesson.module_order === 1;
                    const isFirstTwoLessons = lesson.order_index <= 2;

                    // Also check if course is one of the allowed free courses?
                    // Previous requirement: "Can access only limited courses".
                    // If they managed to get a lesson ID for a blocked course, we should also block here.
                    // But for simplicity and stricter security, let's enforce "First 2 lessons" rule globally for now.
                    // Or we can check course_id.

                    // Hardcoded Allowed Course IDs (from previous steps)
                    // const ALLOWED_FREE_IDS = ['1', '2', 'course_beginner_english', 'course_ielts_prep'];
                    // const isAllowedCourse = ALLOWED_FREE_IDS.includes(lesson.course_id);

                    // Combined Rule: Must be Allowed Course AND (First Module AND First 2 Lessons)
                    // Actually, if it's an allowed course, maybe we allow more?
                    // Prompt says "Can access only limited lessons per course". So restriction applies even to allowed courses.

                    if (!isFirstModule || !isFirstTwoLessons) {
                        // Block content
                        lesson.content_text = "This content is locked for Free users. Please upgrade to Pro to continue learning.";
                        lesson.is_locked = true; // Flag for frontend
                        // We don't error out, allowing frontend to show "Locked" state with description
                        // OR we can return 403. Returning 403 is cleaner for "Security".
                        await connection.end();
                        return res.status(403).json({ message: 'This lesson is locked for Free users. Upgrade to Pro.' });
                    }
                }
            }
        }

        // Parse JSON fields
        if (lesson.learning_objectives && typeof lesson.learning_objectives === 'string') {
            try {
                lesson.learning_objectives = JSON.parse(lesson.learning_objectives);
            } catch (e) {
                console.error("Failed to parse learning_objectives:", e);
                lesson.learning_objectives = [];
            }
        }
        if (lesson.prerequisites && typeof lesson.prerequisites === 'string') {
            try {
                lesson.prerequisites = JSON.parse(lesson.prerequisites);
            } catch (e) {
                console.error("Failed to parse prerequisites:", e);
                lesson.prerequisites = [];
            }
        }

        // Get user progress if email provided
        if (user_email) {
            const [progress] = await connection.execute(`
                SELECT * FROM user_lesson_progress 
                WHERE user_email = ? AND lesson_id = ?
            `, [user_email, id]);

            lesson.user_progress = progress[0] || null;

            // Get recent interactions
            const [interactions] = await connection.execute(`
                SELECT * FROM lesson_interactions 
                WHERE user_email = ? AND lesson_id = ?
                ORDER BY created_at DESC
                LIMIT 10
            `, [user_email, id]);

            lesson.recent_interactions = interactions;
        }

        await connection.end();
        res.json(lesson);
    } catch (error) {
        console.error('Error fetching lesson:', error);
        res.status(500).json({ message: 'Failed to fetch lesson' });
    }
});

/**
 * POST /api/learning/lessons/:id/start
 * Mark lesson as started
 */
router.post('/lessons/:id/start', async (req, res) => {
    try {
        const { id } = req.params;
        const { user_email } = req.body;

        if (!user_email) {
            return res.status(400).json({ message: 'User email required' });
        }

        const connection = await getDBConnection();

        // Insert or update progress
        await connection.execute(`
            INSERT INTO user_lesson_progress 
            (user_email, lesson_id, status, started_at, last_accessed_at)
            VALUES (?, ?, 'in_progress', NOW(), NOW())
            ON DUPLICATE KEY UPDATE 
                status = IF(status = 'not_started', 'in_progress', status),
                started_at = IF(started_at IS NULL, NOW(), started_at),
                last_accessed_at = NOW()
        `, [user_email, id]);

        // Update course/module progress
        await updateCourseProgress(connection, user_email, id);

        await connection.end();
        res.json({ message: 'Lesson started successfully' });
    } catch (error) {
        console.error('Error starting lesson:', error);
        res.status(500).json({ message: 'Failed to start lesson' });
    }
});

/**
 * POST /api/learning/lessons/:id/complete
 * Mark lesson as completed
 */
router.post('/lessons/:id/complete', async (req, res) => {
    try {
        const { id } = req.params;
        const { user_email, time_spent, quiz_score } = req.body;

        if (!user_email) {
            return res.status(400).json({ message: 'User email required' });
        }

        const connection = await getDBConnection();

        // Update progress
        await connection.execute(`
            INSERT INTO user_lesson_progress 
            (user_email, lesson_id, status, completion_percentage, completed_at, time_spent_minutes, quiz_score)
            VALUES (?, ?, 'completed', 100, NOW(), ?, ?)
            ON DUPLICATE KEY UPDATE  
                status = 'completed',
                completion_percentage = 100,
                completed_at = NOW(),
                time_spent_minutes = time_spent_minutes + COALESCE(VALUES(time_spent_minutes), 0),
                quiz_score = COALESCE(VALUES(quiz_score), quiz_score)
        `, [user_email, id, time_spent || 0, quiz_score || null]);

        // Update course/module progress
        await updateCourseProgress(connection, user_email, id);

        await connection.end();
        res.json({ message: 'Lesson completed successfully' });
    } catch (error) {
        console.error('Error completing lesson:', error);
        res.status(500).json({ message: 'Failed to complete lesson' });
    }
});

/**
 * POST /api/learning/lessons/:id/interact
 * Store AI interaction (Q&A)
 */
router.post('/lessons/:id/interact', async (req, res) => {
    try {
        const { id } = req.params;
        const { user_email, user_input, ai_response, interaction_type, difficulty } = req.body;

        if (!user_email || !user_input || !ai_response) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const connection = await getDBConnection();

        await connection.execute(`
            INSERT INTO lesson_interactions 
            (lesson_id, user_email, interaction_type, user_input, ai_response, difficulty_at_time)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [id, user_email, interaction_type || 'question', user_input, ai_response, difficulty || 'medium']);

        // Update last accessed time
        await connection.execute(`
            UPDATE user_lesson_progress 
            SET last_accessed_at = NOW()
            WHERE user_email = ? AND lesson_id = ?
        `, [user_email, id]);

        await connection.end();
        res.json({ message: 'Interaction saved successfully' });
    } catch (error) {
        console.error('Error saving interaction:', error);
        res.status(500).json({ message: 'Failed to save interaction' });
    }
});

// =====================================================
// PROGRESS API
// =====================================================

/**
 * GET /api/learning/progress
 * Get user's overall learning progress
 */
router.get('/progress', async (req, res) => {
    try {
        const { user_email } = req.query;

        if (!user_email) {
            return res.status(400).json({ message: 'User email required' });
        }

        const connection = await getDBConnection();

        // Get course progress
        const [courseProgress] = await connection.execute(`
            SELECT cp.*, c.title as course_title
            FROM user_course_progress cp
            JOIN courses c ON cp.course_id = c.id
            WHERE cp.user_email = ?
            ORDER BY cp.last_activity_at DESC
        `, [user_email]);

        // Get recent lesson activity
        const [recentLessons] = await connection.execute(`
            SELECT lp.*, l.title as lesson_title, m.title as module_title
            FROM user_lesson_progress lp
            JOIN lessons l ON lp.lesson_id = l.id
            JOIN modules m ON l.module_id = m.id
            WHERE lp.user_email = ?
            ORDER BY lp.last_accessed_at DESC
            LIMIT 5
        `, [user_email]);

        // Get statistics
        const [stats] = await connection.execute(`
            SELECT 
                COUNT(DISTINCT lesson_id) as total_lessons_started,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as lessons_completed,
                SUM(time_spent_minutes) as total_time_spent,
                AVG(quiz_score) as average_quiz_score
            FROM user_lesson_progress
            WHERE user_email = ?
        `, [user_email]);

        await connection.end();

        res.json({
            course_progress: courseProgress,
            recent_activity: recentLessons,
            statistics: stats[0]
        });
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ message: 'Failed to fetch progress' });
    }
});

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Update course and module progress after lesson change
 */
async function updateCourseProgress(connection, user_email, lesson_id) {
    try {
        // Get module and course IDs
        const [lessonData] = await connection.execute(`
            SELECT l.module_id, m.course_id
            FROM lessons l
            JOIN modules m ON l.module_id = m.id
            WHERE l.id = ?
        `, [lesson_id]);

        if (lessonData.length === 0) return;

        const { module_id, course_id } = lessonData[0];

        // Update module progress
        await connection.execute(`
            INSERT INTO user_module_progress (user_email, module_id, lessons_total, lessons_completed, completion_percentage)
            SELECT 
                ? as user_email,
                ? as module_id,
                COUNT(l.id) as lessons_total,
                SUM(CASE WHEN ulp.status = 'completed' THEN 1 ELSE 0 END) as lessons_completed,
                (SUM(CASE WHEN ulp.status = 'completed' THEN 1 ELSE 0 END) * 100.0 / COUNT(l.id)) as completion_percentage
            FROM lessons l
            LEFT JOIN user_lesson_progress ulp ON l.id = ulp.lesson_id AND ulp.user_email = ?
            WHERE l.module_id = ?
            ON DUPLICATE KEY UPDATE
                lessons_total = VALUES(lessons_total),
                lessons_completed = VALUES(lessons_completed),
                completion_percentage = VALUES(completion_percentage),
                updated_at = NOW()
        `, [user_email, module_id, user_email, module_id]);

        // Update course progress
        await connection.execute(`
            INSERT INTO user_course_progress (user_email, course_id, modules_total, lessons_total, lessons_completed, completion_percentage)
            SELECT 
                ? as user_email,
                ? as course_id,
                COUNT(DISTINCT m.id) as modules_total,
                COUNT(l.id) as lessons_total,
                SUM(CASE WHEN ulp.status = 'completed' THEN 1 ELSE 0 END) as lessons_completed,
                (SUM(CASE WHEN ulp.status = 'completed' THEN 1 ELSE 0 END) * 100.0 / COUNT(l.id)) as completion_percentage
            FROM modules m
            JOIN lessons l ON m.id = l.module_id
            LEFT JOIN user_lesson_progress ulp ON l.id = ulp.lesson_id AND ulp.user_email = ?
            WHERE m.course_id = ?
            ON DUPLICATE KEY UPDATE
                modules_total = VALUES(modules_total),
                lessons_total = VALUES(lessons_total),
                lessons_completed = VALUES(lessons_completed),
                completion_percentage = VALUES(completion_percentage),
                last_activity_at = NOW()
        `, [user_email, course_id, user_email, course_id]);

    } catch (error) {
        console.error('Error updating progress:', error);
    }
}

export default router;
