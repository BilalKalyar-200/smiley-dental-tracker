//central route configuration for the entire app
//all pages are registered here

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

//pages

import Home from "../pages/Home";
// import Login from "../pages/auth/Login";
// import Register from "../pages/auth/Register";
// import PatientDashboard from "../pages/patient/Dashboard";
// import MyImages from "../pages/patient/MyImages";
// import Appointments from "../pages/patient/Appointments";
// import HabitLog from "../pages/patient/HabitLog";
// import ReportSymptom from "../pages/patient/ReportSymptom";
// import DentistDashboard from "../pages/dentist/DentistDashboard";
// import PatientDetails from "../pages/dentist/PatientDetails";

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
