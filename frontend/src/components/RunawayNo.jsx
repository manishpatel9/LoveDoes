import { useRef, useState } from "react";

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

const NO_LABELS = [
  "NO 😜",
  "Nope 🙈",
  "Maybe? 🥺",
  "Can't click! 💨",
  "Wait... 😳",
  "Try again! 🏃",
];

export default function RunawayNo({ onTaunt }) {
  const areaRef = useRef(null);
  const [pos, setPos] = useState({ left: "auto", right: "14px", top: "calc(50% - 24px)" });
  const [label, setLabel] = useState("NO 😜");

  function flee() {
    const area = areaRef.current;
    if (!area) return;
    const w = area.clientWidth;
    const h = area.clientHeight;
    const bw = 118;
    const bh = 52;

    let left = 12;
    let top = 10;
    for (let i = 0; i < 24; i += 1) {
      left = 12 + Math.random() * Math.max(12, w - bw - 24);
      top = 10 + Math.random() * Math.max(10, h - bh - 20);
      const cx = w / 2;
      const cy = h / 2;
      // Keep clear of the center YES button
      const coversYes = Math.abs(left + bw / 2 - cx) < 115 && Math.abs(top + bh / 2 - cy) < 48;
      if (!coversYes) break;
    }

    // Strict clamping to keep 100% visible within arena borders
    left = Math.max(10, Math.min(left, w - bw - 10));
    top = Math.max(8, Math.min(top, h - bh - 8));

    setPos({ left: `${left}px`, right: "auto", top: `${top}px` });
    setLabel(NO_LABELS[Math.floor(Math.random() * NO_LABELS.length)]);
    onTaunt?.(TAUNTS[Math.floor(Math.random() * TAUNTS.length)]);
  }

  return (
    <div className="no-arena" ref={areaRef}>
      <button
        type="button"
        className="btn no-btn"
        style={{ left: pos.left, right: pos.right, top: pos.top }}
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
        {label}
      </button>
    </div>
  );
}
