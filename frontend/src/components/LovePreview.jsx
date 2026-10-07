import { COUPLE_AVATARS } from "./CoupleAvatars.jsx";

export default function LovePreview({ data }) {
  const creatorSrc = data.creatorPreview;
  const partnerSrc = data.partnerPreview;
  const defaultAvatar = COUPLE_AVATARS[0];

  return (
    <div className="card preview-card" style={{ textAlign: "center", background: "rgba(255, 245, 248, 0.9)", padding: "28px 20px" }}>
      <p className="heart-pulse" style={{ fontSize: "2.5rem" }}>💖</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
        <span className="script-name" style={{ fontSize: "2.6rem", color: "var(--rose)" }}>
          {data.creatorName || "You"}
        </span>
        <span className="amp" style={{ fontSize: "1.8rem", color: "var(--pink)" }}>&</span>
        <span className="script-name" style={{ fontSize: "2.6rem", color: "var(--rose)" }}>
          {data.partnerName || "Them"}
        </span>
      </div>
      <p style={{ fontStyle: "italic", color: "var(--muted)", margin: "4px 0 20px" }}>
        {data.title || "Two hearts, one story"}
      </p>

      <div className="preview-photos couple-photos" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
        {creatorSrc ? (
          <img src={creatorSrc} alt={data.creatorName} style={{ width: 140, height: 180, borderRadius: 20, objectFit: "cover", boxShadow: "0 10px 30px rgba(201, 24, 74, 0.3)" }} />
        ) : (
          <div style={{ width: 140, height: 180, borderRadius: 20, background: "#ffe4ef", display: "grid", placeItems: "center", padding: 12, border: "2px solid #ffb4c8" }}>
            {defaultAvatar.creatorSvg}
          </div>
        )}

        <span className="heart-pulse" style={{ fontSize: "2rem" }}>💞</span>

        {partnerSrc ? (
          <img src={partnerSrc} alt={data.partnerName} style={{ width: 140, height: 180, borderRadius: 20, objectFit: "cover", boxShadow: "0 10px 30px rgba(201, 24, 74, 0.3)" }} />
        ) : (
          <div style={{ width: 140, height: 180, borderRadius: 20, background: "#ffe4ef", display: "grid", placeItems: "center", padding: 12, border: "2px solid #ffb4c8" }}>
            {defaultAvatar.partnerSvg}
          </div>
        )}
      </div>

      {data.message ? <p className="message-box" style={{ marginTop: 20, fontStyle: "italic", color: "#4a1230" }}>“{data.message}”</p> : null}
    </div>
  );
}
