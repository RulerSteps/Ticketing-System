// API statistiques (CDC 2.1.7 / 5.5) — tickets par statut, categorie, technicien,
// avec filtres optionnels par periode / categorie / technicien.
const { Op, fn, col } = require('sequelize');
const { Ticket, Category, User } = require('../../models');
const asyncHandler = require('../../utils/asyncHandler');

// Construit la clause WHERE commune a partir des filtres de la query string.
function buildFilters(query) {
  const where = {};
  if (query.date_debut || query.date_fin) {
    where.date_creation = {};
    if (query.date_debut) where.date_creation[Op.gte] = new Date(query.date_debut);
    if (query.date_fin) where.date_creation[Op.lte] = new Date(query.date_fin);
  }
  if (query.categorie_id) where.categorie_id = query.categorie_id;
  if (query.technicien_id) where.technicien_id = query.technicien_id;
  return where;
}

// Forme de reponse attendue par DashboardAdmin.jsx (frontend/src/services/ahmaApi.js: getStats)
const overview = asyncHandler(async (req, res) => {
  const where = buildFilters(req.query);

  const [total, ouverts, enCours, resolus, parCategorie] = await Promise.all([
    Ticket.count({ where }),
    Ticket.count({ where: { ...where, statut: 'nouveau' } }),
    Ticket.count({ where: { ...where, statut: { [Op.in]: ['assigne', 'en_cours', 'en_attente'] } } }),
    Ticket.count({ where: { ...where, statut: { [Op.in]: ['resolu', 'ferme'] } } }),
    Ticket.findAll({
      where,
      attributes: ['categorie_id', [fn('COUNT', col('Ticket.id')), 'count']],
      include: [{ model: Category, as: 'categorie', attributes: ['nom'] }],
      group: ['categorie_id', 'categorie.id'],
    }),
  ]);

  // Evolution sur les 7 derniers jours (widget "byDay" du dashboard)
  const septJoursAvant = new Date();
  septJoursAvant.setDate(septJoursAvant.getDate() - 6);
  septJoursAvant.setHours(0, 0, 0, 0);

  const ticketsRecents = await Ticket.findAll({
    where: { date_creation: { [Op.gte]: septJoursAvant } },
    attributes: ['date_creation'],
    raw: true,
  });

  const byDay = [];
  for (let i = 6; i >= 0; i -= 1) {
    const jour = new Date();
    jour.setDate(jour.getDate() - i);
    const label = jour.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '');
    const count = ticketsRecents.filter(
      (t) => new Date(t.date_creation).toDateString() === jour.toDateString()
    ).length;
    byDay.push({ date: label.charAt(0).toUpperCase() + label.slice(1), count });
  }

  res.json({
    total,
    open: ouverts,
    inProgress: enCours,
    resolved: resolus,
    byCategory: parCategorie.map((row) => ({
      name: row.categorie ? row.categorie.nom : 'Non classe',
      count: Number(row.get('count')),
    })),
    byDay,
  });
});

const byCategory = asyncHandler(async (req, res) => {
  const where = buildFilters(req.query);

  const resultats = await Ticket.findAll({
    where,
    attributes: ['categorie_id', [fn('COUNT', col('Ticket.id')), 'total']],
    include: [{ model: Category, as: 'categorie', attributes: ['nom'] }],
    group: ['categorie_id', 'categorie.id'],
  });

  res.json(resultats);
});

const byTechnician = asyncHandler(async (req, res) => {
  const where = { ...buildFilters(req.query), technicien_id: { [Op.ne]: null } };

  const [totaux, resolus] = await Promise.all([
    Ticket.findAll({
      where,
      attributes: ['technicien_id', [fn('COUNT', col('Ticket.id')), 'total']],
      include: [{ model: User, as: 'technicien', attributes: ['nom', 'email'] }],
      group: ['technicien_id', 'technicien.id'],
    }),
    Ticket.findAll({
      where: { ...where, statut: 'resolu' },
      attributes: ['technicien_id', [fn('COUNT', col('Ticket.id')), 'resolus']],
      group: ['technicien_id'],
      raw: true,
    }),
  ]);

  const resolusParTechnicien = new Map(resolus.map((r) => [r.technicien_id, Number(r.resolus)]));

  const resultats = totaux.map((t) => ({
    technicien_id: t.technicien_id,
    technicien: t.technicien,
    total: Number(t.get('total')),
    resolus: resolusParTechnicien.get(t.technicien_id) || 0,
  }));

  res.json(resultats);
});

module.exports = { overview, byCategory, byTechnician };
