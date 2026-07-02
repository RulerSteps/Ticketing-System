const router = require('express').Router();
const { listUnassigned, assign } = require('./assignment.controller');
const { verifyToken, requireRole } = require('../../middlewares/auth.middleware');
const { ROLES } = require('../../constants/roles');

router.get('/unassigned', verifyToken, requireRole(ROLES.ADMIN), listUnassigned);
// Methode PUT pour matcher le client frontend (frontend/src/services/ahmaApi.js: assignTicket)
router.put('/:id/assign', verifyToken, requireRole(ROLES.ADMIN), assign);

module.exports = router;
