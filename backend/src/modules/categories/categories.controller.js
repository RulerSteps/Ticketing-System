// Perimetre officiel (CRUD categories) a la charge de Malick.
// Implementation complete fournie ici pour que la page CategoryManagement.jsx
// (deja mergee sur main, cf. frontend/src/pages/admin/CategoryManagement.jsx)
// fonctionne des maintenant ; Malick pourra reprendre/durcir ce module.
const { Category } = require('../../models');
const asyncHandler = require('../../utils/asyncHandler');
const { serializeCategory } = require('../../utils/serializers');

const list = asyncHandler(async (req, res) => {
  const categories = await Category.findAll({ order: [['nom', 'ASC']] });
  res.json(categories.map(serializeCategory));
});

const create = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: 'name est requis' });
  const category = await Category.create({ nom: name, description });
  res.status(201).json(serializeCategory(category));
});

const update = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) return res.status(404).json({ message: 'Categorie non trouvee' });

  const { name, description } = req.body;
  if (name !== undefined) category.nom = name;
  if (description !== undefined) category.description = description;
  await category.save();

  res.json(serializeCategory(category));
});

const remove = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) return res.status(404).json({ message: 'Categorie non trouvee' });

  await category.destroy();
  res.status(204).send();
});

module.exports = { list, create, update, remove };
