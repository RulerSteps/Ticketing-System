// Perimetre complet (CRUD categories) a la charge de Malick.
// Stub minimal fourni pour permettre la creation de tickets et les stats par categorie.
const { Category } = require('../../models');
const asyncHandler = require('../../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const categories = await Category.findAll({ order: [['nom', 'ASC']] });
  res.json(categories);
});

const create = asyncHandler(async (req, res) => {
  const { nom, description } = req.body;
  if (!nom) return res.status(400).json({ message: 'nom est requis' });
  const category = await Category.create({ nom, description });
  res.status(201).json(category);
});

module.exports = { list, create };
