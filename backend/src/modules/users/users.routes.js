const router = require('express').Router();
const { list, listTechnicians, create, update, toggleStatus } = require('./users.controller');
const { verifyToken, requireRole } = require('../../middlewares/auth.middleware');
const { ROLES } = require('../../constants/roles');

// Montee avant "/:id" pour eviter tout conflit de routage
router.get('/technicians', verifyToken, requireRole(ROLES.ADMIN), listTechnicians);
router.get('/', verifyToken, requireRole(ROLES.ADMIN), list);
router.post('/', verifyToken, requireRole(ROLES.ADMIN), create);
router.put('/:id', verifyToken, requireRole(ROLES.ADMIN), update);
router.patch('/:id/toggle-status', verifyToken, requireRole(ROLES.ADMIN), toggleStatus);

module.exports = router;
