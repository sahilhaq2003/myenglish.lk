
import mysql from 'mysql2';

const dbConfig = {
    host: 'database-1.ctaqimoaafgp.eu-north-1.rds.amazonaws.com',
    user: 'admin',
    password: 'myenglish2003',
    port: 3306,
    database: 'myenglish_db'
};

const connection = mysql.createConnection(dbConfig);

const emailToCheck = 'sahilhaq2003@gmail.com';

connection.connect(err => {
    if (err) {
        console.error('Connection failed:', err);
        return;
    }
    console.log('Connected to DB');

    const query = 'SELECT * FROM users WHERE email = ?';
    connection.query(query, [emailToCheck], (err, results) => {
        if (err) {
            console.error('Query failed:', err);
        } else {
            console.log(`Checking for user: ${emailToCheck}`);
            if (results.length === 0) {
                console.log('RESULT: User NOT found in database. (Account is deleted)');
            } else {
                console.log('RESULT: User FOUND in database. (Account exists)');
                console.log(results[0]);
            }
        }
        connection.end();
    });
});
