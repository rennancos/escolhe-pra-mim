const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

async function setupDatabase() {
  let connection;
  try {
    // 1. Connect without selecting a database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL server.');

    // 2. Create Database
    await connection.query(`CREATE DATABASE IF NOT EXISTS escolhe_pra_mim`);
    console.log('✅ Database "escolhe_pra_mim" created (or already exists).');

    // 3. Use Database
    await connection.query(`USE escolhe_pra_mim`);
    console.log('✅ Using database "escolhe_pra_mim".');

    // 4. Create Users Table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await connection.query(createUsersTable);
    console.log('✅ Table "users" created (or already exists).');

    // 5. Create Contents Table
    const createContentsTable = `
      CREATE TABLE IF NOT EXISTS contents (
        id INT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type ENUM('movie', 'series') NOT NULL,
        overview TEXT,
        poster_path VARCHAR(255),
        rating DECIMAL(3, 1),
        year INT,
        genres JSON,
        streaming JSON
      )
    `;
    await connection.query(createContentsTable);
    console.log('✅ Table "contents" created (or already exists).');

  } catch (err) {
    console.error('❌ Error setting up database:', err);
  } finally {
    if (connection) await connection.end();
  }
}

setupDatabase();
