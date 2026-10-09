import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroBg from "../assets/hero_bg.png";
import { playSparkleSound } from "../utils/audioSynth.js";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function HeroTopSection() {
  return (
    <section className="hero-ref-wrapper">
      <div 
        className="hero-ref-card"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      >
        {/* Soft overlay gradient for high contrast readability on left side */}
        <div className="hero-ref-overlay" />

        {/* MAIN HERO CONTENT */}
        <div className="hero-ref-body">
          <motion.div 
            className="hero-ref-main-content royal-open-hero-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={0.5}
              style={{ marginBottom: 14 }}
            >
              <span className="eyebrow royal-eyebrow-badge">
                👑 ROYAL DIGITAL LOVE SANCTUARY ✦ 50,000+ COUPLES 👑
              </span>
            </motion.div>

            <motion.h1 
              className="hero-ref-headline"
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={1}
            >
              <span className="hero-ref-light-text">Transform Your</span>
              <br />
              <span className="hero-ref-script-gold">
                Love Story <span className="pink-heart-outline">♡</span>
              </span>
              <br />
              <span className="hero-ref-light-text">into a Royal</span>
              <br />
              <span className="hero-ref-gold-bold">Digital Masterpiece.</span>
            </motion.h1>

            <motion.p 
              className="hero-ref-paragraph royal-para-light"
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={2}
            >
              A private, majestic romantic sanctuary — pre-filled with your names, intimate photos, symphonic melodies, and secret love notes that unfold like magic.
            </motion.p>

            {/* CTA BUTTON MOVED INSIDE MAIN CONTENT FOR LEFT ALIGNMENT */}
            <motion.div 
              className="bottom-cta-wrapper"
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={3}
            >
              <Link 
                to="/create" 
                className="custom-animated-cta"
                onClick={() => playSparkleSound()}
              >
                <div className="cta-heart-icon">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
                <div className="cta-text-wrapper">
                  <span className="cta-title-main">Create Love Story</span>
                  <span className="cta-subtitle-lower">A Journey of Hearts, Forever</span>
                </div>
                <div className="cta-arrow">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </Link>
            </motion.div>

          </motion.div>

          {/* Right Floating Handwritten Touch */}
          <div className="hero-ref-right-accent">
            <div className="hero-ref-accent-text royal-accent-gold">
              Two Hearts <span className="accent-dash">✦</span> One Decree
              <br />
              Forever <span className="accent-heart">👑</span>
            </div>
          </div>
        </div>

        {/* BOTTOM FEATURE BAR (GLASSMORPHISM RIBBON) */}
        <motion.div 
          className="hero-ref-feature-bar"
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={4}
        >
          {/* Feature 1: Personalized with Your Names */}
          <div className="hero-ref-feature-item">
            <div className="hero-ref-icon-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <span className="hero-ref-feature-label">Personalized with Your Names</span>
          </div>

          {/* Feature 2: Your Favorite Songs */}
          <div className="hero-ref-feature-item">
            <div className="hero-ref-icon-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <span className="hero-ref-feature-label">Your Favorite Songs</span>
          </div>

          {/* Feature 3: Secret Messages */}
          <div className="hero-ref-feature-item">
            <div className="hero-ref-icon-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                <path d="M12 11.5l.01 0" />
              </svg>
            </div>
            <span className="hero-ref-feature-label">Secret Messages</span>
          </div>

          {/* Feature 4: A Magical Experience */}
          <div className="hero-ref-feature-item">
            <div className="hero-ref-icon-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" />
                <path d="M19 16l1.2 3.3L23 20l-3.3 1.2L18.5 24.5l-1.2-3.3L14 20l3.3-1.2L18.5 15.5" />
              </svg>
            </div>
            <span className="hero-ref-feature-label">A Magical Experience</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
