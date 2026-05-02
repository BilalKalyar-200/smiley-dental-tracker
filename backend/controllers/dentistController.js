//dentist-specific actions
//getAllPatients() --> returns all users with role 'patient'

const User = require("../models/User");
const DiagnosisNote = require("../models/DiagnosisNote");
const Symptom = require("../models/Symptom");
const DentalImage = require("../models/DentalImage");

// @desc    Get all patients
// @route   GET /api/dentist/patients --> returns all users with role 'patient'
// @access  Dentist only
const getAllPatients = async (req, res, next) => {
  try {
    const patients = await User.find({ role: "patient" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json({ success: true, patients });
  } catch (error) {
    next(error);
  }
};

// @desc    Get full details for one patient (for dentist view)
// @route   GET /api/dentist/patient/:id
// @access  Dentist only
const getPatientDetails = async (req, res, next) => {
  try {
    const patient = await User.findById(req.params.id).select("-password");
    if (!patient || patient.role !== "patient") {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }

    // Get all patient data at once
    const [symptoms, images, notes] = await Promise.all([
      Symptom.find({ patient: req.params.id }).sort({ createdAt: -1 }),
      DentalImage.find({ patient: req.params.id }).sort({ createdAt: -1 }),
      DiagnosisNote.find({ patient: req.params.id })
        .populate("dentist", "fullName")
        .sort({ createdAt: -1 }),
    ]);

    res.json({ success: true, patient, symptoms, images, notes });
  } catch (error) {
    next(error);
  }
};

// @desc    Add diagnosis note for a patient
// @route   POST /api/dentist/diagnosis
// @access  Dentist only
const addDiagnosisNote = async (req, res, next) => {
  try {
    const { patientId, diagnosis, treatment, medications, followUpDate } =
      req.body;
    const note = await DiagnosisNote.create({
      patient: patientId,
      dentist: req.user._id,
      diagnosis,
      treatment,
      medications,
      followUpDate,
    });
    res.status(201).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllPatients, getPatientDetails, addDiagnosisNote };
