import PublicLayout from "../layouts/PublicLayout.jsx";
import CursorStardust from "../components/CursorStardust.jsx";
import AudioSoundtrackBar from "../components/AudioSoundtrackBar.jsx";

export default function Terms() {
  return (
    <PublicLayout>
      <CursorStardust />
      <AudioSoundtrackBar />
      <div className="about-page-wrapper">
        <div className="about-manifesto-card" style={{ textAlign: "left" }}>
          <span className="lp-mini-tag">📜 TERMS OF SERVICE</span>
          <h1 className="contact-title" style={{ textAlign: "left", fontSize: "3.2rem" }}>Terms of Service ♡</h1>
          <p className="manifesto-text" style={{ textAlign: "left", margin: "0 0 20px" }}>
            By creating a digital surprise page on LoveDoes, you agree to spread joy, kindness, and genuine affection.
          </p>
          <ul style={{ color: "#ffd0dc", fontSize: "1.05rem", lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Respectful Content: Only upload content you have explicit consent to share.</li>
            <li>Sanctuary Integrity: Do not attempt to reverse engineer or misuse the platform infrastructure.</li>
            <li>Forever Hosting: Standard digital pages remain accessible indefinitely unless deleted upon user request.</li>
          </ul>
        </div>
      </div>
    </PublicLayout>
  );
}
