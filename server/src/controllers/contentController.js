const pool = require('../config/db');

// @desc    Get all contents with optional filtering
// @route   GET /api/contents
// @access  Public
const getContents = async (req, res, next) => {
  try {
    const { type, genres, streaming } = req.query;
    
    let query = 'SELECT * FROM contents';
    const conditions = [];
    const params = [];

    // 1. Filter by Type (movie/series)
    if (type && type !== 'all') {
      conditions.push('type = ?');
      params.push(type);
    }

    // 2. Filter by Genres
    // Logic: Returns content that has AT LEAST ONE of the selected genres (OR logic)
    // To switch to AND logic (must have ALL selected genres), change ' OR ' to ' AND ' below.
    if (genres) {
      const genreList = Array.isArray(genres) ? genres : genres.split(',');
      
      if (genreList.length > 0) {
        const genreConditions = genreList.map(g => {
          // JSON_CONTAINS checks if the JSON array contains the specific string
          // We wrap the string in JSON.stringify to ensure quotes: "Action" -> '"Action"'
          return 'JSON_CONTAINS(genres, ?)';
        });
        
        conditions.push(`(${genreConditions.join(' OR ')})`);
        
        // Add parameters
        genreList.forEach(g => {
          params.push(JSON.stringify(g.trim()));
        });
      }
    }

    // 3. Filter by Streaming Platforms
    // Logic: Returns content available on AT LEAST ONE of the selected platforms
    if (streaming) {
      const streamingList = Array.isArray(streaming) ? streaming : streaming.split(',');
      
      if (streamingList.length > 0) {
        const streamingConditions = streamingList.map(s => {
          return 'JSON_CONTAINS(streaming, ?)';
        });
        
        conditions.push(`(${streamingConditions.join(' OR ')})`);
        
        streamingList.forEach(s => {
          params.push(JSON.stringify(s.trim()));
        });
      }
    }

    // Construct final query
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Debugging (Optional)
    // console.log('Query:', query);
    // console.log('Params:', params);

    const [contents] = await pool.query(query, params);
    res.status(200).json(contents);
  } catch (error) {
    next(error);
  }
};

// @desc    Get content by ID
// @route   GET /api/contents/:id
// @access  Public
const getContentById = async (req, res, next) => {
  try {
    const [contents] = await pool.query('SELECT * FROM contents WHERE id = ?', [req.params.id]);
    const content = contents[0];

    if (content) {
      res.status(200).json(content);
    } else {
      res.status(404);
      throw new Error('Content not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContents,
  getContentById,
};
