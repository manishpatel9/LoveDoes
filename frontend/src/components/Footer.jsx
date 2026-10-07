import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { playSparkleSound } from "../utils/audioSynth.js";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="royal-site-footer">
      <motion.div 
        className="royal-footer-card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* TOP BRAND EMBLEM */}
        <div className="royal-footer-crown-header">
          <span className="royal-crown-icon">👑</span>
          <span className="royal-footer-logo">LoveDoes</span>
          <span className="royal-crown-icon">👑</span>
        </div>

        <p className="royal-footer-tagline">
          Made slowly, for souls who still believe in eternal romance & magical surprises. ♡
        </p>

        {/* DEVELOPER CREDIT CARD */}
        <div className="royal-developer-badge-card">
          <div className="dev-badge-top-row">
            <span className="dev-heart-pulse">❤️</span>
            <span className="dev-crafted-text">
              Architected & Developed with passion by <strong className="dev-name-gold">Er. Manish Patel</strong>
            </span>
          </div>

          <div className="developer-social-section">
            <span className="dev-connect-label">Connect With Developer</span>
            <div className="developer-social-icons">
              <a
                href="https://www.instagram.com/manishpatel1946/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn insta"
                aria-label="Instagram"
                title="Instagram Profile"
                onClick={() => playSparkleSound()}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span className="social-lbl-text">Instagram</span>
              </a>

              <a
                href="https://www.linkedin.com/in/manish-kumar-016b0827a/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn linkedin"
                aria-label="LinkedIn"
                title="LinkedIn Profile"
                onClick={() => playSparkleSound()}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.67a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z"/>
                </svg>
                <span className="social-lbl-text">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="royal-footer-nav">
          <Link to="/about" onClick={() => playSparkleSound()}>About Sanctuary</Link>
          <span className="royal-dot">•</span>
          <Link to="/privacy" onClick={() => playSparkleSound()}>Privacy Policy</Link>
          <span className="royal-dot">•</span>
          <Link to="/terms" onClick={() => playSparkleSound()}>Terms of Service</Link>
          <span className="royal-dot">•</span>
          <Link to="/contact" onClick={() => playSparkleSound()}>Contact Us</Link>
        </nav>

        {/* OFFICIAL COPYRIGHT NOTICE */}
        <div className="royal-copyright-strip">
          <p>© {currentYear} <strong>LoveDoes™</strong>. All Rights Reserved. Crafted with 💕 for Romantic Souls Worldwide.</p>
        </div>
      </motion.div>
    </footer>
  );
}


