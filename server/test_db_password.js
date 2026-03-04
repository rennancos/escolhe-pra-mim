const mysql = require('mysql2/promise');
require('dotenv').config();

// Tenta conectar SEM senha primeiro
async function testConnection(password = '') {
  console.log(`🔌 Testando conexão com senha: "${password}"...`);
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: password,
    });
    console.log('✅ SUCESSO! Conexão estabelecida.');
    console.log('---');
    console.log(`A senha correta é: "${password}"`);
    console.log('Atualize seu arquivo .env com essa senha.');
    await connection.end();
    return true;
  } catch (err) {
    console.log(`❌ FALHA: ${err.message}`);
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('   (Senha incorreta ou usuário sem permissão)');
    }
    return false;
  }
}

// Executa o teste
(async () => {
  // Teste 1: Senha vazia
  const success = await testConnection('');
  
  if (!success) {
    console.log('\n⚠️  O MySQL requer uma senha.');
    console.log('Por favor, edite o arquivo .env em "server/.env" e coloque a senha correta em DB_PASSWORD.');
  }
})();
