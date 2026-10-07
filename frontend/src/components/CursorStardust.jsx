import { useEffect, useRef } from "react";

export default function CursorStardust() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const addParticle = (x, y, isClick = false) => {
      const count = isClick ? 14 : 2;
      for (let i = 0; i < count; i++) {
        const symbols = ["✨", "❤️", "💖", "🌸", "⭐", "💕"];
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        const angle = Math.random() * Math.PI * 2;
        const speed = isClick ? 1 + Math.random() * 3.5 : 0.4 + Math.random() * 1.2;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (isClick ? 1 : 0.5),
          size: isClick ? 14 + Math.random() * 10 : 10 + Math.random() * 8,
          alpha: 1,
          decay: isClick ? 0.015 : 0.025,
          symbol,
        });
      }
    };

    const handleMouseMove = (e) => {
      if (Math.random() > 0.4) {
        addParticle(e.clientX, e.clientY, false);
      }
    };

    const handleClick = (e) => {
      addParticle(e.clientX, e.clientY, true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.font = `${p.size}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.symbol, p.x, p.y);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 99,
      }}
    />
  );
}
