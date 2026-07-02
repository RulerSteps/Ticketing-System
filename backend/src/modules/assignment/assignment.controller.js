// API affectation des tickets (CDC 4.3) — priorisation assistee par les scores IA.
const { Ticket, Category, User, HistoriqueTicket, Notification } = require('../../models');
const asyncHandler = require('../../utils/asyncHandler');
const { ROLES } = require('../../constants/roles');

const listUnassigned = asyncHandler(async (req, res) => {
  const tickets = await Ticket.findAll({
    where: { technicien_id: null },
    include: [
      { model: Category, as: 'categorie' },
      { model: User, as: 'createur', attributes: ['id', 'nom', 'email'] },
    ],
    // Tri par criticite IA decroissante, puis par anciennete (CDC 13.2 etape 4)
    order: [
      ['ia_score', 'DESC'],
      ['date_creation', 'ASC'],
    ],
  });
  res.json(tickets);
});

const assign = asyncHandler(async (req, res) => {
  const { technicien_id } = req.body;
  if (!technicien_id) {
    return res.status(400).json({ message: 'technicien_id est requis' });
  }

  const ticket = await Ticket.findByPk(req.params.id);
  if (!ticket) return res.status(404).json({ message: 'Ticket non trouve' });

  const technicien = await User.findByPk(technicien_id);
  if (!technicien || technicien.role !== ROLES.TECHNICIEN) {
    return res.status(400).json({ message: 'Technicien invalide' });
  }

  const ancienStatut = ticket.statut;
  ticket.technicien_id = technicien.id;
  ticket.statut = 'assigne';
  await ticket.save();

  await HistoriqueTicket.create({
    ticket_id: ticket.id,
    utilisateur_id: req.user.id,
    ancien_statut: ancienStatut,
    nouveau_statut: 'assigne',
    description_action: `Ticket affecte a ${technicien.nom}`,
  });

  await Notification.create({
    utilisateur_id: technicien.id,
    ticket_id: ticket.id,
    message: `Un ticket vous a ete affecte : "${ticket.titre}"`,
  });

  const updated = await Ticket.findByPk(ticket.id, {
    include: [
      { model: Category, as: 'categorie' },
      { model: User, as: 'technicien', attributes: ['id', 'nom', 'email'] },
    ],
  });
  res.json(updated);
});

module.exports = { listUnassigned, assign };
