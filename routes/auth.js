const router = require('express').Router();
const {
    body
} = require('express-validator');

const authController
 = require('../controllers/auth');

router.put('/signup',
    [
        body('email')
        .trim()
        .isEmail().withMessage('Please enter a valid email.')
        .normalizeEmail(),
        body('password')
        .trim()
        // .notEmpty().withMessage('Password cannot be empty.')
        .isLength({
            min: 6,
            max: 72
        }).withMessage('Password must be between 6 and 72 characters.'),
        body('name')
        .trim()
        .notEmpty().withMessage('Name cannot be empty.')
    ],
    authController
    .createUser);

router.post('/signin',
    [
        body('email')
        .trim()
        .isEmail().withMessage('Please enter a valid email.')
        .normalizeEmail(),
        body('password')
        .trim()
        .isLength({
            min: 6,
            max: 72
        }).withMessage('Password is between 6 and 72 characters.')
    ],
    authController
    .postSignIn);

router.get('/verify/:token', authController
.getVerify);
router.get('/verify/resend/:id', authController
.getResend);


module.exports = router;