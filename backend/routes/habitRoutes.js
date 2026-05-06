const express = require('express');
const router = express.Router();
const { logHabits, getMyHabits, getHealthScore } = require('../controllers/habitController');
const { protect, roleMiddleware } = require('../middleware/authMiddleware');

router.use(protect, roleMiddleware('patient'));

// GET  /api/habits        → get all logs
// GET  /api/habits/score  → health score (must be before /:id style routes)
// POST /api/habits        → log today

router.get('/score', getHealthScore);
router.get('/', getMyHabits);
router.post('/', logHabits);

module.exports = router;