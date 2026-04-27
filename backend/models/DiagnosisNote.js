const mongoose = require("mongoose");

const diagnosisNoteSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dentist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    diagnosis: { type: String, required: true, maxlength: 2000 },
    treatment: { type: String, maxlength: 2000 },
    medications: { type: String, maxlength: 500 },
    followUpDate: { type: Date },
    relatedAppointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("DiagnosisNote", diagnosisNoteSchema);
