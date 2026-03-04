const pool = require('./config/db');

async function checkIndexes() {
  try {
    const [rows] = await pool.query("SHOW INDEX FROM user_lists");
    console.log('Índices atuais na tabela user_lists:');
    console.table(rows.map(row => ({
      Key_name: row.Key_name,
      Column_name: row.Column_name,
      Seq_in_index: row.Seq_in_index
    })));
    process.exit(0);
  } catch (error) {
    console.error('Erro ao verificar índices:', error);
    process.exit(1);
  }
}

checkIndexes();
