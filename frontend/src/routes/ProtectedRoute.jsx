//wraps routes that require login
//if not logged in -> redirect to /login
//if wrong role (e.g. patient trying dentist route) -> redirect to their dashboard

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  //wait until we check localStorage before deciding
  if (loading)
    return <div className="text-white text-center mt-20">Loading...</div>;

  //not logged in -> go to login
  if (!user) return <Navigate to="/login" replace />;

  // Wrong role -> redirect to their own dashboard
  if (role && user.role !== role) {
    return (
      <Navigate
        to={
          user.role === "dentist" ? "/dentist/dashboard" : "/patient/dashboard"
        }
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
