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

const overview = asyncHandler(async (req, res) => {
  const where = buildFilters(req.query);

  const [total, parStatut, parPriorite, parCriticiteIA] = await Promise.all([
    Ticket.count({ where }),
    Ticket.findAll({ where, attributes: ['statut', [fn('COUNT', col('id')), 'total']], group: ['statut'] }),
    Ticket.findAll({ where, attributes: ['priorite', [fn('COUNT', col('id')), 'total']], group: ['priorite'] }),
    Ticket.findAll({
      where: { ...where, ia_criticite: { [Op.ne]: null } },
      attributes: ['ia_criticite', [fn('COUNT', col('id')), 'total']],
      group: ['ia_criticite'],
    }),
  ]);

  res.json({
    total,
    par_statut: parStatut,
    par_priorite: parPriorite,
    par_criticite_ia: parCriticiteIA,
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
