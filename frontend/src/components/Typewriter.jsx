import { useEffect, useState } from "react";

export default function Typewriter({ text, className = "", speed = 32 }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    setShown("");
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <p className={`typewriter ${className}`}>
      {shown}
      <span className="caret">|</span>
    </p>
  );
}
