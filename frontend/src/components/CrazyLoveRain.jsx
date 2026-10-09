import React, { useMemo } from "react";

// Highly biased towards emojis! (Less than 10% chance of getting a word)
const EMOJI_PALETTE = [
  "💖", "💖", "💖", "💕", "💕", "💕", "✨", "✨", 
  "💌", "🌹", "💖", "💕", "✨", "💕", "💖", 
  "I Love You", "Forever"
];

export default function CrazyLoveRain() {
  // useMemo ensures these drops are calculated EXACTLY ONCE on mount.
  // There is NO React state, NO intervals, NO rerenders.
  // This guarantees silky smooth 60fps performance on mobile.
  const drops = useMemo(() => {
    // Only 15 total items looping infinitely on CSS
    return Array.from({ length: 14 }).map((_, i) => {
      const text = EMOJI_PALETTE[Math.floor(Math.random() * EMOJI_PALETTE.length)];
      const delay = Math.random() * 10; // Start instantly or up to 10s later
      const duration = 14 + Math.random() * 8; // Extremely slow (14s to 22s to fall)
      
      // Determine columns (0-100vw). Push items slightly away from absolute center if possible
      let left = Math.random() * 100;
      if (left > 40 && left < 60) {
        left += (Math.random() > 0.5 ? 20 : -20); // Push out of center safe-zone
      }

      const isText = text.length > 2; 
      
      // Keep words smaller and emojis a nice size
      const size = isText ? (0.9 + Math.random() * 0.3) : (1.1 + Math.random() * 0.5);
      
      // Random sway pattern assignment
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

        /* 
         * Using translate3d forces GPU hardware acceleration, 
         * ensuring the smoothest possible float down the screen.
         */
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
            className={\`love-rain-drop \${drop.swayType} \${drop.isText ? 'love-rain-text' : 'love-rain-emoji'}\`}
            style={{
              left: \`\${drop.left}%\`,
              fontSize: \`\${drop.size}rem\`,
              animationName: drop.swayType,
              animationDuration: \`\${drop.duration}s\`,
              animationDelay: \`\${drop.delay}s\`,
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
