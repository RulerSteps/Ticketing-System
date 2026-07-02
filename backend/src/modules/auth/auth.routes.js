const router = require('express').Router();
const { register, login, me } = require('./auth.controller');
const { verifyToken } = require('../../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, me);

module.exports = router;
