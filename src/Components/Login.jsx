import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
        role,
      });

      const { token, user } = res.data;
      const normalizedRole = user.role.toLowerCase();

      const updatedUser = { ...user, role: normalizedRole };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Reset fields
      setEmail("");
      setPassword("");
      setRole("");
      setError("");

      // Redirect by role
      if (normalizedRole === "admin") {
        navigate("/admin");
      } else if (normalizedRole === "owner") {
        navigate("/owner");
      } else if (normalizedRole === "blogger") {
        navigate("/blogger");
      } else {
        navigate("/home");
      }
    } catch (err) {
      const backendError = err.response?.data?.error;
      setError(backendError || "Login failed. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");

    if (
      location.pathname.includes("/admin") ||
      location.pathname.includes("/owner") ||
      location.pathname.includes("/blogger")
    ) {
      navigate("/home");
    }
  };

  return (
    <div className="login-container">
      {!user ? (
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Welcome Back 👋</h2>
          <p>Sign in to continue to your dashboard</p>

          {error && <p className="error">{error}</p>}

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <label>Select Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select a Role</option>
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
            <option value="blogger">Blogger</option>
          </select>

          <button type="submit" className="login-btn">
            Log In
          </button>
        </form>
      ) : (
        <div className="login-form">
          <h2>Welcome, {user.email}!</h2>
          <p>Role: {user.role}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Login;
