const fs = require('fs');
const path = require('path');

// Caminho para o CSV
const csvPath = path.join(__dirname, 'users_export.csv');

// Ler o CSV
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.split('\n');

// Obter cabeçalhos
const headers = lines[0].split(',');

// Gerar SQL
let sql = 'INSERT INTO users (id, name, email, created_at) VALUES\n';
const values = [];

for (let i = 1; i < lines.length; i++) {
  if (lines[i].trim() === '') continue;
  
  // Parse simples de CSV (assumindo que strings estão entre aspas)
  // Nota: Em produção, use uma lib de CSV real para lidar com casos complexos
  const parts = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
  
  // Limpar aspas das strings para o SQL
  const id = parts[0];
  const name = parts[1].replace(/^"|"$/g, ''); // Remove aspas externas
  const email = parts[2].replace(/^"|"$/g, '');
  const date = parts[3];

  values.push(`(${id}, '${name}', '${email}', '${date}')`);
}

sql += values.join(',\n') + ';';

console.log('--- SQL GERADO ---');
console.log(sql);
console.log('------------------');
console.log('Copie este SQL e execute no SQLTools para importar os dados (se a tabela estiver vazia).');
