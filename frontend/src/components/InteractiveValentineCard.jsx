import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { playRomanticChime, playSparkleSound, playHeartbeatSound } from "../utils/audioSynth.js";

const ROMANTIC_WHISPERS = [
  "“You are my favorite place to go when my mind searches for peace.”",
  "“In a room full of art, I'd still stare at you.”",
  "“If I had a flower for every time I thought of you, I could walk in my garden forever.”",
  "“You are the song I never knew my heart wanted to sing.”",
  "“With you, every day feels like Valentine's Day.”",
];

export default function InteractiveValentineCard() {
  const navigate = useNavigate();
  const [creatorName, setCreatorName] = useState("Aman");
  const [partnerName, setPartnerName] = useState("Riya");
  const [occasion, setOccasion] = useState("Valentine's Day");
  const [isOpen, setIsOpen] = useState(false);
  const [whisperIdx, setWhisperIdx] = useState(0);

  const toggleEnvelope = () => {
    if (!isOpen) {
      playRomanticChime();
    } else {
      playSparkleSound();
    }
    setIsOpen(!isOpen);
  };

  const nextWhisper = () => {
    playHeartbeatSound();
    setWhisperIdx((prev) => (prev + 1) % ROMANTIC_WHISPERS.length);
  };

  const handleCreate = () => {
    playSparkleSound();
    navigate("/create", {
      state: {
        creatorName: creatorName.trim(),
        partnerName: partnerName.trim(),
        occasion: occasion,
      },
    });
  };

  return (
    <div className="interactive-card-wrapper">
      {/* Live Name Input Inputs */}
      <div className="card-input-strip">
        <div className="input-group">
          <label htmlFor="hero-creator">👤 Your Name</label>
          <input
            id="hero-creator"
            type="text"
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            placeholder="Your Name"
            maxLength={25}
          />
        </div>

        <div className="heart-separator" title="Heart connection">
          💖
        </div>

        <div className="input-group">
          <label htmlFor="hero-partner">💖 Your Valentine</label>
          <input
            id="hero-partner"
            type="text"
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
            placeholder="Partner's Name"
            maxLength={25}
          />
        </div>

        <div className="input-group occasion-select">
          <label htmlFor="hero-occasion">🎉 Occasion</label>
          <select
            id="hero-occasion"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
          >
            <option value="Valentine's Day">💖 Valentine's Day</option>
            <option value="Anniversary">💍 Anniversary</option>
            <option value="Proposal">🌹 Romantic Proposal</option>
            <option value="Birthday">🎂 Birthday Surprise</option>
            <option value="Secret Love Note">💌 Secret Love Note</option>
          </select>
        </div>
      </div>

      {/* Interactive 3D Digital Love Envelope */}
      <div className="envelope-container" onClick={toggleEnvelope}>
        <motion.div
          className={`love-envelope ${isOpen ? "open" : ""}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Envelope Flap */}
          <div className="envelope-flap" />

          {/* Wax Seal Button */}
          <div className="wax-seal" onClick={(e) => { e.stopPropagation(); toggleEnvelope(); }}>
            <span className="seal-icon">{isOpen ? "💌" : "💖"}</span>
            <span className="seal-text">{isOpen ? "TAP TO CLOSE" : "TAP TO OPEN"}</span>
          </div>

          {/* Letter Content sliding out */}
          <AnimatePresence>
            <motion.div
              className="letter-card"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: isOpen ? -60 : 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
            >
              <div className="letter-header">
                <span className="letter-occasion">{occasion}</span>
                <span className="letter-hearts">✨ ❤️ ✨</span>
              </div>

              <div className="letter-body">
                <p className="letter-to">Dearest <span className="highlight">{partnerName || "Partner"}</span>,</p>
                <motion.p
                  key={whisperIdx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="letter-whisper"
                >
                  {ROMANTIC_WHISPERS[whisperIdx]}
                </motion.p>
                <p className="letter-from">Forever Yours,<br /><span className="highlight-script">{creatorName || "Your Love"}</span></p>
              </div>

              <div className="letter-footer">
                <button
                  type="button"
                  className="whisper-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextWhisper();
                  }}
                >
                  🔄 Shuffle Romantic Whisper
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="card-actions">
        <button type="button" className="btn glow hero-create-btn" onClick={handleCreate}>
          Create Digital Valentine For {partnerName || "Them"} ❤️
        </button>
        <button
          type="button"
          className="btn secondary hero-scroll-btn"
          onClick={() => {
            playSparkleSound();
            document.getElementById("proposal-arena")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Explore Valentine Journey 🪄
        </button>
      </div>
    </div>
  );
}
