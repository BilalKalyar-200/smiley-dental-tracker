//central route configuration for the entire app
//all pages are registered here

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

//pages

import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import PatientDashboard from "../pages/patient/Dashboard";
import MyImages from "../pages/patient/MyImages";
import Appointments from "../pages/patient/Appointments";
import HabitLog from "../pages/patient/HabitLog";
import ReportSymptom from "../pages/patient/ReportSymptom";
import DentistDashboard from "../pages/dentist/DentistDashboard";
import PatientDetails from "../pages/dentist/PatientDetails";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          !user ? (
            <Login />
          ) : (
            <Navigate
              to={
                user.role === "dentist"
                  ? "/dentist/dashboard"
                  : "/patient/dashboard"
              }
            />
          )
        }
      />
      <Route
        path="/register"
        element={
          !user ? (
            <Register />
          ) : (
            <Navigate
              to={
                user.role === "dentist"
                  ? "/dentist/dashboard"
                  : "/patient/dashboard"
              }
            />
          )
        }
      />

      {/* Patient Routes */}
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute role="patient">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/images"
        element={
          <ProtectedRoute role="patient">
            <MyImages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/appointments"
        element={
          <ProtectedRoute role="patient">
            <Appointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/habits"
        element={
          <ProtectedRoute role="patient">
            <HabitLog />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/symptoms"
        element={
          <ProtectedRoute role="patient">
            <ReportSymptom />
          </ProtectedRoute>
        }
      />

      {/* Dentist Routes */}
      <Route
        path="/dentist/dashboard"
        element={
          <ProtectedRoute role="dentist">
            <DentistDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dentist/patient/:id"
        element={
          <ProtectedRoute role="dentist">
            <PatientDetails />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
