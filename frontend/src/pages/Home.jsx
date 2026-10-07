import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PublicLayout from "../layouts/PublicLayout.jsx";
import CursorStardust from "../components/CursorStardust.jsx";
import AudioSoundtrackBar from "../components/AudioSoundtrackBar.jsx";
import LoveBubbles from "../components/LoveBubbles.jsx";
import RosePetals from "../components/RosePetals.jsx";
import GlowOrbs from "../components/GlowOrbs.jsx";
import HeroTopSection from "../components/HeroTopSection.jsx";
import InteractiveValentineCard from "../components/InteractiveValentineCard.jsx";
import TenSlidesCarousel from "../components/TenSlidesCarousel.jsx";
import LovePageSections from "../components/LovePageSections.jsx";
import ValentineProposalArena from "../components/ValentineProposalArena.jsx";
import RomanticPolaroidDeck from "../components/RomanticPolaroidDeck.jsx";
import ThemeVisualizer from "../components/ThemeVisualizer.jsx";
import StarlightWishWall from "../components/StarlightWishWall.jsx";
import RomanticStepsTimeline from "../components/RomanticStepsTimeline.jsx";
import { playSparkleSound } from "../utils/audioSynth.js";

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      let vdayYear = now.getFullYear();
      let vday = new Date(`February 14, ${vdayYear} 00:00:00`);
      if (now > vday) {
        vday = new Date(`February 14, ${vdayYear + 1} 00:00:00`);
      }
      const diff = vday - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <PublicLayout>
      {/* Interactive Trailing Stardust & Hearts */}
      <CursorStardust />

      {/* Floating Audio Atmosphere Controller */}
      <AudioSoundtrackBar />

      {/* Background Floating Multilingual Love Messages, Rose Petals & Ambient Glow Orbs */}
      <LoveBubbles count={20} showMessages />
      <RosePetals count={14} />
      <GlowOrbs />

      {/* EXACT REFERENCE TOP HERO SECTION */}
      <HeroTopSection />

      {/* ROYAL MAJESTY HIGHLIGHTS RIBBON */}
      <section className="section" style={{ paddingTop: 0, paddingBottom: 24 }}>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fade}
          style={{
            background: "linear-gradient(135deg, rgba(28, 4, 18, 0.88), rgba(45, 8, 30, 0.92))",
            border: "1.8px solid rgba(244, 193, 110, 0.45)",
            borderRadius: 32,
            padding: "36px 28px",
            boxShadow: "0 25px 65px rgba(0, 0, 0, 0.6), inset 0 1px 2px rgba(244, 193, 110, 0.3)",
            backdropFilter: "blur(20px)",
            textAlign: "center",
          }}
        >
          <span
            className="eyebrow"
            style={{
              background: "linear-gradient(135deg, rgba(244, 193, 110, 0.2), rgba(255, 79, 129, 0.2))",
              border: "1px solid rgba(244, 193, 110, 0.5)",
              color: "#ffd166",
              marginBottom: 16,
            }}
          >
            👑 WHY LOVEDOES FEELS MAGICAL & ROYAL 👑
          </span>
          <h2
            style={{
              fontFamily: "'Great Vibes', 'Playfair Display', serif",
              fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)",
              background: "linear-gradient(135deg, #ffffff 0%, #ffd166 50%, #ff8fab 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: "8px 0 16px",
            }}
          >
            Crafted for Unforgettable Royalty & Romance
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 20,
              marginTop: 28,
            }}
          >
            {[
              {
                icon: "👑",
                title: "Royal Wax Seals & Locks",
                desc: "Send private love decrees sealed with custom wax emblems and romantic passcodes.",
              },
              {
                icon: "🎻",
                title: "Symphonic Audio Melodies",
                desc: "Choose from acoustic guitars, soft pianos, or ambient orchestral love soundtracks.",
              },
              {
                icon: "💎",
                title: "24K Gold & Velvet Themes",
                desc: "Select ultra high-end visual themes inspired by sunset balconies & starlight galaxies.",
              },
              {
                icon: "📜",
                title: "Eternal Love Certificate",
                desc: "Generate high-res 4K printable parchment decrees of everlasting togetherness.",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                style={{
                  background: "rgba(18, 3, 13, 0.65)",
                  border: "1.2px solid rgba(244, 193, 110, 0.3)",
                  borderRadius: 22,
                  padding: "24px 18px",
                  textAlign: "center",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
                  transition: "transform 0.3s ease, border-color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.borderColor = "#ffd166";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(244, 193, 110, 0.3)";
                }}
              >
                <div style={{ fontSize: "2.4rem", marginBottom: 12 }}>{card.icon}</div>
                <h3 style={{ color: "#ffd166", fontSize: "1.15rem", fontFamily: "'Playfair Display', serif", marginBottom: 8 }}>
                  {card.title}
                </h3>
                <p style={{ color: "rgba(255, 235, 245, 0.82)", fontSize: "0.88rem", lineHeight: 1.55 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 10-SLIDES INTERACTIVE PRESENTATION CAROUSEL & STORY STACK */}
      <section className="section" id="slides-experience">
        <TenSlidesCarousel />

        {/* Live Interactive Hero Digital Valentine Card & Envelope Generator */}
        <motion.div initial="hidden" animate="show" variants={fade} custom={3}>
          <InteractiveValentineCard />
        </motion.div>
      </section>

      {/* 10 DISTINCT DESIGN SECTIONS FROM USER SPECIFICATION */}
      <LovePageSections />

      {/* INTERACTIVE PROPOSAL ARENA (Runaway No Button + Confetti + Certificate) */}
      <ValentineProposalArena />

      {/* 3D FLIP POLAROID MEMORY DECK */}
      <RomanticPolaroidDeck />

      {/* LIVE ATMOSPHERIC THEME SWITCHER */}
      <ThemeVisualizer />

      {/* STARLIGHT LOVE WISH WALL */}
      <StarlightWishWall />

      {/* FRICTIONLESS 3-STEP CREATION TIMELINE */}
      <RomanticStepsTimeline />

      {/* GRAND FINALE ROMANTIC CALL TO ACTION */}
      <section className="section" style={{ paddingBottom: 60 }}>
        <div className="card cta-banner" style={{ borderRadius: 36, padding: "52px 24px" }}>
          <span className="eyebrow" style={{ margin: "0 auto 16px" }}>
            💖 UNFORGETTABLE MOMENTS AWAIT 💖
          </span>
          <h2 className="display" style={{ fontStyle: "italic", fontSize: "clamp(2rem, 5vw, 3.8rem)" }}>
            Make Their Heart Skip — On Purpose.
          </h2>
          <p className="lede" style={{ maxWidth: 620, margin: "16px auto 28px" }}>
            They tap open a private link. Soft original tones play. Floating hearts rise into the night sky, and your words whisper directly to their soul.
          </p>

          {/* Valentine Countdown Ticker */}
          <div
            style={{
              display: "flex",
              justify: "center",
              gap: 18,
              margin: "0 auto 32px",
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Days", val: timeLeft.days },
              { label: "Hours", val: timeLeft.hours },
              { label: "Mins", val: timeLeft.minutes },
              { label: "Secs", val: timeLeft.seconds },
            ].map((t) => (
              <div
                key={t.label}
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  backdropFilter: "blur(12px)",
                  borderRadius: 20,
                  padding: "12px 20px",
                  minWidth: 78,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#ffd166", lineHeight: 1 }}>
                  {String(t.val).padStart(2, "0")}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#ffd0dc", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>
                  {t.label}
                </div>
              </div>
            ))}
          </div>

          <Link
            className="btn glow"
            to="/create"
            onClick={() => playSparkleSound()}
            style={{ fontSize: "1.1rem", padding: "16px 36px" }}
          >
            Create Your Digital Valentine Sanctuary ❤️
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
