const config = require('../util/config');
const multer = require('multer');
const {initializeApp} = require('firebase/app');
const {getStorage, ref, getDownloadURL, uploadBytesResumable, } = require('firebase/storage');

initializeApp(config.firebaseConfig);
module.exports = [ multer({storage: multer.memoryStorage()}).single('image'),
async (req, res, next) => {
    if(!req.file) return next();
    try {
        const storageRef = ref(getStorage(), `uploads/${req.body.title} - ${Date.now()}`);
        const metadata = {contentType: req.file.mimetype};
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('File uploaded successfully');
        req.imageUrl = downloadURL;
        req.imageRef = storageRef;
        next();
    } catch (error) {
        console.log(error);
    }
}]