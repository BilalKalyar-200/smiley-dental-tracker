//register page
//what it needs from backend:
//   POST /api/auth/register
//   sends: { fullName, email, password, role, ...role-specific fields }
//   returns: { success, token, user }
// shows different extra fields depending on chosen role (patient vs dentist)

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "patient",
    //patient fields
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    //dentist fields
    licenseNumber: "",
    specialization: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    setLoading(true);
    try {
      // POST to /api/auth/register
      const res = await api.post("/auth/register", formData);
      login(res.data.user, res.data.token);
      toast.success("Account created successfully!");
      navigate(
        res.data.user.role === "dentist"
          ? "/dentist/dashboard"
          : "/patient/dashboard"
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="card w-full max-w-lg">
        <div className="text-center mb-8">
          <span className="text-4xl">🦷</span>
          <h2 className="text-2xl font-bold text-white mt-3">
            Create Your Account
          </h2>
          <p className="text-gray-400 mt-1 text-sm">Join Smiley today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* role selector */}
          <div>
            <label className="form-label">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              {["patient", "dentist"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: r })}
                  className={`py-3 rounded-lg border font-medium capitalize transition-all ${
                    formData.role === r
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-[#1a2235] border-[#2d3f6b] text-gray-400 hover:border-blue-500"
                  }`}
                >
                  {r === "patient" ? "🧑 Patient" : "🩺 Dentist"}
                </button>
              ))}
            </div>
          </div>

          {/* common fields */}
          <div>
            <label className="form-label">Full Name</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              className="input-field"
              required
            />
          </div>

          {/* patient-specific fields */}
          {formData.role === "patient" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Phone Number</label>
                <input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+1234567890"
                  className="input-field"
                />
              </div>
            </>
          )}

          {/* dentist-specific fields */}
          {formData.role === "dentist" && (
            <>
              <div>
                <label className="form-label">License Number</label>
                <input
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="DEN-XXXXX"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="form-label">Specialization</label>
                <input
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="e.g. Orthodontist"
                  className="input-field"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
