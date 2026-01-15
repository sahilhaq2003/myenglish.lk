import mysql from 'mysql2';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'database-1.ctaqimoaafgp.eu-north-1.rds.amazonaws.com',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'myenglish2003',
    port: parseInt(process.env.DB_PORT) || 3306,
    database: 'myenglish_db',
    ssl: {
        rejectUnauthorized: false
    }
};

const connection = mysql.createConnection(dbConfig);

const columnsCallback = [
    "ADD COLUMN subscription_status ENUM('free', 'trial', 'pro') DEFAULT 'free'",
    "ADD COLUMN trial_start_at TIMESTAMP NULL",
    "ADD COLUMN trial_end_at TIMESTAMP NULL",
    "ADD COLUMN pro_start_at TIMESTAMP NULL",
    "ADD COLUMN pro_end_at TIMESTAMP NULL"
];

connection.connect(err => {
    if (err) {
        console.error('Connection failed:', err);
        return;
    }
    console.log('Connected to DB');

    let completed = 0;

    const runQuery = (index) => {
        if (index >= columnsCallback.length) {
            console.log('All columns processed.');
            connection.end();
            return;
        }

        const col = columnsCallback[index];
        console.log(`Processing: ${col}`);

        connection.query(`ALTER TABLE users ${col}`, (err) => {
            if (err) {
                if (err.code === 'ER_DUP_FIELDNAME') {
                    console.log(`Column already exists.`);
                } else {
                    console.error(`Error adding column:`, err.message);
                }
            } else {
                console.log(`- Success!`);
            }
            runQuery(index + 1);
        });
    };

    runQuery(0);
});
