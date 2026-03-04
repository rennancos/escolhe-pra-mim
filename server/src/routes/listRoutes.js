const express = require('express');
const router = express.Router();
const { getUserLists, addToList, removeFromList } = require('../controllers/listController');
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { addToListSchema, removeFromListSchema } = require('../validators/listSchema');

// Rotas protegidas (apenas usuários logados)
router.get('/', protect, getUserLists);
router.post('/', protect, validateRequest(addToListSchema), addToList);
router.delete('/:contentId/:listType', protect, validateRequest(removeFromListSchema), removeFromList);

module.exports = router;
