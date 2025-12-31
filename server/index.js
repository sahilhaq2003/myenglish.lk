import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Database Configuration
const dbConfig = {
    host: 'database-1.ctaqimoaafgp.eu-north-1.rds.amazonaws.com',
    user: 'admin',
    password: 'myenglish2003',
    port: 3306,
    multipleStatements: true
};

// Create a connection to create the database if it doesn't exist
// Note: mysql2/promise is better for async/await but callback style works if wrapped or used directly.
// We'll stick to basic mysql2 for simplicity here or use connection.

const initialConnection = mysql.createConnection(dbConfig);

initialConnection.connect((err) => {
    if (err) {
        console.error('Error connecting to RDS instance:', err);
        return;
    }
    console.log('Connected to RDS instance.');

    // Create Database
    initialConnection.query("CREATE DATABASE IF NOT EXISTS myenglish_db", (err) => {
        if (err) {
            console.error('Error creating database:', err);
            // Fallback: If we can't create DB, maybe we don't have permissions or it exists.
            // We will try to proceed by connecting to the DB if created, or fail later.
            // But we need to switch to the DB.
        }
        console.log('Database myenglish_db checked/created.');
        initialConnection.end();

        // Start the main pool with the database selected
        startServer();
    });
});

let pool;

function startServer() {
    pool = mysql.createPool({
        ...dbConfig,
        database: 'myenglish_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

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

    // Root Route
    app.get('/', (req, res) => {
        res.send('MyEnglish Backend Server is Running. Please use the frontend application to interact.');
    });

    // Routes
    app.post('/api/signup', async (req, res) => {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
            pool.query(query, [username, email, hashedPassword], (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(409).json({ message: 'Email already exists' });
                    }
                    console.error(err);
                    return res.status(500).json({ message: 'Server error' });
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
                console.error(err);
                return res.status(500).json({ message: 'Server error' });
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
                user: { id: user.id, username: user.username, email: user.email }
            });
        });
    });

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
