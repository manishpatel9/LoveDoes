export default function ConfettiBurst() {
  const bits = Array.from({ length: 28 }, (_, i) => i);
  return (
    <div className="confetti" aria-hidden="true">
      {bits.map((i) => (
        <i
          key={i}
          style={{
            left: `${(i * 3.7) % 100}%`,
            animationDelay: `${(i % 8) * 0.12}s`,
            background: ["#ff4f81", "#ffd166", "#fff", "#ff8fab", "#c9184a"][i % 5],
          }}
        />
      ))}
    </div>
  );
}
