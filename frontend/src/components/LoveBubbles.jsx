import { useMemo, useEffect, useState } from "react";

const LOVE_MESSAGES = [
  "I Love You", "Te Amo", "Je t'aime", "사랑해", "愛してる",
  "Ich liebe dich", "Ti amo", "Я тебя люблю", "أحبك",
  "Σ'αγαπώ", "मैं तुमसे प्यार करता हूँ", "너를 사랑해",
  "Forever", "Always", "My Heart", "Soulmate", "Be Mine",
  "❤️", "💕", "💖", "💗", "💞", "💘", "✨", "🌹", "💜",
  "I Love You ❤️", "My Everything", "You & Me"
];

export default function LoveBubbles({ count = 24, showMessages = true }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const bubbles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${((i * 17 + 5) % 96)}%`,
        delay: `${(i * 0.35) % 10}s`,
        duration: `${7 + (i % 8)}s`,
        size: 12 + ((i * 7) % 26),
        msg: LOVE_MESSAGES[i % LOVE_MESSAGES.length],
        isEmoji: i % 3 === 0,
        xDrift: `${-30 + ((i * 13) % 60)}px`,
        opacity: 0.4 + ((i * 7) % 5) / 10,
      })),
    [count]
  );

  if (!visible) return null;

  return (
    <div className="love-bubbles-layer" aria-hidden="true">
      {bubbles.map((b) => (
        <span
          key={b.id}
          className={`love-bubble ${b.isEmoji ? "emoji-bubble" : "text-bubble"}`}
          style={{
            left: b.left,
            animationDelay: b.delay,
            animationDuration: b.duration,
            fontSize: b.isEmoji ? b.size : Math.max(10, b.size * 0.55),
            "--bubble-drift": b.xDrift,
            "--bubble-opacity": b.opacity,
          }}
        >
          {showMessages ? b.msg : b.isEmoji ? b.msg : "❤️"}
        </span>
      ))}
    </div>
  );
}
