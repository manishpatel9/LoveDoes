import { useEffect } from "react";

export default function Lightbox({ src, title, onClose }) {
  useEffect(() => {
    if (!src) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, src]);

  if (!src) return null;
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${title || "Image"} preview`} onClick={onClose}>
      <button
        type="button"
        className="memory-lightbox-close"
        aria-label="Close image preview"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
      >
        ×
      </button>
      <img src={src} alt={title || "Memory"} onClick={(event) => event.stopPropagation()} />
      {title ? <p>{title}</p> : null}
    </div>
  );
}
