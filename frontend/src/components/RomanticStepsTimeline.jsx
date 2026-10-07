import { useState } from "react";
import { motion } from "framer-motion";
import { playSparkleSound, playHeartbeatSound } from "../utils/audioSynth.js";

const STEPS = [
  {
    num: "01",
    title: "Whisper Your Names",
    desc: "Yours and theirs — the two hearts this digital sanctuary is crafted for.",
    detail: "Personalized script title, custom occasion badge, and romantic relationship kicker.",
    icon: "💑",
  },
  {
    num: "02",
    title: "Keep the Memories & Melody",
    desc: "Upload photos that feel like home and attach your secret love song.",
    detail: "Polaroid frames, blur reveal animations, timeline cards, and autoplay audio.",
    icon: "📸",
  },
  {
    num: "03",
    title: "Send the Surprise Link",
    desc: "A glowing secret URL, WhatsApp invite, or quiet high-res QR code.",
    detail: "One-click share, interactive runaway proposal, rose petals, and celebration confetti.",
    icon: "🔗",
  },
];

export default function RomanticStepsTimeline() {
  const [activeStep, setActiveStep] = useState(0);

  const handleStepClick = (idx) => {
    playSparkleSound();
    setActiveStep(idx);
  };

  return (
    <section className="section steps-timeline-section">
      <div className="section-header text-center">
        <span className="eyebrow">✨ FRICTIONLESS ROMANTIC CREATION ✨</span>
        <h2 className="display section-title">How the Feeling is Made</h2>
        <p className="lede">
          In less than 2 minutes, transform your deepest feelings into a cinematic digital Valentine page.
        </p>
      </div>

      <div className="steps-grid">
        {STEPS.map((s, i) => {
          const isActive = activeStep === i;
          return (
            <motion.article
              key={s.num}
              className={`card step-card ${isActive ? "active-step" : ""}`}
              onClick={() => handleStepClick(i)}
              onMouseEnter={() => playHeartbeatSound()}
              whileHover={{ y: -6 }}
            >
              <div className="step-card-header">
                <span className="step-num-badge">{s.num}</span>
                <span className="step-icon-emoji">{s.icon}</span>
              </div>
              <h3>{s.title}</h3>
              <p className="hint">{s.d}</p>

              {isActive && (
                <motion.div
                  className="step-detail-box"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <p>✨ <strong>What happens:</strong> {s.detail}</p>
                </motion.div>
              )}
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
