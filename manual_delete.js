
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

    // 1. Check
    const query = 'SELECT * FROM users WHERE email = ?';
    connection.query(query, [emailToCheck], (err, results) => {
        if (err) {
            console.error('Select failed:', err);
            connection.end();
            return;
        }

        if (results.length > 0) {
            console.log(`User found: '${results[0].email}'. Deleting now...`);

            // 2. Delete
            const deleteQuery = 'DELETE FROM users WHERE email = ?';
            connection.query(deleteQuery, [emailToCheck], (err, result) => {
                if (err) {
                    console.error('Delete failed:', err);
                } else {
                    console.log(`Deleted. Affected rows: ${result.affectedRows}`);
                }

                // 3. Verify
                connection.query(query, [emailToCheck], (err, finalResults) => {
                    if (finalResults.length === 0) {
                        console.log('VERIFICATION: User is GONE from database.');
                    } else {
                        console.log('VERIFICATION: User STILL EXISTS (Delete failed?)');
                    }
                    connection.end();
                });
            });

        } else {
            console.log('User was NOT found initially. Already deleted.');
            connection.end();
        }
    });
});
