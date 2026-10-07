import { useRef, useState } from "react";

const TAUNTS = [
  "Are you sure? 🥺",
  "Think again ❤️",
  "Nice try 😜",
  "You can't escape love! 💕",
  "The heart already knows…",
];

export default function RunawayNo({ onTaunt }) {
  const areaRef = useRef(null);
  const [pos, setPos] = useState({ left: "70%", top: "58%" });

  function flee() {
    const area = areaRef.current;
    if (!area) return;
    const w = area.clientWidth;
    const h = area.clientHeight;
    const bw = 108;
    const bh = 48;
    let left = 8;
    let top = 8;
    for (let i = 0; i < 16; i += 1) {
      left = 8 + Math.random() * Math.max(8, w - bw - 16);
      top = 8 + Math.random() * Math.max(8, h - bh - 16);
      const cx = w / 2;
      const cy = h / 2;
      const coversYes = Math.abs(left + bw / 2 - cx) < 90 && Math.abs(top + bh / 2 - cy) < 40;
      if (!coversYes) break;
    }
    setPos({ left: `${left}px`, top: `${top}px` });
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
        NO 😜
      </button>
    </div>
  );
}
