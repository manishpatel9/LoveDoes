import { useMemo } from "react";

export default function GlowOrbs() {
  const orbs = useMemo(
    () => [
      { cx: "15%", cy: "20%", size: 320, color: "rgba(255, 79, 129, 0.35)", delay: "0s" },
      { cx: "80%", cy: "30%", size: 260, color: "rgba(255, 209, 102, 0.25)", delay: "-4s" },
      { cx: "50%", cy: "75%", size: 400, color: "rgba(201, 24, 74, 0.2)", delay: "-8s" },
      { cx: "25%", cy: "85%", size: 200, color: "rgba(255, 143, 171, 0.3)", delay: "-2s" },
      { cx: "70%", cy: "10%", size: 180, color: "rgba(255, 255, 255, 0.08)", delay: "-6s" },
    ],
    []
  );

  return (
    <div className="glow-orbs-layer" aria-hidden="true">
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="glow-orb"
          style={{
            left: orb.cx,
            top: orb.cy,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            animationDelay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}
