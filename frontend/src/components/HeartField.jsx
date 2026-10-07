import { useMemo } from "react";

export default function HeartField({ count = 18, dense = false }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${((i * 13) + 4) % 96}%`,
        delay: `${(i * 0.45) % 8}s`,
        duration: `${9 + (i % 7)}s`,
        size: dense ? 10 + ((i * 5) % 16) : 16 + ((i * 9) % 22),
        drift: `${-20 + ((i * 11) % 40)}px`,
        char: ["❤️", "💕", "💖", "💗", "✨", "💞"][i % 6],
      })),
    [count, dense]
  );

  return (
    <div className="floating-hearts" aria-hidden="true">
      {hearts.map((h, i) => (
        <span
          key={i}
          style={{
            left: h.left,
            animationDelay: h.delay,
            animationDuration: h.duration,
            fontSize: h.size,
            "--drift": h.drift,
          }}
        >
          {h.char}
        </span>
      ))}
    </div>
  );
}
