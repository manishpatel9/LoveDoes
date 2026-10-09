import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Clean, strictly romantic palette
const ITEMS = ["💖", "💕", "✨", "💌", "🌹", "I Love You", "Forever", "My Everything", "Amor", "Together", "Always"];

export default function CrazyLoveRain() {
  const [drops, setDrops] = useState([]);

  useEffect(() => {
    // Generate an initial gentle falling of 15 elements
    const initialDrops = Array.from({ length: 15 }).map((_, i) => createDrop(i));
    setDrops(initialDrops);

    // Slowly spawn new ones to keep the screen active but not messy
    const interval = setInterval(() => {
      setDrops((prev) => {
        // Keep array strictly limited to max 25 items so it stays readable and light
        return [...prev.slice(-24), createDrop(Date.now() + Math.random())];
      });
    }, 1500); // 1.5 seconds per new item (much slower spawn rate)

    return () => clearInterval(interval);
  }, []);

  function createDrop(id) {
    const text = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    const left = 5 + Math.random() * 90; // Keep mostly away from exact edges
    const duration = 12 + Math.random() * 10; // 12s to 22s to fall VERY slowly
    const delay = Math.random() * 2;
    const isText = text.length > 2; // e.g. "I Love You"
    
    // Make text normally readable size, emojis slightly larger than text
    const size = isText ? (1.0 + Math.random() * 0.4) : (1.2 + Math.random() * 0.8);

    // Emojis can tilt slightly back and forth, words MUST NOT spin or flip
    const finalRotate = isText ? (Math.random() > 0.5 ? 5 : -5) : (Math.random() > 0.5 ? 15 : -15);
    
    // Very gentle sway
    const swayDistance = isText ? (Math.random() > 0.5 ? 20 : -20) : (Math.random() > 0.5 ? 40 : -40);

    return { id, text, left, duration, delay, size, isText, finalRotate, swayDistance };
  }

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", pointerEvents: "none", zIndex: 9999, overflow: "hidden" }}>
      {drops.map(drop => (
        <motion.div
          key={drop.id}
          initial={{ y: -50, x: 0, opacity: 0, rotate: 0 }}
          animate={{
            y: "110vh",
            x: drop.swayDistance,
            opacity: [0, 0.8, 1, 0.8, 0],
            rotate: drop.finalRotate // Gentle fixed tilt, NOT spinning continuously
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
            color: drop.isText ? "#ffb4cd" : "inherit", // soft pink for words
            fontFamily: drop.isText ? "'Playfair Display', serif" : "inherit",
            fontStyle: drop.isText ? "italic" : "normal",
            fontWeight: "600",
            textShadow: drop.isText ? "0 2px 6px rgba(0,0,0,0.8)" : "none",
            whiteSpace: "nowrap",
            filter: drop.isText ? "drop-shadow(0 0 5px rgba(255, 79, 129, 0.3))" : "drop-shadow(0 0 3px rgba(0,0,0,0.4))",
            zIndex: drop.isText ? 2 : 1
          }}
        >
          {drop.text}
        </motion.div>
      ))}
    </div>
  );
}
