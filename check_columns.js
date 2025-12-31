
import mysql from 'mysql2';

const dbConfig = {
    host: 'database-1.ctaqimoaafgp.eu-north-1.rds.amazonaws.com',
    user: 'admin',
    password: 'myenglish2003',
    port: 3306,
    database: 'myenglish_db'
};

const connection = mysql.createConnection(dbConfig);

connection.connect(err => {
    if (err) {
        console.error('Connection failed:', err);
        return;
    }
    console.log('Connected to DB');

    const query = 'SHOW COLUMNS FROM users';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Query failed:', err);
        } else {
            console.log('Columns in users table:');
            results.forEach(col => console.log(col.Field));
        }
        connection.end();
    });
});
