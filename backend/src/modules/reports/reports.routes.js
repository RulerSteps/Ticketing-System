const router = require('express').Router();
const { summary, exportCsv } = require('./reports.controller');
const { verifyToken, requireRole } = require('../../middlewares/auth.middleware');
const { ROLES } = require('../../constants/roles');

router.get('/summary', verifyToken, requireRole(ROLES.ADMIN), summary);
router.get('/export', verifyToken, requireRole(ROLES.ADMIN), exportCsv);

module.exports = router;
