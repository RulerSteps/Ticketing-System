const router = require('express').Router();
const { create, list, getOne } = require('./tickets.controller');
const { verifyToken } = require('../../middlewares/auth.middleware');

router.post('/', verifyToken, create);
router.get('/', verifyToken, list);
router.get('/:id', verifyToken, getOne);

module.exports = router;
