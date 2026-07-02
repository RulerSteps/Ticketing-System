const router = require('express').Router();
const { list } = require('./users.controller');
const { verifyToken, requireRole } = require('../../middlewares/auth.middleware');
const { ROLES } = require('../../constants/roles');

router.get('/', verifyToken, requireRole(ROLES.ADMIN), list);

module.exports = router;
