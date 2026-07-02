// API rapports — indicateurs de performance (temps moyen de resolution, volumes
// resolus/fermes sur une periode) + export CSV des tickets.
const { Op, fn, col, literal } = require('sequelize');
const { Ticket, Category, User } = require('../../models');
const asyncHandler = require('../../utils/asyncHandler');

function buildPeriodFilter(query) {
  const where = {};
  if (query.date_debut || query.date_fin) {
    where.date_creation = {};
    if (query.date_debut) where.date_creation[Op.gte] = new Date(query.date_debut);
    if (query.date_fin) where.date_creation[Op.lte] = new Date(query.date_fin);
  }
  return where;
}

const summary = asyncHandler(async (req, res) => {
  const where = buildPeriodFilter(req.query);

  const [totalCree, totalResolu, totalFerme, dureeMoyenneRow] = await Promise.all([
    Ticket.count({ where }),
    Ticket.count({ where: { ...where, statut: 'resolu' } }),
    Ticket.count({ where: { ...where, statut: 'ferme' } }),
    Ticket.findOne({
      where: { ...where, date_resolution: { [Op.ne]: null } },
      attributes: [
        [fn('AVG', literal('TIMESTAMPDIFF(HOUR, date_creation, date_resolution)')), 'moyenne_heures'],
      ],
      raw: true,
    }),
  ]);

  res.json({
    total_tickets_crees: totalCree,
    total_resolus: totalResolu,
    total_fermes: totalFerme,
    temps_moyen_resolution_heures: dureeMoyenneRow?.moyenne_heures
      ? Math.round(Number(dureeMoyenneRow.moyenne_heures) * 10) / 10
      : null,
  });
});

const exportCsv = asyncHandler(async (req, res) => {
  const where = buildPeriodFilter(req.query);

  const tickets = await Ticket.findAll({
    where,
    include: [
      { model: Category, as: 'categorie', attributes: ['nom'] },
      { model: User, as: 'technicien', attributes: ['nom'] },
    ],
    order: [['date_creation', 'DESC']],
  });

  const entetes = [
    'id',
    'titre',
    'statut',
    'priorite',
    'categorie',
    'technicien',
    'ia_criticite',
    'ia_score',
    'date_creation',
    'date_resolution',
  ];

  const echapperCsv = (valeur) => `"${String(valeur ?? '').replace(/"/g, '""')}"`;

  const lignes = tickets.map((t) =>
    [
      t.id,
      t.titre,
      t.statut,
      t.priorite,
      t.categorie?.nom,
      t.technicien?.nom,
      t.ia_criticite,
      t.ia_score,
      t.date_creation?.toISOString(),
      t.date_resolution?.toISOString(),
    ]
      .map(echapperCsv)
      .join(',')
  );

  const csv = [entetes.join(','), ...lignes].join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="rapport_tickets.csv"');
  res.send(csv);
});

module.exports = { summary, exportCsv };
