import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playSparkleSound, playHeartbeatSound, playRomanticChime } from "../utils/audioSynth.js";
import { submitContactMessage } from "../services/api.js";

const INITIAL_WISHES = [
  { id: 1, text: "May your heart always feel like home.", author: "Anonymous Love", icon: "✨" },
  { id: 2, text: "I love you more than all the stars in the night sky.", author: "R & A", icon: "🌌" },
  { id: 3, text: "Every morning with you is a gift I never take for granted.", author: "Forever Yours", icon: "💖" },
  { id: 4, text: "You are the sweetest surprise life ever gave me.", author: "Cupid's Note", icon: "🌸" },
  { id: 5, text: "Holding your hand is my favorite place in the world.", author: "Secret Whisper", icon: "🌹" },
];

export default function StarlightWishWall() {
  const [wishes, setWishes] = useState(INITIAL_WISHES);
  const [activeWish, setActiveWish] = useState(INITIAL_WISHES[0]);
  const [newWish, setNewWish] = useState("");
  const [author, setAuthor] = useState("");
  const [submittedMsg, setSubmittedMsg] = useState("");

  const handleStarClick = (wish) => {
    playSparkleSound();
    setActiveWish(wish);
  };

  const handleAddWish = async (e) => {
    e.preventDefault();
    if (!newWish.trim()) return;
    playRomanticChime();

    const wishText = newWish.trim();
    const wishAuthor = author.trim() || "Secret Lover";

    const created = {
      id: Date.now(),
      text: wishText,
      author: wishAuthor,
      icon: "⭐",
    };

    setWishes((prev) => [created, ...prev]);
    setActiveWish(created);
    setNewWish("");
    setAuthor("");
    setSubmittedMsg("Your love wish has floated up into the starlight constellation! ✨");
    setTimeout(() => setSubmittedMsg(""), 4000);

    try {
      await submitContactMessage({
        name: wishAuthor,
        email: "starlight-wish@lovedoes.app",
        topic: "⭐ Secret Whisper / Starlight Wish",
        message: wishText,
      });
    } catch (err) {
      console.error("Failed to persist wish to admin dashboard:", err);
    }
  };


  return (
    <section className="section wish-wall-section">
      <div className="section-header text-center">
        <span className="eyebrow">✨ INTERACTIVE STARLIGHT CONSTELLATION ✨</span>
        <h2 className="display section-title">Messages Floating in the Stars</h2>
        <p className="lede">
          Click on any glowing star below to read secret romantic whispers, or whisper your own love wish to the night sky.
        </p>
      </div>

      <div className="wish-wall-grid">
        {/* Constellation Star Map */}
        <div className="star-map-box">
          <div className="star-grid">
            {wishes.map((w) => {
              const isActive = activeWish?.id === w.id;
              return (
                <motion.button
                  type="button"
                  key={w.id}
                  className={`star-pod ${isActive ? "active" : ""}`}
                  onClick={() => handleStarClick(w)}
                  onMouseEnter={() => playHeartbeatSound()}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="star-icon">{w.icon}</span>
                  <span className="star-author">{w.author}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Active Wish Display Display */}
          <AnimatePresence mode="wait">
            {activeWish && (
              <motion.div
                key={activeWish.id}
                className="active-wish-display"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="wish-quote-symbol">“</div>
                <p className="wish-text">{activeWish.text}</p>
                <span className="wish-by">— {activeWish.author}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Submit A Wish Form */}
        <div className="add-wish-box">
          <h3>💌 Whisper a Wish to the Stars</h3>
          <p className="hint">Your love wish will glow in the starlight constellation below.</p>

          <form onSubmit={handleAddWish}>
            <div className="field">
              <label htmlFor="wish-input">Your Love Wish</label>
              <textarea
                id="wish-input"
                value={newWish}
                onChange={(e) => setNewWish(e.target.value)}
                placeholder="e.g. May our love grow stronger with every passing sunrise..."
                maxLength={200}
                rows={3}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="wish-author">Your Name / Signature (Optional)</label>
              <input
                id="wish-author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Secret Lover / S & A"
                maxLength={30}
              />
            </div>

            <button type="submit" className="btn glow" style={{ width: "100%" }}>
              Send Wish to the Stars ✨
            </button>
          </form>

          {submittedMsg && <p className="success-msg">{submittedMsg}</p>}
        </div>
      </div>
    </section>
  );
}
