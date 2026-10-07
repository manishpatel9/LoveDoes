import { motion } from "framer-motion";
import { playSparkleSound, playHeartbeatSound } from "../utils/audioSynth.js";

const NICKNAMES_LEFT = [
  { name: "Sona", emoji: "❤️" },
  { name: "Bacha", emoji: "💀" },
  { name: "Jaan", emoji: "🥳" },
  { name: "Janu", emoji: "💖" },
  { name: "Babu", emoji: "💌" },
  { name: "Baby", emoji: "🤩" },
  { name: "Pagal", emoji: "🧸" },
];

const AFFIRMATIONS_LEFT = [
  { text: "MY SWEETHEART", emoji: "❤️" },
  { text: "MY LIFELINE", emoji: "🌍" },
  { text: "MY BABY", emoji: "🦋" },
  { text: "LOVE YOU PAGAL", emoji: "💖" },
  { text: "My Sweetheart Baby", emoji: "🌹" },
];

const MAPPING_TABLE = [
  { nickname: "Sona ❤️", meaning: "My Today 💕" },
  { nickname: "Bacha 💀", meaning: "My Tomorrow 💕" },
  { nickname: "Jaan 🥳", meaning: "My Always 💕" },
  { nickname: "Janu 💖", meaning: "My Forever 💕" },
  { nickname: "Babu 💌", meaning: "My Smile 💕" },
  { nickname: "Baby 🤩", meaning: "My World 💕" },
];

// Helper to generate text lines for the heart micro-text grid
const HEART_ROWS = [
  "I LOVE YOU ❤️ I LOVE YOU ❤️",
  "I LOVE YOU ❤️ I LOVE YOU ❤️ I LOVE YOU ❤️ I LOVE YOU ❤️",
  "I LOVE YOU ❤️ I LOVE YOU ❤️ I LOVE YOU ❤️ I LOVE YOU ❤️ I LOVE YOU ❤️",
  "I LOVE YOU ❤️ I LOVE YOU ❤️ I LOVE YOU ❤️ I LOVE YOU ❤️ I LOVE YOU ❤️",
  "I LOVE YOU ❤️ I LOVE YOU ❤️ I LOVE YOU ❤️ I LOVE YOU ❤️ I LOVE YOU ❤️",
  "I LOVE YOU ❤️ I LOVE YOU ❤️ I LOVE YOU ❤️ I LOVE YOU ❤️",
  "I LOVE YOU ❤️ I LOVE YOU ❤️ I LOVE YOU ❤️ I LOVE YOU ❤️",
  "I LOVE YOU ❤️ I LOVE YOU ❤️ I LOVE YOU ❤️ I LOVE YOU ❤️",
  "I LOVE YOU ❤️ I LOVE YOU ❤️ I LOVE YOU ❤️",
  "I LOVE YOU ❤️ I LOVE YOU ❤️ I LOVE YOU ❤️",
  "I LOVE YOU ❤️ I LOVE YOU ❤️",
  "I LOVE YOU ❤️ I LOVE YOU ❤️",
  "I LOVE YOU ❤️",
];

export default function RomanticMemoriesWordArt({ partnerName = "Jaan" }) {
  return (
    <div className="romantic-wordart-container">
      {/* 1. TOP CALLIGRAPHY TITLE */}
      <div className="wordart-top-header">
        <h2 className="wordart-title">
          Meri pyari <span className="highlight-jaan">{partnerName}</span> ke liye... 🥰🌹💖
        </h2>
      </div>

      <div className="wordart-grid-layout">
        {/* 2. TOP LEFT: NICKNAMES & AFFIRMATIONS */}
        <div className="wordart-col left-col">
          <div className="nicknames-badge-group">
            {NICKNAMES_LEFT.map((item, idx) => (
              <div key={idx} className="nickname-tag-pill" onClick={() => playSparkleSound()}>
                <span className="nick-name">{item.name}</span>
                <span className="nick-emoji">{item.emoji}</span>
              </div>
            ))}
          </div>

          <div className="filigree-divider">
            <span className="f-line" />
            <span className="f-heart">❤️</span>
            <span className="f-line" />
          </div>

          <div className="affirmations-list">
            {AFFIRMATIONS_LEFT.map((aff, idx) => (
              <div key={idx} className="affirmation-item" onClick={() => playSparkleSound()}>
                <span className="aff-text">{aff.text}</span>
                <span className="aff-emoji">{aff.emoji}</span>
              </div>
            ))}
          </div>

          {/* Floating Lip Prints */}
          <div className="floating-kiss-mark kiss-left-top">💋</div>
          <div className="floating-kiss-mark kiss-left-mid">💋</div>
        </div>

        {/* 3. TOP RIGHT: NEON HEART FILLED WITH 'I LOVE YOU' MICRO-TEXT */}
        <div className="wordart-col right-col">
          <motion.div
            className="neon-heart-shape-box"
            whileHover={{ scale: 1.02 }}
            onClick={() => playHeartbeatSound()}
          >
            <div className="neon-heart-glow-border" />
            <div className="heart-text-content">
              {HEART_ROWS.map((row, idx) => (
                <div key={idx} className="heart-text-row">
                  {row}
                </div>
              ))}
            </div>
            <div className="floating-kiss-mark kiss-heart-corner">💋</div>
          </motion.div>
        </div>
      </div>

      {/* 4. MIDDLE: HUGE "I YOU" WORD-ART WITH MICRO-TEXT */}
      <div className="wordart-middle-banner">
        <div className="floating-kiss-mark kiss-mid-left">💋</div>

        <div className="iyou-letters-wrap">
          {/* Big Letter 'I' */}
          <div className="big-letter-i">
            {Array.from({ length: 18 }).map((_, i) => (
              <span key={i} className="micro-iloveyou">I LOVE YOU • </span>
            ))}
          </div>

          {/* Center Nicknames Vertical Stack */}
          <div className="center-nicknames-column">
            <div className="filigree-divider">
              <span className="f-heart">💖</span>
            </div>
            {NICKNAMES_LEFT.map((item, idx) => (
              <div key={idx} className="center-nick-line">
                <span>{item.name}</span>
                <span>{item.emoji}</span>
              </div>
            ))}
            <div className="filigree-divider">
              <span className="f-heart">💖</span>
            </div>
            <div className="center-aff-text">MY SWEETHEART ❤️</div>
            <div className="center-aff-text">MY LIFELINE 🌍</div>
            <div className="center-aff-text">LOVE YOU PAGAL 💖</div>
          </div>

          {/* Big Letter 'YOU' */}
          <div className="big-word-you">
            {Array.from({ length: 48 }).map((_, i) => (
              <span key={i} className="micro-iloveyou">I LOVE YOU • </span>
            ))}
          </div>

          <div className="floating-kiss-mark kiss-mid-right">💋</div>
        </div>

        <div className="wordart-cursive-footer">
          <span>You are my everything</span>
          <span className="cursive-heart">♡</span>
        </div>
      </div>

      {/* 5. BOTTOM GRID: HEARTBEAT PULSE & NICKNAME MAPPING TABLE */}
      <div className="wordart-bottom-grid">
        {/* BOTTOM LEFT: EKG HEARTBEAT PULSE WITH KISS MARKS */}
        <div className="ekg-heartbeat-card" onClick={() => playHeartbeatSound()}>
          <div className="heartbeat-shape-wrap">
            <div className="floating-kiss-mark kiss-inside-heart">💋</div>
            <div className="ekg-pulse-line">
              <svg viewBox="0 0 400 120" className="ekg-svg">
                <path
                  d="M 10,60 L 80,60 L 100,10 L 120,110 L 140,40 L 160,80 L 180,60 L 390,60"
                  fill="none"
                  stroke="#ff1e4b"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="neon-heart-icon">❤️</div>
          </div>
          <div className="ekg-labels">
            <span>MY SWEETHEART ❤️</span>
            <span>MY LIFELINE 🌍</span>
          </div>
        </div>

        {/* BOTTOM RIGHT: NICKNAME TO AFFIRMATION MAPPING TABLE */}
        <div className="mapping-table-card">
          <div className="mapping-card-header">
            <span>Love you meri Jaan</span>
            <span className="header-heart">💖</span>
          </div>
          <div className="mapping-rows-list">
            {MAPPING_TABLE.map((row, idx) => (
              <div key={idx} className="mapping-row-item" onClick={() => playSparkleSound()}>
                <span className="map-nick">{row.nickname}</span>
                <span className="map-arrow">➔</span>
                <span className="map-meaning">{row.meaning}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
