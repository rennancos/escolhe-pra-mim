const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  console.log('Tentando conectar com:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ? '****' : '(empty)',
    database: process.env.DB_NAME
  });

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    console.log('✅ Conexão bem sucedida!');
    await connection.end();
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message);
    console.error('Código do erro:', error.code);
  }
}

testConnection();
