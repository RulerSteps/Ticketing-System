const router = require('express').Router();
const { list, create, update, remove } = require('./categories.controller');
const { verifyToken, requireRole } = require('../../middlewares/auth.middleware');
const { ROLES } = require('../../constants/roles');

router.get('/', verifyToken, list);
router.post('/', verifyToken, requireRole(ROLES.ADMIN), create);
router.put('/:id', verifyToken, requireRole(ROLES.ADMIN), update);
router.delete('/:id', verifyToken, requireRole(ROLES.ADMIN), remove);

module.exports = router;
