import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { playSparkleSound } from "../utils/audioSynth.js";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="site-header">
      {/* BRAND LOGO */}
      <NavLink to="/" className="logo-brand" onClick={() => playSparkleSound()}>
        <span className="logo-sparkle-dot" />
        <span className="logo-text">LoveDoes</span>
        <span className="logo-heart-badge">💖</span>
      </NavLink>

      {/* DESKTOP NAVIGATION LINKS */}
      <nav className="nav-links desktop-nav" aria-label="Main Navigation">
        <NavLink to="/" className={({ isActive }) => `site-nav-item ${isActive ? "active" : ""}`}>
          <span className="nav-icon">🏠</span>
          <span>Home</span>
        </NavLink>

        <NavLink to="/create" className={({ isActive }) => `site-nav-item ${isActive ? "active" : ""}`}>
          <span className="nav-icon">✨</span>
          <span>Create</span>
        </NavLink>

        <NavLink to="/about" className={({ isActive }) => `site-nav-item ${isActive ? "active" : ""}`}>
          <span className="nav-icon">📖</span>
          <span>About</span>
        </NavLink>

        <NavLink to="/contact" className={({ isActive }) => `site-nav-item ${isActive ? "active" : ""}`}>
          <span className="nav-icon">💌</span>
          <span>Contact</span>
        </NavLink>

        {/* MODERN ATTRACTIVE CTA BUTTON */}
        <NavLink
          to="/create"
          className="header-cta-btn glow"
          onClick={() => playSparkleSound()}
        >
          <span className="cta-sparkle">✨</span>
          <span>Create Page</span>
          <span className="cta-heart">💖</span>
        </NavLink>
      </nav>

      {/* MOBILE MENU TOGGLE */}
      <button
        type="button"
        className="mobile-menu-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle Navigation Menu"
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {/* MOBILE NAV DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-nav-drawer"
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <NavLink to="/" onClick={() => setMobileOpen(false)} className={location.pathname === "/" ? "active" : ""}>
              <span>🏠 Home</span>
            </NavLink>
            <NavLink to="/create" onClick={() => setMobileOpen(false)} className={location.pathname === "/create" ? "active" : ""}>
              <span>✨ Create Page</span>
            </NavLink>
            <NavLink to="/about" onClick={() => setMobileOpen(false)} className={location.pathname === "/about" ? "active" : ""}>
              <span>📖 About Us</span>
            </NavLink>
            <NavLink to="/contact" onClick={() => setMobileOpen(false)} className={location.pathname === "/contact" ? "active" : ""}>
              <span>💌 Contact Us</span>
            </NavLink>
            <NavLink to="/create" className="header-cta-btn glow" onClick={() => setMobileOpen(false)}>
              <span>Create Page 💖</span>
            </NavLink>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
