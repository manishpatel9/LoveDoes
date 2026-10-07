import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { playSparkleSound, playHeartbeatSound, playRomanticChime } from "../utils/audioSynth.js";

const SLIDES = [
  {
    id: 1,
    theme: "dark-velvet",
    eyebrow: "REAL EMOTIONS ✦ BEAUTIFUL WORDS ✦ LASTING MEMORIES",
    title: "Turn Your Love Story into an Unforgettable Digital Experience.",
    subtitle: "A private, interactive romantic sanctuary — prefilled with your names, intimate photos, secret songs, and a message that unfolds like magic.",
    type: "hero",
  },
  {
    id: 2,
    theme: "soft-blush",
    eyebrow: "BEAUTIFULLY PERSONALIZED",
    title: "Your Valentine's Day Just Got More Special. 💕",
    subtitle: "Create a private space filled with love, memories and little surprises — Just for the two of you.",
    type: "personalized-form",
  },
  {
    id: 3,
    theme: "night-bokeh",
    eyebrow: "CAPTURE ✦ CHERISH ✦ RELIVE",
    title: "Your Photos. Your Story.",
    subtitle: "Add your favorite photos, create beautiful moments, and relive your love story anytime, anywhere.",
    type: "photos-showcase",
  },
  {
    id: 4,
    theme: "rose-sunset",
    eyebrow: "MUSIC ✦ FEELINGS ✦ TOGETHER",
    title: "Your Love Soundtrack. 💕",
    subtitle: "Add your favorite songs and let the music tell your love story, just the way you feel it.",
    type: "soundtrack-player",
  },
  {
    id: 5,
    theme: "crimson-letter",
    eyebrow: "SWEET ✦ PERSONAL ✦ FOREVER",
    title: "A Message That Touches the Heart. 💕",
    subtitle: "Write a special message for your partner — or choose from our heartfelt pre-written templates.",
    type: "love-letter",
  },
  {
    id: 6,
    theme: "pink-occasions",
    eyebrow: "FOR EVERY OCCASION",
    title: "More Than Just Valentine's Day. 💕",
    subtitle: "Every love story deserves a special moment — and we're here for all of them.",
    type: "occasions-grid",
  },
  {
    id: 7,
    theme: "dark-devices",
    eyebrow: "ACCESS ✦ ANYTIME ✦ ANYWHERE",
    title: "On Your Phone, Tablet or Desktop. 💕",
    subtitle: "Your love story, always within reach — wherever you are, whenever you want.",
    type: "multi-device",
  },
  {
    id: 8,
    theme: "cream-testimonial",
    eyebrow: "REAL STORIES ✦ REAL PEOPLE",
    title: "Because Every Couple Deserves a LoveDoes. 💕",
    subtitle: "Join thousands of couples who have already created their own magical space.",
    type: "social-proof",
  },
  {
    id: 9,
    theme: "rich-cta",
    eyebrow: "READY TO CREATE YOURS?",
    title: "Your Love Story Awaits... 💕",
    subtitle: "Personalize ✦ Celebrate ✦ Keep Forever",
    type: "cta-banner",
  },
  {
    id: 10,
    theme: "sunset-sanctuary",
    eyebrow: "REAL LOVE ✦ REAL MOMENTS ✦ LOVEDOES",
    title: "Same Love... New Memories Everyday. ♡",
    subtitle: "Made slowly, for people who still believe in surprises.",
    type: "footer-sunset",
  },
];

export default function TenSlidesCarousel() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [viewMode, setViewMode] = useState("slider"); // "slider" or "stack"
  const [valentineName, setValentineName] = useState("Ananya");
  const [occasion, setOccasion] = useState("Valentine's Day");
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const touchStartX = useRef(0);

  // Autoplay timer
  useEffect(() => {
    if (!isAutoplay || viewMode !== "slider") return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isAutoplay, viewMode]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (viewMode !== "slider") return;
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, currentIndex]);

  const nextSlide = () => {
    playSparkleSound();
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    playSparkleSound();
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const goToSlide = (idx) => {
    playHeartbeatSound();
    setCurrentIndex(idx);
  };

  const handleStartStory = () => {
    playRomanticChime();
    navigate("/create", {
      state: {
        partnerName: valentineName,
        occasion: occasion,
      },
    });
  };

  // Touch Swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  };

  // Render individual slide content
  const renderSlideContent = (slide) => {
    switch (slide.type) {
      case "hero":
        return (
          <div className="slide-hero-layout">
            <div className="slide-text-col">
              <span className="slide-eyebrow">{slide.eyebrow}</span>
              <h1 className="slide-title">{slide.title}</h1>
              <p className="slide-subtitle">{slide.subtitle}</p>
            </div>
            <div className="slide-visual-col">
              <div className="tablet-frame-wrapper">
                <div className="tablet-screen">
                  <span className="tablet-script">Your Story<br />Your Way</span>
                  <div className="play-heart-btn">💖</div>
                </div>
                <div className="side-polaroid polaroid-kiss">
                  <img
                    src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&auto=format&fit=crop&q=80"
                    alt="Couple Kissing"
                  />
                </div>
                <div className="side-rose">🌹</div>
              </div>
            </div>
          </div>
        );

      case "personalized-form":
        return (
          <div className="slide-form-layout">
            <div className="slide-text-col">
              <span className="slide-eyebrow">{slide.eyebrow}</span>
              <h2 className="slide-title">{slide.title}</h2>
              <p className="slide-subtitle">{slide.subtitle}</p>
            </div>
            <div className="slide-visual-col">
              <div className="personalized-widget-card">
                <div className="form-row-2">
                  <div className="form-field-item">
                    <label>♥ YOUR VALENTINE</label>
                    <input
                      type="text"
                      value={valentineName}
                      onChange={(e) => setValentineName(e.target.value)}
                      placeholder="Partner's Name"
                    />
                  </div>
                  <div className="form-field-item">
                    <label>♥ YOUR OCCASION</label>
                    <select value={occasion} onChange={(e) => setOccasion(e.target.value)}>
                      <option value="Valentine's Day">♥ Valentine's Day</option>
                      <option value="Anniversary">💍 Anniversary</option>
                      <option value="Birthday">🎂 Birthday</option>
                      <option value="Proposal">🌹 Proposal</option>
                    </select>
                  </div>
                </div>
                <button type="button" className="btn pink-glow-btn" onClick={handleStartStory}>
                  Create Your Experience →
                </button>
                <p className="widget-tagline">♡ Because love deserves a place ♡</p>
              </div>
            </div>
          </div>
        );

      case "photos-showcase":
        return (
          <div className="slide-photos-layout">
            <div className="slide-text-col">
              <span className="slide-eyebrow">{slide.eyebrow}</span>
              <h2 className="slide-title">{slide.title}</h2>
              <p className="slide-subtitle">{slide.subtitle}</p>
            </div>
            <div className="slide-visual-col">
              <div className="photos-deck-wrapper">
                <div className="polaroid-main">
                  <img
                    src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80"
                    alt="Sunset Couple"
                  />
                  <span className="polaroid-caption-script">You & Me ♡</span>
                </div>
                <div className="polaroid-back-left">
                  <img
                    src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=300&auto=format&fit=crop&q=80"
                    alt="Couple Memory"
                  />
                </div>
                <div className="handwritten-arrow-note">
                  <span>Your Memories<br />in One Place ♡</span>
                  <span className="curved-arrow">⤤</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "soundtrack-player":
        return (
          <div className="slide-music-layout">
            <div className="slide-text-col">
              <span className="slide-eyebrow">{slide.eyebrow}</span>
              <h2 className="slide-title">{slide.title}</h2>
              <p className="slide-subtitle">{slide.subtitle}</p>
            </div>
            <div className="slide-visual-col">
              <div className="music-player-widget">
                <div className="player-header">
                  <span>♥ Our Playlist</span>
                </div>
                <div className="player-body">
                  <img
                    src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=80"
                    alt="Album Art"
                    className="album-cover"
                  />
                  <div className="track-details">
                    <strong className="track-title">Perfect</strong>
                    <span className="track-artist">Ed Sheeran</span>
                  </div>
                </div>
                <div className="player-controls">
                  <button type="button" className="ctrl-btn">⏮</button>
                  <button
                    type="button"
                    className="ctrl-btn play-pause"
                    onClick={() => {
                      playSparkleSound();
                      setIsPlayingMusic(!isPlayingMusic);
                    }}
                  >
                    {isPlayingMusic ? "⏸" : "▶"}
                  </button>
                  <button type="button" className="ctrl-btn">⏭</button>
                </div>
                <div className="progress-bar-line">
                  <span className="time-lbl">1:42</span>
                  <div className="bar-track"><div className="bar-fill" style={{ width: "42%" }} /></div>
                  <span className="time-lbl">4:23</span>
                </div>
                <div className="handwritten-music-note">
                  <span>Songs that bring<br />you closer ♡</span>
                  <span className="notes-icon">🎵 🎶</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "love-letter":
        return (
          <div className="slide-letter-layout">
            <div className="slide-text-col">
              <span className="slide-eyebrow">{slide.eyebrow}</span>
              <h2 className="slide-title">{slide.title}</h2>
              <p className="slide-subtitle">{slide.subtitle}</p>
            </div>
            <div className="slide-visual-col">
              <div className="letter-envelope-wrapper">
                <div className="red-envelope-bg">
                  <div className="letter-card-paper">
                    <span className="paper-heading">A Little Message<br />Just For You</span>
                    <p className="paper-quote">“No matter where life takes us, my heart will always find you.”</p>
                    <span className="paper-heart">♥</span>
                  </div>
                </div>
                <div className="handwritten-letter-note">
                  <span>Words that<br />matter ♡</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "occasions-grid":
        return (
          <div className="slide-occasions-layout">
            <div className="slide-text-col text-center">
              <span className="slide-eyebrow">{slide.eyebrow}</span>
              <h2 className="slide-title">{slide.title}</h2>
              <p className="slide-subtitle">{slide.subtitle}</p>
            </div>
            <div className="occasions-chips-row">
              {[
                { label: "Valentine's Day", icon: "💖" },
                { label: "Anniversary", icon: "💍" },
                { label: "Birthday", icon: "🎂" },
                { label: "Just Because", icon: "💖" },
                { label: "Special Moments", icon: "⭐" },
              ].map((occ) => (
                <div
                  key={occ.label}
                  className="occasion-card-chip"
                  onClick={() => {
                    playSparkleSound();
                    setOccasion(occ.label);
                    handleStartStory();
                  }}
                >
                  <span className="chip-icon">{occ.icon}</span>
                  <span className="chip-name">{occ.label}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "multi-device":
        return (
          <div className="slide-devices-layout">
            <div className="slide-text-col">
              <span className="slide-eyebrow">{slide.eyebrow}</span>
              <h2 className="slide-title">{slide.title}</h2>
              <p className="slide-subtitle">{slide.subtitle}</p>
            </div>
            <div className="slide-visual-col">
              <div className="devices-mockup-group">
                <div className="device-laptop">
                  <div className="device-screen">
                    <span className="mini-title">Turn Your Love Story...</span>
                  </div>
                </div>
                <div className="device-tablet">
                  <div className="device-screen" />
                </div>
                <div className="device-phone">
                  <div className="device-screen" />
                </div>
                <div className="handwritten-device-note">
                  <span>Anywhere<br />Anytime ♡</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "social-proof":
        return (
          <div className="slide-testimonial-layout">
            <div className="slide-text-col">
              <span className="slide-eyebrow">{slide.eyebrow}</span>
              <h2 className="slide-title">{slide.title}</h2>
              <p className="slide-subtitle">{slide.subtitle}</p>
            </div>
            <div className="slide-visual-col">
              <div className="testimonial-polaroid-box">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
                  alt="Priya & Arjun"
                />
                <div className="testimonial-quote-box">
                  <p className="testimonial-quote">“It's not just a website, it's our little world. ♡”</p>
                  <span className="testimonial-author">- Priya & Arjun</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "cta-banner":
        return (
          <div className="slide-cta-layout text-center">
            <span className="slide-eyebrow">{slide.eyebrow}</span>
            <h2 className="slide-title">{slide.title}</h2>
            <p className="slide-subtitle">{slide.subtitle}</p>
            <div className="cta-action-wrap">
              <button type="button" className="btn pink-glow-btn main-cta" onClick={handleStartStory}>
                Create Your Experience →
              </button>
              <p className="cta-sub-tag">Because every love story is unique ♡</p>
              <div className="ribbon-gift-box">🎁</div>
            </div>
          </div>
        );

      case "footer-sunset":
        return (
          <div className="slide-sunset-layout text-center">
            <div className="sunset-silhouette-bg">
              <div className="silhouette-couples" />
            </div>
            <span className="slide-eyebrow">{slide.eyebrow}</span>
            <h2 className="slide-title">{slide.title}</h2>
            <p className="slide-subtitle">{slide.subtitle}</p>
            <div className="footer-links-strip">
              <span>Real Love</span> ✦ <span>Real Moments</span> ✦ <span>LoveDoes</span>
            </div>
            <button
              type="button"
              className="btn glow"
              onClick={handleStartStory}
              style={{ marginTop: 20 }}
            >
              Start Creating Our Page Now ❤️
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const currentSlide = SLIDES[currentIndex];

  return (
    <div className="ten-slides-container">
      {/* Control Bar Header */}
      <div className="slides-control-bar">
        <div className="left-controls">
          <span className="slide-badge">
            SLIDE {String(currentIndex + 1).padStart(2, "0")} / {SLIDES.length}
          </span>
          <button
            type="button"
            className="autoplay-toggle-btn"
            onClick={() => {
              playSparkleSound();
              setIsAutoplay(!isAutoplay);
            }}
          >
            {isAutoplay ? "⏸ Pause Autoplay" : "▶ Start Autoplay"}
          </button>
        </div>

        <div className="right-controls">
          <button
            type="button"
            className={`view-mode-btn ${viewMode === "slider" ? "active" : ""}`}
            onClick={() => setViewMode("slider")}
          >
            🎞️ Slide Mode
          </button>
          <button
            type="button"
            className={`view-mode-btn ${viewMode === "stack" ? "active" : ""}`}
            onClick={() => setViewMode("stack")}
          >
            📜 Full Story View
          </button>
        </div>
      </div>

      {/* Slider View Mode */}
      {viewMode === "slider" ? (
        <div
          className={`slider-stage-wrapper ${currentSlide.theme}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Arrow Buttons */}
          <button type="button" className="nav-arrow left-arrow" onClick={prevSlide} aria-label="Previous Slide">
            ‹
          </button>
          <button type="button" className="nav-arrow right-arrow" onClick={nextSlide} aria-label="Next Slide">
            ›
          </button>

          {/* Animated Slide Frame */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              className="slide-content-frame"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderSlideContent(currentSlide)}
            </motion.div>
          </AnimatePresence>

          {/* Pagination Indicators */}
          <div className="slider-dots-bar">
            {SLIDES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                className={`dot ${idx === currentIndex ? "active" : ""}`}
                onClick={() => goToSlide(idx)}
                title={`Slide ${idx + 1}: ${s.title}`}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Full Story Vertical Scroll View Mode */
        <div className="full-story-stack">
          {SLIDES.map((s) => (
            <div key={s.id} className={`stack-slide-card ${s.theme}`}>
              {renderSlideContent(s)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
