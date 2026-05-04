const express = require('express');
const router = express.Router();
const { createSymptom, getMySymptoms } = require('../controllers/symptomController');
const { protect, roleMiddleware } = require('../middleware/authMiddleware');

router.use(protect, roleMiddleware('patient'));

router.get('/', getMySymptoms);
router.post('/', createSymptom);

module.exports = router;