const router = require('express').Router();
const { overview, byCategory, byTechnician } = require('./stats.controller');
const { verifyToken, requireRole } = require('../../middlewares/auth.middleware');
const { ROLES } = require('../../constants/roles');

router.get('/overview', verifyToken, requireRole(ROLES.ADMIN), overview);
router.get('/by-category', verifyToken, requireRole(ROLES.ADMIN), byCategory);
router.get('/by-technician', verifyToken, requireRole(ROLES.ADMIN), byTechnician);

module.exports = router;
