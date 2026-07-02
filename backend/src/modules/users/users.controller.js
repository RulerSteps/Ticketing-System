// Perimetre complet (CRUD utilisateurs, roles, notifications) a la charge de Malick.
// Stub minimal fourni pour permettre l'affectation des tickets (liste des techniciens).
const { User } = require('../../models');
const asyncHandler = require('../../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const where = {};
  if (req.query.role) where.role = req.query.role;

  const users = await User.findAll({
    where,
    attributes: { exclude: ['mot_de_passe'] },
    order: [['nom', 'ASC']],
  });
  res.json(users);
});

module.exports = { list };
