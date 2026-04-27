const mongoose = require("mongoose");

const habitLogSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    brushedMorning: { type: Boolean, default: false },
    brushedNight: { type: Boolean, default: false },
    flossed: { type: Boolean, default: false },
    mouthwashUsed: { type: Boolean, default: false },
    notes: { type: String, maxlength: 200 },
  },
  { timestamps: true },
);

// One log per patient per day
habitLogSchema.index({ patient: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("HabitLog", habitLogSchema);
