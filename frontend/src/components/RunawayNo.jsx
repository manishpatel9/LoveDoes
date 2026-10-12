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
  const [pos, setPos] = useState({ left: "calc(50% + 145px)", top: "calc(50% - 22px)" });
  const [label, setLabel] = useState("NO 😜");

  function flee() {
    const area = areaRef.current;
    if (!area) return;
    const w = area.clientWidth;
    const h = area.clientHeight;
    const bw = 115;
    const bh = 50;

    let left = 8;
    let top = 8;
    for (let i = 0; i < 20; i += 1) {
      left = 8 + Math.random() * Math.max(8, w - bw - 16);
      top = 8 + Math.random() * Math.max(8, h - bh - 16);
      const cx = w / 2;
      const cy = h / 2;
      // Keep clear of the center YES button
      const coversYes = Math.abs(left + bw / 2 - cx) < 110 && Math.abs(top + bh / 2 - cy) < 45;
      if (!coversYes) break;
    }

    setPos({ left: `${left}px`, top: `${top}px` });
    setLabel(NO_LABELS[Math.floor(Math.random() * NO_LABELS.length)]);
    onTaunt?.(TAUNTS[Math.floor(Math.random() * TAUNTS.length)]);
  }

  return (
    <div className="no-arena" ref={areaRef}>
      <button
        type="button"
        className="btn no-btn"
        style={{ left: pos.left, top: pos.top }}
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
