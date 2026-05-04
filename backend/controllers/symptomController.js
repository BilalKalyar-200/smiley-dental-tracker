const Symptom = require('../models/Symptom');

// @desc    Submit a new symptom report
// @route   POST /api/symptoms
// @access  Patient only
const createSymptom = async (req, res, next) => {
  try {
    const { symptomType, severity, location, duration, description } = req.body;

    const symptom = await Symptom.create({
      patient: req.user._id,
      symptomType,
      severity,
      location,
      duration,
      description,
    });

    res.status(201).json({ success: true, symptom });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all symptoms for logged-in patient
// @route   GET /api/symptoms
// @access  Patient only
const getMySymptoms = async (req, res, next) => {
  try {
    const symptoms = await Symptom.find({ patient: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, symptoms });
  } catch (error) {
    next(error);
  }
};
module.exports = { createSymptom, getMySymptoms };