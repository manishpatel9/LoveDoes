import React, { useMemo } from "react";

// Highly biased towards emojis! (Less than 10% chance of getting a word)
const EMOJI_PALETTE = [
  "💖", "💖", "💖", "💕", "💕", "💕", "✨", "✨", 
  "💌", "🌹", "💖", "💕", "✨", "💕", "💖", 
  "I Love You", "Forever"
];

export default function CrazyLoveRain() {
  const drops = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => {
      const text = EMOJI_PALETTE[Math.floor(Math.random() * EMOJI_PALETTE.length)];
      const delay = Math.random() * 10;
      const duration = 14 + Math.random() * 8;
      
      let left = Math.random() * 100;
      if (left > 40 && left < 60) {
        left += (Math.random() > 0.5 ? 20 : -20);
      }

      const isText = text.length > 2; 
      const size = isText ? (0.9 + Math.random() * 0.3) : (1.1 + Math.random() * 0.5);
      const swayType = Math.random() > 0.5 ? "love-rain-sway-left" : "love-rain-sway-right";
      
      return { id: i, text, left, delay, duration, isText, size, swayType };
    });
  }, []);

  return (
    <>
      <style>{`
        .love-rain-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          pointer-events: none;
          z-index: 9999;
          overflow: hidden;
        }

        .love-rain-drop {
          position: absolute;
          top: -100px;
          opacity: 0;
          white-space: nowrap;
          will-change: transform, opacity;
        }

        .love-rain-text {
          color: #ffb4cd;
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-weight: 600;
          text-shadow: 0 2px 4px rgba(0,0,0,0.8);
          filter: drop-shadow(0 0 5px rgba(255, 79, 129, 0.4));
          z-index: 2;
        }

        .love-rain-emoji {
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4));
          z-index: 1;
        }

        @keyframes love-rain-sway-left {
          0% { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          50% { transform: translate3d(-30px, 60vh, 0) rotate(-4deg); opacity: 0.9; }
          90% { opacity: 0.8; }
          100% { transform: translate3d(10px, 110vh, 0) rotate(2deg); opacity: 0; }
        }

        @keyframes love-rain-sway-right {
          0% { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          50% { transform: translate3d(30px, 60vh, 0) rotate(4deg); opacity: 0.9; }
          90% { opacity: 0.8; }
          100% { transform: translate3d(-10px, 110vh, 0) rotate(-2deg); opacity: 0; }
        }
      `}</style>
      
      <div className="love-rain-overlay">
        {drops.map(drop => (
          <div
            key={drop.id}
            className={`love-rain-drop ${drop.swayType} ${drop.isText ? 'love-rain-text' : 'love-rain-emoji'}`}
            style={{
              left: `${drop.left}%`,
              fontSize: `${drop.size}rem`,
              animationName: drop.swayType,
              animationDuration: `${drop.duration}s`,
              animationDelay: `${drop.delay}s`,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite'
            }}
          >
            {drop.text}
          </div>
        ))}
      </div>
    </>
  );
}
