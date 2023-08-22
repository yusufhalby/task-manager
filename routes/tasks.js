const router = require('express').Router();

const taskController = require('../controllers/task');
const categoryController = require('../controllers/category');
const isAuth = require('../middleware/is-auth');

const config = require('../util/config');
const multer = require('multer');
const {initializeApp} = require('firebase/app');
const {getStorage, ref, getDownloadURL, uploadBytesResumable} = require('firebase/storage');

initializeApp(config.firebaseConfig);
const storage = getStorage();
const upload = multer({storage: multer.memoryStorage()});

router.post('/task', isAuth, taskController.createTask);
router.post('/category', isAuth, categoryController.createCategory);

router.get('/category', isAuth, categoryController.getCategories);
router.get('/task', isAuth, taskController.getTasks);
router.get('/task/:id', isAuth, taskController.getTask);

router.post('/', upload.single('filename'), async (req, res) => {
    try {
        const storageRef = ref(storage, `files/${req.file.originalname}`);
        const metadata = {contentType: req.file.mimetype};
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('upload success');
        return res.status(201).json({downloadURL})
    } catch (error) {
        
    }
});

module.exports = router;