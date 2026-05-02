// Handles dental image upload, retrieval and deletion
// Images are stored in backend/uploads/ folder
// imageUrl stored in DB as: /uploads/filename.jpg

const DentalImage = require('../models/DentalImage');
const fs = require('fs');
const path = require('path');

// @desc    Upload a dental image
// @route   POST /api/images/upload
// @access  Patient only
const uploadImage = async (req, res, next) => {
  try {
    // req.file is set by Multer middleware
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const { viewType, notes } = req.body;

    // Save image record to MongoDB
    // imageUrl is the path that can be accessed at http://localhost:5000/uploads/filename.jpg
    const image = await DentalImage.create({
      patient: req.user._id,
      imageUrl: `/uploads/${req.file.filename}`,
      viewType,
      notes,
      fileSize: req.file.size,
    });

    res.status(201).json({ success: true, image });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all images for the logged-in patient
// @route   GET /api/images
// @access  Patient only
const getMyImages = async (req, res, next) => {
  try {
    const images = await DentalImage.find({ patient: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, images });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an image
// @route   DELETE /api/images/:id
// @access  Patient only (must own the image)
const deleteImage = async (req, res, next) => {
  try {
    const image = await DentalImage.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    // Ensure the logged-in patient owns this image
    if (image.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Delete the actual file from the uploads folder
    const filePath = path.join(__dirname, '..', image.imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete the DB record
    await image.deleteOne();

    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImage, getMyImages, deleteImage };