const router = require('express').Router();

const authRoutes = require('../controllers/auth');

router.put('/signup', authRoutes.createUser);
router.post('/signin', authRoutes.postSignIn);

module.exports = router;