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

  // High-Resolution 4K Canvas Certificate Download Handler (Exact Match to Reference Image)
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

      // 2. Top kicker: — THE OFFICIAL —
      ctx.fillStyle = "#c8a356";
      ctx.font = "700 24px 'Cinzel', Georgia, serif";
      ctx.letterSpacing = "5px";
      // draw dashes manually
      ctx.fillText("— THE OFFICIAL —", width / 2, 240);

      // CERTIFICATE OF
      ctx.shadowColor = "rgba(74, 9, 19, 0.25)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 3;
      ctx.font = "bold 58px 'Cinzel', 'Playfair Display', Georgia, serif";
      ctx.fillStyle = "#4a0913";
      ctx.letterSpacing = "4px";
      ctx.fillText("CERTIFICATE OF", width / 2, 320);

      // ETERNAL LOVE (large, bold)
      ctx.shadowColor = "rgba(102, 7, 20, 0.35)";
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 5;
      ctx.font = "900 96px 'Cinzel', 'Playfair Display', Georgia, serif";
      ctx.fillStyle = "#4a0913";
      ctx.letterSpacing = "6px";
      ctx.fillText("ETERNAL LOVE", width / 2, 428);

      // Reset shadows
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Heart accent below ETERNAL LOVE
      ctx.font = "bold 28px sans-serif";
      ctx.fillStyle = "#b0102a";
      ctx.letterSpacing = "0px";
      ctx.fillText("♥", width / 2, 468);

      // — THIS CERTIFIES THAT —  (with lines)
      ctx.strokeStyle = "#c8a356";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 330, 510);
      ctx.lineTo(width / 2 - 145, 510);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width / 2 + 145, 510);
      ctx.lineTo(width / 2 + 330, 510);
      ctx.stroke();

      ctx.fillStyle = "#70101f";
      ctx.font = "700 22px 'Cinzel', Georgia, serif";
      ctx.letterSpacing = "6px";
      ctx.fillText("THIS CERTIFIES THAT", width / 2, 516);

      // 3. Couple Names Row: Left ♥ Right  (heart separator, NOT ampersand)
      ctx.shadowColor = "rgba(110, 9, 23, 0.3)";
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 4;
      ctx.font = "normal 112px 'Alex Brush', 'Great Vibes', cursive";
      ctx.fillStyle = "#5c0816";

      const nameY = 635;
      const heartGap = 58; // pixels around the heart

      const leftWidth = ctx.measureText(leftName).width;
      const rightWidth = ctx.measureText(rightName).width;

      // Position: left name ends, then heart, then right name starts — all centred
      const totalWidth = leftWidth + heartGap * 2 + 40 + rightWidth; // 40 px for heart char
      const startX = width / 2 - totalWidth / 2;

      ctx.textAlign = "left";
      ctx.fillText(leftName, startX, nameY);

      // Heart separator
      ctx.shadowBlur = 0;
      ctx.font = "bold 52px sans-serif";
      ctx.fillStyle = "#b0102a";
      const heartX = startX + leftWidth + heartGap;
      ctx.fillText("♥", heartX, nameY - 10);

      // Right name
      ctx.font = "normal 112px 'Alex Brush', 'Great Vibes', cursive";
      ctx.fillStyle = "#5c0816";
      ctx.shadowBlur = 14;
      ctx.fillText(rightName, heartX + 40 + heartGap, nameY);

      ctx.textAlign = "center";

      // Reset shadow for body text
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // 4. Declaration Body Paragraph 1
      ctx.font = "italic 33px 'Cormorant Garamond', Georgia, serif";
      ctx.fillStyle = "#2c161a";
      ctx.letterSpacing = "0.3px";
      // "are hereby declared to be forever bound in love,"  — 'in love' in red
      const line1a = "are hereby declared to be forever bound ";
      const line1b = "in love";
      const line1c = ",";
      const fullLine1 = line1a + line1b + line1c;
      // measure parts
      const w1a = ctx.measureText(line1a).width;
      const w1b = ctx.measureText(line1b).width;
      const line1Y = 730;
      const line1StartX = width / 2 - ctx.measureText(fullLine1).width / 2;
      ctx.textAlign = "left";
      ctx.fillStyle = "#2c161a";
      ctx.fillText(line1a, line1StartX, line1Y);
      ctx.fillStyle = "#990020";
      ctx.font = "italic 33px 'Cormorant Garamond', Georgia, serif";
      ctx.fillText(line1b, line1StartX + w1a, line1Y);
      ctx.fillStyle = "#2c161a";
      ctx.fillText(line1c, line1StartX + w1a + w1b, line1Y);

      ctx.textAlign = "center";
      ctx.fillStyle = "#2c161a";
      ctx.fillText("in heart, in soul and in every lifetime.", width / 2, 778);

      // Thin divider line
      ctx.strokeStyle = "#c8a356";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 220, 820);
      ctx.lineTo(width / 2 + 220, 820);
      ctx.stroke();

      // 5. Certification Paragraph — first line italic red
      ctx.font = "italic 33px 'Cormorant Garamond', Georgia, serif";
      ctx.fillStyle = "#990020";
      ctx.fillText(
        "This bond is certified as timeless, unconditional, and everlasting,",
        width / 2,
        868
      );

      ctx.fillStyle = "#2c161a";
      ctx.fillText(
        "sealed with trust, respect, care and a love that grows stronger",
        width / 2,
        916
      );
      ctx.fillText("with every heartbeat.", width / 2, 964);

      // 6. Together Forever with ornaments: — ♥ Together Forever ♥ —
      ctx.font = "normal 72px 'Alex Brush', 'Great Vibes', cursive";
      ctx.fillStyle = "#5c0d18";
      const togetherForeverY = 1050;

      // Draw ornament lines beside Together Forever
      ctx.strokeStyle = "#c8a356";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 360, togetherForeverY - 20);
      ctx.lineTo(width / 2 - 198, togetherForeverY - 20);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(width / 2 + 198, togetherForeverY - 20);
      ctx.lineTo(width / 2 + 360, togetherForeverY - 20);
      ctx.stroke();

      // Hearts in ornaments
      ctx.font = "bold 24px sans-serif";
      ctx.fillStyle = "#b0102a";
      ctx.fillText("♥", width / 2 - 170, togetherForeverY - 16);
      ctx.fillText("♥", width / 2 + 170, togetherForeverY - 16);

      ctx.font = "normal 72px 'Alex Brush', 'Great Vibes', cursive";
      ctx.fillStyle = "#5c0d18";
      ctx.fillText("Together Forever", width / 2, togetherForeverY);

      // 7. Signatures Row
      // Left Signature
      ctx.font = "normal 64px 'Alex Brush', 'Great Vibes', cursive";
      ctx.fillStyle = "#1a1a1a";
      ctx.fillText(leftName, width / 2 - 390, 1195);

      ctx.strokeStyle = "#b89047";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 540, 1214);
      ctx.lineTo(width / 2 - 240, 1214);
      ctx.stroke();

      ctx.font = "bold 19px 'Cinzel', Georgia, serif";
      ctx.fillStyle = "#5a101b";
      ctx.letterSpacing = "3px";
      ctx.fillText("PARTNER IN LIFE", width / 2 - 390, 1252);

      // Right Signature
      ctx.font = "normal 64px 'Alex Brush', 'Great Vibes', cursive";
      ctx.fillStyle = "#1a1a1a";
      ctx.fillText(rightName, width / 2 + 370, 1195);

      ctx.strokeStyle = "#b89047";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(width / 2 + 220, 1214);
      ctx.lineTo(width / 2 + 540, 1214);
      ctx.stroke();

      ctx.font = "bold 19px 'Cinzel', Georgia, serif";
      ctx.fillStyle = "#5a101b";
      ctx.letterSpacing = "3px";
      ctx.fillText("PARTNER IN LIFE", width / 2 + 370, 1252);

      // 8. Wax Seal (center-bottom between the two signatures)
      const sealCX = width / 2;
      const sealCY = 1230;
      const sealR = 78;

      // Outer gold ring
      ctx.beginPath();
      ctx.arc(sealCX, sealCY, sealR + 22, 0, Math.PI * 2);
      ctx.strokeStyle = "#c8a356";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Gold laurel wreath simulation (simple circles around)
      for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        const cx2 = sealCX + (sealR + 12) * Math.cos(angle);
        const cy2 = sealCY + (sealR + 12) * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(cx2, cy2, 7, 0, Math.PI * 2);
        ctx.fillStyle = "#d4af37";
        ctx.fill();
      }

      // Red wax seal body
      const sealGrad = ctx.createRadialGradient(
        sealCX - 18, sealCY - 18, 10,
        sealCX, sealCY, sealR
      );
      sealGrad.addColorStop(0, "#c41c3a");
      sealGrad.addColorStop(1, "#7a0a18");
      ctx.beginPath();
      ctx.arc(sealCX, sealCY, sealR, 0, Math.PI * 2);
      ctx.fillStyle = sealGrad;
      ctx.fill();

      // Hearts on seal
      ctx.font = "bold 56px sans-serif";
      ctx.fillStyle = "#ffd166";
      ctx.textAlign = "center";
      ctx.fillText("♥♥", sealCX, sealCY + 18);

      // Red ribbon tails
      ctx.fillStyle = "#c41c3a";
      // Left ribbon
      ctx.save();
      ctx.translate(sealCX - 30, sealCY + sealR);
      ctx.rotate(-0.25);
      ctx.fillRect(-18, 0, 36, 80);
      ctx.restore();
      // Right ribbon
      ctx.save();
      ctx.translate(sealCX + 30, sealCY + sealR);
      ctx.rotate(0.25);
      ctx.fillRect(-18, 0, 36, 80);
      ctx.restore();

      // 9. Envelope Note (Bottom Left)
      ctx.save();
      ctx.translate(250, 1360);
      ctx.rotate((-15 * Math.PI) / 180);
      ctx.textAlign = "center";
      ctx.font = "normal 40px 'Alex Brush', 'Great Vibes', cursive";
      ctx.fillStyle = "#2a1c15";
      ctx.letterSpacing = "0px";
      ctx.fillText("Forever Looks", 0, 0);
      ctx.fillText("Better", 0, 44);
      ctx.fillText("With You", 0, 88);
      ctx.font = "28px sans-serif";
      ctx.fillStyle = "#aa1024";
      ctx.fillText("♡", 0, 124);
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
        {/* INNER CONTENT OVERLAY MATCHING REFERENCE IMAGE */}
        <div className="cert-100-content">

          {/* HEADER SECTION */}
          <div className="cert-100-header">
            <div className="cert-100-kicker">— THE OFFICIAL —</div>
            <h2 className="cert-100-sub-title">CERTIFICATE OF</h2>
            <h1 className="cert-100-title">ETERNAL LO<span className="cert-title-heart">♥</span>VE</h1>
            <div className="cert-100-heart-accent">♥</div>
            <div className="cert-100-divider">
              <span className="cert-line" />
              <span className="cert-div-text">THIS CERTIFIES THAT</span>
              <span className="cert-line" />
            </div>
          </div>

          {/* COUPLE NAMES ROW — heart separator */}
          <div className="cert-100-names-row">
            <span className="cert-100-script-name">{leftName}</span>
            <span className="cert-100-heart-sep">♥</span>
            <span className="cert-100-script-name">{rightName}</span>
          </div>

          {/* DECLARATION BODY */}
          <div className="cert-100-body">
            <p className="cert-100-p">
              are hereby declared to be forever bound{" "}
              <em className="cert-highlight">in love</em>,
              <br />
              in heart, in soul and in every lifetime.
            </p>

            <p className="cert-100-p cert-100-p-red">
              This bond is certified as timeless, unconditional, and everlasting,
            </p>
            <p className="cert-100-p">
              sealed with trust, respect, care and a love that grows stronger
              <br />
              with every heartbeat.
            </p>

            {/* Together Forever with ornaments */}
            <div className="cert-100-tf-row">
              <span className="cert-tf-line-left" />
              <span className="cert-100-tf-heart">♥</span>
              <div className="cert-100-together-forever">Together Forever</div>
              <span className="cert-100-tf-heart">♥</span>
              <span className="cert-tf-line-right" />
            </div>
          </div>

          {/* SIGNATURES ROW */}
          <div className="cert-100-signatures-row">
            <div className="cert-100-sig-col">
              <span className="cert-100-sig-script">{leftName}</span>
              <div className="cert-100-sig-line" />
              <span className="cert-100-sig-role">PARTNER IN LIFE</span>
            </div>

            {/* Wax seal center */}
            <div className="cert-100-wax-seal">
              <div className="cert-seal-laurel">
                <div className="cert-seal-body">
                  <span className="cert-seal-hearts">♥♥</span>
                </div>
              </div>
              <div className="cert-seal-ribbons">
                <div className="cert-seal-ribbon cert-seal-ribbon-left" />
                <div className="cert-seal-ribbon cert-seal-ribbon-right" />
              </div>
            </div>

            <div className="cert-100-sig-col">
              <span className="cert-100-sig-script">{rightName}</span>
              <div className="cert-100-sig-line" />
              <span className="cert-100-sig-role">PARTNER IN LIFE</span>
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
