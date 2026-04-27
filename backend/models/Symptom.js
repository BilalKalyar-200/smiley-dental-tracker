const mongoose = require("mongoose");

const symptomSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    symptomType: {
      type: [String],
      enum: [
        "tooth_pain",
        "bleeding_gums",
        "sensitivity",
        "staining",
        "bad_breath",
        "swelling",
        "other",
      ],
      required: true,
    },
    severity: {
      type: String,
      enum: ["mild", "moderate", "severe"],
      required: true,
    },
    location: { type: String, maxlength: 100 },
    duration: { type: String, maxlength: 50 },
    description: { type: String, maxlength: 1000 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Symptom", symptomSchema);
