import { useState } from "react";

const TAUNTS = [
  "Are you sure? 🥺",
  "Think again ❤️",
  "Nice try! 😜",
  "You can't escape love! 💕",
  "The heart already knows… 💖",
  "Try clicking YES! 🥰",
  "No is not an option! 💍",
  "Resistance is futile 💘",
];

// Curated dodge offsets (in pixels) that jump playfully away without overlapping YES
const DODGE_OFFSETS = [
  { x: 55, y: -40 },
  { x: -140, y: -45 },
  { x: 50, y: 45 },
  { x: -130, y: 40 },
  { x: 75, y: -10 },
  { x: -150, y: 15 },
  { x: 40, y: -55 },
  { x: -125, y: -50 },
];

export default function RunawayNo({ onTaunt }) {
  const [dodgeIndex, setDodgeIndex] = useState(-1);

  function flee() {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * DODGE_OFFSETS.length);
    } while (nextIndex === dodgeIndex && DODGE_OFFSETS.length > 1);

    setDodgeIndex(nextIndex);
    onTaunt?.(TAUNTS[Math.floor(Math.random() * TAUNTS.length)]);
  }

  const offset = dodgeIndex >= 0 ? DODGE_OFFSETS[dodgeIndex] : { x: 0, y: 0 };

  return (
    <button
      type="button"
      className="btn no-btn"
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
      }}
      onMouseEnter={flee}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        flee();
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        flee();
      }}
      aria-label="No — it might wander away"
    >
      <span className="no-btn-icon">🏃</span>
      <span className="no-btn-text">NO 😜</span>
    </button>
  );
}
