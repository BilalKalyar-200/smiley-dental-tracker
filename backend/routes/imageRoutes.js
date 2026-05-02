const express = require('express');
const router = express.Router();
const { uploadImage, getMyImages, deleteImage } = require('../controllers/imageController');
const { protect, roleMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All image routes require login
router.use(protect);

// GET  /api/images          → get my images
// POST /api/images/upload   → upload (with multer, then controller)
// DELETE /api/images/:id    → delete image

router.get('/', getMyImages);
// upload.single('image') runs first → saves file → then uploadImage runs
router.post('/upload', upload.single('image'), uploadImage);
router.delete('/:id', deleteImage);

module.exports = router;