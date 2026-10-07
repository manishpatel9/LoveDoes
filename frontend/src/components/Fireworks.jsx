export default function Fireworks() {
  return (
    <div className="fireworks" aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => (
        <span key={i} className="burst" style={{ left: `${12 + i * 11}%`, animationDelay: `${i * 0.35}s` }} />
      ))}
    </div>
  );
}
