//central route configuration for the entire app
//all pages are registered here

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// pages
import Home from "../pages/Home";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
