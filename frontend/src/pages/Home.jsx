//landing page first thing they will see

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center px-4">
      {/* Hero */}
      <div className="text-center max-w-3xl">
        <div className="text-6xl mb-6">🦷</div>
        <h1 className="text-5xl font-bold text-white mb-4">
          Welcome to <span className="text-blue-400">Smiley</span>
        </h1>
        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
          Your digital dental health companion. Track habits, upload dental
          images, report symptoms, and book appointments — all in one place.
        </p>

        {/* CTA Buttons */}
        {!user ? (
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="btn-primary text-base px-8 py-3">
              Get Started Free
            </Link>
            <Link to="/login" className="btn-secondary text-base px-8 py-3">
              Sign In
            </Link>
          </div>
        ) : (
          <Link
            to={
              user.role === "dentist"
                ? "/dentist/dashboard"
                : "/patient/dashboard"
            }
            className="btn-primary text-base px-8 py-3"
          >
            Go to Dashboard →
          </Link>
        )}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl w-full">
        {[
          {
            icon: "📸",
            title: "Dental Image Gallery",
            desc: "Upload and track your dental photos over time",
          },
          {
            icon: "📅",
            title: "Appointment Booking",
            desc: "Book appointments with your dentist easily",
          },
          {
            icon: "📊",
            title: "Habit Tracker",
            desc: "Log daily brushing and flossing habits",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="card text-center hover:border-blue-500 transition-colors"
          >
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
            <p className="text-gray-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
