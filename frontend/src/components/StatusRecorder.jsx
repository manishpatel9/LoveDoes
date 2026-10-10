import { useRef, useState } from "react";
import certBg from "../assets/cert_bg.png";

const isMobileDevice = () =>
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  (navigator.maxTouchPoints > 1 && window.innerWidth < 900);

function loadImage(src) {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function getBestSupportedMimeType() {
  if (typeof MediaRecorder === "undefined") return "video/webm";

  const candidates = [
    "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
    "video/mp4;codecs=avc1",
    "video/mp4",
    "video/webm;codecs=h264",
    "video/webm;codecs=vp8,opus",
    "video/webm;codecs=vp9",
    "video/webm"
  ];

  for (const type of candidates) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }

  return "video/webm";
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(url), 60000);

  return url;
}

export default function StatusRecorder({ page, photos }) {
  const [phase, setPhase] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [blobUrl, setBlobUrl] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("");
  const [fileFormatLabel, setFileFormatLabel] = useState("MP4");
  const [error, setError] = useState("");
  const [finalFile, setFinalFile] = useState(null);
  const canvasRef = useRef(null);

  const handleMobileShare = async () => {
    if (finalFile && navigator.canShare && navigator.canShare({ files: [finalFile] })) {
      try {
        await navigator.share({
          files: [finalFile],
          title: "Our Love Status",
          text: "💕 Here is our beautiful love status!"
        });
      } catch (err) {
        console.log("User cancelled share or share failed", err);
      }
      return;
    }

    const link = document.createElement("a");
    link.href = blobUrl || "";
    link.download = downloadFileName || "Love_Status_30s.mp4";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  async function recordDesktop() {
    setError("");

    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      await recordMobile();
      return;
    }

    try {
      setPhase("loading");

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "browser" },
        audio: true,
        preferCurrentTab: true
      });

      const selectedMime = getBestSupportedMimeType();
      const isMp4 = selectedMime.includes("mp4");
      const cleanBlobType = isMp4 ? "video/mp4" : "video/webm";
      const ext = isMp4 ? "mp4" : "webm";

      const rawCreator = page?.creatorName || "Kumar";
      const rawPartner = page?.partnerName || "Bhumi";
      const cleanCreator = rawCreator.replace(/[^a-zA-Z0-9]/g, "_");
      const cleanPartner = rawPartner.replace(/[^a-zA-Z0-9]/g, "_");
      const fileName = `Love_Sanctuary_Desktop_30s_${cleanCreator}_and_${cleanPartner}.${ext}`;

      setDownloadFileName(fileName);
      setFileFormatLabel(ext.toUpperCase());

      let mixed = stream;

      try {
        if (page?.audioUrl && window.AudioContext) {
          const audioEl = new Audio(page.audioUrl);
          audioEl.crossOrigin = "anonymous";
          audioEl.volume = 0.5;
          await audioEl.play().catch(() => { });
          const audioContext = new AudioContext();
          const dest = audioContext.createMediaStreamDestination();
          const src = audioContext.createMediaElementSource(audioEl);
          src.connect(dest);
          src.connect(audioContext.destination);
          mixed = new MediaStream([...stream.getVideoTracks(), ...dest.stream.getAudioTracks()]);
          setTimeout(() => audioEl.pause(), 30500);
        }
      } catch (err) {
        console.warn("Audio mixing failed:", err);
      }

      const recorder = new MediaRecorder(mixed, { mimeType: selectedMime });
      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: cleanBlobType });
        const file = new File([blob], fileName, { type: cleanBlobType });
        setFinalFile(file);

        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        setPhase("ready");

        try {
          downloadBlob(blob, fileName);
        } catch (e) {
          console.warn("Auto download failed:", e);
        }
      };

      setPhase("recording");
      recorder.start();

      const start = performance.now();
      window.scrollTo({ top: 0, behavior: "smooth" });

      const scrollTick = () => {
        const elapsed = performance.now() - start;
        const t = Math.min(1, Math.max(0, elapsed / 30000));

        setProgress(Math.round(t * 100));

        const maxScroll = Math.max(0, document.body.scrollHeight - window.innerHeight);
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

        window.scrollTo(0, maxScroll * ease);

        if (t < 1) {
          requestAnimationFrame(scrollTick);
        } else {
          recorder.stop();
          stream.getTracks().forEach((track) => track.stop());
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      };

      requestAnimationFrame(scrollTick);
    } catch (err) {
      console.error("Screen recording setup failed.", err);
      await runCanvasFallbackRecording();
    }
  }

  async function recordMobile() {
    setError("");
    setProgress(0);
    setPhase("loading");
    await runCanvasFallbackRecording();
  }

  async function runCanvasFallbackRecording() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const w = 720;
    const h = 1280;
    canvas.width = w;
    canvas.height = h;

    setPhase("loading");

    const creator = await loadImage(photos?.creator);
    const partner = await loadImage(photos?.partner);
    const couple = await loadImage(photos?.couple);
    const certBgImg = await loadImage(certBg);

    const memoryImgs = [];
    if (page?.memories?.length > 0) {
      for (const m of page.memories) {
        if (m.photo) {
          const loaded = await loadImage(m.photo);
          if (loaded) memoryImgs.push({ ...m, loadedImage: loaded });
        }
      }
    }

    const supports = typeof MediaRecorder !== "undefined" && canvas.captureStream;

    const rawCreator = page?.creatorName || "Kumar";
    const rawPartner = page?.partnerName || "Bhumi";
    const cleanCreator = rawCreator.replace(/[^a-zA-Z0-9]/g, "_");
    const cleanPartner = rawPartner.replace(/[^a-zA-Z0-9]/g, "_");

    if (!supports) {
      drawFrame(ctx, w, h, 1, 30, { creator, partner, couple, page, certBgImg, memoryImgs });
      canvas.toBlob((blob) => {
        if (!blob) return;

        const fileName = `Love_Sanctuary_Status_${cleanCreator}_and_${cleanPartner}.png`;
        const file = new File([blob], fileName, { type: "image/png" });
        setFinalFile(file);

        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        setDownloadFileName(fileName);
        setFileFormatLabel("PNG");
        setPhase("image");

        try {
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => document.body.removeChild(a), 300);
        } catch (e) { }
      }, "image/png");
      return;
    }

    const stream = canvas.captureStream(30);
    let mixed = stream;

    try {
      if (page?.audioUrl && window.AudioContext) {
        const audioEl = new Audio(page.audioUrl);
        audioEl.crossOrigin = "anonymous";
        await audioEl.play().catch(() => { });
        const audioContext = new AudioContext();
        const dest = audioContext.createMediaStreamDestination();
        const src = audioContext.createMediaElementSource(audioEl);
        src.connect(dest);
        src.connect(audioContext.destination);
        mixed = new MediaStream([...stream.getVideoTracks(), ...dest.stream.getAudioTracks()]);
        setTimeout(() => audioEl.pause(), 30500);
      }
    } catch {
      mixed = stream;
    }

    const selectedMime = getBestSupportedMimeType();
    const isMp4 = selectedMime.includes("mp4");
    const cleanBlobType = isMp4 ? "video/mp4" : "video/webm";
    const ext = isMp4 ? "mp4" : "webm"; // CRITICAL: NEVER spoof WebM as MP4. Android fails to decode the video track!

    const fileName = `Love_Sanctuary_Status_30s_${cleanCreator}_and_${cleanPartner}.${ext}`;

    setDownloadFileName(fileName);
    setFileFormatLabel("MP4");

    const recorder = new MediaRecorder(mixed, { mimeType: selectedMime });
    const chunks = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size) chunks.push(event.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: cleanBlobType });
      const file = new File([blob], fileName, { type: cleanBlobType });
      setFinalFile(file);

      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
      setPhase("ready");

      try {
        downloadBlob(blob, fileName);
      } catch (e) {
        console.warn("Fallback download failed:", e);
      }
    };

    setPhase("recording");
    recorder.start();

    const start = performance.now();

    const DURATION_SCROLL = 30000;
    const DURATION_RECORD = 30500; // Extra 500ms padding to guarantee 0:30s output in galleries

    const tickId = setInterval(() => {
      const elapsed = Math.max(0, performance.now() - start);
      
      // 't' controls the animation completion (0 to 1) over 30s
      const t = Math.min(1, elapsed / DURATION_SCROLL);
      const timeSec = elapsed / 1000;

      // Update UI percent specifically up to 100%
      setProgress(Math.round(t * 100));
      
      drawFrame(ctx, w, h, t, timeSec, { creator, partner, couple, page, certBgImg, memoryImgs });

      // Stop once we surpass the guaranteed recording padded duration
      if (elapsed >= DURATION_RECORD) {
        clearInterval(tickId);
        recorder.stop();
      }
    }, 1000 / 30); // Force strictly paced 30 FPS pumping
  }

  return (
    <div
      className="status-recorder-wrapper"
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <canvas
        ref={canvasRef}
        className="status-canvas"
        width="720"
        height="1280"
        style={{ position: "absolute", left: "-9999px", top: "-9999px", visibility: "hidden" }}
      />

      {phase === "idle" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
          <button
            className="target-primary-btn glow"
            type="button"
            onClick={recordMobile}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #e61c5d, #9e0c3b)",
              color: "#ffffff",
              fontWeight: 700,
              padding: "14px 20px",
              borderRadius: "30px",
              border: "none",
              cursor: "pointer",
              fontSize: "1.05rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              boxShadow: "0 10px 30px rgba(230, 28, 93, 0.4)",
              transition: "all 0.3s ease"
            }}
          >
            <span className="btn-icon-left">📱</span>
            <span className="btn-text">
              {isMobileDevice() ? "Download Status (30s Video)" : "Mobile Status (9:16 Video)"}
            </span>
            <span className="btn-icon-right">→</span>
          </button>

          {!isMobileDevice() && (
            <button
              className="target-primary-btn glow"
              type="button"
              onClick={recordDesktop}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #6d28d9, #4c1d95)",
                color: "#ffffff",
                fontWeight: 700,
                padding: "14px 20px",
                borderRadius: "30px",
                border: "none",
                cursor: "pointer",
                fontSize: "1.05rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                boxShadow: "0 10px 30px rgba(109, 40, 217, 0.4)",
                transition: "all 0.3s ease"
              }}
            >
              <span className="btn-icon-left">💻</span>
              <span className="btn-text">Desktop Video (Full Screen)</span>
              <span className="btn-icon-right">→</span>
            </button>
          )}
        </div>
      )}

      {(phase === "loading" || phase === "recording") && (
        <div
          style={{
            width: "100%",
            background: "rgba(230, 28, 93, 0.15)",
            border: "1px solid rgba(230, 28, 93, 0.4)",
            borderRadius: "20px",
            padding: "16px",
            textAlign: "center",
            color: "#fff"
          }}
        >
          <div style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "8px" }}>
            {phase === "loading"
              ? "⏳ Preparing your page snapshot..."
              : `🎥 Recording 30s Sanctuary Page Status Video... ${progress}%`}
          </div>

          <div
            style={{
              width: "100%",
              height: "8px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "4px",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "linear-gradient(90deg, #ff4d8d, #ff75a0)",
                transition: "width 0.2s linear"
              }}
            />
          </div>

          <div style={{ fontSize: "0.85rem", opacity: 0.85, marginTop: "8px" }}>
            Downloading full sanctuary status video as{" "}
            <strong style={{ color: "#ffd166" }}>
              {downloadFileName || "Love_Status_30s.mp4"}
            </strong>{" "}
            ❤️
          </div>
        </div>
      )}

      {phase === "ready" && (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px"
          }}
        >
          <div style={{ color: "#4cd964", fontWeight: 600, textAlign: "center" }}>
            ✅ 30-Second Full Sanctuary Page Video Downloaded! ({fileFormatLabel})
          </div>

          <button
            className="target-primary-btn glow"
            onClick={handleMobileShare}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #10b981, #047857)",
              color: "#ffffff",
              fontWeight: 700,
              padding: "14px 20px",
              borderRadius: "30px",
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <span>📱</span> Share / Save to Gallery
          </button>

          <a
            className="secondary-btn"
            href={blobUrl}
            download={downloadFileName}
            style={{
              width: "100%",
              color: "rgba(255,255,255,0.9)",
              fontWeight: 600,
              padding: "10px",
              borderRadius: "30px",
              textDecoration: "none",
              textAlign: "center",
              display: "inline-block",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)"
            }}
          >
            📥 Manual Download ({downloadFileName})
          </a>

          <button
            type="button"
            onClick={() => setPhase("idle")}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.7)",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "0.9rem"
            }}
          >
            Record Again
          </button>
        </div>
      )}

      {phase === "image" && (
        <div
          style={{
            width: "100%",
            textAlign: "center",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "center"
          }}
        >
          <p style={{ color: "#ffd166", fontWeight: 600 }}>✅ Story Card Image Downloaded!</p>

          <button
            className="target-primary-btn glow"
            onClick={handleMobileShare}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #10b981, #047857)",
              color: "#ffffff",
              fontWeight: 700,
              padding: "14px 20px",
              borderRadius: "30px",
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <span>📱</span> Share / Save to Gallery
          </button>

          <a
            className="secondary-btn"
            href={blobUrl}
            download={downloadFileName}
            style={{
              width: "100%",
              color: "rgba(255,255,255,0.9)",
              fontWeight: 600,
              padding: "10px",
              borderRadius: "30px",
              textDecoration: "none",
              textAlign: "center",
              display: "inline-block",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)"
            }}
          >
            📥 Manual Download ({downloadFileName})
          </a>
        </div>
      )}

      {error ? (
        <p className="error" style={{ color: "#ff4d4d", marginTop: "8px" }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function drawCoverImage(ctx, img, x, y, w, h, radius = 0) {
  if (!img) return;

  ctx.save();

  if (radius > 0) {
    roundRect(ctx, x, y, w, h, radius);
    ctx.clip();
  }

  const imgRatio = img.width / img.height;
  const targetRatio = w / h;
  let sWidth, sHeight, sx, sy;

  if (imgRatio > targetRatio) {
    sHeight = img.height;
    sWidth = img.height * targetRatio;
    sx = (img.width - sWidth) / 2;
    sy = 0;
  } else {
    sWidth = img.width;
    sHeight = img.width / targetRatio;
    sx = 0;
    sy = (img.height - sHeight) / 2;
  }

  ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);
  ctx.restore();
}

function drawFrame(ctx, w, h, t, timeSec, { creator, partner, couple, page, certBgImg, memoryImgs }) {
  const creatorName = page?.creatorName || "Rahul";
  const partnerName = page?.partnerName || "Priya";

  const g = ctx.createLinearGradient(0, -timeSec * 2, w, h + timeSec * 2);
  g.addColorStop(0, "#1a0209");
  g.addColorStop(0.25, "#3d0515");
  g.addColorStop(0.65, "#660a22");
  g.addColorStop(1, "#29040e");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  if (couple) {
    ctx.save();
    ctx.globalAlpha = 0.12;
    drawCoverImage(ctx, couple, 0, 0, w, h);
    ctx.restore();
  }

  const orb1Y = 200 + Math.sin(timeSec) * 40;
  const rad1 = ctx.createRadialGradient(w / 2, orb1Y, 10, w / 2, orb1Y, 350);
  rad1.addColorStop(0, "rgba(230, 28, 93, 0.35)");
  rad1.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = rad1;
  ctx.fillRect(0, 0, w, h);

  const bubbles = [
    { text: "I Love You 💕", x: 60, speedY: 450, seed: 1 },
    { text: "Ti amo 💖", x: 620, speedY: 520, seed: 2 },
    { text: "Je t'aime 🌹", x: 90, speedY: 380, seed: 3 },
    { text: "사랑해 🌸", x: 640, speedY: 610, seed: 4 },
    { text: "愛してる ✨", x: 75, speedY: 690, seed: 5 },
    { text: "Together Forever ♡", x: 630, speedY: 340, seed: 6 },
    { text: "Soulmate ❤️", x: 80, speedY: 820, seed: 7 },
    { text: "You & Me 💕", x: 610, speedY: 750, seed: 8 },
    { text: "Forever 💍", x: 100, speedY: 920, seed: 9 }
  ];

  bubbles.forEach((b) => {
    const y = (h + 100 - ((timeSec * b.speedY * 0.5 + b.seed * 140) % (h + 200)));
    const waveX = b.x + Math.sin(timeSec * 0.8 + b.seed) * 20;

    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1;
    roundRect(ctx, waveX - 60, y - 18, 120, 34, 17);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "italic 16px Georgia, serif";
    ctx.fillText(b.text, waveX, y + 5);
    ctx.restore();
  });

  for (let i = 0; i < 35; i++) {
    const cx = (i * 47 + timeSec * 35) % w;
    const cy = (i * 83 + timeSec * 150) % (h + 100);
    const size = 6 + (i % 6);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(timeSec * 1.5 + i);
    ctx.fillStyle = i % 2 === 0 ? "rgba(255, 117, 160, 0.7)" : "rgba(255, 215, 0, 0.6)";
    ctx.fillRect(-size / 2, -size / 2, size, size * 1.4);
    ctx.restore();
  }

  const rainEmojis = ["💖", "💕", "✨", "💌", "🌹", "💖", "💕"];
  for (let j = 0; j < 15; j++) {
    const char = rainEmojis[j % rainEmojis.length];
    const fallSpeed = 35 + (j % 5) * 5;
    const dropY = (j * 110 + timeSec * fallSpeed) % (h + 100);
    const swayX = Math.sin(timeSec * 0.5 + j) * 40;
    const dropX = ((j * 85) % w) + swayX;

    if (dropX > w / 2 - 120 && dropX < w / 2 + 120 && dropY > 50 && dropY < 250) {
      continue;
    }

    ctx.save();
    ctx.font = "26px sans-serif";
    ctx.textAlign = "center";
    ctx.translate(dropX, dropY - 50);
    ctx.rotate(Math.sin(timeSec * 0.8 + j) * 0.2);
    ctx.fillText(char, 0, 0);
    ctx.restore();
  }

  // CALCULATE DYNAMIC SCROLL
  const hasStory = !!page?.storyText;
  const memCount = memoryImgs?.length || 0;
  const totalContentH = 1100 + (hasStory ? 500 : 0) + (memCount * 450);
  const maxScroll = Math.max(0, totalContentH - h + 100);
  
  // Cinematic ease scroll downwards over the 30s
  const easeScroll = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  const currentScrollY = maxScroll * easeScroll;

  ctx.save();
  ctx.translate(0, -currentScrollY);

  ctx.save();
  ctx.fillStyle = "rgba(230, 28, 93, 0.85)";
  ctx.shadowColor = "rgba(230, 28, 93, 0.6)";
  ctx.shadowBlur = 15;
  roundRect(ctx, w / 2 - 110, 45, 220, 36, 18);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "bold 15px 'Cinzel', Georgia, serif";
  ctx.fillText("✨ YOU SAID YES! ✨", w / 2, 68);

  const pulseSize = 36 + Math.sin(timeSec * 3) * 1.5;
  ctx.font = `italic ${pulseSize}px 'Cormorant Garamond', Georgia, serif`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText("You said YES!", w / 2, 115);

  ctx.font = "normal 48px 'Pinyon Script', 'Great Vibes', cursive";
  ctx.fillStyle = "#ffb3c1";
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = 8;
  ctx.fillText(`${creatorName}  ♡  ${partnerName}`, w / 2, 168);

  ctx.shadowColor = "transparent";
  ctx.font = "bold 14px Georgia, serif";
  ctx.fillStyle = "#ffd1d9";
  ctx.fillText("Two Hearts  •  One Story  •  Forever & Always", w / 2, 202);
  ctx.restore();

  if (creator) {
    ctx.save();
    const driftY1 = Math.sin(timeSec * 1.4) * 8;
    ctx.translate(w / 2 - 130, 340 + driftY1);
    ctx.rotate(-0.08);

    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 16;
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, -100, -120, 200, 240, 12);
    ctx.fill();
    ctx.shadowColor = "transparent";

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.fillRect(-35, -132, 70, 24);

    drawCoverImage(ctx, creator, -88, -108, 176, 180, 0);

    ctx.fillStyle = "#e61c5d";
    roundRect(ctx, -60, 80, 120, 28, 14);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText(creatorName, 0, 99);
    ctx.restore();
  }

  if (partner) {
    ctx.save();
    const driftY2 = Math.cos(timeSec * 1.6 + 1) * 8;
    ctx.translate(w / 2 + 130, 340 + driftY2);
    ctx.rotate(0.08);

    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 16;
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, -100, -120, 200, 240, 12);
    ctx.fill();
    ctx.shadowColor = "transparent";

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.fillRect(-35, -132, 70, 24);

    drawCoverImage(ctx, partner, -88, -108, 176, 180, 0);

    ctx.fillStyle = "#e61c5d";
    roundRect(ctx, -60, 80, 120, 28, 14);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText(partnerName, 0, 99);
    ctx.restore();
  }

  ctx.save();
  const crownScale = 1 + Math.sin(timeSec * 2) * 0.08;
  ctx.translate(w / 2, 330);
  ctx.scale(crownScale, crownScale);
  ctx.fillStyle = "#ffb800";
  ctx.font = "28px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("👑", 0, 0);
  ctx.fillStyle = "#e61c5d";
  ctx.font = "20px sans-serif";
  ctx.fillText("❤️", 0, 30);
  ctx.restore();

  const certW = 600;
  const certH = 500;
  const certX = (w - certW) / 2;
  const certDriftY = Math.sin(timeSec * 1.1 + 0.5) * 6;
  const certY = 530 + certDriftY;

  ctx.save();
  ctx.shadowColor = "rgba(230, 28, 93, 0.5)";
  ctx.shadowBlur = 24;

  if (certBgImg) {
    roundRect(ctx, certX, certY, certW, certH, 20);
    ctx.clip();
    ctx.drawImage(certBgImg, certX, certY, certW, certH);
  } else {
    const bgG = ctx.createLinearGradient(certX, certY, certX + certW, certY + certH);
    bgG.addColorStop(0, "#fffcf2");
    bgG.addColorStop(1, "#f4ecc2");
    ctx.fillStyle = bgG;
    roundRect(ctx, certX, certY, certW, certH, 20);
    ctx.fill();
  }

  ctx.shadowColor = "transparent";
  ctx.textAlign = "center";

  ctx.fillStyle = "#70101f";
  ctx.font = "bold 14px 'Cinzel', Georgia, serif";
  ctx.fillText("— THE OFFICIAL —", w / 2, certY + 55);

  ctx.fillStyle = "#4a0913";
  ctx.font = "bold 26px 'Cinzel', Georgia, serif";
  ctx.fillText("CERTIFICATE OF", w / 2, certY + 95);

  ctx.font = "900 38px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "#4a0913";
  ctx.fillText("ETERNAL L❤️VE", w / 2, certY + 140);

  ctx.fillStyle = "#70101f";
  ctx.font = "700 13px 'Cinzel', Georgia, serif";
  ctx.fillText("— THIS CERTIFIES THAT —", w / 2, certY + 175);

  ctx.font = "normal 52px 'Pinyon Script', 'Great Vibes', cursive";
  ctx.fillStyle = "#660714";
  ctx.fillText(`${creatorName}   ❤️   ${partnerName}`, w / 2, certY + 240);

  ctx.font = "italic 16px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "#1a1012";
  ctx.fillText("are hereby declared to be forever bound in love,", w / 2, certY + 280);
  ctx.fillText("in heart, in soul and in every lifetime.", w / 2, certY + 305);

  ctx.font = "italic 18px 'Pinyon Script', cursive";
  ctx.fillStyle = "#8a0c1e";
  ctx.fillText("This bond is certified as timeless, unconditional, and everlasting,", w / 2, certY + 345);

  ctx.font = "italic 15px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "#1a1012";
  ctx.fillText("sealed with trust, respect, care and a love that grows stronger.", w / 2, certY + 375);

  ctx.font = "normal 32px 'Pinyon Script', cursive";
  ctx.fillStyle = "#5c0d18";
  ctx.fillText("Together Forever", w / 2, certY + 425);

  ctx.font = "32px sans-serif";
  ctx.fillText("❤️", w / 2, certY + 465);

  ctx.restore();

  ctx.font = "italic 18px Georgia, serif";
  ctx.fillStyle = "#ffb3c1";
  ctx.textAlign = "center";
  ctx.fillText("💕 A digital love story, created just for the two of you. 💕", w / 2, 1070);

  let currentY = 1140;

  // Render Love Letter 
  if (page?.storyText) {
    ctx.shadowColor = "rgba(230, 28, 93, 0.4)";
    ctx.shadowBlur = 15;
    ctx.fillStyle = "rgba(25, 2, 8, 0.7)";
    roundRect(ctx, 40, currentY, w - 80, 400, 20);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#ffd1d9";
    ctx.font = "bold 24px 'Cinzel', serif";
    ctx.fillText("💌 Our Love Letter 💌", w/2, currentY + 50);

    ctx.fillStyle = "#fffcf2";
    ctx.font = "18px 'Cormorant Garamond', serif";
    wrapText(ctx, page.storyText, w/2, currentY + 110, w - 120, 28);
    currentY += 460;
  }

  // Render Memories Timeline
  if (memoryImgs?.length > 0) {
    ctx.fillStyle = "#ffb3c1";
    ctx.font = "bold 28px 'Cinzel', serif";
    ctx.fillText("✨ Our Beautiful Memories ✨", w/2, currentY + 30);
    currentY += 80;

    memoryImgs.forEach((mem, idx) => {
      ctx.save();
      const tilt = (idx % 2 === 0) ? -0.05 : 0.05;
      const swayY = Math.sin(timeSec * 1.5 + idx) * 10;
      ctx.translate(w/2, currentY + 180 + swayY);
      ctx.rotate(tilt);

      // Frame
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 20;
      ctx.fillStyle = "#ffffff";
      roundRect(ctx, -160, -180, 320, 380, 16);
      ctx.fill();
      ctx.shadowColor = "transparent";

      // Photo
      drawCoverImage(ctx, mem.loadedImage, -145, -165, 290, 270, 8);

      // Title & Date
      ctx.fillStyle = "#1a0209";
      ctx.font = "bold 20px Georgia, serif";
      ctx.fillText(mem.title || "Our Memory", 0, 140);
      
      ctx.fillStyle = "#e61c5d";
      ctx.font = "14px sans-serif";
      ctx.fillText(mem.date || "", 0, 168);

      ctx.restore();
      currentY += 420;
    });
  }

  ctx.restore(); // Restore the Y scrolling translation

  // Fixed Progress bar ALWAYS at bottom of screen
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.fillRect(50, 1220, (w - 100) * t, 6);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(ctx, text, x, y, max, line) {
  const words = text.split(" ");
  let row = "";
  let yy = y;

  words.forEach((word) => {
    const test = `${row}${word} `;
    if (ctx.measureText(test).width > max) {
      ctx.fillText(row, x, yy);
      row = `${word} `;
      yy += line;
    } else {
      row = test;
    }
  });

  ctx.fillText(row, x, yy);
}