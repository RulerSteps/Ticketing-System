const router = require('express').Router();

router.use('/auth', require('../modules/auth/auth.routes'));
router.use('/categories', require('../modules/categories/categories.routes'));
router.use('/users', require('../modules/users/users.routes'));
router.use('/notifications', require('../modules/notifications/notifications.routes'));

// Attention a l'ordre : les routes d'affectation (/tickets/unassigned, /tickets/:id/assign)
// sont montees avant le routeur CRUD general des tickets pour eviter que
// GET /tickets/:id n'intercepte "/unassigned".
router.use('/tickets', require('../modules/assignment/assignment.routes'));
router.use('/tickets', require('../modules/tickets/tickets.routes'));

router.use('/stats', require('../modules/stats/stats.routes'));
router.use('/reports', require('../modules/reports/reports.routes'));

module.exports = router;
