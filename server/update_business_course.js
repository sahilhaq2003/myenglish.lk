
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const COURSE_ID = 'course_business_english';

const modulesData = [
    {
        title: "Business English Foundations",
        lessons: ["Business Communication Basics", "Formal vs Informal English", "Professional Tone & Etiquette", "Common Business Vocabulary"]
    },
    {
        title: "Professional Introductions & Networking",
        lessons: ["Introducing Yourself Professionally", "Talking About Your Job & Company", "Networking Conversations", "Small Talk in Business"]
    },
    {
        title: "Business Vocabulary & Phrases",
        lessons: ["Office & Workplace Vocabulary", "Corporate Terms & Expressions", "Common Business Collocations", "Industry-Specific Language"]
    },
    {
        title: "Email & Written Communication",
        lessons: ["Writing Professional Emails", "Subject Lines & Email Structure", "Formal Requests & Replies", "Reports & Business Messages"]
    },
    {
        title: "Meetings & Discussions",
        lessons: ["Starting & Ending Meetings", "Expressing Opinions", "Agreeing & Disagreeing Politely", "Interrupting & Clarifying"]
    },
    {
        title: "Presentations & Public Speaking",
        lessons: ["Presentation Structure", "Opening & Closing Strongly", "Describing Data & Charts", "Handling Questions"]
    },
    {
        title: "Telephone & Online Communication",
        lessons: ["Phone Call Language", "Video Meeting Etiquette", "Clarifying & Confirming Information", "Handling Difficult Calls"]
    },
    {
        title: "Negotiation & Persuasion",
        lessons: ["Negotiation Vocabulary", "Making Proposals", "Persuasive Language", "Reaching Agreements"]
    },
    {
        title: "Customer Service & Sales English",
        lessons: ["Dealing with Customers", "Handling Complaints", "Sales Conversations", "Follow-ups & Feedback"]
    },
    {
        title: "Workplace Situations",
        lessons: ["Giving Instructions", "Asking for Help", "Giving Feedback", "Managing Conflict"]
    },
    {
        title: "Business Grammar & Accuracy",
        lessons: ["Grammar for Professional Use", "Common Business Grammar Mistakes", "Polite Structures", "Clear & Concise Writing"]
    },
    {
        title: "Cross-Cultural Business English",
        lessons: ["Global Communication Styles", "Cultural Differences", "Avoiding Misunderstandings", "Professional Etiquette Worldwide"]
    },
    {
        title: "Career Growth English",
        lessons: ["Resume & Cover Letter Language", "Job Interviews", "Performance Reviews", "Career Discussions"]
    },
    {
        title: "Practice & Mastery",
        lessons: ["Role Plays & Simulations", "Real Business Scenarios", "Speaking & Writing Practice", "Final Assessment"]
    }
];

async function updateCourse() {
    console.log(`Starting update for course: ${COURSE_ID}`);

    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'myenglish_db',
            port: parseInt(process.env.DB_PORT) || 3306
        });

        console.log('Connected to database.');

        // 1. Delete existing modules for this course
        // Note: DELETE CASCADE should remove lessons too if set up in schema.
        // Schema check: FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
        // Wait, deleting modules by course_id?
        // Schema: FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE in lessons table.
        // So deleting modules should delete lessons.
        console.log('Deleting existing modules and lessons for this course...');
        await connection.execute('DELETE FROM modules WHERE course_id = ?', [COURSE_ID]);
        console.log('Existing content cleared.');

        // 2. Insert new modules and lessons
        let moduleIndex = 1;

        for (const mod of modulesData) {
            const moduleId = `m_be_${moduleIndex.toString().padStart(2, '0')}`;

            console.log(`Creating Module ${moduleIndex}: ${mod.title}`);

            await connection.execute(`
                INSERT INTO modules (id, course_id, title, description, order_index, estimated_hours)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [
                moduleId,
                COURSE_ID,
                mod.title,
                `Master ${mod.title} in a professional context.`,
                moduleIndex,
                2.5 // Estimated hours per module
            ]);

            let lessonIndex = 1;
            for (const lessonTitle of mod.lessons) {
                const lessonId = `l_be_${moduleIndex.toString().padStart(2, '0')}_${lessonIndex.toString().padStart(2, '0')}`;

                // Determine Lesson Type
                let type = 'lecture';
                if (lessonTitle.includes('Practice') || lessonTitle.includes('Role Play')) type = 'practice';
                if (lessonTitle.includes('Assessment') || lessonTitle.includes('Review')) type = 'quiz';
                if (lessonTitle.includes('Simulation')) type = 'interactive';

                // Basic content text
                const contentText = `Welcome to the lesson on ${lessonTitle}. In this lesson, we will explore key concepts and practical applications relevant to ${mod.title}.`;

                await connection.execute(`
                    INSERT INTO lessons (
                        id, module_id, title, description, order_index, 
                        lesson_type, content_text, difficulty_level, estimated_minutes
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    lessonId,
                    moduleId,
                    lessonTitle,
                    `Learn about ${lessonTitle}`,
                    lessonIndex,
                    type,
                    contentText,
                    'intermediate',
                    15
                ]);
                lessonIndex++;
            }
            moduleIndex++;
        }

        console.log('✅ Course content updated successfully!');

    } catch (error) {
        console.error('❌ Error updating course:', error);
    } finally {
        if (connection) await connection.end();
    }
}

updateCourse();
