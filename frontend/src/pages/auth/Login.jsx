//what it needs from backend:
//   POST /api/auth/login  →  { email, password }
//   Returns: { success, token, user: { _id, fullName, email, role } }
//on success: saves token + user to localStorage via AuthContext.login()
//then redirects to the correct dashboard based on role

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // POST to /api/auth/login
      const res = await api.post("/auth/login", formData);
      login(res.data.user, res.data.token); // Save to context + localStorage
      toast.success(`Welcome back, ${res.data.user.fullName.split(" ")[0]}!`);
      // Redirect based on role
      navigate(
        res.data.user.role === "dentist"
          ? "/dentist/dashboard"
          : "/patient/dashboard"
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl">🦷</span>
          <h2 className="text-2xl font-bold text-white mt-3">
            Sign In to Smiley
          </h2>
          <p className="text-gray-400 mt-1 text-sm">Welcome back!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="••••••••"
              className="input-field"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
