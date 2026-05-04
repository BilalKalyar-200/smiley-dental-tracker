// Appointments page
// What it needs from backend:
//   GET  /api/appointments/my       → patient's own appointments
//   GET  /api/appointments/dentists → list of dentists to book with
//   POST /api/appointments          → book a new appointment
//   PUT  /api/appointments/:id/cancel → cancel an appointment

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
];

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    dentistId: '',
    appointmentDate: '',
    timeSlot: '',
    reason: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [aRes, dRes] = await Promise.all([
        api.get('/appointments/my'),
        api.get('/appointments/dentists'),
      ]);
      setAppointments(aRes.data.appointments || []);
      setDentists(dRes.data.dentists || []);
    } catch {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!form.dentistId || !form.appointmentDate || !form.timeSlot) {
      return toast.error('Please fill all required fields');
    }
    setSubmitting(true);
    try {
      const res = await api.post('/appointments', form);
      setAppointments([res.data.appointment, ...appointments]);
      setForm({ dentistId: '', appointmentDate: '', timeSlot: '', reason: '' });
      toast.success('Appointment booked!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    try {
      const res = await api.put(`/appointments/${id}/cancel`);
      setAppointments(appointments.map(a => a._id === id ? res.data.appointment : a));
      toast.success('Appointment cancelled');
    } catch {
      toast.error('Failed to cancel');
    }
  };

  const statusStyle = (s) => ({
    pending: 'bg-yellow-900 text-yellow-300',
    confirmed: 'bg-green-900 text-green-300',
    cancelled: 'bg-red-900 text-red-300',
    completed: 'bg-blue-900 text-blue-300',
  }[s] || '');

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Appointments</h1>
      <p className="text-gray-400 mb-8">Book and manage your dental appointments</p>

      {/* Booking Form */}
      <div className="card mb-10">
        <h2 className="text-lg font-semibold text-white mb-4">Book New Appointment</h2>
        <form onSubmit={handleBook} className="space-y-4">
          <div>
            <label className="form-label">Select Dentist</label>
            <select value={form.dentistId} onChange={e => setForm({ ...form, dentistId: e.target.value })}
              className="input-field" required>
              <option value="">Choose a dentist...</option>
              {dentists.map(d => (
                <option key={d._id} value={d._id}>
                  Dr. {d.fullName} — {d.specialization}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Date</label>
              <input type="date" value={form.appointmentDate}
                onChange={e => setForm({ ...form, appointmentDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]} // Can't book past dates
                className="input-field" required />
            </div>
            <div>
              <label className="form-label">Time Slot</label>
              <select value={form.timeSlot} onChange={e => setForm({ ...form, timeSlot: e.target.value })}
                className="input-field" required>
                <option value="">Select time...</option>
                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Reason for Visit (optional)</label>
            <textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}
              placeholder="Describe why you need this appointment..." rows={2}
              className="input-field resize-none" />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Booking...' : '📅 Book Appointment'}
          </button>
        </form>
      </div>

      {/* Appointment List */}
      <h2 className="text-xl font-semibold text-white mb-4">My Appointments</h2>
      {appointments.length === 0 ? (
        <div className="card text-center text-gray-400 py-10">No appointments yet.</div>
      ) : (
        <div className="space-y-3">
          {appointments.map(a => (
            <div key={a._id} className="card flex justify-between items-center">
              <div>
                <p className="text-white font-medium">Dr. {a.dentist?.fullName}</p>
                <p className="text-gray-400 text-sm">
                  {new Date(a.appointmentDate).toDateString()} at {a.timeSlot}
                </p>
                {a.reason && <p className="text-gray-500 text-xs mt-1">{a.reason}</p>}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusStyle(a.status)}`}>
                  {a.status}
                </span>
                {(a.status === 'pending' || a.status === 'confirmed') && (
                  <button onClick={() => handleCancel(a._id)}
                    className="text-red-400 hover:text-red-300 text-xs transition-colors">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Appointments;