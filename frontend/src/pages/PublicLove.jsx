import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import HeartField from "../components/HeartField.jsx";
import RosePetals from "../components/RosePetals.jsx";
import Fireworks from "../components/Fireworks.jsx";
import ConfettiBurst from "../components/ConfettiBurst.jsx";
import ScreenFade from "../components/ScreenFade.jsx";
import Typewriter from "../components/Typewriter.jsx";
import PersonalAudio from "../components/PersonalAudio.jsx";
import RunawayNo from "../components/RunawayNo.jsx";
import Lightbox from "../components/Lightbox.jsx";
import StatusRecorder from "../components/StatusRecorder.jsx";
import LoveBubbles from "../components/LoveBubbles.jsx";
import GlowOrbs from "../components/GlowOrbs.jsx";
import LoveFinaleStageDecoration from "../components/LoveFinaleStageDecoration.jsx";
import RomanticCertificate from "../components/RomanticCertificate.jsx";
import PaywallModal from "../components/PaywallModal.jsx";
import { getPublicPage, recordView, submitContactMessage } from "../services/api.js";
import { playTone, stopTone } from "../utils/audio.js";

const LOVE_QUOTES = [
  "“I found the one whom my soul loves.”",
  "“In all the world, there is no heart for me like yours.”",
  "“My heart is and always will be yours.”",
  "“Every love story is beautiful, but ours is my favorite.”",
  "“You are my today and all of my tomorrows.”",
  "“Together is a wonderful place to be.”",
];

export default function PublicLove() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [error, setError] = useState("");
  const [expired, setExpired] = useState(false);
  const [screen, setScreen] = useState("welcome");
  const [taunt, setTaunt] = useState("Choose carefully... 💕");
  const [hearts, setHearts] = useState([]);
  const [light, setLight] = useState(null);
  const [started, setStarted] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showCertModal, setShowCertModal] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [showAudioPlayer, setShowAudioPlayer] = useState(true);

  // Contact Admin Modal State
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    topic: `Re-activate sanctuary /love/${slug}`,
    message: `Hello Admin,\n\nI am requesting to re-activate/unlock our love page (/love/${slug}). Please review and enable it.\n\nThank you!`,
  });
  const [contactStatus, setContactStatus] = useState({ sending: false, success: false, error: "" });

  async function handleSendContactAdmin(e) {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setContactStatus({ sending: false, success: false, error: "Please fill in your name, email, and message." });
      return;
    }

    setContactStatus({ sending: true, success: false, error: "" });
    try {
      const res = await submitContactMessage({
        name: contactForm.name.trim(),
        email: contactForm.email.trim(),
        topic: contactForm.topic || `Re-activate /love/${slug}`,
        message: contactForm.message.trim(),
      });
      if (res.success) {
        setContactStatus({ sending: false, success: true, error: "" });
      } else {
        setContactStatus({ sending: false, success: false, error: res.error || "Failed to send message." });
      }
    } catch (err) {
      setContactStatus({ sending: false, success: false, error: err.message || "Failed to send message to admin." });
    }
  }

  useEffect(() => {
    getPublicPage(slug)
      .then((data) => {
        if (data.page) {
          setPage(data.page);
          setError("");
          setExpired(false);
          if (!data.page.isUnlocked) {
            const viewKey = `lovedoes_views_${slug}`;
            let localCurrent = Number(localStorage.getItem(viewKey) || 0) + 1;
            localStorage.setItem(viewKey, localCurrent.toString());

            // Record view in backend DB immediately on page load
            recordView(slug).catch(() => {});

            const serverViews = Number(data.page.views || 0) + 1;
            setViewCount(Math.max(serverViews, localCurrent));
          }
        } else {
          setError(data.error || "This love page has been disabled or is no longer available.");
          setExpired(true);
        }
      })
      .catch((err) => {
        const msg = err?.response?.data?.error || err?.message || "This love page has been disabled or is no longer available.";
        setError(msg);
        setExpired(true);
      });
    return () => stopTone();
  }, [slug]);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % LOVE_QUOTES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const spawnHeart = useCallback((event) => {
    const id = crypto.randomUUID();
    const emojis = ["💖", "💕", "💗", "❤️", "✨", "💞", "🌹", "💘", "💌", "🥰"];
    const quotes = ["I Love You!", "Forever!", "You & Me", "My Soulmate", "Forever Yours", "Pure Magic ✨"];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    setHearts((prev) => [...prev.slice(-20), { id, x: event.clientX, y: event.clientY, emoji, quote }]);
    setTimeout(() => setHearts((prev) => prev.filter((h) => h.id !== id)), 1400);
  }, []);

  function begin() {
    recordView(slug).catch(() => {});
    playTone(page?.music?.tone);
    setStarted(true);
    setScreen("story");
  }

  if (expired || error || !page) {
    return (
      <div className="love-shell classic" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <GlowOrbs />
        <HeartField count={20} />
        <RosePetals count={16} />
        <LoveBubbles count={14} showMessages={false} />

        <motion.div
          className="love-stage glass-panel"
          style={{
            maxWidth: 580,
            width: "100%",
            padding: "40px 30px",
            textAlign: "center",
            borderRadius: 28,
            background: "rgba(18, 4, 15, 0.88)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 158, 187, 0.35)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(255, 42, 117, 0.15)",
          }}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Glowing Animated Heart / Lock Emblem */}
          <motion.div
            style={{
              width: 84,
              height: 84,
              margin: "0 auto 20px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(255, 42, 117, 0.25), rgba(168, 85, 247, 0.25))",
              border: "2px solid rgba(255, 158, 187, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.4rem",
              boxShadow: "0 0 30px rgba(255, 42, 117, 0.4)",
            }}
            animate={{ scale: [1, 1.08, 1], boxShadow: ["0 0 20px rgba(255,42,117,0.3)", "0 0 45px rgba(255,42,117,0.7)", "0 0 20px rgba(255,42,117,0.3)"] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            🔒
          </motion.div>

          {/* Status Pill */}
          <div style={{ marginBottom: 16 }}>
            <span style={{ background: "rgba(255, 42, 117, 0.15)", border: "1px solid rgba(255, 158, 187, 0.4)", color: "#ff9ebb", padding: "6px 16px", borderRadius: 99, fontSize: "0.82rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
              🔒 SANCTUARY PAUSED BY ADMIN
            </span>
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#ffffff", margin: "0 0 14px", lineHeight: 1.3 }}>
            This Love Story Has Gone Quiet 🌙
          </h1>

          <p style={{ color: "rgba(255, 255, 255, 0.78)", fontSize: "0.98rem", lineHeight: 1.65, maxWidth: 460, margin: "0 auto 28px" }}>
            The sanctuary page <code style={{ color: "#ff9ebb", background: "rgba(255, 158, 187, 0.12)", padding: "2px 8px", borderRadius: 6 }}>/love/{slug}</code> is currently paused or temporarily disabled by the site administrator.
          </p>

          {/* Action Buttons Group */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 360, margin: "0 auto" }}>
            <button
              type="button"
              className="btn glow"
              style={{ padding: "12px 24px", fontSize: "0.98rem", fontWeight: 700, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              onClick={() => setShowContactModal(true)}
            >
              <span>💬 Contact Admin to Re-Activate</span>
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Link className="btn secondary" to="/" style={{ padding: "10px 16px", fontSize: "0.88rem", borderRadius: 12, textAlign: "center" }}>
                🏠 Home
              </Link>
              <Link className="btn secondary" to="/create" style={{ padding: "10px 16px", fontSize: "0.88rem", borderRadius: 12, textAlign: "center" }}>
                💖 Create Page
              </Link>
            </div>
          </div>
        </motion.div>

        {/* CONTACT ADMIN MODAL */}
        {showContactModal && (
          <div className="admin-modal-overlay" onClick={() => setShowContactModal(false)}>
            <div className="admin-modal-box" style={{ maxWidth: 540, background: "rgba(18, 4, 15, 0.96)", border: "1px solid rgba(255, 158, 187, 0.4)", borderRadius: 24, padding: 28 }} onClick={(e) => e.stopPropagation()}>
              <button type="button" className="modal-close-x" onClick={() => setShowContactModal(false)}>
                ✕
              </button>

              <h3 style={{ margin: "0 0 6px", color: "#ff9ebb", fontSize: "1.3rem", display: "flex", alignItems: "center", gap: 10 }}>
                <span>💌 Contact Site Admin</span>
              </h3>
              <p style={{ margin: "0 0 20px", color: "rgba(255, 255, 255, 0.7)", fontSize: "0.88rem" }}>
                Send a message to request page re-activation for <code style={{ color: "#ff9ebb" }}>/love/{slug}</code>.
              </p>

              {contactStatus.success ? (
                <div style={{ padding: "30px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: "3rem", marginBottom: 12 }}>✨</div>
                  <h4 style={{ color: "#ffffff", fontSize: "1.2rem", margin: "0 0 8px" }}>Message Sent Successfully!</h4>
                  <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginBottom: 20 }}>
                    The administrator has received your request and will review your sanctuary.
                  </p>
                  <button
                    type="button"
                    className="btn glow"
                    onClick={() => {
                      setShowContactModal(false);
                      setContactStatus({ sending: false, success: false, error: "" });
                    }}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendContactAdmin}>
                  {contactStatus.error && (
                    <div style={{ background: "rgba(231, 76, 60, 0.2)", border: "1px solid rgba(231, 76, 60, 0.5)", color: "#ff7675", padding: "10px 14px", borderRadius: 10, fontSize: "0.85rem", marginBottom: 16 }}>
                      ⚠️ {contactStatus.error}
                    </div>
                  )}

                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label style={{ display: "block", color: "rgba(255,255,255,0.8)", fontSize: "0.82rem", marginBottom: 6, fontWeight: 600 }}>Your Full Name</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Rakesh Kumar / Priya Patel"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label style={{ display: "block", color: "rgba(255,255,255,0.8)", fontSize: "0.82rem", marginBottom: 6, fontWeight: 600 }}>Your Email Address</label>
                    <input
                      type="email"
                      className="admin-input"
                      placeholder="your.email@example.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label style={{ display: "block", color: "rgba(255,255,255,0.8)", fontSize: "0.82rem", marginBottom: 6, fontWeight: 600 }}>Subject / Topic</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={contactForm.topic}
                      onChange={(e) => setContactForm({ ...contactForm, topic: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", color: "rgba(255,255,255,0.8)", fontSize: "0.82rem", marginBottom: 6, fontWeight: 600 }}>Message to Administrator</label>
                    <textarea
                      className="admin-input"
                      style={{ minHeight: 100, fontFamily: "inherit", resize: "vertical" }}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <button
                      type="button"
                      className="btn secondary"
                      onClick={() => setShowContactModal(false)}
                      disabled={contactStatus.sending}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn glow"
                      disabled={contactStatus.sending}
                    >
                      {contactStatus.sending ? "⏳ Sending..." : "💌 Send Request to Admin"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 👑 CHECK PAYWALL EXPIRATION: View limit exceeded (> 3 views) and page is not unlocked by admin/payment
  if (!page.isUnlocked && (viewCount > 3 || (page.views && page.views > 3))) {
    return (
      <div className="love-shell classic" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <GlowOrbs />
        <LoveBubbles count={16} showMessages={false} />
        <PaywallModal
          slug={slug}
          creatorName={page.creatorName}
          partnerName={page.partnerName}
          onUnlocked={() => setPage((p) => ({ ...p, isUnlocked: true }))}
        />
      </div>
    );
  }

  const theme = page.theme?.slug || "classic";
  const creator = page.photos?.find((p) => p.type === "creator" || p.category === "creator") || { file_url: "/creator_avatar.png" };
  const partner = page.photos?.find((p) => p.type === "partner" || p.category === "partner") || { file_url: "/partner_avatar.png" };
  const couple = page.photos?.find((p) => p.type === "couple" || p.category === "couple") || { file_url: "/romantic_sunset_deck_bg.png" };
  const memories = page.memories || [];
  const gallery = [
    creator && { src: creator.file_url, title: page.creatorName },
    partner && { src: partner.file_url, title: page.partnerName },
    couple && { src: couple.file_url, title: "Us Together" },
    ...memories.filter((m) => m.photo_url).map((m) => ({ src: m.photo_url, title: m.title })),
  ].filter(Boolean);

  const customBg = page.theme?.bgUrl || page.theme?.bg_url || "/image.png";
  const shellBgStyle = {
    backgroundImage: `linear-gradient(180deg, rgba(20, 3, 12, 0.2) 0%, rgba(10, 2, 7, 0.35) 100%), url(${customBg})`
  };

  return (
    <div className={`love-shell ${theme}`} style={shellBgStyle} onClick={spawnHeart}>
      {/* Dynamic ambient lighting & romantic particle backgrounds */}
      <GlowOrbs />
      <HeartField count={24} />
      <RosePetals count={20} />

      {/* Target Image Ambient Decorations (Left/Right Hearts, Cloud Beds, Badges) */}
      {screen === "finale" && <LoveFinaleStageDecoration />}

      {/* Floating Love Bubbles */}
      {screen === "finale" ? (
        <LoveBubbles count={36} showMessages />
      ) : (
        <LoveBubbles count={16} showMessages={false} />
      )}

      {/* Interactive tap hearts & quotes */}
      {hearts.map((h) => (
        <div key={h.id} className="click-heart-box" style={{ left: h.x, top: h.y }}>
          <span className="click-heart-emoji">{h.emoji}</span>
          <span className="click-heart-quote">{h.quote}</span>
        </div>
      ))}

      {/* Finale Fireworks & Confetti */}
      {screen === "finale" && (
        <>
          <ConfettiBurst />
          <Fireworks />
        </>
      )}

      <Lightbox src={light?.src} title={light?.title} onClose={() => setLight(null)} />

      <div className="love-stage">
        {/* Removed duplicate PersonalAudio tag that caused dual playback - playback is handled exclusively by the floating player below */}

        <AnimatePresence mode="wait">
          {/* ───────── 1. WELCOME SCREEN (EXACT TARGET MATCH) ───────── */}
          {screen === "welcome" && (
            <ScreenFade screenKey="welcome">
              <div className="target-welcome-container">
                {/* Top Quote Ribbon */}
                <div className="target-top-quote-bar">
                  <svg className="quote-flourish left" width="80" height="12" viewBox="0 0 80 12" fill="none">
                    <path d="M0 6H60M60 6C65 2 70 10 75 6" stroke="rgba(255, 182, 193, 0.6)" strokeWidth="1.2"/>
                    <circle cx="78" cy="6" r="2" fill="#ff7ea8"/>
                  </svg>
                  <span className="quote-heart-icon">💕</span>
                  <span className="quote-main-text">{LOVE_QUOTES[quoteIndex]}</span>
                  <span className="quote-heart-icon">💕</span>
                  <svg className="quote-flourish right" width="80" height="12" viewBox="0 0 80 12" fill="none">
                    <path d="M80 6H20M20 6C15 2 10 10 5 6" stroke="rgba(255, 182, 193, 0.6)" strokeWidth="1.2"/>
                    <circle cx="2" cy="6" r="2" fill="#ff7ea8"/>
                  </svg>
                </div>

                {/* Main Glassmorphism Card */}
                <div className="glass-panel target-exact-welcome-card">
                  {/* Top Circle Ring Badge with Envelope */}
                  <div className="target-emblem-wrapper">
                    <svg className="emblem-flourish-left" width="80" height="30" viewBox="0 0 80 30" fill="none">
                      <path d="M80 15 C60 15 50 2 30 15 C18 22 8 8 0 15" stroke="rgba(255, 182, 193, 0.75)" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="4" cy="15" r="2.5" fill="#ff7ea8"/>
                      <circle cx="30" cy="5" r="1.5" fill="#ffd166"/>
                    </svg>

                    <div className="target-glowing-ring">
                      <div className="target-envelope-icon-box">
                        <svg width="42" height="34" viewBox="0 0 42 34" fill="none">
                          <path d="M3 5 C3 3.89543 3.89543 3 5 3 H37 C38.1046 3 39 3.89543 39 5 V29 C39 30.1046 38.1046 31 37 31 H5 C3.89543 31 3 30.1046 3 29 V5 Z" fill="#FFFFFF" stroke="rgba(255, 182, 193, 0.5)" strokeWidth="1"/>
                          <path d="M3 6 L21 20 L39 6" stroke="#ff4f81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 28 L15 17" stroke="rgba(255, 182, 193, 0.4)" strokeWidth="1.5"/>
                          <path d="M39 28 L27 17" stroke="rgba(255, 182, 193, 0.4)" strokeWidth="1.5"/>
                          <circle cx="21" cy="18" r="6.5" fill="#ff2a75"/>
                          <path d="M21 16.2 C21 16.2 19.5 14.5 18.2 15.6 C17.2 16.5 18 18 21 20 C24 18 24.8 16.5 23.8 15.6 C22.5 14.5 21 16.2 21 16.2 Z" fill="#FFFFFF"/>
                        </svg>
                      </div>
                    </div>

                    <svg className="emblem-flourish-right" width="80" height="30" viewBox="0 0 80 30" fill="none">
                      <path d="M0 15 C20 15 30 2 50 15 C62 22 72 8 80 15" stroke="rgba(255, 182, 193, 0.75)" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="76" cy="15" r="2.5" fill="#ff7ea8"/>
                      <circle cx="50" cy="5" r="1.5" fill="#ffd166"/>
                    </svg>
                  </div>

                  {/* Pill Badge */}
                  {!page.isUnlocked && viewCount > 0 && viewCount <= 3 && (
                    <div style={{ marginBottom: 12, background: "rgba(255, 209, 102, 0.18)", border: "1px solid rgba(255, 209, 102, 0.5)", color: "#ffd166", padding: "4px 14px", borderRadius: 99, fontSize: "0.8rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, backdropFilter: "blur(8px)" }}>
                      <span>👑 Free Preview: View {viewCount} of 3</span>
                    </div>
                  )}

                  <div className="target-pill-badge">
                    <span className="badge-heart">💕</span>
                    <span className="badge-text">A DIGITAL LOVE STORY</span>
                    <span className="badge-heart">💕</span>
                  </div>

                  {/* Main Title Heading */}
                  <div className="target-title-wrapper">
                    <h1 className="target-made-title">
                      Made just for{" "}
                      <span className="target-you-script">
                        you
                        <span className="target-you-heart-flourish">♡</span>
                      </span>
                    </h1>
                    <svg className="target-title-flourish" width="280" height="32" viewBox="0 0 280 32" fill="none">
                      <path d="M15 10 C70 26 160 28 240 8 M170 14 C195 30 225 4 245 20 M245 20 C255 28 265 16 258 8 C250 0 240 13 252 22" stroke="#ff7ea8" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="265" cy="20" r="3" fill="#ff4f81"/>
                    </svg>
                  </div>

                  {/* Names Subtitle Row */}
                  <div className="target-names-sub-row">
                    <span className="target-creator-name">{page.creatorName || "Manish Kumar"}</span>
                    <span className="target-wrote-for-text">wrote this for</span>
                    <span className="target-partner-name">{page.partnerName || "Lcky patel"}</span>
                  </div>

                  {/* Instruction Subtext */}
                  <p className="target-instruction-text">
                    Take a deep breath. Don't rush. This is yours.
                  </p>

                  {/* Start Button */}
                  <motion.button
                    className="target-start-story-btn"
                    type="button"
                    onClick={(e) => { e.stopPropagation(); begin(); }}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="btn-heart-prefix">♥</span>
                    <span className="btn-label-text">Start Our Story</span>
                    <span className="btn-arrow-suffix">→</span>
                  </motion.button>

                  {/* Bottom Decorative Flourish */}
                  <div className="target-bottom-flourish">
                    <svg width="240" height="20" viewBox="0 0 240 20" fill="none">
                      <path d="M10 10 C60 18 90 2 120 10 C150 18 180 2 230 10" stroke="rgba(255, 182, 193, 0.6)" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="10" cy="10" r="3" fill="#ff7ea8"/>
                      <circle cx="120" cy="10" r="2.5" fill="#ffd166"/>
                      <circle cx="230" cy="10" r="3" fill="#ff7ea8"/>
                    </svg>
                  </div>
                </div>
              </div>
            </ScreenFade>
          )}

          {/* ───────── 2. STORY / COUPLE SCREEN ───────── */}
          {screen === "story" && (
            <ScreenFade screenKey="story">
              <div className="glass-panel target-exact-welcome-card compact-one-page">
                <div className="target-pill-badge">
                  <span className="badge-heart">🌹</span>
                  <span className="badge-text">{page.occasion || "OUR LOVE STORY"}</span>
                  <span className="badge-heart">🌹</span>
                </div>

                <h2 className="compact-headline">
                  Every beautiful story has a beginning...
                </h2>

                {/* Horizontal Trio Showcase */}
                <div className="compact-photo-trio">
                  {creator && (
                    <motion.div
                      className="compact-photo-card"
                      initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
                      animate={{ opacity: 1, scale: 1, rotate: -3 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="compact-photo-frame">
                        <img src={creator.file_url} alt={page.creatorName} loading="lazy" decoding="async" />
                      </div>
                      <span className="compact-photo-label">{page.creatorName}</span>
                    </motion.div>
                  )}

                  <div className="compact-heart-pulse-center">
                    <motion.div
                      className="pulse-heart-ring"
                      animate={{ scale: [1, 1.25, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      💖
                    </motion.div>
                    <span className="pulse-heart-tag">Two Hearts</span>
                  </div>

                  {partner && (
                    <motion.div
                      className="compact-photo-card"
                      initial={{ opacity: 0, scale: 0.8, rotate: 6 }}
                      animate={{ opacity: 1, scale: 1, rotate: 3 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <div className="compact-photo-frame">
                        <img src={partner.file_url} alt={page.partnerName} loading="lazy" decoding="async" />
                      </div>
                      <span className="compact-photo-label">{page.partnerName}</span>
                    </motion.div>
                  )}
                </div>

                {couple && (
                  <motion.div
                    className="compact-couple-banner"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <img src={couple.file_url} alt="Us Together" loading="lazy" decoding="async" />
                    <span className="compact-couple-tag">Us Together 💕</span>
                  </motion.div>
                )}

                <div className="compact-names-row">
                  <span className="target-creator-name">{page.creatorName}</span>
                  <span className="compact-amp">&amp;</span>
                  <span className="target-partner-name">{page.partnerName}</span>
                </div>

                <motion.button
                  className="target-start-story-btn compact-btn"
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setScreen("memories"); }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="btn-label-text">Continue to Memories</span>
                  <span className="btn-arrow-suffix">→</span>
                </motion.button>
              </div>
            </ScreenFade>
          )}

          {/* ───────── 3. MEMORIES SCREEN ───────── */}
          {screen === "memories" && (
            <ScreenFade screenKey="memories">
              <div className="glass-panel target-exact-welcome-card compact-one-page">
                <div className="target-pill-badge">
                  <span className="badge-heart">📖</span>
                  <span className="badge-text">SWEET MEMORIES</span>
                  <span className="badge-heart">📖</span>
                </div>
                <h2 className="compact-headline">Moments Frozen in Time</h2>
                
                <div className="compact-gallery-row">
                  {gallery.slice(0, 3).map((item, idx) => (
                    <motion.button
                      type="button"
                      className="compact-polaroid"
                      key={item.src}
                      onClick={(e) => { e.stopPropagation(); setLight(item); }}
                      initial={{ opacity: 0, y: 15, rotate: idx % 2 === 0 ? -3 : 3 }}
                      animate={{ opacity: 1, y: 0, rotate: idx % 2 === 0 ? -3 : 3 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.08, rotate: 0 }}
                    >
                      <img src={item.src} alt={item.title} />
                      <span className="polaroid-label">{item.title}</span>
                    </motion.button>
                  ))}
                </div>

                {memories.length > 0 && (
                  <div className="compact-timeline-strip">
                    {memories.slice(0, 2).map((m) => (
                      <div className="timeline-strip-item" key={m.title}>
                        <span className="strip-dot">✨</span>
                        <strong>{m.title}:</strong>
                        <span>{m.description}</span>
                      </div>
                    ))}
                  </div>
                )}

                <motion.button
                  className="target-start-story-btn compact-btn"
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setScreen("message"); }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="btn-label-text">Read Love Letter</span>
                  <span className="btn-arrow-suffix">→</span>
                </motion.button>
              </div>
            </ScreenFade>
          )}

          {/* ───────── 4. MESSAGE / LETTER SCREEN ───────── */}
          {screen === "message" && (
            <ScreenFade screenKey="message">
              <div className="glass-panel target-exact-welcome-card compact-one-page">
                <div className="target-pill-badge">
                  <span className="badge-heart">💌</span>
                  <span className="badge-text">LETTER FROM THE HEART</span>
                  <span className="badge-heart">💌</span>
                </div>
                <h2 className="compact-headline">From My Heart To Yours</h2>
                <div className="compact-letter-box">
                  <Typewriter
                    speed={22}
                    className="message-box glow-text love-letter-text"
                    text={page.message || "Some people come into our lives and make everything more beautiful."}
                  />
                </div>
                <p className="compact-letter-signature">— {page.creatorName} 💕</p>

                <motion.button
                  className="target-start-story-btn compact-btn"
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setScreen("spark"); }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="btn-label-text">Continue</span>
                  <span className="btn-arrow-suffix">→</span>
                </motion.button>
              </div>
            </ScreenFade>
          )}

          {/* ───────── 5. SPARK / PAUSE SCREEN ───────── */}
          {screen === "spark" && (
            <ScreenFade screenKey="spark">
              <div className="glass-panel target-exact-welcome-card compact-one-page">
                <motion.div
                  className="compact-spark-orb"
                  animate={{
                    scale: [1, 1.25, 1],
                    boxShadow: [
                      "0 0 30px rgba(255, 79, 129, 0.4)",
                      "0 0 80px rgba(255, 79, 129, 0.85)",
                      "0 0 30px rgba(255, 79, 129, 0.4)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="spark-emoji">💫</span>
                </motion.div>
                <h2 className="compact-headline">A little pause, for your heart</h2>
                <div className="compact-spark-text">
                  <Typewriter text="Breathe. The next question is only for you." />
                </div>
                <motion.button
                  className="target-start-story-btn compact-btn"
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setScreen("proposal"); }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="btn-label-text">I'm ready ✨</span>
                </motion.button>
              </div>
            </ScreenFade>
          )}

          {/* ───────── 6. PROPOSAL SCREEN ───────── */}
          {screen === "proposal" && (
            <ScreenFade screenKey="proposal">
              <div className="glass-panel target-exact-welcome-card compact-one-page">
                <motion.div
                  className="compact-proposal-heart"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  💖
                </motion.div>
                <h1 className="compact-proposal-headline">Will you be my Valentine?</h1>
                <p className="taunt love-taunt">{taunt}</p>
                <div className="proposal-actions">
                  <motion.button
                    className="target-start-story-btn compact-btn yes-glow"
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setScreen("finale"); }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    YES ❤️
                  </motion.button>
                  <RunawayNo onTaunt={setTaunt} />
                </div>
              </div>
            </ScreenFade>
          )}

          {/* ───────── 7. FINALE / CELEBRATION SCREEN (EXACT TARGET MATCH) ───────── */}
          {screen === "finale" && (
            <ScreenFade screenKey="finale">
              <div className="target-card-container">
                {/* Overlapping Top 3D YES! Heart Emblem */}
                <motion.div
                  className="target-top-heart-badge"
                  initial={{ scale: 0, y: -20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 220, delay: 0.2 }}
                >
                  <div className="sparkle-rays" />
                  <span className="yes-emblem-text">YES!</span>
                </motion.div>

                <div className="glass-panel target-finale-panel">
                  {/* YOU SAID YES Pill Badge */}
                  <motion.div
                    className="target-you-said-yes-badge"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    ✨ YOU SAID YES ✨
                  </motion.div>

                  {/* Heading: You Said YES! */}
                  <motion.h1
                    className="target-headline"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    You said <span className="target-gold-yes">YES!</span>
                  </motion.h1>

                  {/* Names Calligraphy: Manish Kumar ♡ / ♡ Lucky Patel ♡ */}
                  <motion.div
                    className="target-names-container"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="target-name-row">
                      <span className="target-script-name">{page.creatorName}</span>
                      <span className="target-pink-heart-outline">♡</span>
                    </div>
                    <div className="target-name-row">
                      <span className="target-pink-heart-outline">♡</span>
                      <span className="target-script-name">{page.partnerName}</span>
                      <span className="target-pink-heart-outline">♡</span>
                    </div>
                  </motion.div>

                  {/* Subtitle Ribbon: Two Hearts ♥ One Story ♥ Forever & Always */}
                  <div className="target-ribbon-subtitle">
                    <span>Two Hearts</span>
                    <span className="ribbon-bullet">♥</span>
                    <span>One Story</span>
                    <span className="ribbon-bullet">♥</span>
                    <span>Forever & Always</span>
                  </div>

                  {/* Polaroid Photo Frames Section */}
                  <motion.div
                    className="target-photos-row"
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    {creator && (
                      <div className="target-polaroid-frame left-tilt">
                        <div className="polaroid-tape" />
                        <img src={creator.file_url} alt={page.creatorName} loading="lazy" decoding="async" />
                        <span className="target-name-pill">{page.creatorName}</span>
                      </div>
                    )}

                    {/* Center Crown & Forever 3D Seal */}
                    <div className="target-center-seal">
                      <span className="seal-crown">👑</span>
                      <div className="seal-heart">
                        <span className="seal-text">Forever</span>
                      </div>
                    </div>

                    {partner && (
                      <div className="target-polaroid-frame right-tilt">
                        <div className="polaroid-tape" />
                        <img src={partner.file_url} alt={page.partnerName} loading="lazy" decoding="async" />
                        <span className="target-name-pill">{page.partnerName}</span>
                      </div>
                    )}
                  </motion.div>

                  {/* Subtitle Note */}
                  <div className="target-footer-note">
                    💕 A digital love story, created just for the two of you. 💕
                  </div>

                  {/* EMBEDDED DYNAMIC ROMANTIC CERTIFICATE OF ETERNAL LOVE */}
                  <div className="target-cert-embedded-box" style={{ marginTop: "24px", width: "100%" }}>
                    <RomanticCertificate
                      creatorName={page.creatorName || "Manish Kumar"}
                      partnerName={page.partnerName || "Lucky Patel"}
                    />
                  </div>

                  {/* Buttons Layout Matching Target */}
                  <div className="target-buttons-group" style={{ marginTop: "20px" }}>
                    {/* Primary Button: 30s Status Video Recording & Auto Download */}
                    <StatusRecorder
                      page={page}
                      photos={{
                        creator: creator?.file_url,
                        partner: partner?.file_url,
                        couple: couple?.file_url,
                      }}
                    />

                    {/* Secondary Buttons Row */}
                    <div className="target-secondary-row">
                      <button
                        className="target-secondary-btn"
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setScreen("welcome"); setStarted(false); }}
                      >
                        <span className="sec-icon">▶</span>
                        <span>Replay Love Story</span>
                      </button>

                      <Link className="target-secondary-btn" to="/create">
                        <span className="sec-icon">✏</span>
                        <span>Create Your Own Love Page</span>
                      </Link>
                    </div>

                    {/* KNOW MORE ABOUT DEVELOPER SECTION */}
                    <div className="developer-social-section" style={{ marginTop: "28px" }}>
                      <h4 className="developer-title">Know More About Developer</h4>
                      <div className="developer-social-icons">
                        <a
                          href="https://www.instagram.com/manishpatel1946/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon-btn insta"
                          aria-label="Instagram"
                          title="Instagram Profile"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                          </svg>
                        </a>

                        <a
                          href="https://www.linkedin.com/in/manish-kumar-016b0827a/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon-btn linkedin"
                          aria-label="LinkedIn"
                          title="LinkedIn Profile"
                        >
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.67a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScreenFade>
          )}
        </AnimatePresence>

        {/* POPUP FULLSCREEN CERTIFICATE MODAL */}
        {showCertModal && (
          <div className="cert-modal-overlay" onClick={() => setShowCertModal(false)}>
            <motion.div
              className="cert-modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <button
                type="button"
                className="cert-modal-close-btn"
                onClick={() => setShowCertModal(false)}
              >
                ✕
              </button>
              <RomanticCertificate
                creatorName={page.creatorName || "Kumar"}
                partnerName={page.partnerName || "Bhumi Kashyap"}
              />
            </motion.div>
          </div>
        )}
        {/* FLOATING BACKGROUND AUDIO PLAYER WITH TOGGLE */}
        {started && (page.audioUrl || page.music?.fileUrl) && (
          <motion.div
            style={{
              position: "fixed",
              bottom: 24,
              right: 24,
              zIndex: 9999,
              background: "rgba(25, 4, 16, 0.9)",
              backdropFilter: "blur(12px)",
              padding: "6px 12px",
              borderRadius: 50,
              border: "1px solid rgba(255, 180, 205, 0.4)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
            initial={false}
            animate={{ width: showAudioPlayer ? "auto" : 48 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setShowAudioPlayer(!showAudioPlayer); }}
              style={{
                background: "transparent",
                border: "none",
                color: "#ff9ebb",
                fontSize: "1.1rem",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 24,
                height: 24,
                outline: "none"
              }}
            >
              {showAudioPlayer ? "🎵" : "🎶"}
            </button>
            <audio
              controls
              autoPlay
              loop
              src={page.audioUrl || page.music?.fileUrl}
              style={{
                height: 32,
                maxWidth: 210,
                display: showAudioPlayer ? "block" : "none"
              }}
            />
            {showAudioPlayer && (
              <button
                onClick={(e) => { e.stopPropagation(); setShowAudioPlayer(false); }}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "#ff9ebb",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 4,
                  outline: "none"
                }}
              >
                ➔
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
