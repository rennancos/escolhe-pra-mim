const pool = require('../config/db');
const { LIST_TYPES } = require('../utils/constants');

class ListService {
  /**
   * Obtém todas as listas de um usuário
   * @param {string} userId
   * @returns {Promise<{watchlist: Array, watched: Array}>}
   */
  async getUserLists(userId) {
    const [rows] = await pool.query(
      `SELECT ul.list_type, ul.added_at, c.* 
       FROM user_lists ul
       JOIN contents c ON ul.content_id = c.id
       WHERE ul.user_id = ?`,
      [userId]
    );

    const watchlist = [];
    const watched = [];

    rows.forEach(row => {
      const content = {
        id: row.id,
        title: row.title,
        type: row.type,
        overview: row.overview,
        poster_path: row.poster_path,
        rating: row.rating,
        year: row.year,
        genres: row.genres,
        streaming: row.streaming
      };

      const item = {
        content,
        addedAt: row.added_at
      };

      if (row.list_type === LIST_TYPES.WATCHLIST) {
        watchlist.push(item);
      } else {
        watched.push(item);
      }
    });

    return { watchlist, watched };
  }

  /**
   * Adiciona um item à lista (e salva o conteúdo se necessário)
   * @param {string} userId
   * @param {Object} content
   * @param {string} listType
   */
  async addToList(userId, content, listType) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Garantir que o conteúdo existe na tabela contents
      const genresJson = JSON.stringify(content.genres || []);
      const streamingJson = JSON.stringify(content.streaming || []);
      
      await connection.query(
        `INSERT INTO contents (id, title, type, overview, poster_path, rating, year, genres, streaming)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title=VALUES(title)`,
        [
          content.id,
          content.title,
          content.type,
          content.overview || '',
          content.poster_path || content.posterPath,
          content.rating || 0,
          content.year || 0,
          genresJson,
          streamingJson
        ]
      );

      // 2. Se for adicionar aos 'watched', remover da 'watchlist' (regra de negócio)
      if (listType === LIST_TYPES.WATCHED) {
        await connection.query(
          'DELETE FROM user_lists WHERE user_id = ? AND content_id = ? AND list_type = ?',
          [userId, content.id, LIST_TYPES.WATCHLIST]
        );
      }

      // 3. Inserir na lista desejada
      await connection.query(
        `INSERT IGNORE INTO user_lists (user_id, content_id, list_type)
         VALUES (?, ?, ?)`,
        [userId, content.id, listType]
      );

      await connection.commit();
      return true;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Remove um item da lista
   * @param {string} userId
   * @param {string} contentId
   * @param {string} listType
   */
  async removeFromList(userId, contentId, listType) {
    await pool.query(
      'DELETE FROM user_lists WHERE user_id = ? AND content_id = ? AND list_type = ?',
      [userId, contentId, listType]
    );
    return true;
  }
}

module.exports = new ListService();
