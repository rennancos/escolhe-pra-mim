const axios = require('axios');

async function testRegistration() {
  const url = 'http://localhost:3000/api/users';
  const userData = {
    name: 'Test User ' + Date.now(),
    email: `test${Date.now()}@example.com`,
    password: 'password123'
  };

  try {
    console.log('Tentando registrar:', userData);
    const response = await axios.post(url, userData);
    console.log('Sucesso:', response.status, response.data);
  } catch (error) {
    if (error.response) {
        console.error('Erro na resposta:', error.response.status, error.response.data);
    } else {
        console.error('Erro:', error.message);
    }
  }
}

testRegistration();
