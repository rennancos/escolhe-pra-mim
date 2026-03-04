const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

(async () => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SHOW DATABASES');
    console.log('Databases found:', rows.map(row => row.Database));
  } catch (err) {
    console.error('Database connection error:', err.message);
  } finally {
    if (connection) await connection.end();
  }
})();
