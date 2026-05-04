const express = require('express');
const router = express.Router();
const {
  bookAppointment, getMyAppointments, getDentistAppointments,
  getDentistList, cancelAppointment, updateAppointmentStatus,
} = require('../controllers/appointmentController');
const { protect, roleMiddleware } = require('../middleware/authMiddleware');

// All routes require login
router.use(protect);

// Patient routes
router.get('/my', roleMiddleware('patient'), getMyAppointments);
router.get('/dentists', roleMiddleware('patient'), getDentistList);
router.post('/', roleMiddleware('patient'), bookAppointment);
router.put('/:id/cancel', roleMiddleware('patient'), cancelAppointment);

// Dentist routes
router.get('/dentist', roleMiddleware('dentist'), getDentistAppointments);
router.put('/:id/status', roleMiddleware('dentist'), updateAppointmentStatus);

module.exports = router;