const listService = require('../services/listService');

// Obter todas as listas do usuário
exports.getUserLists = async (req, res) => {
  const userId = req.user.id;

  try {
    const lists = await listService.getUserLists(userId);
    res.json(lists);
  } catch (error) {
    console.error('Error fetching user lists:', error);
    res.status(500).json({ message: 'Erro ao buscar listas' });
  }
};

// Adicionar item à lista
exports.addToList = async (req, res) => {
  const userId = req.user.id;
  const { content, listType } = req.body;

  try {
    await listService.addToList(userId, content, listType);
    res.status(201).json({ message: 'Adicionado com sucesso' });
  } catch (error) {
    console.error('Error adding to list:', error);
    res.status(500).json({ message: 'Erro ao adicionar à lista' });
  }
};

// Remover item da lista
exports.removeFromList = async (req, res) => {
  const userId = req.user.id;
  const { contentId, listType } = req.params;

  try {
    await listService.removeFromList(userId, contentId, listType);
    res.json({ message: 'Removido com sucesso' });
  } catch (error) {
    console.error('Error removing from list:', error);
    res.status(500).json({ message: 'Erro ao remover da lista' });
  }
};
