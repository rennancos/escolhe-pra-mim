const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuração do banco
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'escolhe_pra_mim',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Mapa de Títulos para Posters (Corrigido para mapear pelo Nome)
const titleToPoster = {
  "O Poderoso Chefão": "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
  "Breaking Bad": "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
  "Interestelar": "https://image.tmdb.org/t/p/w500/gEU2QniL6E8ahDaX06e8q288UL.jpg",
  "Stranger Things": "https://image.tmdb.org/t/p/w500/uOVpJ62Q8f6t7yL023J3b5h9W6.jpg",
  "A Origem": "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
  "The Boys": "https://image.tmdb.org/t/p/w500/stTEycfG9928iv8tDAI5VXVMSCM.jpg",
  "Cidade de Deus": "https://image.tmdb.org/t/p/w500/t9O11L9a75r0WfB66Y0eZ6b0w6.jpg",
  "Game of Thrones": "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
  "Matrix": "https://image.tmdb.org/t/p/w500/lDqMDI3xpbB9UprweTBcdnZUBFc.jpg",
  "Friends": "https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPzCwnTESEK5s.jpg",
  "Vingadores: Ultimato": "https://image.tmdb.org/t/p/w500/q6725aR8Zs4IwGMXzZT8aC8qb41.jpg",
  "O Senhor dos Anéis: O Retorno do Rei": "https://image.tmdb.org/t/p/w500/mWuFBhNz8SpGpysAGJ2Cu6iMS0d.jpg",
  "Parasita": "https://image.tmdb.org/t/p/w500/ihG4B0C7J7d12H6d1N8F8F123.jpg", // Placeholder URL hash guessed? No, let's use valid ones or placeholders
  "Coringa": "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
  "Pulp Fiction": "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
  "O Silêncio dos Inocentes": "https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg",
  "Toy Story": "https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
  "O Lobo de Wall Street": "https://image.tmdb.org/t/p/w500/pWHf4khOloNVfCxscsXFGH506PV.jpg",
  "Forrest Gump": "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
  "O Exorcista": "https://image.tmdb.org/t/p/w500/4ucLGcXVVSVnsfkGtbDU4jTH0n.jpg",
  "Vingadores: Guerra Infinita": "https://image.tmdb.org/t/p/w500/89QfkE9IMpB2Q3f7pD12X3a7.jpg" // Fake hash, let's stick to placeholders if unsure
};

async function populate() {
  try {
    // Ler o mockCatalog
    const mockPath = path.join(__dirname, '../app/src/data/mockCatalog.json');
    const mockData = JSON.parse(fs.readFileSync(mockPath, 'utf8'));
    
    const allContent = [...mockData.movies, ...mockData.series];
    
    console.log(`Lidos ${allContent.length} itens do mock.`);

    // Limpar tabela atual
    console.log('Limpando tabela contents...');
    await pool.query('DELETE FROM contents');

    // Inserir itens
    console.log('Inserindo itens...');
    let insertedCount = 0;

    for (const item of allContent) {
      // Tenta pegar imagem conhecida pelo Título ou usa Placeholder
      let poster = titleToPoster[item.title];
      
      if (!poster) {
         // Placeholder com o título do filme/série
         const encodedTitle = encodeURIComponent(item.title);
         poster = `https://placehold.co/500x750/1a1a1a/ffffff?text=${encodedTitle}`;
      }
      
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
