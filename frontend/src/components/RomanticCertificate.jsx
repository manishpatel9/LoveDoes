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
      ctx.font = "normal 36px Georgia, serif";
      ctx.fillText("─── ༺ ♥ ༻ ───", width / 2, 215);

      // — THE OFFICIAL —
      ctx.fillStyle = "#70101f";
      ctx.font = "700 24px 'Cinzel', Georgia, serif";
      ctx.letterSpacing = "6px";
      ctx.fillText("— THE OFFICIAL —", width / 2, 260);

      // CERTIFICATE OF
      ctx.shadowColor = "rgba(74, 9, 19, 0.25)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 3;
      ctx.font = "bold 56px 'Cinzel', 'Playfair Display', Georgia, serif";
      ctx.fillStyle = "#4a0913";
      ctx.letterSpacing = "3px";
      ctx.fillText("CERTIFICATE OF", width / 2, 325);

      // ETERNAL LOVE (With Heart in the O of LOVE)
      ctx.shadowColor = "rgba(102, 7, 20, 0.35)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;
      ctx.font = "900 92px 'Cinzel', 'Playfair Display', Georgia, serif";
      ctx.fillStyle = "#4a0913";
      ctx.letterSpacing = "4px";

      // Calculate width of "ETERNAL L" + Heart + "VE"
      const part1 = "ETERNAL L";
      const part2 = "VE";
      ctx.font = "900 92px 'Cinzel', 'Playfair Display', Georgia, serif";
      const w1 = ctx.measureText(part1).width;
      const w2 = ctx.measureText(part2).width;
      const heartW = 75;
      const totalTitleW = w1 + heartW + w2;

      const titleStartX = width / 2 - totalTitleW / 2;

      ctx.textAlign = "left";
      ctx.fillStyle = "#4a0913";
      ctx.fillText(part1, titleStartX, 412);

      // Red Heart in O of LOVE
      ctx.font = "76px sans-serif";
      ctx.fillStyle = "#b80d22";
      ctx.fillText("❤️", titleStartX + w1 - 4, 408);

      ctx.font = "900 92px 'Cinzel', 'Playfair Display', Georgia, serif";
      ctx.fillStyle = "#4a0913";
      ctx.fillText(part2, titleStartX + w1 + heartW - 8, 412);

      // Reset shadows for lines
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // — THIS CERTIFIES THAT —
      ctx.textAlign = "center";
      ctx.strokeStyle = "#c8a356";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 340, 470);
      ctx.lineTo(width / 2 - 145, 470);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width / 2 + 145, 470);
      ctx.lineTo(width / 2 + 340, 470);
      ctx.stroke();

      ctx.fillStyle = "#70101f";
      ctx.font = "700 20px 'Cinzel', Georgia, serif";
      ctx.letterSpacing = "6px";
      ctx.fillText("THIS CERTIFIES THAT", width / 2, 476);

      // Small heart divider
      ctx.font = "22px sans-serif";
      ctx.fillStyle = "#aa1024";
      ctx.fillText("♥", width / 2, 508);

      // 3. Couple Names Row: Kumar ♥ Bhumi Kashyap
      ctx.shadowColor = "rgba(110, 9, 23, 0.3)";
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 5;
      ctx.font = "normal 112px 'Pinyon Script', 'Great Vibes', 'Alex Brush', cursive";
      ctx.fillStyle = "#660714";

      const leftWidth = ctx.measureText(leftName).width;
      const rightWidth = ctx.measureText(rightName).width;
      const spacing = 110;

      const leftX = width / 2 - (spacing + leftWidth / 2);
      const rightX = width / 2 + (spacing + rightWidth / 2);

      ctx.fillText(leftName, leftX, 600);

      // Center 3D Heart Emblem
      ctx.font = "64px sans-serif";
      ctx.fillStyle = "#b80d22";
      ctx.fillText("❤️", width / 2, 585);

      ctx.font = "normal 112px 'Pinyon Script', 'Great Vibes', 'Alex Brush', cursive";
      ctx.fillStyle = "#660714";
      ctx.fillText(rightName, rightX, 600);

      // Reset shadow for body text
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // 4. Declaration Body Paragraph
      // Line 1: "are hereby declared to be forever bound " (Serif) + "in love," (Red script)
      ctx.font = "italic 32px 'Cormorant Garamond', Georgia, serif";
      const line1Part1 = "are hereby declared to be forever bound ";
      const line1P1W = ctx.measureText(line1Part1).width;

      ctx.font = "italic 38px 'Pinyon Script', 'Great Vibes', cursive";
      const line1Part2 = "in love,";
      const line1P2W = ctx.measureText(line1Part2).width;

      const totalL1W = line1P1W + line1P2W;
      const startL1X = width / 2 - totalL1W / 2;

      ctx.textAlign = "left";
      ctx.font = "italic 32px 'Cormorant Garamond', Georgia, serif";
      ctx.fillStyle = "#1f1614";
      ctx.fillText(line1Part1, startL1X, 685);

      ctx.font = "italic 38px 'Pinyon Script', 'Great Vibes', cursive";
      ctx.fillStyle = "#8a0c1e";
      ctx.fillText(line1Part2, startL1X + line1P1W, 685);

      ctx.textAlign = "center";
      ctx.font = "italic 32px 'Cormorant Garamond', Georgia, serif";
      ctx.fillStyle = "#1f1614";
      ctx.fillText("in heart, in soul and in every lifetime.", width / 2, 730);

      // 5. Certification Paragraph
      // Line 1: "This bond is certified as timeless, unconditional, and everlasting," (Red script)
      ctx.font = "italic 38px 'Pinyon Script', 'Great Vibes', cursive";
      ctx.fillStyle = "#8a0c1e";
      ctx.fillText("This bond is certified as timeless, unconditional, and everlasting,", width / 2, 810);

      ctx.font = "italic 32px 'Cormorant Garamond', Georgia, serif";
      ctx.fillStyle = "#1f1614";
      ctx.fillText("sealed with trust, respect, care and a love that grows stronger", width / 2, 858);
      ctx.fillText("with every heartbeat.", width / 2, 900);

      // 6. Together Forever Calligraphy & Flourishes
      ctx.font = "normal 68px 'Pinyon Script', 'Great Vibes', cursive";
      ctx.fillStyle = "#5c0d18";
      ctx.fillText("Together Forever", width / 2, 990);

      ctx.strokeStyle = "#c8a356";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 240, 1030);
      ctx.lineTo(width / 2 + 240, 1030);
      ctx.stroke();

      ctx.font = "20px sans-serif";
      ctx.fillStyle = "#aa1024";
      ctx.fillText("♥", width / 2, 1036);

      // 7. Signatures Row (Safely Centered Inside Parchment Area)
      // Left Signature (Kumar / Rahul)
      ctx.font = "normal 64px 'Pinyon Script', 'Great Vibes', cursive";
      ctx.fillStyle = "#1a1a1a";
      ctx.fillText(leftName, width / 2 - 380, 1180);

      ctx.strokeStyle = "#8b0d1e";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 530, 1215);
      ctx.lineTo(width / 2 - 230, 1215);
      ctx.stroke();

      ctx.font = "18px sans-serif";
      ctx.fillStyle = "#aa1024";
      ctx.fillText("♥", width / 2 - 380, 1221);

      ctx.font = "bold 20px 'Cinzel', Georgia, serif";
      ctx.fillStyle = "#4a0812";
      ctx.letterSpacing = "2px";
      ctx.fillText("PARTNER IN LIFE", width / 2 - 380, 1252);

      // Right Signature (Bhumi Kashyap / Priya)
      ctx.font = "normal 64px 'Pinyon Script', 'Great Vibes', cursive";
      ctx.fillStyle = "#1a1a1a";
      ctx.fillText(rightName, width / 2 + 380, 1180);

      ctx.beginPath();
      ctx.moveTo(width / 2 + 230, 1215);
      ctx.lineTo(width / 2 + 530, 1215);
      ctx.stroke();

      ctx.font = "18px sans-serif";
      ctx.fillStyle = "#aa1024";
      ctx.fillText("♥", width / 2 + 380, 1221);

      ctx.font = "bold 20px 'Cinzel', Georgia, serif";
      ctx.fillStyle = "#4a0812";
      ctx.letterSpacing = "2px";
      ctx.fillText("PARTNER IN LIFE", width / 2 + 380, 1252);

      // 8. Envelope Note (Bottom Left Envelope Card)
      ctx.save();
      ctx.translate(250, 1340);
      ctx.rotate((-15 * Math.PI) / 180);
      ctx.textAlign = "center";
      ctx.font = "normal 38px 'Pinyon Script', 'Great Vibes', cursive";
      ctx.fillStyle = "#2a1c15";
      ctx.fillText("Forever Looks", 0, 0);
      ctx.fillText("Better", 0, 42);
      ctx.fillText("With You", 0, 84);
      ctx.font = "26px sans-serif";
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
        {/* INNER CONTENT OVERLAY MATCHING REFERENCE IMAGE 100% EXACTLY */}
        <div className="cert-100-content">
          {/* HEADER SECTION */}
          <div className="cert-100-header">
            <div className="cert-100-twin-hearts">─── ༺ ♥ ༻ ───</div>
            <div className="cert-100-kicker">— THE OFFICIAL —</div>
            <h2 className="cert-100-sub-title">CERTIFICATE OF</h2>
            <h1 className="cert-100-title">
              ETERNAL L<span className="cert-title-heart">❤️</span>VE
            </h1>
            <div className="cert-100-divider">
              <span className="cert-line" />
              <span className="cert-div-text">THIS CERTIFIES THAT</span>
              <span className="cert-line" />
            </div>
            <div className="cert-100-small-heart">♥</div>
          </div>

          {/* COUPLE NAMES ROW */}
          <div className="cert-100-names-row">
            <span className="cert-name-flourish">❧</span>
            <span className="cert-100-script-name">{leftName}</span>
            <div className="cert-100-heart-emblem">❤️</div>
            <span className="cert-100-script-name">{rightName}</span>
            <span className="cert-name-flourish">❧</span>
          </div>

          {/* DECLARATION BODY */}
          <div className="cert-100-body">
            <p className="cert-100-p">
              are hereby declared to be forever bound <em className="cert-script-highlight">in love,</em><br />
              in heart, in soul and in every lifetime.
            </p>

            <p className="cert-100-p">
              <em className="cert-script-highlight">This bond is certified as timeless, unconditional, and everlasting,</em><br />
              sealed with trust, respect, care and a love that grows stronger<br />
              with every heartbeat.
            </p>

            <div className="cert-100-together-forever">
              Together Forever
            </div>
            <div className="cert-tf-flourish">─── ༺ ♥ ༻ ───</div>
          </div>

          {/* SIGNATURES ROW */}
          <div className="cert-100-signatures-row">
            <div className="cert-100-sig-col">
              <span className="cert-100-sig-script">{leftName}</span>
              <div className="cert-100-sig-line">
                <span className="sig-heart-dot">♥</span>
              </div>
              <span className="cert-100-sig-role">PARTNER IN LIFE</span>
            </div>

            <div className="cert-100-sig-col">
              <span className="cert-100-sig-script">{rightName}</span>
              <div className="cert-100-sig-line">
                <span className="sig-heart-dot">♥</span>
              </div>
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

