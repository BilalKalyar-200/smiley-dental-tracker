const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
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
    appointmentDate: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    reason: { type: String, maxlength: 500 },
    notes: { type: String, maxlength: 1000 },
  },
  { timestamps: true },
);

//prevent double booking same dentist at same slot
appointmentSchema.index(
  { dentist: 1, appointmentDate: 1, timeSlot: 1 },
  { unique: true },
);

module.exports = mongoose.model("Appointment", appointmentSchema);
