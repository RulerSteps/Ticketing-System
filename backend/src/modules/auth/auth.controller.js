// Base d'authentification (JWT) - perimetre complet (inscription, verrouillage de
// compte, reinitialisation par email) a finaliser par Lamine. Fournie ici uniquement
// pour permettre de tester les routes protegees des autres modules.
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const asyncHandler = require('../../utils/asyncHandler');

const MAX_TENTATIVES = 5;

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role, nom: user.nom }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  });
}

const register = asyncHandler(async (req, res) => {
  const { nom, email, mot_de_passe, role } = req.body;
  if (!nom || !email || !mot_de_passe) {
    return res.status(400).json({ message: 'nom, email et mot_de_passe sont requis' });
  }

  const existant = await User.findOne({ where: { email } });
  if (existant) {
    return res.status(409).json({ message: 'Cet email est deja utilise' });
  }

  const hash = await bcrypt.hash(mot_de_passe, 12);
  const user = await User.create({ nom, email, mot_de_passe: hash, role: role || 'utilisateur' });

  return res.status(201).json({
    id: user.id,
    nom: user.nom,
    email: user.email,
    role: user.role,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, mot_de_passe } = req.body;
  if (!email || !mot_de_passe) {
    return res.status(400).json({ message: 'email et mot_de_passe sont requis' });
  }

  const user = await User.findOne({ where: { email } });
  if (!user || !user.actif) {
    return res.status(401).json({ message: 'Identifiants incorrects' });
  }

  if (user.bloque_jusqua && new Date(user.bloque_jusqua) > new Date()) {
    return res.status(423).json({ message: 'Compte temporairement bloque, reessayez plus tard' });
  }

  const motDePasseValide = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
  if (!motDePasseValide) {
    user.tentatives_echouees += 1;
    if (user.tentatives_echouees >= MAX_TENTATIVES) {
      user.bloque_jusqua = new Date(Date.now() + 15 * 60 * 1000); // blocage 15 min
      user.tentatives_echouees = 0;
    }
    await user.save();
    return res.status(401).json({ message: 'Identifiants incorrects' });
  }

  user.tentatives_echouees = 0;
  user.bloque_jusqua = null;
  await user.save();

  return res.json({
    token: signToken(user),
    user: { id: user.id, nom: user.nom, email: user.email, role: user.role },
  });
});

const me = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: { exclude: ['mot_de_passe'] } });
  return res.json(user);
});

module.exports = { register, login, me };
