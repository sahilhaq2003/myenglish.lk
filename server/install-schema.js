/**
 * Database schema installer for Learning Platform
 * Executes the SQL schema to create all necessary tables
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

async function installSchema() {
    console.log('🚀 Starting database schema installation...\n');

    try {
        // Read the SQL schema file
        const schemaPath = path.join(__dirname, 'database_schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Create connection
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'myenglish_db',
            port: parseInt(process.env.DB_PORT) || 3306,
            multipleStatements: true
        });

        console.log('✅ Connected to database');

        // Execute schema
        console.log('📝 Executing schema...');
        await connection.query(schema);

        console.log('✅ Schema executed successfully!');
        console.log('\n📊 Created/Updated tables:');
        console.log('   - courses');
        console.log('   - modules');
        console.log('   - lessons');
        console.log('   - user_lesson_progress');
        console.log('   - lesson_interactions');
        console.log('   - user_module_progress');
        console.log('   - user_course_progress');
        console.log('\n✨ Sample data inserted!');

        // Verify installation
        const [courses] = await connection.query('SELECT COUNT(*) as count FROM courses');
        const [modules] = await connection.query('SELECT COUNT(*) as count FROM modules');
        const [lessons] = await connection.query('SELECT COUNT(*) as count FROM lessons');

        console.log('\n📈 Database status:');
        console.log(`   Courses: ${courses[0].count}`);
        console.log(`   Modules: ${modules[0].count}`);
        console.log(`   Lessons: ${lessons[0].count}`);

        await connection.end();
        console.log('\n✅ Installation complete!\n');

    } catch (error) {
        console.error('❌ Error installing schema:', error);
        process.exit(1);
    }
}

installSchema();
