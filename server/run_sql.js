const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

(async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    multipleStatements: true // Enable multiple statements
  });

  try {
    const sqlPath = path.join(__dirname, '../app/banco/mybank.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('🚀 Executing SQL script...');
    await connection.query(sql);
    console.log('✅ Database migrated successfully!');
  } catch (err) {
    console.error('❌ Error executing SQL:', err.message);
  } finally {
    await connection.end();
  }
})();
