/**
 * Run Repopulate Courses Script
 * Adds modules and lessons to ensure all courses have comprehensive content.
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') }); // note: adjusted path to root .env if running from this dir generally, but let's check location.
// Actually add-lessons.js used path.join(__dirname, '.env') which implies .env is in server dir.
// Step 1433 content confirms: dotenv.config({ path: path.join(__dirname, '.env') });
// I will check if .env exists in server/ dir. Step 1403 showed .env exists in server/.

dotenv.config({ path: path.join(__dirname, '.env') });

async function repopulateCourses() {
    console.log('🚀 Starting content population...\n');

    try {
        const sqlPath = path.join(__dirname, 'repopulate_courses.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split SQL by semicolons to execute statements one by one if needed, 
        // or rely on multipleStatements: true

        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'myenglish_db',
            port: parseInt(process.env.DB_PORT) || 3306,
            multipleStatements: true
        });

        console.log('✅ Connected to database');
        console.log('📝 Executing Content Update SQL...');

        await connection.query(sql);

        console.log('✅ Content updated successfully!');

        // Verification Report
        console.log('\n📊 Content Verification Report:');

        const [courses] = await connection.query('SELECT id, title FROM courses');

        for (const course of courses) {
            console.log(`\n📘 Course: ${course.title} (${course.id})`);

            const [modules] = await connection.query(
                'SELECT id, title FROM modules WHERE course_id = ? ORDER BY order_index',
                [course.id]
            );

            if (modules.length === 0) {
                console.log(`   ⚠️  No modules found!`);
                continue;
            }

            for (const mod of modules) {
                const [lessons] = await connection.query(
                    'SELECT COUNT(*) as count FROM lessons WHERE module_id = ?',
                    [mod.id]
                );
                const count = lessons[0].count;
                const status = count >= 2 ? '✅' : (count > 0 ? '⚠️' : '❌');
                console.log(`   ${status} Module: ${mod.title} - ${count} lessons`);
            }
        }

        await connection.end();
        console.log('\n✨ All operations complete! The dashboard should now show lessons for all modules.\n');

    } catch (error) {
        console.error('❌ Error executing script:', error);
        process.exit(1);
    }
}

repopulateCourses();
