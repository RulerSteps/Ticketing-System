const router = require('express').Router();
const { list, create } = require('./categories.controller');
const { verifyToken, requireRole } = require('../../middlewares/auth.middleware');
const { ROLES } = require('../../constants/roles');

router.get('/', verifyToken, list);
router.post('/', verifyToken, requireRole(ROLES.ADMIN), create);

module.exports = router;
