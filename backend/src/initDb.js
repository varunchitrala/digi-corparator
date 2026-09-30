const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

async function initDB() {
  console.log('[DB Init] Attempting to connect to MySQL server...');
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('[DB Init] Connected. Reading schema.sql...');
    const schemaSql = fs.readFileSync(path.join(__dirname, '../../database/schema.sql'), 'utf8');
    await connection.query(schemaSql);
    console.log('[DB Init] Schema created successfully!');

    console.log('[DB Init] Reading seed.sql...');
    const seedSql = fs.readFileSync(path.join(__dirname, '../../database/seed.sql'), 'utf8');
    await connection.query(seedSql);
    console.log('[DB Init] Seed data inserted successfully!');

    await connection.end();
    console.log('[DB Init] Database initialization complete.');
  } catch (err) {
    console.error('[DB Init Error]', err.message);
  }
}

initDB();
