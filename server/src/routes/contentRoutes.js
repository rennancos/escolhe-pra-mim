const express = require('express');
const router = express.Router();
const { getContents, getContentById } = require('../controllers/contentController');

router.get('/', getContents);
router.get('/:id', getContentById);

module.exports = router;
