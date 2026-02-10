
const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'escolher_pra_mim',
    });

    const [rows] = await pool.query('SELECT COUNT(*) as count FROM contents');
    console.log('Contents count:', rows[0].count);
    
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log('Users count:', users[0].count);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
