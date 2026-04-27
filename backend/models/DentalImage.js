const mongoose = require("mongoose");

const dentalImageSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: { type: String, required: true }, //path like /uploads/filename.jpg
    viewType: {
      type: String,
      enum: ["front", "left", "right", "top", "bottom", "other"],
      required: true,
    },
    notes: { type: String, maxlength: 500 },
    fileSize: { type: Number },
  },
  { timestamps: true },
);

module.exports = mongoose.model("DentalImage", dentalImageSchema);
