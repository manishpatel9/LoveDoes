import { useMemo } from "react";

export default function RosePetals({ count = 16 }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${(i * 11 + 3) % 96}%`,
        delay: `${(i * 0.4) % 6}s`,
        duration: `${8 + (i % 6)}s`,
        size: 10 + ((i * 5) % 14),
        rotate: i * 40,
      })),
    [count]
  );

  return (
    <div className="petals" aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            fontSize: p.size,
            "--spin": `${p.rotate}deg`,
          }}
        >
          🌹
        </span>
      ))}
    </div>
  );
}
