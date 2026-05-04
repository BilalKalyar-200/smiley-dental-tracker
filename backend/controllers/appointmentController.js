const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Patient only
const bookAppointment = async (req, res, next) => {
  try {
    const { dentistId, appointmentDate, timeSlot, reason } = req.body;

    // Check if the slot is already taken for that dentist
    const conflict = await Appointment.findOne({
      dentist: dentistId,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      status: { $in: ['pending', 'confirmed'] }, // Only block if active
    });

    if (conflict) {
      return res.status(400).json({ success: false, message: 'This time slot is already booked' });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      dentist: dentistId,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      reason,
    });

    // Populate dentist name before sending response
    await appointment.populate('dentist', 'fullName specialization');

    res.status(201).json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all appointments for logged-in patient
// @route   GET /api/appointments/my
// @access  Patient only
const getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('dentist', 'fullName specialization')
      .sort({ appointmentDate: -1 });
    res.json({ success: true, appointments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all appointments for logged-in dentist
// @route   GET /api/appointments/dentist
// @access  Dentist only
const getDentistAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ dentist: req.user._id })
      .populate('patient', 'fullName email')
      .sort({ appointmentDate: -1 });
    res.json({ success: true, appointments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of all dentists (for booking dropdown)
// @route   GET /api/appointments/dentists
// @access  Patient only
const getDentistList = async (req, res, next) => {
  try {
    const dentists = await User.find({ role: 'dentist' }).select('fullName specialization email');
    res.json({ success: true, dentists });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Patient only (their own appointment)
const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Only the patient who booked it can cancel
    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status (dentist confirms/completes)
// @route   PUT /api/appointments/:id/status
// @access  Dentist only
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('patient', 'fullName email');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getDentistAppointments,
  getDentistList,
  cancelAppointment,
  updateAppointmentStatus,
};