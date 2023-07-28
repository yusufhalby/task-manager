const router = require('express').Router();

const taskRoutes = require('../controllers/task');
const categoryRoutes = require('../controllers/category');

router.post('/task', taskRoutes.createTask);
router.post('/category', categoryRoutes.createCategory);

module.exports = router;