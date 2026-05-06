const HabitLog = require('../models/HabitLog');

// @desc    Log today's habits
// @route   POST /api/habits
// @access  Patient only
const logHabits = async (req, res, next) => {
  try {
    const { brushedMorning, brushedNight, flossed, mouthwashUsed, notes, date } = req.body;

    // Normalize date to start of day (strip time) so one log per day works
    const logDate = new Date(date);
    logDate.setHours(0, 0, 0, 0);

    // Check if already logged today
    const existing = await HabitLog.findOne({ patient: req.user._id, date: logDate });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Habits already logged for today' });
    }

    const log = await HabitLog.create({
      patient: req.user._id,
      date: logDate,
      brushedMorning,
      brushedNight,
      flossed,
      mouthwashUsed,
      notes,
    });

    res.status(201).json({ success: true, log });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all habit logs for logged-in patient
// @route   GET /api/habits
// @access  Patient only
const getMyHabits = async (req, res, next) => {
  try {
    const logs = await HabitLog.find({ patient: req.user._id }).sort({ date: -1 });
    res.json({ success: true, logs });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculate health score from last 7 days of habits
// @route   GET /api/habits/score
// @access  Patient only
// Score = (total habits completed / total possible habits) * 100
// Each day has 4 possible habits: brushedMorning, brushedNight, flossed, mouthwashUsed
const getHealthScore = async (req, res, next) => {
  try {
    // Get last 7 days of logs
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const logs = await HabitLog.find({
      patient: req.user._id,
      date: { $gte: sevenDaysAgo },
    });

    if (logs.length === 0) {
      return res.json({ success: true, score: 0 });
    }

    // Total possible = 7 days × 4 habits = 28
    // If patient hasn't logged every day, total possible = logs.length × 4
    const totalPossible = logs.length * 4;
    let totalDone = 0;

    logs.forEach(log => {
      if (log.brushedMorning) totalDone++;
      if (log.brushedNight) totalDone++;
      if (log.flossed) totalDone++;
      if (log.mouthwashUsed) totalDone++;
    });

    const score = Math.round((totalDone / totalPossible) * 100);

    res.json({ success: true, score });
  } catch (error) {
    next(error);
  }
};

module.exports = { logHabits, getMyHabits, getHealthScore };