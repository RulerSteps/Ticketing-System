// Perimetre officiel (CRUD utilisateurs, roles, notifications) a la charge de
// Malick. Implementation complete fournie ici pour que UserManagement.jsx
// (deja mergee sur main) fonctionne des maintenant ; Malick pourra reprendre/
// durcir ce module (validation avancee, pagination, etc.).
const bcrypt = require('bcrypt');
const { User } = require('../../models');
const asyncHandler = require('../../utils/asyncHandler');
const { ROLES } = require('../../constants/roles');
const { serializeUser } = require('../../utils/serializers');

const list = asyncHandler(async (req, res) => {
  const where = {};
  if (req.query.role) where.role = req.query.role;

  const users = await User.findAll({ where, order: [['nom', 'ASC']] });
  res.json(users.map(serializeUser));
});

// Route dediee attendue par le client frontend (frontend/src/services/ahmaApi.js: getTechnicians)
const listTechnicians = asyncHandler(async (req, res) => {
  const users = await User.findAll({
    where: { role: ROLES.TECHNICIEN, actif: true },
    order: [['nom', 'ASC']],
  });
  res.json(users.map(serializeUser));
});

const create = asyncHandler(async (req, res) => {
  const { name, email, role, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email et password sont requis' });
  }

  const existant = await User.findOne({ where: { email } });
  if (existant) return res.status(409).json({ message: 'Cet email est deja utilise' });

  const mot_de_passe = await bcrypt.hash(password, 12);
  const user = await User.create({ nom: name, email, mot_de_passe, role: role || ROLES.UTILISATEUR });

  res.status(201).json(serializeUser(user));
});

const update = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouve' });

  const { name, email, role, password } = req.body;
  if (name !== undefined) user.nom = name;
  if (email !== undefined) user.email = email;
  if (role !== undefined) user.role = role;
  if (password) user.mot_de_passe = await bcrypt.hash(password, 12);
  await user.save();

  res.json(serializeUser(user));
});

const toggleStatus = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouve' });

  user.actif = !user.actif;
  await user.save();

  res.json(serializeUser(user));
});

module.exports = { list, listTechnicians, create, update, toggleStatus };
