export default function Lightbox({ src, title, onClose }) {
  if (!src) return null;
  return (
    <div className="lightbox" role="dialog" onClick={onClose}>
      <img src={src} alt={title || "Memory"} />
      {title ? <p>{title}</p> : null}
    </div>
  );
}
