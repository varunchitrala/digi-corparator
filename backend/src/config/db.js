const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'digital_corporator',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

/**
 * Test DB Connection function
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(`[Database] Successfully connected to MySQL at ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('[Database] Connection Error:', error.message);
    return false;
  }
}

module.exports = {
  pool,
  testConnection
};
