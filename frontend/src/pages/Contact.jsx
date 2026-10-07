import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PublicLayout from "../layouts/PublicLayout.jsx";
import CursorStardust from "../components/CursorStardust.jsx";
import AudioSoundtrackBar from "../components/AudioSoundtrackBar.jsx";
import LoveBubbles from "../components/LoveBubbles.jsx";
import RosePetals from "../components/RosePetals.jsx";
import { playSparkleSound, playHeartbeatSound, playRomanticChime } from "../utils/audioSynth.js";
import { submitContactMessage } from "../services/api.js";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "💖 Custom Valentine Request",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openFaq, setOpenFaq] = useState(0);
  const [copiedInfo, setCopiedInfo] = useState("");

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage("Please fill in your name, email address, and romantic note.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    playHeartbeatSound();

    try {
      const res = await submitContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        topic: formData.subject,
        message: formData.message.trim(),
      });

      if (res.success) {
        playRomanticChime();
        setSubmitted(true);
      } else {
        setErrorMessage(res.error || "Could not deliver message. Please try again.");
      }
    } catch (err) {
      setErrorMessage(err.message || "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = (text, label) => {
    playSparkleSound();
    navigator.clipboard.writeText(text);
    setCopiedInfo(label);
    setTimeout(() => setCopiedInfo(""), 3000);
  };

  const faqs = [
    {
      q: "Can I update photos and music after sharing our love link?",
      a: "Yes, absolutely! You can customize your memory timeline, romantic gallery, secret love note, and music soundtrack anytime — your custom link remains identical and updated in real-time.",
    },
    {
      q: "How long does our love page stay active online?",
      a: "Your digital sanctuary stays live forever! We preserve your romantic memories, photos, audio, and certificates so your love story shines for decades to come.",
    },
    {
      q: "Is my private message and proposal password-protected?",
      a: "Yes! Your page is accessible only via your custom link, and you can optionally activate secret passcode protection or a wax seal lock for complete privacy.",
    },
    {
      q: "Can I request custom themes or special anniversary surprises?",
      a: "We love crafting bespoke romantic experiences! Send us a note right here, and our team will craft customized color palettes, sound clips, or proposal features within hours.",
    },
    {
      q: "How fast will I receive a response from the LoveDoes Sanctuary team?",
      a: "Every whisper sent through this sanctuary goes directly to our admin team inbox. We read every love letter and respond within 2 hours!",
    },
  ];

  return (
    <PublicLayout>
      {/* Interactive Trailing Stardust & Ambient Audio Controls */}
      <CursorStardust />
      <AudioSoundtrackBar />
      <LoveBubbles count={18} showMessages />
      <RosePetals count={12} />

      <div className="contact-page-wrapper">
        {/* HERO HEADER */}
        <motion.div className="contact-hero" initial="hidden" animate="show" variants={fadeUp}>
          <div className="lp-mini-tag">✨ WE'RE HERE FOR YOUR LOVE STORY ✨</div>
          <h1 className="contact-title">We’d Love to Hear Your Story ♡</h1>
          <p className="contact-sub">
            Whether you need help crafting the perfect digital surprise, customized theme requests, or just want to share your happy tears — our hearts and inbox are wide open for you.
          </p>
        </motion.div>

        {/* DUAL-COLUMN SANCTUARY & LIVE LOVE NOTE PREVIEW */}
        <div className="contact-grid-container">
          {/* LEFT: GLASSFORM FORM WITH LIVE INPUT */}
          <motion.div className="contact-form-card" initial="hidden" animate="show" variants={fadeUp} custom={1}>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  className="contact-success-state"
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <div className="success-wax-seal">💌</div>
                  <h2 className="success-heading">Message Delivered with Love! ♡</h2>
                  <p className="success-sub">
                    Thank you, <strong>{formData.name || "Special Someone"}</strong>. Your note has been safely stored in our admin sanctuary. Our heart-centered team will reply to <strong>{formData.email}</strong> within 2 hours!
                  </p>

                  <div className="submitted-summary-card">
                    <div className="summary-row">
                      <span className="summary-label">Topic:</span>
                      <span className="summary-val">{formData.subject}</span>
                    </div>
                    <div className="summary-message-preview">"{formData.message}"</div>
                  </div>

                  <button
                    type="button"
                    className="btn glow"
                    style={{ marginTop: 24 }}
                    onClick={() => {
                      playSparkleSound();
                      setSubmitted(false);
                      setFormData({ name: "", email: "", subject: "💖 Custom Valentine Request", message: "" });
                    }}
                  >
                    Send Another Love Letter ✉️
                  </button>
                </motion.div>
              ) : (
                <form key="form" onSubmit={handleSubmit} className="contact-actual-form">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h3 className="form-card-title" style={{ margin: 0 }}>Send Us a Love Note 💌</h3>
                    <span style={{ fontSize: "0.8rem", color: "#ff9ebb", background: "rgba(255, 158, 187, 0.12)", padding: "4px 12px", borderRadius: 20, border: "1px solid rgba(255, 158, 187, 0.3)" }}>
                      Direct Admin Inbox ⚡
                    </span>
                  </div>

                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.4)", borderRadius: 12, padding: "10px 14px", color: "#fca5a5", fontSize: "0.9rem", marginBottom: 18 }}
                    >
                      ⚠️ {errorMessage}
                    </motion.div>
                  )}

                  <div className="c-field-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="e.g. Aman & Riya"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="c-field-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@love.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="c-field-group">
                    <label htmlFor="subject">Topic of Interest</label>
                    <select id="subject" name="subject" value={formData.subject} onChange={handleInputChange}>
                      <option value="💖 Custom Valentine Request">💖 Custom Valentine Request</option>
                      <option value="💌 Page Editing Support">💌 Page Editing Support</option>
                      <option value="✨ Theme & Background Customization">✨ Theme & Background Customization</option>
                      <option value="🥂 Share Happy Tears & Feedback">🥂 Share Happy Tears & Feedback</option>
                      <option value="💬 General Inquiry">💬 General Inquiry</option>
                    </select>
                  </div>

                  <div className="c-field-group">
                    <label htmlFor="message">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Tell us what's on your heart..."
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn glow contact-submit-btn"
                    disabled={submitting}
                  >
                    {submitting ? "⏳ Sealing & Sending..." : "Send Your Love Letter 💌"}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* RIGHT: LIVE PARCHMENT LOVE NOTE PREVIEW & CONTACT CARDS */}
          <motion.div className="contact-info-col" initial="hidden" animate="show" variants={fadeUp} custom={2}>
            {/* LIVE PARCHMENT LOVE NOTE PREVIEW CARD */}
            <div className="live-love-note-card">
              <div className="parchment-stamp">SEALED WITH LOVE</div>
              <div className="parchment-header">
                <span className="parchment-badge">📜 Live Love Note Preview</span>
                <span className="parchment-date">{new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
              <div className="parchment-content">
                <div className="parchment-to">To: <em>LoveDoes Sanctuary Concierge</em></div>
                <div className="parchment-from">From: <strong>{formData.name || "Special Someone"}</strong> {formData.email ? `<${formData.email}>` : ""}</div>
                <div className="parchment-topic">Topic: <span>{formData.subject}</span></div>
                <div className="parchment-body">
                  "{formData.message || "Your message will illuminate this parchment live as you type..."}"
                </div>
              </div>
              <div className="parchment-footer">
                <span className="parchment-script">Forever & Always ♡</span>
                <span className="parchment-wax-icon">💌</span>
              </div>
            </div>

            {/* INTERACTIVE SUPPORT INFO CARDS */}
            <div
              className="info-card-item"
              onClick={() => handleCopy("support@lovedoes.app", "Email copied to clipboard!")}
              title="Click to copy email address"
            >
              <div className="info-icon">📧</div>
              <div className="info-details">
                <h4>Direct Email Sanctuary</h4>
                <p>support@lovedoes.app</p>
                <span className="info-badge">
                  {copiedInfo === "Email copied to clipboard!" ? "✓ Copied!" : "Fast 2-Hour Response"}
                </span>
              </div>
            </div>

            <div
              className="info-card-item"
              onClick={() => handleCopy("+1 (800) LOVE-DOES", "WhatsApp number copied!")}
              title="Click to copy support hotline"
            >
              <div className="info-icon">💬</div>
              <div className="info-details">
                <h4>Instant WhatsApp Concierge</h4>
                <p>+1 (800) LOVE-DOES</p>
                <span className="info-badge">
                  {copiedInfo === "WhatsApp number copied!" ? "✓ Copied!" : "Live 24/7 Concierge"}
                </span>
              </div>
            </div>

            <div className="info-card-item" onClick={() => playSparkleSound()}>
              <div className="info-icon">📍</div>
              <div className="info-details">
                <h4>Crafted With Passion</h4>
                <p>San Francisco, CA & Hearts Worldwide</p>
                <span className="info-badge">Global Valentine Service</span>
              </div>
            </div>

            {/* SIDE POLAROID CARD */}
            <div className="contact-polaroid-side">
              <div className="c-polaroid-frame">
                <img
                  src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=360&auto=format&fit=crop&q=80"
                  alt="Love Letter Memory"
                />
                <span className="c-polaroid-script">Every message brings a smile ♡</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ROMANTIC FAQ ACCORDION SECTION */}
        <motion.div className="contact-faq-section" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <div className="lp-section-header">
            <div className="lp-mini-tag">❓ FREQUENTLY ASKED QUESTIONS</div>
            <h2 className="lp-section-title">Everything You Need to Know ♡</h2>
          </div>

          <div className="faq-accordion-list">
            {faqs.map((faq, idx) => (
              <div
                key={faq.q}
                className={`faq-item-card ${openFaq === idx ? "open" : ""}`}
                onClick={() => {
                  playSparkleSound();
                  setOpenFaq(openFaq === idx ? null : idx);
                }}
              >
                <div className="faq-question">
                  <span>{faq.q}</span>
                  <span className="faq-toggle-icon">{openFaq === idx ? "−" : "+"}</span>
                </div>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      className="faq-answer"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </PublicLayout>
  );
}
