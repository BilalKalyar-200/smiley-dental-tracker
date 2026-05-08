const express = require("express");
const router = express.Router();
const { getMyDiagnosis } = require("../controllers/dentistController");
const { protect, roleMiddleware } = require("../middleware/authMiddleware");

router.use(protect, roleMiddleware("patient"));

// GET /api/patient/diagnosis
router.get("/diagnosis", getMyDiagnosis);

module.exports = router;
