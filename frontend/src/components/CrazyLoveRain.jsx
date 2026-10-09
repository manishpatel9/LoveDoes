import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const EMOJIS = ["💖", "💕", "🧸", "🎈", "✨", "🥰", "💌", "💑", "I Love You", "Forever", "My Everything", "Amor", "🌹", "👑", "🌟", "💍", "Together", "💘", "Always"];

export default function CrazyLoveRain() {
  const [drops, setDrops] = useState([]);

  useEffect(() => {
    // Generate an initial burst of 40 elements
    const initialDrops = Array.from({ length: 45 }).map((_, i) => createDrop(i));
    setDrops(initialDrops);

    // Continuous randomized spawning
    const interval = setInterval(() => {
      setDrops((prev) => {
        // Keep array to around 60 items so we don't crash mobile devices
        return [...prev.slice(-55), createDrop(Date.now() + Math.random())];
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  function createDrop(id) {
    const text = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const left = Math.random() * 100; // random X position %
    const duration = 5 + Math.random() * 8; // 5s to 13s to fall (varied speeds)
    const delay = Math.random() * 3;
    const isText = text.length > 2; // e.g. "I Love You"
    const size = isText ? (1.2 + Math.random() * 1.5) : (1.5 + Math.random() * 1.5); // Random sizes

    return { id, text, left, duration, delay, size, isText };
  }

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 9999, overflow: "hidden" }}>
      {drops.map(drop => (
        <motion.div
          key={drop.id}
          initial={{ y: -100, x: 0, opacity: 0, rotate: 0 }}
          animate={{
            y: "110vh",
            x: Math.random() > 0.5 ? 80 : -80, // Sway left/right while falling
            opacity: [0, 1, 1, 1, 0],
            rotate: Math.random() > 0.5 ? 360 : -360
          }}
          transition={{
            duration: drop.duration,
            delay: drop.delay,
            ease: "linear",
            repeat: Infinity
          }}
          style={{
            position: "absolute",
            left: `${drop.left}%`,
            fontSize: `${drop.size}rem`,
            color: drop.isText ? "#ff4f81" : "inherit",
            fontFamily: drop.isText ? "'Great Vibes', cursive" : "inherit",
            fontWeight: "bold",
            textShadow: drop.isText ? "0 2px 8px rgba(255, 255, 255, 0.9)" : "0 2px 10px rgba(0,0,0,0.5)",
            whiteSpace: "nowrap",
            filter: "drop-shadow(0 0 10px rgba(255, 79, 129, 0.6))"
          }}
        >
          {drop.text}
        </motion.div>
      ))}
    </div>
  );
}
