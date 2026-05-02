//patient dashboard
//what it needs from backend:
//   GET /api/auth/me          --> logged-in user info
//   GET /api/habits/score     --> health score (calculated from recent habits)
//   GET /api/symptoms         --> recent symptoms count
//   GET /api/appointments     --> upcoming appointments

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import Loader from "../../components/common/Loader";

const PatientDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        //fetch multiple stats in parallel
        const [scoreRes, symptomsRes, appointmentsRes] = await Promise.all([
          api.get("/habits/score"),
          api.get("/symptoms"),
          api.get("/appointments/my"),
        ]);
        setStats({
          score: scoreRes.data.score,
          symptoms: symptomsRes.data.symptoms?.length || 0,
          appointments:
            appointmentsRes.data.appointments?.filter(
              (a) => a.status === "pending" || a.status === "confirmed",
            ).length || 0,
        });
      } catch {
        setStats({ score: 0, symptoms: 0, appointments: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const quickLinks = [
    {
      to: "/patient/images",
      icon: "📸",
      label: "My Images",
      desc: "Upload dental photos",
    },
    {
      to: "/patient/symptoms",
      icon: "🤒",
      label: "Report Symptom",
      desc: "Log pain or discomfort",
    },
    {
      to: "/patient/appointments",
      icon: "📅",
      label: "Appointments",
      desc: "Book or view appointments",
    },
    {
      to: "/patient/habits",
      icon: "🪥",
      label: "Habit Tracker",
      desc: "Log today's habits",
    },
  ];

  if (loading) return <Loader text="Loading dashboard..." />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Hello, {user?.fullName?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-400 mt-1">Here's your dental health overview</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="card text-center">
          <p className="text-gray-400 text-sm mb-1">Health Score</p>
          <p
            className={`text-4xl font-bold ${
              stats.score >= 70
                ? "text-green-400"
                : stats.score >= 40
                  ? "text-yellow-400"
                  : "text-red-400"
            }`}
          >
            {stats.score}%
          </p>
          <p className="text-gray-500 text-xs mt-1">Based on recent habits</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-400 text-sm mb-1">Symptoms Logged</p>
          <p className="text-4xl font-bold text-blue-400">{stats.symptoms}</p>
          <p className="text-gray-500 text-xs mt-1">Total reported</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-400 text-sm mb-1">Upcoming Appointments</p>
          <p className="text-4xl font-bold text-purple-400">
            {stats.appointments}
          </p>
          <p className="text-gray-500 text-xs mt-1">Pending or confirmed</p>
        </div>
      </div>

      {/* quick links */}
      <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="card flex items-center gap-4 hover:border-blue-500 transition-colors cursor-pointer"
          >
            <span className="text-3xl">{link.icon}</span>
            <div>
              <p className="text-white font-semibold">{link.label}</p>
              <p className="text-gray-400 text-sm">{link.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PatientDashboard;
