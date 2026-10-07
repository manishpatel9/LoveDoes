import PublicLayout from "../layouts/PublicLayout.jsx";
import CursorStardust from "../components/CursorStardust.jsx";
import AudioSoundtrackBar from "../components/AudioSoundtrackBar.jsx";

export default function Privacy() {
  return (
    <PublicLayout>
      <CursorStardust />
      <AudioSoundtrackBar />
      <div className="about-page-wrapper">
        <div className="about-manifesto-card" style={{ textAlign: "left" }}>
          <span className="lp-mini-tag">🔒 PRIVACY & TRUST</span>
          <h1 className="contact-title" style={{ textAlign: "left", fontSize: "3.2rem" }}>Privacy Policy ♡</h1>
          <p className="manifesto-text" style={{ textAlign: "left", margin: "0 0 20px" }}>
            Your trust and privacy are sacred to us. Photos, names, intimate messages, and custom ambient melodies uploaded to LoveDoes are encrypted and stored solely to serve your private digital sanctuary.
          </p>
          <ul style={{ color: "#ffd0dc", fontSize: "1.05rem", lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Private URLs: Your love page is accessible only via your unique generated link.</li>
            <li>Passcode Protection: Optional 4-digit pin or wax seal lock to ensure complete privacy.</li>
            <li>Analytics: We log hashed view counters solely to show you how many times your loved one opened your page.</li>
            <li>Media Safety: Images (JPEG, PNG, WEBP up to 5MB) are securely served via localized CDN.</li>
          </ul>
        </div>
      </div>
    </PublicLayout>
  );
}
