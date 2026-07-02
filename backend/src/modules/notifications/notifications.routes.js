const router = require('express').Router();
const { list, markAsRead } = require('./notifications.controller');
const { verifyToken } = require('../../middlewares/auth.middleware');

router.get('/', verifyToken, list);
router.patch('/:id/read', verifyToken, markAsRead);

module.exports = router;
