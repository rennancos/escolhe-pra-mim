const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

// Gera um usuário aleatório
const randomId = Math.floor(Math.random() * 10000);
const newUser = {
  name: `User Test ${randomId}`,
  email: `test${randomId}@example.com`,
  password: 'password123'
};

async function testAuthFlow() {
  console.log('🚀 Iniciando teste de fluxo de autenticação...\n');

  try {
    // 1. Registrar Usuário
    console.log(`1️⃣ Tentando registrar usuário: ${newUser.email}...`);
    const registerRes = await axios.post(`${API_URL}/users`, newUser);
    console.log('✅ Registro com sucesso!');
    console.log('   Resposta:', registerRes.data);
    
    const token = registerRes.data.token;
    if (!token) {
      console.error('❌ ERRO: Token não retornado no registro!');
      return;
    }
    console.log('🔑 Token recebido no registro.\n');

    // 2. Testar Login (opcional, pois registro já loga, mas bom validar)
    console.log(`2️⃣ Tentando fazer login com: ${newUser.email}...`);
    const loginRes = await axios.post(`${API_URL}/login`, {
      email: newUser.email,
      password: newUser.password
    });
    console.log('✅ Login com sucesso!');
    console.log('   Token de login:', loginRes.data.token ? 'Presente' : 'Ausente');
    console.log('\n');

    // 3. Acessar Rota Protegida (/api/me)
    console.log('3️⃣ Testando acesso à rota protegida (/api/me)...');
    const meRes = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}` // Envia o token no header
      }
    });
    console.log('✅ Acesso autorizado!');
    console.log('   Dados do usuário logado:', meRes.data);

  } catch (error) {
    console.error('❌ ERRO no teste:', error.response ? error.response.data : error.message);
  }
}

testAuthFlow();
