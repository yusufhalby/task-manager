const router = require('express').Router();

const taskRoutes = require('../controllers/task');
const categoryRoutes = require('../controllers/category');

router.post('/task', taskRoutes.createTask);
router.post('/category', categoryRoutes.createCategory);

router.get('/category', categoryRoutes.getCategories);
router.get('/task', taskRoutes.getTasks);
router.get('/task/:id', taskRoutes.getTask);

module.exports = router;