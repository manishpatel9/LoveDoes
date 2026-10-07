import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { adminLogin } from "../../services/api.js";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await adminLogin(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-login-shell">
      {/* Background Animated Glow Orbs & Particles */}
      <motion.div
        className="admin-glow-orb orb-1"
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.3, 0.6, 0.3],
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="admin-glow-orb orb-2"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.25, 0.55, 0.25],
          x: [0, -40, 0],
          y: [0, 35, 0],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Main Animated Login Glass Card */}
      <motion.div
        className="admin-login-card"
        initial={{ opacity: 0, y: 30, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Top Badge Emblem */}
        <motion.div
          className="admin-badge-emblem"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
        >
          <div className="emblem-ring" />
          <span className="emblem-icon">🔐</span>
        </motion.div>

        {/* Title Section */}
        <div className="admin-card-header">
          <p className="admin-kicker">✨ SANCTUARY CONTROL CENTER</p>
          <h1 className="admin-title">Admin Gateway</h1>
          <p className="admin-subtitle">Welcome back. Enter your credentials to manage love pages.</p>
        </div>

        {/* Login Form */}
        <form className="admin-form" onSubmit={onSubmit}>
          {/* Email Field */}
          <div className="admin-field-group">
            <label htmlFor="admin-email" className="admin-label">
              <span>Email Address</span>
            </label>
            <div className="admin-input-wrapper">
              <span className="input-icon">✉️</span>
              <input
                id="admin-email"
                type="email"
                className="admin-input"
                placeholder="admin@lovedoes.local"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="admin-field-group">
            <label htmlFor="admin-password" className="admin-label">
              <span>Password</span>
            </label>
            <div className="admin-input-wrapper">
              <span className="input-icon">🔑</span>
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                className="admin-input"
                placeholder="••••••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Animated Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="admin-error-box"
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            className="admin-submit-btn"
            type="submit"
            disabled={busy}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {busy ? (
              <span className="btn-loading-state">
                <span className="spinner-dot" />
                <span>Authenticating...</span>
              </span>
            ) : (
              <span className="btn-normal-state">
                <span>Sign In to Admin</span>
                <span className="btn-arrow">→</span>
              </span>
            )}
          </motion.button>
        </form>

        {/* Footer Navigation */}
        <div className="admin-card-footer">
          <Link to="/" className="back-home-link">
            <span>← Return to LoveDoes Home</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
