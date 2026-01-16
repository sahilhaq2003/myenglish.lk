import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import learningRoutes from './routes/learning.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Error handling for JSON parsing
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && 'body' in err) {
        console.error('JSON Parse Error:', err.message);
        return res.status(400).json({ message: 'Invalid JSON payload' });
    }
    next();
});

// Load environment variables from server/.env
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

// Database Configuration
const dbConfig = {
    host: process.env.DB_HOST || 'database-1.ctaqimoaafgp.eu-north-1.rds.amazonaws.com',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD,  // MUST be set in .env file
    port: parseInt(process.env.DB_PORT) || 3306,
    ssl: {
        rejectUnauthorized: false
    }
};

let pool;

function startServer() {
    pool = mysql.createPool({
        ...dbConfig,
        database: 'myenglish_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    // ... Routes and other logic will be attached to 'app' here or globally ...
    // Note: In strict express + mysql patterns we usually pass pool to routes
    // But here 'pool' is a module-level variable used by closures.
    // We just need to initialize it.
}

// Validate required environment variables
if (!dbConfig.password) {
    console.error('WARNING: DB_PASSWORD environment variable is not set! Database operations will fail.');
    // process.exit(1); // Don't crash on Vercel, let it try to handle requests just in case
}

console.log('Environment Variables Loaded:', {
    DB_HOST: process.env.DB_HOST ? 'Set' : 'Missing',
    DB_USER: process.env.DB_USER ? 'Set' : 'Missing',
    DB_PASSWORD: process.env.DB_PASSWORD ? 'Set' : 'Missing',
    NODE_ENV: process.env.NODE_ENV
});

// Create a connection to create the database if it doesn't exist
// Note: mysql2/promise is better for async/await but callback style works if wrapped or used directly.
// We'll stick to basic mysql2 for simplicity here or use connection.

// Initial Connection Logic (Dev Only)
if (process.env.NODE_ENV !== 'production') {
    const initialConnection = mysql.createConnection(dbConfig);
    initialConnection.connect((err) => {
        if (err) {
            console.error('Error connecting to RDS instance:', err);
            return;
        }
        console.log('Connected to RDS instance.');
        initialConnection.query("CREATE DATABASE IF NOT EXISTS myenglish_db", (err) => {
            if (err) console.error('Error creating database:', err);
            console.log('Database myenglish_db checked/created.');
            initialConnection.end();
            startServer();
            app.listen(PORT, () => {
                console.log(`Server running on http://localhost:${PORT}`);
            });
        });
    });
} else {
    // Production/Vercel: Just start the server configuration
    startServer();
}



/* 
// AUTO-MIGRATION DISABLED FOR SERVERLESS PERFORMANCE
// Run these migrations manually or in a separate script if needed.
 
// Create Users Table
const createTableQuery = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

pool.query(createTableQuery, (err) => {
    if (err) {
        console.error('Error creating users table:', err);
    } else {
        console.log('Users table checked/created.');
    }
});


// Update or check users table for profile fields
// Verify and add missing columns individually to prevent failures if some exist
const columns = [
    "ADD COLUMN bio TEXT",
    "ADD COLUMN phone VARCHAR(20)",
    "ADD COLUMN location VARCHAR(100)",
    "ADD COLUMN avatar_url LONGTEXT",
    "ADD COLUMN current_level VARCHAR(50) DEFAULT 'Not assessed yet'",
    "ADD COLUMN learning_goal VARCHAR(100) DEFAULT 'General Fluency'",
    "ADD COLUMN daily_goal INT DEFAULT 20",
    "ADD COLUMN first_name VARCHAR(100)",
    "ADD COLUMN birthday DATE"
];

columns.forEach(col => {
    pool.query(`ALTER TABLE users ${col}`, (err) => {
        // Ignore duplicate column errors
        if (err && err.code !== 'ER_DUP_FIELDNAME') {
            // console.error(`Error adding column ${col}:`, err.message);
        }
    });
});

// Ensure avatar_url is LONGTEXT (migration for existing VARCHAR users)
pool.query("ALTER TABLE users MODIFY COLUMN avatar_url LONGTEXT", (err) => {
    // Ignore if already LONGTEXT or other non-critical errors
    if (err) console.log("Note: Avatar column modify check:", err.code);
});
console.log('Profile columns verified.');

// Create Enrollments Table
const createEnrollmentsTableQuery = `
CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  course_id VARCHAR(100) NOT NULL,
  course_title VARCHAR(255) NOT NULL,
  course_category VARCHAR(100),
  course_level VARCHAR(50),
  course_description TEXT,
  course_thumbnail TEXT,
  course_instructor VARCHAR(255),
  course_lessons INT DEFAULT 0,
  progress INT DEFAULT 0,
  completed_lessons INT DEFAULT 0,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_enrollment (user_email, course_id),
  FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
)
`;

pool.query(createEnrollmentsTableQuery, (err) => {
    if (err) {
        console.error('Error creating enrollments table:', err);
    } else {
        console.log('Enrollments table checked/created.');
    }
});
*/

// =====================================================
// LEARNING PLATFORM ROUTES
// =====================================================
app.use('/api/learning', learningRoutes);
console.log('✅ Learning platform routes loaded successfully');

// Health Check Endpoint (for load balancers and monitoring)
app.get('/health', (req, res) => {
    // Check database connection
    pool.query('SELECT 1', (err) => {
        if (err) {
            return res.status(503).json({
                status: 'unhealthy',
                database: 'disconnected',
                error: err.message
            });
        }
        res.json({
            status: 'healthy',
            database: 'connected',
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        });
    });
});

app.get('/', (req, res) => {
    res.send('MyEnglish Backend Server is Running. Please use the frontend application to interact.');
});

// Database Test Route (For Debugging)
app.get('/api/test-db', (req, res) => {
    try {
        pool.query('SELECT 1 + 1 AS solution', (err, results, fields) => {
            if (err) {
                return res.status(500).json({
                    status: 'Database Connection Failed',
                    error: err.message,
                    code: err.code,
                    host: dbConfig.host,
                    user: dbConfig.user
                });
            }
            res.json({
                status: 'Database Connection Successful',
                result: results[0].solution,
                timestamp: new Date().toISOString()
            });
        });
    } catch (e) {
        res.status(500).json({ status: 'Unexpected Error', error: e.message });
    }
});

// Routes
app.post('/api/signup', async (req, res) => {
    const { username, email, password, first_name, birthday } = req.body;

    if (!username || !email || !password || !first_name || !birthday) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `INSERT INTO users 
            (username, email, password, first_name, birthday, subscription_status, trial_start_at, trial_end_at) 
            VALUES (?, ?, ?, ?, ?, 'trial', NOW(), DATE_ADD(NOW(), INTERVAL 3 DAY))`;
        pool.query(query, [username, email, hashedPassword, first_name, birthday], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: 'Email already exists' });
                }
                console.error('Signup DB Error:', err);
                return res.status(500).json({ message: 'Server error', error: err.message, stack: err.stack });
            }
            res.status(201).json({ message: 'User created successfully', userId: result.insertId });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    pool.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Login DB Error:', err);
            return res.status(500).json({ message: 'Server error', error: err.message, stack: err.stack });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                phone: user.phone,
                location: user.location,
                avatar_url: user.avatar_url,
                current_level: user.current_level,
                learning_goal: user.learning_goal,
                daily_goal: user.daily_goal,
                first_name: user.first_name,
                birthday: user.birthday,
                subscription_status: user.subscription_status,
                trial_end_at: user.trial_end_at,
                pro_end_at: user.pro_end_at
            }
        });
    });
});

// Get Profile
app.get('/api/profile', (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    console.log('Getting profile for email:', email);
    const query = 'SELECT id, username, email, bio, phone, location, avatar_url, current_level, learning_goal, daily_goal, first_name, birthday, created_at, subscription_status, trial_end_at, pro_end_at FROM users WHERE email = ?';
    pool.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error fetching profile:', err);
            return res.status(500).json({ message: 'Server error' });
        }
        if (results.length === 0) {
            console.log('User not found for email:', email);
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('Profile retrieved from DB:', results[0]);
        res.json(results[0]);
    });
});

// Update Profile
app.put('/api/profile', (req, res) => {
    const { email, username, bio, phone, location, learning_goal, daily_goal, first_name, birthday, current_level, avatar_url } = req.body;

    console.log('Update profile request received for:', email);
    // console.log('Update data:', { username, bio, phone, location, learning_goal, daily_goal, first_name, birthday, current_level }); // Reduced logging for privacy/size

    if (!email) return res.status(400).json({ message: 'Email required' });

    // Sanitize date for MySQL (empty string, null, or undefined -> null)
    const birthdayVal = (birthday && birthday !== '') ? birthday : null;
    const phoneVal = (phone && phone !== '') ? phone : null;
    const locationVal = (location && location !== '') ? location : null;
    const bioVal = (bio && bio !== '') ? bio : null;

    // Only update avatar_url if provided (avoid overwriting with null if not sent, though frontend should send it)
    // Actually, let's just update all fields. 

    const query = `UPDATE users SET 
            username = ?, 
            bio = ?, 
            phone = ?, 
            location = ?, 
            learning_goal = ?, 
            daily_goal = ?, 
            first_name = ?, 
            birthday = ?,
            current_level = ?,
            avatar_url = ?
            WHERE email = ?`;

    const values = [username, bioVal, phoneVal, locationVal, learning_goal, daily_goal, first_name, birthdayVal, current_level, avatar_url || null, email];

    pool.query(query, values, (err, result) => {
        if (err) {
            console.error('Error updating profile:', err);
            return res.status(500).json({ message: 'Server error updating profile', error: err.message });
        }
        if (result.affectedRows === 0) {
            console.log('No rows updated for email:', email);
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('Profile updated successfully in DB for:', email);
        console.log('Affected rows:', result.affectedRows);
        console.log('Changed rows:', result.changedRows);
        res.json({ message: 'Profile updated successfully', affectedRows: result.affectedRows, changedRows: result.changedRows });
    });
});

// Delete Account
app.delete('/api/profile', (req, res) => {
    const email = req.body.email || req.query.email;
    console.log('Attempting to delete account for email:', email);

    if (!email) {
        console.log('Delete failed: Email required');
        return res.status(400).json({ message: 'Email required' });
    }

    const query = 'DELETE FROM users WHERE email = ?';
    pool.query(query, [email], (err, result) => {
        if (err) {
            console.error('Database error during delete:', err);
            return res.status(500).json({ message: 'Server error check console' });
        }
        if (result.affectedRows === 0) {
            console.log('Delete failed: User not found for email', email);
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('Account deleted successfully for:', email);
        res.json({ message: 'Account deleted successfully' });
    });
});

// Upgrade Subscription (Mock for now)
app.post('/api/upgrade', (req, res) => {
    const { email } = req.body;
    console.log('Upgrading subscription for:', email);

    if (!email) return res.status(400).json({ message: 'Email required' });

    // Set to 'pro' and give 1 year for now (or perpetual)
    const query = `UPDATE users SET 
            subscription_status = 'pro',
            pro_start_at = NOW(),
            pro_end_at = DATE_ADD(NOW(), INTERVAL 1 YEAR)
            WHERE email = ?`;

    pool.query(query, [email], (err, result) => {
        if (err) {
            console.error('Error upgrading subscription:', err);
            return res.status(500).json({ message: 'Server error upgrading' });
        }
        console.log('Subscription upgraded for:', email);

        // Return updated user data
        const getQuery = 'SELECT * FROM users WHERE email = ?';
        pool.query(getQuery, [email], (err, results) => {
            if (err || results.length === 0) {
                return res.json({ message: 'Upgraded, but failed to fetch updated profile' });
            }
            res.json({
                message: 'Upgrade successful',
                user: {
                    ...results[0],
                    // ensure we don't send password
                    password: undefined
                }
            });
        });
    });
});

// ============ ENROLLMENT ENDPOINTS ============

// Get user's enrolled courses
app.get('/api/enrollments', (req, res) => {
    const email = req.query.email;
    console.log('Fetching enrollments for email:', email);

    if (!email) {
        return res.status(400).json({ message: 'Email required' });
    }

    const query = 'SELECT * FROM enrollments WHERE user_email = ? ORDER BY enrolled_at DESC';
    pool.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error fetching enrollments:', err);
            return res.status(500).json({ message: 'Server error fetching enrollments' });
        }


        // Map old course IDs to new learning platform IDs
        const courseIdMapping = {
            '1': 'course_beginner_english',          // Complete English Grammar Mastery
            '2': 'course_ielts_prep',                // IELTS 8+ Band Guaranteed
            '3': 'course_business_english',          // Business English for Professionals
            '4': 'course_american_accent',           // American Accent Training
            '5': 'course_conversational_beginners',  // Conversational English Beginners
            '6': 'course_advanced_writing'           // Advanced Writing & Composition
        };

        // Add learning_course_id to each enrollment
        const mappedResults = results.map(enrollment => ({
            ...enrollment,
            learning_course_id: courseIdMapping[enrollment.course_id] || enrollment.course_id
        }));

        console.log('Enrollments fetched:', mappedResults.length);
        res.json(mappedResults);
    });
});

// Enroll in a course
app.post('/api/enrollments', (req, res) => {
    const {
        userEmail,
        courseId,
        courseTitle,
        courseCategory,
        courseLevel,
        courseDescription,
        courseThumbnail,
        courseInstructor,
        courseLessons
    } = req.body;

    console.log('Enrolling user:', userEmail, 'in course:', courseTitle);

    if (!userEmail || !courseId || !courseTitle) {
        return res.status(400).json({ message: 'User email, course ID, and course title are required' });
    }

    // Check subscription status first
    const userQuery = 'SELECT subscription_status, trial_end_at, pro_end_at FROM users WHERE email = ?';
    pool.query(userQuery, [userEmail], (err, results) => {
        if (err) {
            console.error('Error fetching user for enrollment check:', err);
            return res.status(500).json({ message: 'Server error checking subscription' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];
        const isPro = user.subscription_status === 'pro';
        const isTrial = user.subscription_status === 'trial' && user.trial_end_at && new Date() < new Date(user.trial_end_at);
        const isUnlocked = isPro || isTrial;

        // Strict restriction: Free users can ONLY enroll in 'English for Beginners'
        // Check by course title (primary) and known free course IDs
        const isFreeOnlyCourse = courseTitle === 'English for Beginners';
        
        // All other courses require pro/trial subscription
        if (!isUnlocked && !isFreeOnlyCourse) {
            console.log('Blocked enrollment for free user:', userEmail, 'Course:', courseTitle, 'ID:', courseId);
            return res.status(403).json({ message: 'This is a Premium course. Please upgrade your plan to enroll.' });
        }

        // Also restrict to maximum number of free courses if needed
        // For now, allowing unlimited free course (English for Beginners) but blocking premium

        // Proceed with enrollment
        const query = `
            INSERT INTO enrollments 
            (user_email, course_id, course_title, course_category, course_level, 
             course_description, course_thumbnail, course_instructor, course_lessons)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        pool.query(query, [
            userEmail,
            courseId,
            courseTitle,
            courseCategory || '',
            courseLevel || '',
            courseDescription || '',
            courseThumbnail || '',
            courseInstructor || '',
            courseLessons || 0
        ], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log('User already enrolled in this course');
                    return res.status(409).json({ message: 'Already enrolled in this course' });
                }
                console.error('Error enrolling in course:', err);
                return res.status(500).json({ message: 'Server error enrolling in course' });
            }
            console.log('Successfully enrolled in course:', courseTitle);
            res.status(201).json({ message: 'Successfully enrolled', enrollmentId: result.insertId });
        });
    });
});

// Unenroll from a course
app.delete('/api/enrollments/:courseId', (req, res) => {
    const { courseId } = req.params;
    const { email } = req.body;

    console.log('Unenrolling user:', email, 'from course:', courseId);

    if (!email || !courseId) {
        return res.status(400).json({ message: 'Email and course ID required' });
    }

    const query = 'DELETE FROM enrollments WHERE user_email = ? AND course_id = ?';
    pool.query(query, [email, courseId], (err, result) => {
        if (err) {
            console.error('Error unenrolling from course:', err);
            return res.status(500).json({ message: 'Server error unenrolling from course' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        console.log('Successfully unenrolled from course');
        res.json({ message: 'Successfully unenrolled' });
    });
});

// Update course progress
app.put('/api/enrollments/:courseId/progress', (req, res) => {
    const { courseId } = req.params;
    const { email, progress, completedLessons } = req.body;

    console.log('Updating progress for user:', email, 'course:', courseId);

    if (!email || !courseId) {
        return res.status(400).json({ message: 'Email and course ID required' });
    }

    const query = `
            UPDATE enrollments 
            SET progress = ?, completed_lessons = ?
            WHERE user_email = ? AND course_id = ?
        `;

    pool.query(query, [progress || 0, completedLessons || 0, email, courseId], (err, result) => {
        if (err) {
            console.error('Error updating progress:', err);
            return res.status(500).json({ message: 'Server error updating progress' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        console.log('Progress updated successfully');
        res.json({ message: 'Progress updated successfully' });
    });
});



export default app;
