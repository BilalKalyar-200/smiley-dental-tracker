//multer handles file uploads (images)
//files are saved temporarily to backend/uploads/
//i'll use this in the image upload feature

const multer = require("multer");
const path = require("path");

//define where and how to store files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); //save to backend/uploads folder
  },
  filename: (req, file, cb) => {
    //name format-> userId-timestamp.extension (e.g. 64abc-1700000000.jpg)
    const uniqueName = `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

//Only allow image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const isValid = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, PNG, WEBP images are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB per file
});

module.exports = upload;
