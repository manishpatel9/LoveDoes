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

  // ── High-Resolution Canvas Certificate Download ──────────────────────────
  const handleDownloadImage = async () => {
    playRomanticChime();
    setDownloading(true);
    try {
      await document.fonts.ready;

      const canvas = document.createElement("canvas");
      const W = 2400, H = 1600;
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");

      // Background
      const bgImg = new Image();
      bgImg.crossOrigin = "anonymous";
      bgImg.src = certBg;
      await new Promise((r) => { bgImg.onload = r; bgImg.onerror = r; });
      ctx.drawImage(bgImg, 0, 0, W, H);

      const cx = W / 2;
      ctx.textAlign = "center";

      // ── Helper: reset shadow ──
      const clearShadow = () => {
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      };
      const setShadow = (color, blur, oy = 3) => {
        ctx.shadowColor = color;
        ctx.shadowBlur = blur;
        ctx.shadowOffsetY = oy;
      };

      // ── 1. Kicker: — THE OFFICIAL — ──────────────────────────────────────
      ctx.font = "500 26px 'Cinzel Decorative', 'Cinzel', Georgia, serif";
      ctx.fillStyle = "#c8a356";
      ctx.letterSpacing = "5px";
      ctx.fillText("— THE OFFICIAL —", cx, 235);

      // ── 2. CERTIFICATE OF ────────────────────────────────────────────────
      setShadow("rgba(74,9,19,0.22)", 10, 3);
      ctx.font = "bold 62px 'Cinzel', Georgia, serif";
      ctx.fillStyle = "#4a0913";
      ctx.letterSpacing = "5px";
      ctx.fillText("CERTIFICATE OF", cx, 315);

      // ── 3. ETERNAL LOVE ──────────────────────────────────────────────────
      setShadow("rgba(100,7,20,0.32)", 18, 6);
      ctx.font = "900 102px 'Cinzel', 'Playfair Display', Georgia, serif";
      ctx.fillStyle = "#4a0913";
      ctx.letterSpacing = "6px";
      ctx.fillText("ETERNAL LOVE", cx, 432);
      clearShadow();

      // ── 4. Heart accent ──────────────────────────────────────────────────
      ctx.font = "bold 30px sans-serif";
      ctx.fillStyle = "#b0102a";
      ctx.letterSpacing = "0px";
      ctx.fillText("♥", cx, 474);

      // ── 5. THIS CERTIFIES THAT divider ───────────────────────────────────
      const drawDivLine = (x1, x2, y) => {
        ctx.strokeStyle = "#c8a356";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
      };
      drawDivLine(cx - 345, cx - 155, 516);
      drawDivLine(cx + 155, cx + 345, 516);

      ctx.fillStyle = "#70101f";
      ctx.font = "700 23px 'Cinzel', Georgia, serif";
      ctx.letterSpacing = "6px";
      ctx.fillText("THIS CERTIFIES THAT", cx, 522);

      // ── 6. Names row (left ♥ right) ──────────────────────────────────────
      setShadow("rgba(110,9,23,0.28)", 16, 4);
      ctx.font = "normal 116px 'Alex Brush', 'Great Vibes', cursive";
      ctx.fillStyle = "#5c0816";
      ctx.letterSpacing = "0px";

      const nameY = 645;
      const lw = ctx.measureText(leftName).width;
      const rw = ctx.measureText(rightName).width;
      const heartPad = 60;
      const heartCharW = 50;
      const total = lw + heartPad * 2 + heartCharW + rw;
      const sx = cx - total / 2;

      ctx.textAlign = "left";
      ctx.fillText(leftName, sx, nameY);

      clearShadow();
      ctx.font = "bold 54px sans-serif";
      ctx.fillStyle = "#b0102a";
      const hx = sx + lw + heartPad;
      ctx.fillText("♥", hx, nameY - 12);

      setShadow("rgba(110,9,23,0.28)", 16, 4);
      ctx.font = "normal 116px 'Alex Brush', 'Great Vibes', cursive";
      ctx.fillStyle = "#5c0816";
      ctx.fillText(rightName, hx + heartCharW + heartPad, nameY);

      ctx.textAlign = "center";
      clearShadow();

      // ── 7. Declaration ───────────────────────────────────────────────────
      ctx.font = "italic 500 34px 'Cormorant Garamond', Georgia, serif";
      ctx.letterSpacing = "0.3px";

      // Line 1: "are hereby declared to be forever bound" + [red]"in love"[/red] + ","
      const p1a = "are hereby declared to be forever bound ";
      const p1b = "in love";
      const p1c = ",";
      const full1 = p1a + p1b + p1c;
      const startP1 = cx - ctx.measureText(full1).width / 2;
      const w1a = ctx.measureText(p1a).width;
      const w1b = ctx.measureText(p1b).width;
      ctx.textAlign = "left";
      ctx.fillStyle = "#2c161a";
      ctx.fillText(p1a, startP1, 740);
      ctx.fillStyle = "#990020";
      ctx.fillText(p1b, startP1 + w1a, 740);
      ctx.fillStyle = "#2c161a";
      ctx.fillText(p1c, startP1 + w1a + w1b, 740);

      ctx.textAlign = "center";
      ctx.fillStyle = "#2c161a";
      ctx.fillText("in heart, in soul and in every lifetime.", cx, 790);

      // Thin gold divider
      drawDivLine(cx - 230, cx + 230, 834);

      // Line 2 (red italic): certification sentence
      ctx.font = "italic 600 34px 'Cormorant Garamond', Georgia, serif";
      ctx.fillStyle = "#990020";
      ctx.fillText("This bond is certified as timeless, unconditional, and everlasting,", cx, 886);

      // Lines 3–4
      ctx.font = "italic 500 34px 'Cormorant Garamond', Georgia, serif";
      ctx.fillStyle = "#2c161a";
      ctx.fillText("sealed with trust, respect, care and a love that grows stronger", cx, 936);
      ctx.fillText("with every heartbeat.", cx, 982);

      // ── 8. Together Forever ──────────────────────────────────────────────
      const tfY = 1065;
      drawDivLine(cx - 380, cx - 210, tfY - 26);
      drawDivLine(cx + 210,  cx + 380, tfY - 26);

      ctx.font = "bold 26px sans-serif";
      ctx.fillStyle = "#b0102a";
      ctx.fillText("♥", cx - 182, tfY - 22);
      ctx.fillText("♥", cx + 182, tfY - 22);

      ctx.font = "normal 76px 'Alex Brush', 'Great Vibes', cursive";
      ctx.fillStyle = "#5c0d18";
      ctx.fillText("Together Forever", cx, tfY);

      // ── 9. Signature row ─────────────────────────────────────────────────
      const sigY   = 1210;
      const lineY  = 1230;
      const roleY  = 1268;
      const sigLX  = cx - 400;
      const sigRX  = cx + 380;

      ctx.font = "normal 66px 'Alex Brush', 'Great Vibes', cursive";
      ctx.fillStyle = "#1a1a1a";
      ctx.fillText(leftName,  sigLX, sigY);
      ctx.fillText(rightName, sigRX, sigY);

      ctx.strokeStyle = "#b89047";
      ctx.lineWidth = 1.5;
      drawDivLine(cx - 560, cx - 238, lineY);
      drawDivLine(cx + 238, cx + 560, lineY);

      ctx.font = "700 20px 'Cinzel', Georgia, serif";
      ctx.fillStyle = "#5a101b";
      ctx.letterSpacing = "3px";
      ctx.fillText("PARTNER IN LIFE", sigLX, roleY);
      ctx.fillText("PARTNER IN LIFE", sigRX, roleY);

      // ── 10. Wax Seal (center, between signatures) ────────────────────────
      const seX = cx, seY = 1235, seR = 82;

      // Gold outer ring
      ctx.beginPath();
      ctx.arc(seX, seY, seR + 24, 0, Math.PI * 2);
      ctx.strokeStyle = "#c8a356";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Laurel dots
      for (let i = 0; i < 26; i++) {
        const a = (i / 26) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(seX + (seR + 13) * Math.cos(a), seY + (seR + 13) * Math.sin(a), 6.5, 0, Math.PI * 2);
        ctx.fillStyle = "#d4af37";
        ctx.fill();
      }

      // Red body
      const sGrad = ctx.createRadialGradient(seX - 20, seY - 20, 8, seX, seY, seR);
      sGrad.addColorStop(0, "#c41c3a");
      sGrad.addColorStop(1, "#7a0a18");
      ctx.beginPath();
      ctx.arc(seX, seY, seR, 0, Math.PI * 2);
      ctx.fillStyle = sGrad;
      ctx.fill();

      // Hearts on seal
      ctx.font = "bold 58px sans-serif";
      ctx.fillStyle = "#ffd166";
      ctx.letterSpacing = "-3px";
      ctx.fillText("♥♥", seX, seY + 20);

      // Ribbon tails
      ctx.fillStyle = "#c41c3a";
      [[-30, -0.26], [30, 0.26]].forEach(([dx, rot]) => {
        ctx.save();
        ctx.translate(seX + dx, seY + seR - 4);
        ctx.rotate(rot);
        ctx.fillRect(-17, 0, 34, 82);
        ctx.restore();
      });

      // ── 11. Bottom-left envelope note ────────────────────────────────────
      ctx.save();
      ctx.translate(245, 1368);
      ctx.rotate((-15 * Math.PI) / 180);
      ctx.textAlign = "center";
      ctx.font = "normal 42px 'Alex Brush', 'Great Vibes', cursive";
      ctx.fillStyle = "#2a1c15";
      ctx.letterSpacing = "0px";
      ctx.fillText("Forever Looks", 0, 0);
      ctx.fillText("Better", 0, 46);
      ctx.fillText("With You", 0, 92);
      ctx.font = "30px sans-serif";
      ctx.fillStyle = "#aa1024";
      ctx.fillText("♡", 0, 130);
      ctx.restore();

      // Download
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `Certificate_Eternal_Love_${leftName.replace(/\s+/g, "_")}_${rightName.replace(/\s+/g, "_")}.png`;
      a.click();
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
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ backgroundImage: `url(${certBg})` }}
      >
        <div className="cert-100-content">

          {/* ── HEADER ── */}
          <div className="cert-100-header">
            <div className="cert-100-kicker">— THE OFFICIAL —</div>

            <h2 className="cert-100-sub-title">CERTIFICATE OF</h2>

            <h1 className="cert-100-title">
              ETERNAL&nbsp;LO<span className="cert-title-heart">♥</span>VE
            </h1>

            <div className="cert-100-heart-accent">♥</div>

            <div className="cert-100-divider">
              <span className="cert-line" />
              <span className="cert-div-text">THIS CERTIFIES THAT</span>
              <span className="cert-line" />
            </div>
          </div>

          {/* ── NAMES ── */}
          <div className="cert-100-names-row">
            <span className="cert-100-script-name">{leftName}</span>
            <span className="cert-100-heart-sep">♥</span>
            <span className="cert-100-script-name">{rightName}</span>
          </div>

          {/* ── BODY ── */}
          <div className="cert-100-body">

            <p className="cert-100-p">
              are hereby declared to be forever bound{" "}
              <em className="cert-highlight">in love</em>,
              <br />
              in heart, in soul and in every lifetime.
            </p>

            <div className="cert-100-mid-rule" />

            <p className="cert-100-p cert-100-p-red">
              This bond is certified as timeless, unconditional, and everlasting,
            </p>
            <p className="cert-100-p">
              sealed with trust, respect, care and a love that grows stronger
              <br />
              with every heartbeat.
            </p>

            {/* Together Forever */}
            <div className="cert-100-tf-row">
              <span className="cert-tf-line-left" />
              <span className="cert-100-tf-heart">♥</span>
              <span className="cert-100-together-forever">Together Forever</span>
              <span className="cert-100-tf-heart">♥</span>
              <span className="cert-tf-line-right" />
            </div>

          </div>

          {/* ── SIGNATURES ── */}
          <div className="cert-100-signatures-row">
            <div className="cert-100-sig-col">
              <span className="cert-100-sig-script">{leftName}</span>
              <div className="cert-100-sig-line" />
              <span className="cert-100-sig-role">PARTNER IN LIFE</span>
            </div>

            {/* Wax seal */}
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

          {/* Envelope note */}
          <div className="cert-100-envelope-text">
            <span>Forever Looks</span>
            <span>Better</span>
            <span>With You</span>
            <span className="env-heart">♡</span>
          </div>

        </div>
      </motion.div>

      {/* ── TOOLBAR ── */}
      <div className="cert-100-toolbar">
        <button
          type="button"
          className="btn glow cert-100-dl-btn"
          onClick={handleDownloadImage}
          disabled={downloading}
        >
          {downloading
            ? "⌛ Generating Certificate…"
            : "📜 Download Certificate (PNG)"}
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
