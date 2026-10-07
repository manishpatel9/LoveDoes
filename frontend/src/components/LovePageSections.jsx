import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { playSparkleSound, playHeartbeatSound, playRomanticChime } from "../utils/audioSynth.js";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function LovePageSections() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(2); // 1: Couple, 2: Photos, 3: Memories, 4: Message, 5: Theme, 6: Preview
  const [activeThemeFilter, setActiveThemeFilter] = useState("all");
  const [selectedOccasionTab, setSelectedOccasionTab] = useState("Photos");
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const shareUrl = "https://lovedoes.app/rahul-priya";

  const testimonials = [
    {
      name: "Rahul & Priya",
      rating: 5,
      quote: "This website made our anniversary extra special. It was so easy to create and the final page was beyond beautiful!",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    },
    {
      name: "Aman & Riya",
      rating: 5,
      quote: "She literally cried happy tears when she opened the link on Valentine's Day. The background melody gave me chills!",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    },
    {
      name: "Vikram & Sneha",
      rating: 5,
      quote: "The proposal section with the runaway No button was hilariously cute! Best digital surprise ever created.",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80",
    },
  ];

  const themesList = [
    { name: "Classic", tag: "Sunset", img: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&auto=format&fit=crop&q=80" },
    { name: "Romantic", tag: "Candles", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80" },
    { name: "Dreamy", tag: "Galaxy", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80" },
    { name: "Elegant", tag: "Gold Glow", img: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=300&auto=format&fit=crop&q=80" },
    { name: "Sunset", tag: "Ocean", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80" },
    { name: "Forest", tag: "Fairy Lights", img: "https://images.unsplash.com/photo-1511497584788-876761c119ef?w=300&auto=format&fit=crop&q=80" },
    { name: "Vintage", tag: "Polaroid", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&auto=format&fit=crop&q=80" },
    { name: "Fantasy", tag: "Neon Pink", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80" },
  ];

  const handleCopy = () => {
    playSparkleSound();
    navigator.clipboard?.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleStartCreate = () => {
    playRomanticChime();
    navigate("/create");
  };

  return (
    <div className="lovepage-ten-sections-wrapper">
      {/* SECTION 2: HOW IT WORKS (4 SIMPLE STEPS) */}

      <section className="lp-section lp-how-it-works" id="how-it-works-steps">
        <motion.div className="lp-section-header" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <span className="lp-mini-tag">♥ LoveDoes</span>
          <h2 className="lp-section-title">How It Works ♡</h2>
          <p className="lp-section-sub">Create your special page in just 4 simple steps.</p>
        </motion.div>

        <div className="lp-steps-grid">
          {[
            { num: "01", title: "Add Names", desc: "Tell us about you and your partner.", icon: "🧑‍🤝‍🧑" },
            { num: "02", title: "Upload Photos", desc: "Add your favorite memories & photos.", icon: "🖼️" },
            { num: "03", title: "Choose Theme", desc: "Pick a theme that matches your story.", icon: "💖" },
            { num: "04", title: "Share & Surprise", desc: "Get your unique link and share the love!", icon: "📲" },
          ].map((s) => (
            <div key={s.num} className="lp-step-card" onClick={() => playSparkleSound()}>
              <div className="lp-step-num-badge">{s.num}</div>
              <div className="lp-step-icon-circle">{s.icon}</div>
              <h3 className="lp-step-title">{s.title}</h3>
              <p className="lp-step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
        <p className="lp-handwritten-center">It's that easy! ♡</p>
      </section>

      {/* SECTION 3: BEAUTIFUL THEMES (8 AESTHETIC CARDS) */}
      <section className="lp-section lp-themes-showcase" id="themes-showcase">
        <motion.div className="lp-section-header" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <span className="lp-mini-tag">♥ LoveDoes</span>
          <h2 className="lp-section-title">Beautiful Themes ♡</h2>
          <p className="lp-section-sub">Choose from a variety of stunning themes to make your love page truly special.</p>
        </motion.div>

        <div className="lp-themes-8-grid">
          {themesList.map((t) => (
            <div
              key={t.name}
              className="lp-theme-card"
              onClick={() => {
                playHeartbeatSound();
                handleStartCreate();
              }}
            >
              <img src={t.img} alt={t.name} />
              <div className="lp-theme-overlay">
                <span className="lp-theme-badge">{t.name}</span>
                <span className="lp-theme-tag">{t.tag}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="lp-center-btn-wrap">
          <button type="button" className="btn pink-glow-btn" onClick={handleStartCreate}>
            Explore All Themes →
          </button>
        </div>
      </section>

      {/* SECTION 4: CREATE YOUR PAGE INTERACTIVE STEPPER */}
      <section className="lp-section lp-stepper-preview" id="create-page-stepper">
        <motion.div className="lp-section-header" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <span className="lp-mini-tag">♥ LoveDoes</span>
          <h2 className="lp-section-title">Create Your Page ♡</h2>
        </motion.div>

        <div className="lp-stepper-box">
          {/* Stepper Header Bar */}
          <div className="lp-stepper-header-strip">
            {[
              { id: 1, label: "Couple" },
              { id: 2, label: "Photos" },
              { id: 3, label: "Memories" },
              { id: 4, label: "Message" },
              { id: 5, label: "Theme" },
              { id: 6, label: "Preview" },
            ].map((st) => (
              <div
                key={st.id}
                className={`lp-step-indicator ${activeStep === st.id ? "active" : ""}`}
                onClick={() => {
                  playSparkleSound();
                  setActiveStep(st.id);
                }}
              >
                <div className="lp-step-circle">{st.id}</div>
                <span className="lp-step-lbl">{st.label}</span>
              </div>
            ))}
          </div>

          {/* Stepper Body Container */}
          <div className="lp-stepper-body-split">
            <div className="lp-upload-col">
              <h3 className="lp-upload-heading">Upload Photos</h3>
              <p className="lp-upload-sub">Add your favorite photos and memories.</p>

              <div className="lp-dropzone-row">
                <div className="lp-dropzone-box">
                  <span className="lp-dropzone-lbl">Your Photo</span>
                  <div className="lp-upload-placeholder">
                    <span className="camera-icon">📷</span>
                    <span>Click to upload<br />JPG, PNG, WEBP</span>
                  </div>
                </div>

                <div className="lp-dropzone-box">
                  <span className="lp-dropzone-lbl">Partner's Photo</span>
                  <div className="lp-upload-placeholder">
                    <span className="camera-icon">📷</span>
                    <span>Click to upload<br />JPG, PNG, WEBP</span>
                  </div>
                </div>
              </div>

              <div className="lp-stepper-nav-btns">
                <button
                  type="button"
                  className="btn secondary-btn"
                  onClick={() => {
                    playSparkleSound();
                    setActiveStep((prev) => Math.max(1, prev - 1));
                  }}
                >
                  ← Back
                </button>
                <button type="button" className="btn pink-glow-btn" onClick={handleStartCreate}>
                  Continue →
                </button>
              </div>
            </div>

            <div className="lp-polaroid-side-preview">
              <div className="polaroid-frame-single">
                <img
                  src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=350&auto=format&fit=crop&q=80"
                  alt="Couple Together"
                />
                <span className="polaroid-caption-script">Better Together ♡</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: PREVIEW YOUR LOVE PAGE (DEVICES MOCKUP) */}
      <section className="lp-section lp-preview-devices" id="preview-devices">
        <motion.div className="lp-section-header" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <span className="lp-mini-tag">♥ LoveDoes</span>
          <h2 className="lp-section-title">Preview Your Love Page ♡</h2>
          <p className="lp-section-sub">See how your love page will look before you create it.</p>
        </motion.div>

        <div className="lp-devices-showcase-wrapper">
          <div className="lp-devices-left-col">
            <div className="desktop-monitor-mockup">
              <div className="monitor-screen">
                <div className="mini-hero-banner">
                  <h3>Rahul & Priya</h3>
                  <p>Two hearts, one story.</p>
                  <div className="mini-nav-pills">
                    <span>Our Story</span>
                    <span>Memories</span>
                    <span>Message</span>
                  </div>
                </div>
              </div>
              <div className="monitor-stand" />
            </div>

            <div className="phone-screen-mockup">
              <div className="phone-body">
                <strong className="mini-p-title">Rahul & Priya</strong>
                <div className="mini-p-chip">Our Story</div>
                <div className="mini-p-chip">Memories</div>
              </div>
            </div>
          </div>

          <div className="lp-devices-right-col">
            <ul className="lp-features-check-list">
              <li><span className="check-icon">✔</span> Beautiful Layouts</li>
              <li><span className="check-icon">✔</span> Smooth Animations</li>
              <li><span className="check-icon">✔</span> Music & Effects</li>
              <li><span className="check-icon">✔</span> Mobile Responsive</li>
            </ul>
            <button type="button" className="btn glow main-cta" onClick={handleStartCreate}>
              Create Your Love Page →
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 6: SHARE YOUR LOVE */}
      <section className="lp-section lp-share-love" id="share-love-bar">
        <motion.div className="lp-section-header" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <span className="lp-mini-tag">♥ LoveDoes</span>
          <h2 className="lp-section-title">Share Your Love ♡</h2>
          <p className="lp-section-sub">Get your unique link and share it with your special one.</p>
        </motion.div>

        <div className="lp-share-box-card">
          <div className="lp-link-input-bar">
            <input type="text" value={shareUrl} readOnly />
            <button type="button" className="btn copy-btn" onClick={handleCopy}>
              {copiedLink ? "✓ Copied!" : "📋 Copy"}
            </button>
          </div>

          <div className="lp-social-circles-row">
            <div className="share-circle whatsapp" onClick={handleCopy}>
              <span className="s-icon">💬</span>
              <span className="s-lbl">Share on WhatsApp</span>
            </div>
            <div className="share-circle copy" onClick={handleCopy}>
              <span className="s-icon">🔗</span>
              <span className="s-lbl">Copy Link</span>
            </div>
            <div className="share-circle qrcode" onClick={handleCopy}>
              <span className="s-icon">📱</span>
              <span className="s-lbl">Download QR Code</span>
            </div>
            <div className="share-circle sharemore" onClick={handleCopy}>
              <span className="s-icon">💖</span>
              <span className="s-lbl">Share More</span>
            </div>
          </div>
          <p className="lp-handwritten-note">Because the best things are meant to be shared ♡</p>
        </div>
      </section>

      {/* SECTION 7: EXPERIENCE THE MAGIC */}
      <section className="lp-section lp-experience-magic" id="experience-magic">
        <motion.div className="lp-section-header" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <span className="lp-mini-tag">♥ LoveDoes</span>
          <h2 className="lp-section-title">Experience the Magic ♡</h2>
          <p className="lp-section-sub">A beautiful journey of love, memories and emotions.</p>
        </motion.div>

        <div className="lp-magic-split">
          <div className="lp-magic-pills-col">
            {[
              { icon: "⚙️", label: "Stunning Animations" },
              { icon: "🎵", label: "Background Music" },
              { icon: "🖐️", label: "Interactive Elements" },
              { icon: "💖", label: "Heart Touching Messages" },
              { icon: "🎬", label: "Lasting Memories" },
            ].map((item) => (
              <div key={item.label} className="magic-pill-item" onClick={() => playSparkleSound()}>
                <span className="pill-icon">{item.icon}</span>
                <span className="pill-text">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="lp-magic-phone-col">
            <div className="glowing-phone-stage">
              <div className="glowing-phone-screen">
                <img
                  src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&auto=format&fit=crop&q=80"
                  alt="Glowing Phone Screen"
                />
                <div className="phone-overlay-quote">
                  <p>You are my forever ♡</p>
                  <div className="mini-music-bar">🎵 ▶</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: A LOVE PAGE LIKE NO OTHER */}
      <section className="lp-section lp-no-other" id="polaroid-memory-deck">
        <motion.div className="lp-section-header" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <span className="lp-mini-tag">♥ LoveDoes</span>
          <h2 className="lp-section-title">A Love Page Like No Other ♡</h2>
          <p className="lp-section-sub">More than just a page — it's a feeling, a memory, a forever.</p>
        </motion.div>

        <div className="lp-polaroid-fan-deck">
          <div className="fan-card side-l">
            <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=250&auto=format&fit=crop&q=80" alt="Memory 1" />
          </div>
          <div className="fan-card center-highlight">
            <img src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=300&auto=format&fit=crop&q=80" alt="Memory Center" />
            <div className="polaroid-card-script">
              <span>Same People<br />Different Days<br />Same Love ♡</span>
            </div>
          </div>
          <div className="fan-card side-r">
            <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=250&auto=format&fit=crop&q=80" alt="Memory 2" />
          </div>
        </div>

        <div className="lp-feature-tabs-bar">
          {["Photos", "Memories", "Timeline", "Message", "Final Surprise"].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`lp-tab-btn ${selectedOccasionTab === tab ? "active" : ""}`}
              onClick={() => {
                playSparkleSound();
                setSelectedOccasionTab(tab);
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 9: LOVED BY THOUSANDS (TESTIMONIALS & STATS) */}
      <section className="lp-section lp-testimonials-stats" id="testimonials-stats">
        <motion.div className="lp-section-header" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <span className="lp-mini-tag">♥ LoveDoes</span>
          <h2 className="lp-section-title">Loved by Thousands ♡</h2>
          <p className="lp-section-sub">Real couples. Real stories. Real emotions.</p>
        </motion.div>

        <div className="lp-testimonial-card-slider">
          <button
            type="button"
            className="test-arrow left-t"
            onClick={() => {
              playSparkleSound();
              setTestimonialIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
            }}
          >
            ‹
          </button>
          <div className="test-card-content">
            <img src={testimonials[testimonialIdx].avatar} alt={testimonials[testimonialIdx].name} className="test-avatar" />
            <div className="test-stars">⭐⭐⭐⭐⭐</div>
            <p className="test-quote">“{testimonials[testimonialIdx].quote}”</p>
            <span className="test-author">- {testimonials[testimonialIdx].name}</span>
          </div>
          <button
            type="button"
            className="test-arrow right-t"
            onClick={() => {
              playSparkleSound();
              setTestimonialIdx((prev) => (prev + 1) % testimonials.length);
            }}
          >
            ›
          </button>
        </div>

        <div className="lp-stats-counter-row">
          <div className="stat-box">
            <div className="stat-num">💖 10K+</div>
            <div className="stat-lbl">Love Pages Created</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">💍 50K+</div>
            <div className="stat-lbl">Happy Couples</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">📸 1M+</div>
            <div className="stat-lbl">Views & Counting</div>
          </div>
        </div>
      </section>

      {/* SECTION 10: GRAND SUNSET FINALE CTA */}
      <section className="lp-section lp-grand-sunset-cta" id="grand-sunset-cta">
        <div className="sunset-cityscape-backdrop">
          <div className="couples-silhouettes-city" />
        </div>
        <motion.div className="lp-cta-inner-card" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <span className="lp-mini-tag">♥ LoveDoes</span>
          <h2 className="lp-cta-title">Ready to Create Something Special? ♡</h2>
          <p className="lp-cta-sub">Turn your memories, emotions and dreams into a beautiful love page.</p>
          <button type="button" className="btn glow main-cta" onClick={handleStartCreate}>
            Create Your Love Page →
          </button>
          <p className="lp-handwritten-note">Because every love story deserves to be celebrated ♡</p>
        </motion.div>
      </section>
    </div>
  );
}
