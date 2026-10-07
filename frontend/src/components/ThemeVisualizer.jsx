import { useState } from "react";
import { motion } from "framer-motion";
import { playSparkleSound, playHeartbeatSound } from "../utils/audioSynth.js";

const THEMES = [
  {
    id: "crimson",
    name: "Crimson Romance",
    icon: "❤️",
    desc: "Deep passionate red with shimmering gold stardust",
    gradient: "linear-gradient(135deg, #1b0510 0%, #4c1130 50%, #220614 100%)",
    glow: "rgba(255, 79, 129, 0.4)",
  },
  {
    id: "starlight",
    name: "Midnight Starlight",
    icon: "🌌",
    desc: "Cosmic deep violet with sparkling constellation stars",
    gradient: "linear-gradient(135deg, #090a0f 0%, #1a1b35 50%, #2d1436 100%)",
    glow: "rgba(186, 104, 200, 0.4)",
  },
  {
    id: "sunset",
    name: "Golden Hour Sunset",
    icon: "🌅",
    desc: "Warm glowing amber, romantic sunset rose & gold",
    gradient: "linear-gradient(135deg, #2b0b14 0%, #68172c 50%, #8c2b18 100%)",
    glow: "rgba(255, 183, 77, 0.4)",
  },
  {
    id: "blush",
    name: "Soft Blush Pastel",
    icon: "🌸",
    desc: "Gentle cherry blossom pinks and dreamy white clouds",
    gradient: "linear-gradient(135deg, #331521 0%, #5e2338 50%, #471728 100%)",
    glow: "rgba(255, 182, 193, 0.4)",
  },
  {
    id: "velvet",
    name: "Velvet Moonlight",
    icon: "🌙",
    desc: "Sophisticated dark velvet with silver moonlight beams",
    gradient: "linear-gradient(135deg, #0d0e15 0%, #1c2333 50%, #10141e 100%)",
    glow: "rgba(144, 202, 249, 0.4)",
  },
];

export default function ThemeVisualizer({ onSelectTheme }) {
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);

  const handleSelect = (t) => {
    playSparkleSound();
    setActiveTheme(t);
    onSelectTheme?.(t);
    // Apply background change to body smoothly
    document.body.style.background = t.gradient;
  };

  return (
    <section className="section theme-visualizer-section">
      <div className="section-header text-center">
        <span className="eyebrow">🎨 LIVE INTERACTIVE VIBE PREVIEW 🎨</span>
        <h2 className="display section-title">Choose Your Romantic Atmosphere</h2>
        <p className="lede">
          Click any aesthetic vibe below to live-preview the ambient background and glowing atmosphere.
        </p>
      </div>

      <div className="theme-switcher-grid">
        {THEMES.map((t) => {
          const isSelected = activeTheme.id === t.id;
          return (
            <motion.button
              type="button"
              key={t.id}
              className={`theme-visualizer-card ${isSelected ? "selected" : ""}`}
              onClick={() => handleSelect(t)}
              onMouseEnter={() => playHeartbeatSound()}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                boxShadow: isSelected ? `0 12px 30px ${t.glow}` : "none",
              }}
            >
              <div
                className="theme-visualizer-swatch"
                style={{ background: t.gradient }}
              >
                <span className="theme-icon">{t.icon}</span>
              </div>
              <div className="theme-info">
                <h3>{t.name}</h3>
                <p>{t.desc}</p>
              </div>
              {isSelected && <span className="selected-badge">ACTIVE VIBE ✨</span>}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
