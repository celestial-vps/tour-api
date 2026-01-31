const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a pool of connections using the promise-based API directly
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 1000,
    queueLimit: 0,
    charset: 'utf8mb4'
});

// Test the connection
(async () => {
    let connection;
    try {
        connection = await pool.getConnection();
        console.log('Connection successful!');

        // Execute a query
        const [rows] = await connection.query('SELECT 1');
        console.log(rows);

    } catch (err) {
        console.error('Connection failed:', err.message);
    } finally {
        if (connection) {
            try {
                await connection.release();  // Release the connection back to the pool
            } catch (releaseErr) {
                console.error('Error releasing connection:', releaseErr.message);
            }
        }
    }
})();

// Export the pool directly
module.exports = pool;
