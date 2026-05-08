import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="bg-[#0d1526] border-b border-[#1e2a45] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🦷</span>
            <span className="text-xl font-bold text-blue-400">Smiley</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-4">
            {!user ? (
              // Not logged in
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2">
                  Get Started
                </Link>
              </>
            ) : user.role === "patient" ? (
              // Patient links
              <>
                <Link
                  to="/patient/dashboard"
                  className="text-gray-300 hover:text-blue-400 text-sm transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/patient/images"
                  className="text-gray-300 hover:text-blue-400 text-sm transition-colors"
                >
                  Images
                </Link>
                <Link
                  to="/patient/symptoms"
                  className="text-gray-300 hover:text-blue-400 text-sm transition-colors"
                >
                  Symptoms
                </Link>
                <Link
                  to="/patient/appointments"
                  className="text-gray-300 hover:text-blue-400 text-sm transition-colors"
                >
                  Appointments
                </Link>
                <Link
                  to="/patient/habits"
                  className="text-gray-300 hover:text-blue-400 text-sm transition-colors"
                >
                  Habits
                </Link>
                <Link
                  to="/patient/diagnosis"
                  className="text-gray-300 hover:text-blue-400 text-sm transition-colors"
                >
                  Diagnoses
                </Link>
                <span className="text-blue-400 text-sm font-medium">
                  Hi, {user.fullName?.split(" ")[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              // Dentist links
              <>
                <Link
                  to="/dentist/dashboard"
                  className="text-gray-300 hover:text-blue-400 text-sm transition-colors"
                >
                  Dashboard
                </Link>
                <span className="text-blue-400 text-sm font-medium">
                  Dr. {user.fullName?.split(" ")[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm py-2"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
