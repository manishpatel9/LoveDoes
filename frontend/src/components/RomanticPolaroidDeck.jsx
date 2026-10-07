import { useState } from "react";
import { motion } from "framer-motion";
import { playSparkleSound, playHeartbeatSound } from "../utils/audioSynth.js";

const CARDS = [
  {
    id: "first-date",
    title: "The First Glance",
    tag: "A Spark in Time ⚡",
    frontPhoto: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&auto=format&fit=crop&q=80",
    secretQuote: "“I saw you for a second, but it felt like I had known you for a lifetime.”",
    prompt: "Add your first meeting story & photo",
    bgGradient: "linear-gradient(135deg, #ff758c, #ff7eb3)",
  },
  {
    id: "secret-song",
    title: "Our Favorite Melody",
    tag: "A Private Soundtrack 🎵",
    frontPhoto: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80",
    secretQuote: "“Whenever this song plays, my heart automatically goes to you.”",
    prompt: "Upload your personal love song MP3",
    bgGradient: "linear-gradient(135deg, #654ea3, #eaafc8)",
  },
  {
    id: "unspoken-words",
    title: "Unspoken Love Note",
    tag: "Written from the Chest 💌",
    frontPhoto: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&auto=format&fit=crop&q=80",
    secretQuote: "“You are the quiet thought that comes right before I fall asleep.”",
    prompt: "Write a letter they open when they miss you",
    bgGradient: "linear-gradient(135deg, #ff9a9e, #fecfef)",
  },
  {
    id: "starlight-promise",
    title: "Forever & Always",
    tag: "Cinematic Finale ✨",
    frontPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    secretQuote: "“Whatever our souls are made of, yours and mine are the same.”",
    prompt: "Surprise them with rose petals & countdown",
    bgGradient: "linear-gradient(135deg, #f83600, #fe8c00)",
  },
];

export default function RomanticPolaroidDeck() {
  const [flipped, setFlipped] = useState({});

  const toggleFlip = (id) => {
    playSparkleSound();
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="section polaroid-deck-section">
      <div className="section-header text-center">
        <span className="eyebrow">✨ TAP CARDS TO UNCOVER SECRET MEMORIES ✨</span>
        <h2 className="display section-title">Designed to feel, not just look pretty</h2>
        <p className="lede">
          Every love story is built on moments. Flip these polaroids to see how your digital Valentine page unfolds.
        </p>
      </div>

      <div className="polaroid-grid">
        {CARDS.map((card, idx) => {
          const isFlipped = Boolean(flipped[card.id]);
          return (
            <motion.div
              key={card.id}
              className="polaroid-3d-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              onClick={() => toggleFlip(card.id)}
              onMouseEnter={() => playHeartbeatSound()}
            >
              <motion.div
                className={`polaroid-inner ${isFlipped ? "flipped" : ""}`}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
              >
                {/* Front Side */}
                <div className="polaroid-face polaroid-front">
                  <div className="polaroid-img-wrapper">
                    <img src={card.frontPhoto} alt={card.title} loading="lazy" />
                    <span className="polaroid-tag">{card.tag}</span>
                  </div>
                  <div className="polaroid-caption">
                    <h3>{card.title}</h3>
                    <p className="tap-hint">Tap to flip & reveal 🔄</p>
                  </div>
                </div>

                {/* Back Side */}
                <div
                  className="polaroid-face polaroid-back"
                  style={{ background: card.bgGradient }}
                >
                  <div className="back-content">
                    <span className="back-quote-icon">“</span>
                    <p className="back-quote">{card.secretQuote}</p>
                    <div className="back-divider" />
                    <p className="back-feature">💡 <strong>In your page:</strong> {card.prompt}</p>
                    <button type="button" className="flip-back-btn">
                      Tap to flip front ↩️
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
