const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuração do banco
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'escolher_pra_mim',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Mapa de Imagens conhecidas (do seed.sql original)
const knownPosters = {
  1: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
  2: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
  3: 'https://image.tmdb.org/t/p/w500/gEU2QniL6E8ahDaX06e8q288UL.jpg',
  4: 'https://image.tmdb.org/t/p/w500/uOVpJ62Q8f6t7yL023J3b5h9W6.jpg',
  5: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
  6: 'https://image.tmdb.org/t/p/w500/stTEycfG9928iv8tDAI5VXVMSCM.jpg',
  7: 'https://image.tmdb.org/t/p/w500/t9O11L9a75r0WfB66Y0eZ6b0w6.jpg',
  8: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
  9: 'https://image.tmdb.org/t/p/w500/lDqMDI3xpbB9UprweTBcdnZUBFc.jpg',
  10: 'https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPzCwnTESEK5s.jpg'
};

async function populate() {
  try {
    // Ler o mockCatalog
    const mockPath = path.join(__dirname, '../app/src/data/mockCatalog.json');
    const mockData = JSON.parse(fs.readFileSync(mockPath, 'utf8'));
    
    const allContent = [...mockData.movies, ...mockData.series];
    
    console.log(`Lidos ${allContent.length} itens do mock.`);

    // Limpar tabela atual (DELETE instead of TRUNCATE due to FK)
    console.log('Limpando tabela contents...');
    // Opcional: Limpar user_lists primeiro para garantir, mas CASCADE deve cuidar disso
    await pool.query('DELETE FROM contents');

    // Inserir itens
    console.log('Inserindo itens...');
    let insertedCount = 0;

    for (const item of allContent) {
      // Tenta pegar imagem conhecida ou usa null
      const poster = knownPosters[item.id] || item.poster_path || null;
      
      // Converter arrays para JSON string
      const genresJson = JSON.stringify(item.genres || []);
      const streamingJson = JSON.stringify(item.streaming || []);

      await pool.query(
        `INSERT INTO contents 
        (id, title, type, overview, poster_path, rating, year, genres, streaming) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.title,
          item.type,
          item.overview || '',
          poster,
          item.rating || 0,
          item.year || 0,
          genresJson,
          streamingJson
        ]
      );
      insertedCount++;
    }

    console.log(`✅ Sucesso! ${insertedCount} itens inseridos no banco.`);

  } catch (error) {
    console.error('❌ Erro ao popular banco:', error);
  } finally {
    pool.end();
  }
}

populate();
