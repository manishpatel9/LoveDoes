import { useRef, useState } from "react";
import { motion } from "framer-motion";
import certBg from "../assets/cert_bg.png";
import { playRomanticChime } from "../utils/audioSynth.js";

export default function RomanticCertificate({
  creatorName = "Kumar",
  partnerName = "Bhumi Kashyap",
  onReset,
}) {
  const certCardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const leftName = creatorName || "Kumar";
  const rightName = partnerName || "Bhumi Kashyap";

  // High-Resolution 4K Canvas Certificate Download Handler (Exact 100% Match to Reference Image)
  const handleDownloadImage = async () => {
    playRomanticChime();
    setDownloading(true);

    try {
      await document.fonts.ready;

      const canvas = document.createElement("canvas");
      // Landscape 3:2 aspect ratio matching reference image proportions (2400 x 1600 px)
      const width = 2400;
      const height = 1600;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      // 1. Draw base background template image
      const bgImg = new Image();
      bgImg.crossOrigin = "anonymous";
      bgImg.src = certBg;

      await new Promise((resolve) => {
        bgImg.onload = resolve;
        bgImg.onerror = resolve;
      });

      ctx.drawImage(bgImg, 0, 0, width, height);

      ctx.textAlign = "center";

      // 2. Top Ornaments & Kicker
      ctx.fillStyle = "#c8a356";
      ctx.font = "normal 22px 'Cinzel', Georgia, serif";
      ctx.letterSpacing = "6px";
      ctx.fillText("✦ THE OFFICIAL ✦", width / 2, 240);

      // CERTIFICATE OF
      ctx.shadowColor = "rgba(74, 9, 19, 0.25)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 3;
      ctx.font = "bold 52px 'Cinzel', 'Playfair Display', Georgia, serif";
      ctx.fillStyle = "#4a0913";
      ctx.letterSpacing = "4px";
      ctx.fillText("CERTIFICATE OF", width / 2, 310);

      // ETERNAL LOVE (Clean, majestic, regal typography)
      ctx.shadowColor = "rgba(102, 7, 20, 0.35)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;
      ctx.font = "900 84px 'Cinzel', 'Playfair Display', Georgia, serif";
      ctx.fillStyle = "#4a0913";
      ctx.letterSpacing = "6px";
      ctx.fillText("ETERNAL LOVE", width / 2, 400);

      // Reset shadows for lines
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // — THIS CERTIFIES THAT —
      ctx.strokeStyle = "#c8a356";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 320, 465);
      ctx.lineTo(width / 2 - 140, 465);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width / 2 + 140, 465);
      ctx.lineTo(width / 2 + 320, 465);
      ctx.stroke();

      ctx.fillStyle = "#70101f";
      ctx.font = "700 20px 'Cinzel', Georgia, serif";
      ctx.letterSpacing = "6px";
      ctx.fillText("THIS CERTIFIES THAT", width / 2, 471);

      // 3. Couple Names Row: Left & Right
      ctx.shadowColor = "rgba(110, 9, 23, 0.3)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;
      ctx.font = "normal 108px 'Alex Brush', 'Great Vibes', cursive";
      ctx.fillStyle = "#5c0816";

      const leftWidth = ctx.measureText(leftName).width;
      const rightWidth = ctx.measureText(rightName).width;
      const ampersandSpacing = 70;

      const leftX = width / 2 - (ampersandSpacing + leftWidth / 2);
      const rightX = width / 2 + (ampersandSpacing + rightWidth / 2);

      ctx.fillText(leftName, leftX, 595);

      // Center Golden Script Ampersand
      ctx.shadowBlur = 0;
      ctx.font = "italic 84px 'Great Vibes', 'Alex Brush', cursive";
      ctx.fillStyle = "#c8a356";
      ctx.fillText("&", width / 2, 590);

      ctx.font = "normal 108px 'Alex Brush', 'Great Vibes', cursive";
      ctx.fillStyle = "#5c0816";
      ctx.shadowBlur = 12;
      ctx.fillText(rightName, rightX, 595);

      // Reset shadow for body text
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // 4. Declaration Body Paragraph (Harmonious, Dignified Editorial Typography)
      ctx.font = "italic 32px 'Cormorant Garamond', Georgia, serif";
      ctx.fillStyle = "#2c161a";
      ctx.letterSpacing = "0.5px";
      ctx.fillText("are hereby declared to be forever united in sacred love,", width / 2, 680);
      ctx.fillText("in heart, in soul, and in every lifetime.", width / 2, 725);

      // 5. Certification Paragraph
      ctx.fillText("This bond is certified as timeless, unconditional, and everlasting —", width / 2, 805);
      ctx.fillText("sealed with profound devotion, trust, and a love that deepens", width / 2, 850);
      ctx.fillText("with every heartbeat.", width / 2, 895);

      // 6. Together Forever Calligraphy & Flourishes
      ctx.font = "normal 68px 'Alex Brush', 'Great Vibes', cursive";
      ctx.fillStyle = "#5c0d18";
      ctx.fillText("Together Forever", width / 2, 985);

      ctx.strokeStyle = "#c8a356";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 200, 1025);
      ctx.lineTo(width / 2 + 200, 1025);
      ctx.stroke();

      ctx.font = "16px 'Cinzel', Georgia, serif";
      ctx.fillStyle = "#c8a356";
      ctx.fillText("❖", width / 2, 1030);

      // 7. Signatures Row
      // Left Signature
      ctx.font = "normal 62px 'Alex Brush', 'Great Vibes', cursive";
      ctx.fillStyle = "#1a1a1a";
      ctx.fillText(leftName, width / 2 - 380, 1175);

      ctx.strokeStyle = "#b89047";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 530, 1205);
      ctx.lineTo(width / 2 - 230, 1205);
      ctx.stroke();

      ctx.font = "bold 18px 'Cinzel', Georgia, serif";
      ctx.fillStyle = "#5a101b";
      ctx.letterSpacing = "3px";
      ctx.fillText("SOULMATE & PARTNER", width / 2 - 380, 1242);

      // Right Signature
      ctx.font = "normal 62px 'Alex Brush', 'Great Vibes', cursive";
      ctx.fillStyle = "#1a1a1a";
      ctx.fillText(rightName, width / 2 + 380, 1175);

      ctx.beginPath();
      ctx.moveTo(width / 2 + 230, 1205);
      ctx.lineTo(width / 2 + 530, 1205);
      ctx.stroke();

      ctx.font = "bold 18px 'Cinzel', Georgia, serif";
      ctx.fillStyle = "#5a101b";
      ctx.letterSpacing = "3px";
      ctx.fillText("SOULMATE & PARTNER", width / 2 + 380, 1242);

      // 8. Envelope Note (Bottom Left Envelope Card)
      ctx.save();
      ctx.translate(250, 1340);
      ctx.rotate((-15 * Math.PI) / 180);
      ctx.textAlign = "center";
      ctx.font = "normal 38px 'Alex Brush', 'Great Vibes', cursive";
      ctx.fillStyle = "#2a1c15";
      ctx.fillText("Forever Looks", 0, 0);
      ctx.fillText("Better", 0, 42);
      ctx.fillText("With You", 0, 84);
      ctx.font = "24px sans-serif";
      ctx.fillStyle = "#aa1024";
      ctx.fillText("♡", 0, 118);
      ctx.restore();

      // Download PNG trigger
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `Certificate_of_Eternal_Love_${leftName.replace(/\s+/g, "_")}_and_${rightName.replace(/\s+/g, "_")}.png`;
      link.click();
    } catch (err) {
      console.error("Certificate download error:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="cert-100-wrapper">
      <motion.div
        className="cert-100-card"
        ref={certCardRef}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{ backgroundImage: `url(${certBg})` }}
      >
        {/* INNER CONTENT OVERLAY MATCHING REFERENCE IMAGE WITH ELEVATED TYPOGRAPHY */}
        <div className="cert-100-content">
          {/* HEADER SECTION */}
          <div className="cert-100-header">
            <div className="cert-100-kicker">✦ THE OFFICIAL ✦</div>
            <h2 className="cert-100-sub-title">CERTIFICATE OF</h2>
            <h1 className="cert-100-title">ETERNAL LOVE</h1>
            <div className="cert-100-divider">
              <span className="cert-line" />
              <span className="cert-div-text">THIS CERTIFIES THAT</span>
              <span className="cert-line" />
            </div>
          </div>

          {/* COUPLE NAMES ROW */}
          <div className="cert-100-names-row">
            <span className="cert-100-script-name">{leftName}</span>
            <span className="cert-100-ampersand">&</span>
            <span className="cert-100-script-name">{rightName}</span>
          </div>

          {/* DECLARATION BODY */}
          <div className="cert-100-body">
            <p className="cert-100-p">
              are hereby declared to be forever united in sacred love,
              in heart, in soul, and in every lifetime.
            </p>

            <p className="cert-100-p">
              This bond is certified as timeless, unconditional, and everlasting —
              sealed with profound devotion, trust, and a love that deepens
              with every heartbeat.
            </p>

            <div className="cert-100-together-forever">
              Together Forever
            </div>
            <div className="cert-tf-flourish">❖ ─── ❦ ─── ❖</div>
          </div>

          {/* SIGNATURES ROW */}
          <div className="cert-100-signatures-row">
            <div className="cert-100-sig-col">
              <span className="cert-100-sig-script">{leftName}</span>
              <div className="cert-100-sig-line" />
              <span className="cert-100-sig-role">SOULMATE & PARTNER</span>
            </div>

            <div className="cert-100-sig-col">
              <span className="cert-100-sig-script">{rightName}</span>
              <div className="cert-100-sig-line" />
              <span className="cert-100-sig-role">SOULMATE & PARTNER</span>
            </div>
          </div>

          {/* ENVELOPE OVERLAY TEXT (BOTTOM LEFT) */}
          <div className="cert-100-envelope-text">
            <span>Forever Looks</span>
            <span>Better</span>
            <span>With You</span>
            <span className="env-heart">♡</span>
          </div>
        </div>
      </motion.div>

      {/* ACTION BUTTONS TOOLBAR */}
      <div className="cert-100-toolbar">
        <button
          type="button"
          className="btn glow cert-100-dl-btn"
          onClick={handleDownloadImage}
          disabled={downloading}
        >
          {downloading ? "⌛ Generating Official Certificate..." : "📜 Download Official Certificate (PNG)"}
        </button>

        {onReset && (
          <button
            type="button"
            className="btn secondary cert-100-reset-btn"
            onClick={onReset}
          >
            🔄 Try Quiz Again
          </button>
        )}
      </div>
    </div>
  );
}

