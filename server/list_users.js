const pool = require('./src/config/db');

async function listUsers() {
  try {
    console.log('📋 Buscando usuários cadastrados...\n');
    
    const [users] = await pool.query('SELECT id, name, email, created_at FROM users');
    
    if (users.length === 0) {
      console.log('⚠️ Nenhum usuário encontrado.');
    } else {
      console.table(users);
    }

  } catch (error) {
    console.error('❌ Erro ao buscar usuários:', error.message);
  } finally {
    pool.end();
  }
}

listUsers();
