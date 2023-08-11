const router = require('express').Router();

const taskController = require('../controllers/task');
const categoryController = require('../controllers/category');
const isAuth = require('../middleware/is-auth');

router.post('/task', isAuth, taskController.createTask);
router.post('/category', isAuth, categoryController.createCategory);

router.get('/category', isAuth, categoryController.getCategories);
router.get('/task', isAuth, taskController.getTasks);
router.get('/task/:id', isAuth, taskController.getTask);

module.exports = router;