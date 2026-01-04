/**
 * Add lessons to database
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

async function addLessons() {
    console.log('📚 Adding unique lessons to courses...\n');

    try {
        const sqlPath = path.join(__dirname, 'add-lessons.sql');
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
        console.log('📝 Executing SQL...');

        await connection.query(sql);

        console.log('✅ Lessons added successfully!');

        // Verify
        const [lessons] = await connection.query('SELECT COUNT(*) as count FROM lessons');
        const [courses] = await connection.query(`
            SELECT c.title, COUNT(l.id) as lesson_count
            FROM courses c
            LEFT JOIN modules m ON c.id = m.course_id
            LEFT JOIN lessons l ON m.id = l.module_id
            GROUP BY c.id
        `);

        console.log(`\n📊 Database Status:`);
        console.log(`   Total Lessons: ${lessons[0].count}`);
        console.log(`\n📚 Lessons per Course:`);
        courses.forEach(c => {
            console.log(`   - ${c.title}: ${c.lesson_count} lessons`);
        });

        await connection.end();
        console.log('\n✅ Complete!\n');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

addLessons();
