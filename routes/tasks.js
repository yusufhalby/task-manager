const router = require('express').Router();

const taskRoutes = require('../controllers/task');
const categoryRoutes = require('../controllers/category');
const isAuth = require('../middleware/is-auth');

router.post('/task', isAuth, taskRoutes.createTask);
router.post('/category', isAuth, categoryRoutes.createCategory);

router.get('/category', isAuth, categoryRoutes.getCategories);
router.get('/task', isAuth, taskRoutes.getTasks);
router.get('/task/:id', isAuth, taskRoutes.getTask);

module.exports = router;