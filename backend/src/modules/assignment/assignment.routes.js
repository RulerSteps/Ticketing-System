const router = require('express').Router();
const { listUnassigned, assign } = require('./assignment.controller');
const { verifyToken, requireRole } = require('../../middlewares/auth.middleware');
const { ROLES } = require('../../constants/roles');

router.get('/unassigned', verifyToken, requireRole(ROLES.ADMIN), listUnassigned);
router.post('/:id/assign', verifyToken, requireRole(ROLES.ADMIN), assign);

module.exports = router;
