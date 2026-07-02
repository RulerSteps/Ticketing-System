// Perimetre complet (CRUD, workflow de statuts, commentaires, pieces jointes,
// historique) a la charge de Winter. Stub minimal fourni pour :
//  - demontrer l'integration automatique du module IA a la creation (CDC 13.6)
//  - fournir des donnees de tickets aux modules Statistiques / Affectation / Rapports
const { Ticket, Category, User, HistoriqueTicket } = require('../../models');
const asyncHandler = require('../../utils/asyncHandler');
const { analyzeTicket } = require('../ai/ai.engine');

const INCLUDE_RELATIONS = [
  { model: Category, as: 'categorie' },
  { model: User, as: 'createur', attributes: ['id', 'nom', 'email'] },
  { model: User, as: 'technicien', attributes: ['id', 'nom', 'email'] },
];

const create = asyncHandler(async (req, res) => {
  const { titre, description, categorie_id, priorite } = req.body;
  if (!titre || !description) {
    return res.status(400).json({ message: 'titre et description sont requis' });
  }

  // Declenchement automatique du module IA a la creation du ticket (CDC 13.6)
  const analyse = analyzeTicket(titre, description);

  const ticket = await Ticket.create({
    titre,
    description,
    categorie_id: categorie_id || null,
    priorite: priorite || 'moyenne',
    createur_id: req.user.id,
    statut: 'nouveau',
    ia_criticite: analyse.criticite,
    ia_justification: analyse.justification,
    ia_score: analyse.score,
  });

  await HistoriqueTicket.create({
    ticket_id: ticket.id,
    utilisateur_id: req.user.id,
    ancien_statut: null,
    nouveau_statut: 'nouveau',
    description_action: 'Creation du ticket',
  });

  const created = await Ticket.findByPk(ticket.id, { include: INCLUDE_RELATIONS });
  return res.status(201).json(created);
});

const list = asyncHandler(async (req, res) => {
  const where = {};
  if (req.query.statut) where.statut = req.query.statut;
  if (req.query.categorie_id) where.categorie_id = req.query.categorie_id;
  if (req.query.priorite) where.priorite = req.query.priorite;

  const tickets = await Ticket.findAll({
    where,
    include: INCLUDE_RELATIONS,
    order: [['date_creation', 'DESC']],
  });
  res.json(tickets);
});

const getOne = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findByPk(req.params.id, { include: INCLUDE_RELATIONS });
  if (!ticket) return res.status(404).json({ message: 'Ticket non trouve' });
  res.json(ticket);
});

module.exports = { create, list, getOne };
