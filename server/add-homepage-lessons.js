/**
 * Add lessons for all homepage courses
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function addHomepageLessons() {
    console.log('📚 Adding lessons for all homepage courses...\n');

    try {
        const sqlPath = path.join(__dirname, 'add-homepage-course-lessons.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'myenglish_db',
            port: parseInt(process.env.DB_PORT) || 3306,
            multipleStatements: true
        });

        console.log('✅ Connected to database');
        console.log('📝 Creating courses, modules, and lessons...\n');

        await connection.query(sql);

        console.log('✅ All lessons added successfully!\n');

        // Verify courses
        const [courses] = await connection.query(`
            SELECT id, title FROM courses ORDER BY id
        `);

        console.log('📚 Courses in Learning Platform:');
        courses.forEach(c => {
            console.log(`   ${c.id} → ${c.title}`);
        });

        // Verify lessons per course
        const [lessonCount] = await connection.query(`
            SELECT c.id, c.title, COUNT(l.id) as lesson_count
            FROM courses c
            LEFT JOIN modules m ON c.id = m.course_id
            LEFT JOIN lessons l ON m.id = l.module_id
            GROUP BY c.id
            ORDER BY c.id
        `);

        console.log('\n📊 Lessons per Course:');
        lessonCount.forEach(c => {
            console.log(`   ${c.title}: ${c.lesson_count} lessons`);
        });

        const [totalLessons] = await connection.query('SELECT COUNT(*) as count FROM lessons');
        console.log(`\n🎓 Total Lessons: ${totalLessons[0].count}`);

        await connection.end();
        console.log('\n✅ Complete!\n');

        console.log('📝 Course ID Mapping (Homepage → Learning Platform):');
        console.log('   1 → course_beginner_english');
        console.log('   2 → course_ielts_prep');
        console.log('   3 → course_business_english');
        console.log('   4 → course_american_accent');
        console.log('   5 → course_conversational_beginners');
        console.log('   6 → course_advanced_writing');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

addHomepageLessons();
