const express = require("express");
const router = express.Router();
const {
  getAllPatients,
  getPatientDetails,
  addDiagnosisNote,
} = require("../controllers/dentistController");
const { protect, roleMiddleware } = require("../middleware/authMiddleware");

// All dentist routes require: 1) logged in, 2) role = dentist
router.use(protect, roleMiddleware("dentist"));

router.get("/patients", getAllPatients);
router.get("/patient/:id", getPatientDetails);
router.post("/diagnosis", addDiagnosisNote);

module.exports = router;
