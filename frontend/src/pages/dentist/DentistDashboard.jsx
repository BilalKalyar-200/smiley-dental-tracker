//dentist dashboard page
//what it needs from backend:
//   GET /api/dentist/patients     --> list of all patients
//   GET /api/appointments/dentist --> dentist's appointments

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import Loader from "../../components/common/Loader";

const DentistDashboard = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, aRes] = await Promise.all([
          api.get("/dentist/patients"),
          api.get("/appointments/dentist"),
        ]);
        setPatients(pRes.data.patients || []);
        setAppointments(aRes.data.appointments || []);
      } catch {
        setPatients([]);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Dr. {user?.fullName} 🩺
        </h1>
        <p className="text-gray-400 mt-1">{user?.specialization}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-5 mb-10">
        <div className="card text-center">
          <p className="text-gray-400 text-sm mb-1">Total Patients</p>
          <p className="text-4xl font-bold text-blue-400">{patients.length}</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-400 text-sm mb-1">Pending Appointments</p>
          <p className="text-4xl font-bold text-yellow-400">
            {appointments.filter((a) => a.status === "pending").length}
          </p>
        </div>
      </div>

      {/* Patient List */}
      <h2 className="text-xl font-semibold text-white mb-4">All Patients</h2>
      {patients.length === 0 ? (
        <div className="card text-center text-gray-400">No patients yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((p) => (
            <Link
              key={p._id}
              to={`/dentist/patient/${p._id}`}
              className="card hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {p.fullName?.[0]}
                </div>
                <div>
                  <p className="text-white font-medium">{p.fullName}</p>
                  <p className="text-gray-400 text-sm">{p.email}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Recent Appointments */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        Recent Appointments
      </h2>
      {appointments.length === 0 ? (
        <div className="card text-center text-gray-400">
          No appointments yet.
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.slice(0, 5).map((a) => (
            <div key={a._id} className="card flex justify-between items-center">
              <div>
                <p className="text-white font-medium">{a.patient?.fullName}</p>
                <p className="text-gray-400 text-sm">
                  {new Date(a.appointmentDate).toDateString()} — {a.timeSlot}
                </p>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  a.status === "confirmed"
                    ? "bg-green-900 text-green-300"
                    : a.status === "pending"
                      ? "bg-yellow-900 text-yellow-300"
                      : a.status === "completed"
                        ? "bg-blue-900 text-blue-300"
                        : "bg-red-900 text-red-300"
                }`}
              >
                {a.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DentistDashboard;
