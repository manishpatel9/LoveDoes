import { useRef, useState } from "react";
import certBg from "../assets/cert_bg.png";
import sunsetBg from "../assets/romantic_sunset_deck_bg.png";

const isMobileDevice = () =>
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  (navigator.maxTouchPoints > 1 && window.innerWidth < 900);

function loadImage(src) {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }

    let resolved = false;
    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(null);
      }
    }, 4000);

    const done = (img) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        resolve(img);
      }
    };

    let fullSrc = src;
    if (typeof src === "string" && src.startsWith("/")) {
      fullSrc = `${window.location.origin}${src}`;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => done(img);

    img.onerror = () => {
      if (src.startsWith("data:") || src.startsWith("blob:")) {
        done(null);
        return;
      }

      const retryImg = new Image();
      retryImg.onload = () => done(retryImg);
      retryImg.onerror = () => {
        if (src.startsWith("http")) {
          const proxyImg = new Image();
          proxyImg.crossOrigin = "anonymous";
          proxyImg.onload = () => done(proxyImg);
          proxyImg.onerror = () => done(null);
          proxyImg.src = `https://corsproxy.io/?${encodeURIComponent(src)}`;
        } else {
          done(null);
        }
      };
      retryImg.src = fullSrc;
    };

    img.src = fullSrc;
  });
}

// Romantic Synthesizer Score Engine (Pure Web Audio API, Zero External Dependencies)
function startRomanticMusicSynth(audioContext, dest) {
  const masterGain = audioContext.createGain();
  masterGain.gain.setValueAtTime(0.28, audioContext.currentTime);
  masterGain.connect(dest);

  // Monitor gain so user hears music live during recording
  const monitorGain = audioContext.createGain();
  monitorGain.gain.setValueAtTime(0.18, audioContext.currentTime);
  masterGain.connect(monitorGain);
  try {
    monitorGain.connect(audioContext.destination);
  } catch {}

  const activeNodes = [];
  let isStopped = false;

  // 4-chord romantic progression: Cmaj7 -> Am7 -> Fmaj7 -> Gsus4
  const CHORDS = [
    { bass: 130.81, pads: [261.63, 329.63, 392.00, 493.88] },
    { bass: 110.00, pads: [220.00, 261.63, 329.63, 392.00] },
    { bass: 87.31,  pads: [174.61, 261.63, 329.63, 440.00] },
    { bass: 98.00,  pads: [196.00, 293.66, 392.00, 523.25] },
  ];

  // Sweet Arpeggio Melody notes (Harp / Acoustic music box)
  const MELODY_SEQUENCE = [
    523.25, 659.25, 783.99, 987.77, 1046.50, 783.99, 659.25, 523.25,
    440.00, 523.25, 659.25, 783.99, 880.00,  659.25, 523.25, 440.00,
    349.23, 440.00, 523.25, 659.25, 698.46,  523.25, 440.00, 349.23,
    392.00, 493.88, 587.33, 783.99, 880.00,  587.33, 493.88, 392.00
  ];

  const startTime = audioContext.currentTime + 0.05;
  const chordDuration = 3.8;
  const totalChords = 9;

  for (let c = 0; c < totalChords; c++) {
    const chord = CHORDS[c % CHORDS.length];
    const cTime = startTime + c * chordDuration;

    // Bass note
    const bassOsc = audioContext.createOscillator();
    const bassGain = audioContext.createGain();
    bassOsc.type = "sine";
    bassOsc.frequency.setValueAtTime(chord.bass, cTime);
    bassGain.gain.setValueAtTime(0.001, cTime);
    bassGain.gain.linearRampToValueAtTime(0.2, cTime + 0.4);
    bassGain.gain.exponentialRampToValueAtTime(0.001, cTime + chordDuration);
    bassOsc.connect(bassGain);
    bassGain.connect(masterGain);
    bassOsc.start(cTime);
    bassOsc.stop(cTime + chordDuration);
    activeNodes.push(bassOsc);

    // Warm pad chords
    chord.pads.forEach((padFreq, pIdx) => {
      const padOsc = audioContext.createOscillator();
      const padGain = audioContext.createGain();
      padOsc.type = "triangle";
      padOsc.frequency.setValueAtTime(padFreq, cTime);
      padGain.gain.setValueAtTime(0.001, cTime);
      padGain.gain.linearRampToValueAtTime(0.05 / (pIdx + 1), cTime + 0.6);
      padGain.gain.exponentialRampToValueAtTime(0.001, cTime + chordDuration);
      padOsc.connect(padGain);
      padGain.connect(masterGain);
      padOsc.start(cTime);
      padOsc.stop(cTime + chordDuration);
      activeNodes.push(padOsc);
    });
  }

  // Twinkling arpeggios
  const noteDuration = 0.45;
  const totalNotes = Math.floor(33 / noteDuration);

  for (let n = 0; n < totalNotes; n++) {
    const freq = MELODY_SEQUENCE[n % MELODY_SEQUENCE.length];
    const nTime = startTime + n * noteDuration;

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, nTime);

    gain.gain.setValueAtTime(0.001, nTime);
    gain.gain.linearRampToValueAtTime(0.11, nTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, nTime + 0.7);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(nTime);
    osc.stop(nTime + 0.7);
    activeNodes.push(osc);
  }

  return () => {
    if (isStopped) return;
    isStopped = true;
    try {
      masterGain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.3);
    } catch {}
    setTimeout(() => {
      activeNodes.forEach((node) => {
        try { node.stop(); node.disconnect(); } catch {}
      });
      try { masterGain.disconnect(); } catch {}
    }, 350);
  };
}

async function setupRecordingAudioStream(page, videoStream) {
  const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtxClass) {
    return { stream: videoStream, cleanup: () => {} };
  }

  let audioContext;
  try {
    audioContext = new AudioCtxClass();
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }
  } catch (e) {
    console.warn("AudioContext init error:", e);
    return { stream: videoStream, cleanup: () => {} };
  }

  const dest = audioContext.createMediaStreamDestination();
  const cleanupFns = [];

  const rawAudioSrc = page?.audioUrl || page?.audio_url || page?.music?.fileUrl || page?.music?.url;
  let customAudioPlaying = false;

  if (rawAudioSrc) {
    try {
      let fullUrl = rawAudioSrc;
      if (typeof rawAudioSrc === "string" && rawAudioSrc.startsWith("/")) {
        fullUrl = `${window.location.origin}${rawAudioSrc}`;
      }
      const audioEl = new Audio();
      audioEl.crossOrigin = "anonymous";
      audioEl.src = fullUrl;
      audioEl.loop = true;
      audioEl.volume = 0.8;

      await audioEl.play();
      customAudioPlaying = true;

      const srcNode = audioContext.createMediaElementSource(audioEl);
      srcNode.connect(dest);

      const monitorGain = audioContext.createGain();
      monitorGain.gain.value = 0.3;
      srcNode.connect(monitorGain);
      try {
        monitorGain.connect(audioContext.destination);
      } catch {}

      cleanupFns.push(() => {
        try {
          audioEl.pause();
          audioEl.src = "";
        } catch {}
      });
    } catch (err) {
      console.warn("Custom audio playback failed, falling back to romantic synth score:", err);
      customAudioPlaying = false;
    }
  }

  // If no custom audio or playback failed: generate guaranteed romantic music synth score!
  if (!customAudioPlaying) {
    try {
      const synthCleanup = startRomanticMusicSynth(audioContext, dest);
      cleanupFns.push(synthCleanup);
    } catch (err) {
      console.warn("Synth score error:", err);
    }
  }

  const audioTracks = dest.stream.getAudioTracks();
  if (audioTracks && audioTracks.length > 0) {
    const mixedStream = new MediaStream([
      ...videoStream.getVideoTracks(),
      ...audioTracks
    ]);
    return {
      stream: mixedStream,
      cleanup: () => {
        cleanupFns.forEach((fn) => fn());
        setTimeout(() => {
          try {
            audioContext.close();
          } catch {}
        }, 300);
      }
    };
  }

  return { stream: videoStream, cleanup: () => {} };
}

function getBestSupportedMimeType() {
  if (typeof MediaRecorder === "undefined") {
    return { mimeType: "video/webm", ext: "webm", label: "WEBM" };
  }

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  // On iOS, MP4 is standard. On Android and Chromium browsers, WebM with VP8/Opus is rock-solid
  // and natively handles Canvas + Web Audio without dropping video tracks.
  const candidates = isIOS
    ? [
        { mimeType: "video/mp4;codecs=avc1.42E01E,mp4a.40.2", ext: "mp4", label: "MP4" },
        { mimeType: "video/mp4;codecs=avc1", ext: "mp4", label: "MP4" },
        { mimeType: "video/mp4", ext: "mp4", label: "MP4" },
        { mimeType: "video/webm;codecs=vp8,opus", ext: "webm", label: "WEBM" },
        { mimeType: "video/webm", ext: "webm", label: "WEBM" }
      ]
    : [
        { mimeType: "video/webm;codecs=vp8,opus", ext: "webm", label: "WEBM" },
        { mimeType: "video/webm;codecs=vp8", ext: "webm", label: "WEBM" },
        { mimeType: "video/webm;codecs=h264,opus", ext: "webm", label: "WEBM" },
        { mimeType: "video/webm", ext: "webm", label: "WEBM" },
        { mimeType: "video/mp4;codecs=avc1,mp4a.40.2", ext: "mp4", label: "MP4" },
        { mimeType: "video/mp4", ext: "mp4", label: "MP4" }
      ];

  for (const item of candidates) {
    if (MediaRecorder.isTypeSupported(item.mimeType)) {
      return item;
    }
  }

  return { mimeType: "video/webm", ext: "webm", label: "WEBM" };
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

      const mimeInfo = getBestSupportedMimeType();
      const selectedMime = mimeInfo.mimeType;
      const ext = mimeInfo.ext;
      const isMp4 = ext === "mp4";
      const cleanBlobType = isMp4 ? "video/mp4" : "video/webm";

      const rawCreator = page?.creatorName || "Kumar";
      const rawPartner = page?.partnerName || "Bhumi";
      const cleanCreator = rawCreator.replace(/[^a-zA-Z0-9]/g, "_");
      const cleanPartner = rawPartner.replace(/[^a-zA-Z0-9]/g, "_");
      const fileName = `Love_Sanctuary_Desktop_30s_${cleanCreator}_and_${cleanPartner}.${ext}`;

      setDownloadFileName(fileName);
      setFileFormatLabel(mimeInfo.label);

      let mixed = stream;
      let cleanupDesktopAudio = () => {};
      try {
        const audioSetup = await setupRecordingAudioStream(page, stream);
        mixed = audioSetup.stream;
        cleanupDesktopAudio = audioSetup.cleanup;
      } catch (err) {
        console.warn("Desktop audio setup failed:", err);
      }

      const recorder = new MediaRecorder(mixed, { mimeType: selectedMime });
      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data);
      };

      recorder.onstop = () => {
        try {
          cleanupDesktopAudio();
        } catch { }
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

  async function downloadStoryCardImage() {
    setError("");
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const w = 720;
    const h = 1280;
    canvas.width = w;
    canvas.height = h;

    setPhase("loading");

    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch { }
    }

    const sunsetBgImg = await loadImage(photos?.bg || page?.theme?.bgUrl || page?.theme?.bg_url || "/image.png" || sunsetBg);
    const creator = await loadImage(photos?.creator || page?.photos?.find((p) => p.type === "creator" || p.category === "creator")?.file_url || "/creator_avatar.png");
    const partner = await loadImage(photos?.partner || page?.photos?.find((p) => p.type === "partner" || p.category === "partner")?.file_url || "/partner_avatar.png");
    const couple = await loadImage(photos?.couple || page?.photos?.find((p) => p.type === "couple" || p.category === "couple")?.file_url || "/romantic_sunset_deck_bg.png");
    const certBgImg = await loadImage(certBg);

    const memoryImgs = [];
    if (page?.memories?.length > 0) {
      for (const m of page.memories) {
        if (m.photo || m.photo_url) {
          const loaded = await loadImage(m.photo || m.photo_url);
          if (loaded) memoryImgs.push({ ...m, loadedImage: loaded });
        }
      }
    }

    const rawCreator = page?.creatorName || "Kumar";
    const rawPartner = page?.partnerName || "Bhumi";
    const cleanCreator = rawCreator.replace(/[^a-zA-Z0-9]/g, "_");
    const cleanPartner = rawPartner.replace(/[^a-zA-Z0-9]/g, "_");

    drawFrame(ctx, w, h, 0.5, 14, { creator, partner, couple, sunsetBgImg, page, certBgImg, memoryImgs });

    canvas.toBlob((blob) => {
      if (!blob) return;
      const fileName = `Love_Sanctuary_Card_${cleanCreator}_and_${cleanPartner}.png`;
      const file = new File([blob], fileName, { type: "image/png" });
      setFinalFile(file);
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
      setDownloadFileName(fileName);
      setFileFormatLabel("PNG");
      setPhase("image");
      try {
        downloadBlob(blob, fileName);
      } catch (e) { }
    }, "image/png");
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

    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch { }
    }

    const sunsetBgImg = await loadImage(photos?.bg || page?.theme?.bgUrl || page?.theme?.bg_url || "/image.png" || sunsetBg);
    const creator = await loadImage(photos?.creator || page?.photos?.find((p) => p.type === "creator" || p.category === "creator")?.file_url || "/creator_avatar.png");
    const partner = await loadImage(photos?.partner || page?.photos?.find((p) => p.type === "partner" || p.category === "partner")?.file_url || "/partner_avatar.png");
    const couple = await loadImage(photos?.couple || page?.photos?.find((p) => p.type === "couple" || p.category === "couple")?.file_url || "/romantic_sunset_deck_bg.png");
    const certBgImg = await loadImage(certBg);

    const memoryImgs = [];
    if (page?.memories?.length > 0) {
      for (const m of page.memories) {
        if (m.photo || m.photo_url) {
          const loaded = await loadImage(m.photo || m.photo_url);
          if (loaded) memoryImgs.push({ ...m, loadedImage: loaded });
        }
      }
    }

    const supports = typeof MediaRecorder !== "undefined" && canvas.captureStream;

    const rawCreator = page?.creatorName || "Kumar";
    const rawPartner = page?.partnerName || "Bhumi";
    const cleanCreator = rawCreator.replace(/[^a-zA-Z0-9]/g, "_");
    const cleanPartner = rawPartner.replace(/[^a-zA-Z0-9]/g, "_");

    // Prime the canvas surface with frame 0 BEFORE captureStream
    drawFrame(ctx, w, h, 0, 0, { creator, partner, couple, sunsetBgImg, page, certBgImg, memoryImgs });

    if (!supports) {
      drawFrame(ctx, w, h, 1, 30, { creator, partner, couple, sunsetBgImg, page, certBgImg, memoryImgs });
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
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack && typeof videoTrack.requestFrame === "function") {
      try {
        videoTrack.requestFrame();
      } catch { }
    }

    // Set up guaranteed romantic audio stream (custom audio + synth fallback)
    const { stream: mixed, cleanup: cleanupAudio } = await setupRecordingAudioStream(page, stream);

    const mimeInfo = getBestSupportedMimeType();
    const selectedMime = mimeInfo.mimeType;
    const ext = mimeInfo.ext;
    const isMp4 = ext === "mp4";
    const cleanBlobType = isMp4 ? "video/mp4" : "video/webm";

    const fileName = `Love_Sanctuary_Status_30s_${cleanCreator}_and_${cleanPartner}.${ext}`;

    setDownloadFileName(fileName);
    setFileFormatLabel(mimeInfo.label);

    let recorder;
    try {
      recorder = new MediaRecorder(mixed, {
        mimeType: selectedMime,
        videoBitsPerSecond: 2500000,
        audioBitsPerSecond: 128000
      });
    } catch (e) {
      try {
        recorder = new MediaRecorder(mixed, { mimeType: selectedMime });
      } catch (e2) {
        recorder = new MediaRecorder(mixed);
      }
    }
    const chunks = [];

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) chunks.push(event.data);
    };

    recorder.onstop = () => {
      try {
        cleanupAudio();
      } catch { }
      try {
        stream.getTracks().forEach((track) => track.stop());
      } catch { }
      try {
        mixed.getTracks().forEach((track) => track.stop());
      } catch { }

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
    recorder.start(1000);

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
      
      drawFrame(ctx, w, h, t, timeSec, { creator, partner, couple, sunsetBgImg, page, certBgImg, memoryImgs });

      if (videoTrack && typeof videoTrack.requestFrame === "function") {
        try {
          videoTrack.requestFrame();
        } catch { }
      }

      // Stop once we surpass the guaranteed recording padded duration
      if (elapsed >= DURATION_RECORD) {
        clearInterval(tickId);
        try {
          cleanupAudio();
        } catch { }
        if (recorder.state !== "inactive") {
          recorder.stop();
        }
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
      {/* Live Preview Container during Recording / Hidden but active otherwise */}
      <div
        className="status-canvas-viewport"
        style={
          phase === "recording" || phase === "loading"
            ? {
                width: "220px",
                height: "390px",
                margin: "14px auto",
                borderRadius: "18px",
                overflow: "hidden",
                border: "2px solid rgba(255, 79, 129, 0.7)",
                boxShadow: "0 0 25px rgba(255, 79, 129, 0.4), inset 0 0 20px rgba(0,0,0,0.6)",
                position: "relative",
                background: "#0d0208"
              }
            : {
                position: "fixed",
                bottom: "-9999px",
                left: 0,
                width: "220px",
                height: "390px",
                pointerEvents: "none",
                opacity: 0.01,
                zIndex: -9999
              }
        }
      >
        <canvas
          ref={canvasRef}
          className="status-canvas"
          width="720"
          height="1280"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block"
          }}
        />

        {(phase === "recording" || phase === "loading") && (
          <div
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              background: "rgba(18, 2, 10, 0.8)",
              border: "1px solid rgba(255, 79, 129, 0.5)",
              padding: "4px 10px",
              borderRadius: "12px",
              fontSize: "0.72rem",
              color: "#ffd166",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backdropFilter: "blur(6px)"
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#ff2a75",
                boxShadow: "0 0 8px #ff2a75"
              }}
            />
            {phase === "loading" ? "INITIALIZING" : "RECORDING LIVE"}
          </div>
        )}
      </div>

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

          <button
            type="button"
            onClick={downloadStoryCardImage}
            style={{
              width: "100%",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 209, 102, 0.4)",
              color: "#ffd166",
              fontWeight: 600,
              padding: "11px 18px",
              borderRadius: "30px",
              cursor: "pointer",
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.3s ease"
            }}
          >
            <span>📸</span> Download Story Card (HD Photo)
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
            gap: "12px"
          }}
        >
          <div style={{ color: "#4cd964", fontWeight: 700, textAlign: "center", fontSize: "1.05rem" }}>
            ✅ 30-Second Sanctuary Video Ready! ({fileFormatLabel})
          </div>

          {blobUrl && (
            <div
              style={{
                width: "220px",
                height: "390px",
                borderRadius: "18px",
                overflow: "hidden",
                border: "2px solid rgba(76, 217, 100, 0.6)",
                boxShadow: "0 0 25px rgba(76, 217, 100, 0.35)",
                margin: "4px auto 8px",
                background: "#000"
              }}
            >
              <video
                src={blobUrl}
                controls
                autoPlay
                loop
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block"
                }}
              />
            </div>
          )}

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
            onClick={downloadStoryCardImage}
            style={{
              width: "100%",
              background: "rgba(255, 209, 102, 0.1)",
              border: "1px solid rgba(255, 209, 102, 0.35)",
              color: "#ffd166",
              fontWeight: 600,
              padding: "10px",
              borderRadius: "30px",
              cursor: "pointer",
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <span>📸</span> Download HD Story Card (Image)
          </button>

          <button
            type="button"
            onClick={() => setPhase("idle")}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.7)",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "0.9rem",
              marginTop: "4px"
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

function drawAvatarFallback(ctx, x, y, w, h, name = "Love", radius = 0) {
  ctx.save();
  if (radius > 0) {
    roundRect(ctx, x, y, w, h, radius);
    ctx.clip();
  }
  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  grad.addColorStop(0, "#ff437b");
  grad.addColorStop(0.5, "#d91b5c");
  grad.addColorStop(1, "#8a0c3b");
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);

  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.textAlign = "center";
  ctx.font = `bold ${Math.round(h * 0.38)}px 'Playfair Display', Georgia, serif`;
  ctx.fillText(name.trim().charAt(0).toUpperCase() || "♥", x + w / 2, y + h * 0.52);

  ctx.font = `italic ${Math.round(h * 0.14)}px 'Great Vibes', cursive`;
  ctx.fillText("Together Forever", x + w / 2, y + h * 0.76);
  ctx.restore();
}

// Background Ambient Rain (soft subtle streaks)
function drawLoveRainBackground(ctx, w, h, timeSec) {
  ctx.save();
  // 18 subtle slanted rain streaks
  ctx.strokeStyle = "rgba(255, 220, 235, 0.18)";
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 18; i++) {
    const rx = (i * 41 + timeSec * 45) % (w + 40) - 20;
    const ry = (i * 89 + timeSec * 380) % (h + 80) - 40;
    const rLen = 20 + (i % 3) * 6;
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx + 5, ry + rLen);
    ctx.stroke();
  }
  ctx.restore();
}

// Foreground Love Rain & Words (Gentle, elegant, 12 emojis & only 2 words at a time for smooth 60fps)
function drawLoveRainForeground(ctx, w, h, timeSec) {
  ctx.save();

  // 1. Subtle, lightweight rain streaks (16 streaks)
  ctx.strokeStyle = "rgba(255, 235, 248, 0.16)";
  ctx.lineWidth = 1.1;
  for (let k = 0; k < 16; k++) {
    const rx = (k * 47 + timeSec * 50) % (w + 40) - 20;
    const ry = (k * 83 + timeSec * 420) % (h + 80) - 40;
    const rLen = 18 + (k % 3) * 6;
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx + 5, ry + rLen);
    ctx.stroke();
  }

  // 2. Exactly 12 Elegant Falling Emojis (spaced gently away from center polaroids)
  const EMOJIS = ["💖", "💕", "✨", "🌹", "💌", "❤️", "💞", "🌸", "🫶", "✨", "💖", "💕"];
  for (let i = 0; i < EMOJIS.length; i++) {
    const emoji = EMOJIS[i];
    const speed = 72 + (i % 4) * 16;
    const cycleH = h + 120;
    const y = (i * (cycleH / EMOJIS.length) + timeSec * speed) % cycleH - 60;

    // Distribute towards outer left and right sides so polaroid photos & faces stay clear
    const isLeft = i % 2 === 0;
    const baseOffset = isLeft ? 55 + (i * 29) % 150 : w - 205 + (i * 29) % 150;
    const sway = Math.sin(timeSec * 1.4 + i * 0.9) * 18;
    const x = baseOffset + sway;

    const size = 22 + (i % 3) * 4;
    const rot = Math.sin(timeSec * 1.2 + i) * 0.2;

    ctx.save();
    ctx.font = `${size}px sans-serif`;
    ctx.textAlign = "center";
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.fillText(emoji, 0, 0);
    ctx.restore();
  }

  // 3. Exactly 2 Words on Screen at a Time (Smooth cycling, positioned on outer flanks)
  const WORDS_POOL = [
    "❤️ I Love You",
    "Forever & Always ♾️",
    "My Soulmate 💕",
    "Together Forever 🫶",
    "Two Hearts, One Soul 💞",
    "In Every Lifetime ♾️",
    "My Everything 💖",
    "Only You ❤️",
    "✨ Pure Love ✨",
    "Eternal Love ♾️"
  ];

  const WORD_SLOTS = 2;
  const wordCycleH = h + 240;
  const wordSpeed = 50;

  for (let s = 0; s < WORD_SLOTS; s++) {
    const totalDistance = timeSec * wordSpeed + s * (wordCycleH / WORD_SLOTS);
    const y = (totalDistance % wordCycleH) - 100;

    const cycleCount = Math.floor(totalDistance / wordCycleH);
    const phraseIdx = (s + cycleCount * WORD_SLOTS) % WORDS_POOL.length;
    const phrase = WORDS_POOL[phraseIdx];

    // Slot 0 on left flank (~115px), Slot 1 on right flank (~w - 115px) - NEVER blocking photos
    const sway = Math.sin(timeSec * 0.9 + s * 1.5) * 14;
    const x = s === 0 ? 115 + sway : (w - 115) + sway;
    const tilt = Math.sin(timeSec * 0.8 + s) * 0.05;

    ctx.save();
    ctx.font = "italic 600 13px 'Playfair Display', Georgia, serif";
    ctx.textAlign = "center";
    const txtW = ctx.measureText(phrase).width;

    ctx.translate(x, y);
    ctx.rotate(tilt);

    // Clean, lightweight translucent glass pill
    ctx.fillStyle = "rgba(25, 4, 15, 0.72)";
    ctx.strokeStyle = "rgba(255, 120, 175, 0.55)";
    ctx.lineWidth = 1;
    roundRect(ctx, -txtW / 2 - 10, -14, txtW + 20, 24, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffd3df";
    ctx.fillText(phrase, 0, 2);
    ctx.restore();
  }

  ctx.restore();
}

function drawFrame(ctx, w, h, t, timeSec, { creator, partner, couple, sunsetBgImg, page, certBgImg, memoryImgs }) {
  const creatorName = page?.creatorName || "Kumar";
  const partnerName = page?.partnerName || "Lucky Patel";
  const hasStory = !!(page?.storyText || page?.message);
  const memCount = memoryImgs?.length || 0;
  const hasExtra = hasStory || memCount > 0;

  // 1. DYNAMIC ROMANTIC SUNSET BACKGROUND
  if (sunsetBgImg) {
    drawCoverImage(ctx, sunsetBgImg, 0, 0, w, h);
  } else if (couple) {
    drawCoverImage(ctx, couple, 0, 0, w, h);
  } else {
    const bgG = ctx.createLinearGradient(0, 0, 0, h);
    bgG.addColorStop(0, "#200615");
    bgG.addColorStop(0.35, "#4a0f2b");
    bgG.addColorStop(0.65, "#7b1c3b");
    bgG.addColorStop(0.9, "#a83e38");
    bgG.addColorStop(1, "#f28054");
    ctx.fillStyle = bgG;
    ctx.fillRect(0, 0, w, h);
  }

  // Twilight Atmospheric Vignette
  const vignette = ctx.createLinearGradient(0, 0, 0, h);
  vignette.addColorStop(0, "rgba(25, 4, 18, 0.35)");
  vignette.addColorStop(0.5, "rgba(45, 8, 30, 0.22)");
  vignette.addColorStop(1, "rgba(18, 3, 14, 0.48)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);

  // Soft Ambient Glow Orbs
  const orb1Y = 280 + Math.sin(timeSec * 0.9) * 35;
  const orb1 = ctx.createRadialGradient(w / 2, orb1Y, 15, w / 2, orb1Y, 380);
  orb1.addColorStop(0, "rgba(255, 60, 130, 0.32)");
  orb1.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = orb1;
  ctx.fillRect(0, 0, w, h);

  // Twinkling Floating Fireflies & Stars
  for (let i = 0; i < 28; i++) {
    const starX = (i * 59 + timeSec * 22) % w;
    const starY = (i * 97 + Math.sin(timeSec * 1.2 + i) * 18) % h;
    const starSize = 1.2 + (i % 3);
    const alpha = 0.35 + Math.sin(timeSec * 2.5 + i) * 0.35;
    ctx.fillStyle = `rgba(255, 230, 180, ${Math.max(0.1, alpha)})`;
    ctx.beginPath();
    ctx.arc(starX, starY, starSize, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ambient Background Rain & Falling Petals
  drawLoveRainBackground(ctx, w, h, timeSec);

  // 2. CAMERA SCROLL TIMING (Shows Celebration Screen first, then Certificate)
  const SCENE_OFFSET = 1280;
  let camY = 0;

  if (!hasExtra) {
    if (timeSec < 12.5) {
      camY = 0; // Scene 1: Celebration Card
    } else if (timeSec < 15.5) {
      const p = (timeSec - 12.5) / 3.0;
      const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      camY = SCENE_OFFSET * ease;
    } else {
      camY = SCENE_OFFSET; // Scene 2: Official Certificate
    }
  } else {
    if (timeSec < 10) {
      camY = 0;
    } else if (timeSec < 12.5) {
      const p = (timeSec - 10) / 2.5;
      const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      camY = SCENE_OFFSET * ease;
    } else if (timeSec < 21) {
      camY = SCENE_OFFSET;
    } else if (timeSec < 23.5) {
      const p = (timeSec - 21) / 2.5;
      const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      camY = SCENE_OFFSET + SCENE_OFFSET * ease;
    } else {
      camY = SCENE_OFFSET * 2;
    }
  }

  ctx.save();
  ctx.translate(0, -camY);

  // ─────────────────────────────────────────────────────────────
  // ─── SCENE 1: "YOU SAID YES!" CELEBRATION CARD (TARGET MATCH) ─
  // ─────────────────────────────────────────────────────────────
  const cardW = 620;
  const cardH = 880;
  const cardX = (w - cardW) / 2;
  const cardY = 180;

  // Glass Panel Base
  ctx.save();
  ctx.fillStyle = "rgba(30, 8, 22, 0.72)";
  ctx.shadowColor = "rgba(255, 40, 120, 0.45)";
  ctx.shadowBlur = 38;
  roundRect(ctx, cardX, cardY, cardW, cardH, 28);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 120, 180, 0.7)";
  ctx.lineWidth = 1.8;
  ctx.stroke();
  ctx.restore();

  // Top 3D YES! Heart Emblem (Overlapping Card Top)
  ctx.save();
  const badgePulse = 1 + Math.sin(timeSec * 3) * 0.03;
  ctx.translate(w / 2, cardY);
  ctx.scale(badgePulse, badgePulse);

  // Sparkle Glow Rays
  const rays = ctx.createRadialGradient(0, 0, 10, 0, 0, 60);
  rays.addColorStop(0, "rgba(255, 255, 255, 0.6)");
  rays.addColorStop(0.5, "rgba(255, 42, 117, 0.35)");
  rays.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = rays;
  ctx.beginPath();
  ctx.arc(0, 0, 60, 0, Math.PI * 2);
  ctx.fill();

  // 3D Heart Badge
  const badgeG = ctx.createRadialGradient(-8, -12, 4, 0, 0, 42);
  badgeG.addColorStop(0, "#ff5e98");
  badgeG.addColorStop(0.55, "#ff2a75");
  badgeG.addColorStop(1, "#c9184a");
  ctx.fillStyle = badgeG;
  ctx.shadowColor = "rgba(255, 42, 117, 0.85)";
  ctx.shadowBlur = 24;
  roundRect(ctx, -40, -38, 80, 76, 38);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "italic 900 24px 'Playfair Display', Georgia, serif";
  ctx.fillText("YES!", 0, 8);
  ctx.restore();

  // Pill Badge: ✨ YOU SAID YES ✨
  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
  ctx.strokeStyle = "rgba(255, 209, 102, 0.45)";
  ctx.lineWidth = 1;
  roundRect(ctx, w / 2 - 105, cardY + 68, 210, 32, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffd166";
  ctx.textAlign = "center";
  ctx.font = "bold 13px 'Cinzel', Georgia, serif";
  ctx.fillText("✨ YOU SAID YES ✨", w / 2, cardY + 89);
  ctx.restore();

  // Heading: "You said YES!"
  ctx.save();
  ctx.textAlign = "center";
  ctx.font = "italic bold 38px 'Playfair Display', Georgia, serif";
  const youSaidW = ctx.measureText("You said ").width;

  ctx.font = "bold 54px 'Great Vibes', 'Alex Brush', cursive";
  const yesW = ctx.measureText("YES!").width;
  const totalHeadW = youSaidW + yesW;
  const headStartX = w / 2 - totalHeadW / 2;

  // "You said " in Serif White
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = 10;
  ctx.font = "italic bold 38px 'Playfair Display', Georgia, serif";
  ctx.fillText("You said ", headStartX, cardY + 148);

  // "YES!" in Golden Cursive Calligraphy
  const goldTextG = ctx.createLinearGradient(headStartX + youSaidW, cardY + 110, headStartX + totalHeadW, cardY + 155);
  goldTextG.addColorStop(0, "#ffe082");
  goldTextG.addColorStop(0.5, "#ffd166");
  goldTextG.addColorStop(1, "#ffab40");
  ctx.fillStyle = goldTextG;
  ctx.shadowColor = "rgba(255, 209, 102, 0.75)";
  ctx.shadowBlur = 18;
  ctx.font = "bold 56px 'Great Vibes', 'Alex Brush', cursive";
  ctx.fillText("YES!", headStartX + youSaidW, cardY + 152);
  ctx.restore();

  // Calligraphy Names: Creator ♡ / ♡ Partner ♡
  ctx.save();
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(255, 79, 129, 0.6)";
  ctx.shadowBlur = 24;

  // Top Row: Creator ♡
  ctx.font = "normal 48px 'Great Vibes', 'Pinyon Script', cursive";
  const cNameW = ctx.measureText(creatorName).width;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(creatorName, w / 2 - 14, cardY + 215);

  ctx.font = "30px sans-serif";
  ctx.fillStyle = "#ff5e98";
  ctx.shadowColor = "#ff5e98";
  ctx.shadowBlur = 12;
  ctx.fillText("♡", w / 2 + cNameW / 2 + 6, cardY + 212);

  // Bottom Row: ♡ Partner ♡
  ctx.font = "normal 48px 'Great Vibes', 'Pinyon Script', cursive";
  const pNameW = ctx.measureText(partnerName).width;

  ctx.font = "30px sans-serif";
  ctx.fillStyle = "#ff5e98";
  ctx.shadowColor = "#ff5e98";
  ctx.shadowBlur = 12;
  ctx.fillText("♡", w / 2 - pNameW / 2 - 20, cardY + 268);

  ctx.font = "normal 48px 'Great Vibes', 'Pinyon Script', cursive";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(255, 79, 129, 0.6)";
  ctx.shadowBlur = 24;
  ctx.fillText(partnerName, w / 2, cardY + 270);

  ctx.font = "30px sans-serif";
  ctx.fillStyle = "#ff5e98";
  ctx.shadowColor = "#ff5e98";
  ctx.shadowBlur = 12;
  ctx.fillText("♡", w / 2 + pNameW / 2 + 20, cardY + 268);
  ctx.restore();

  // Subtitle Ribbon: Two Hearts ♥ One Story ♥ Forever & Always
  ctx.save();
  ctx.textAlign = "center";
  ctx.font = "italic 16px 'Playfair Display', Georgia, serif";
  ctx.fillStyle = "#ffd166";
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 6;
  ctx.fillText("Two Hearts", w / 2 - 135, cardY + 316);

  ctx.font = "14px sans-serif";
  ctx.fillStyle = "#ff4f81";
  ctx.fillText("♥", w / 2 - 76, cardY + 315);

  ctx.font = "italic 16px 'Playfair Display', Georgia, serif";
  ctx.fillStyle = "#ffd166";
  ctx.fillText("One Story", w / 2, cardY + 316);

  ctx.font = "14px sans-serif";
  ctx.fillStyle = "#ff4f81";
  ctx.fillText("♥", w / 2 + 76, cardY + 315);

  ctx.font = "italic 16px 'Playfair Display', Georgia, serif";
  ctx.fillStyle = "#ffd166";
  ctx.fillText("Forever & Always", w / 2 + 155, cardY + 316);
  ctx.restore();

  // Polaroid Photo Showcase Section
  const polaroidCenterY = cardY + 495;

  // Left Polaroid: Creator
  ctx.save();
  const driftY1 = Math.sin(timeSec * 1.5) * 6;
  ctx.translate(w / 2 - 135, polaroidCenterY + driftY1);
  ctx.rotate(-0.08); // -4.6 degrees tilt

  // White Polaroid Card Frame
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 22;
  roundRect(ctx, -95, -120, 190, 240, 12);
  ctx.fill();
  ctx.shadowColor = "transparent";

  // Top White Tape
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
  ctx.lineWidth = 1;
  roundRect(ctx, -26, -132, 52, 18, 3);
  ctx.fill();
  ctx.stroke();

  // Photo
  if (creator) {
    drawCoverImage(ctx, creator, -85, -108, 170, 168, 6);
  } else {
    drawAvatarFallback(ctx, -85, -108, 170, 168, creatorName, 6);
  }

  // Pink Bottom Name Pill
  const pillG1 = ctx.createLinearGradient(-65, 80, 65, 108);
  pillG1.addColorStop(0, "#ff2a75");
  pillG1.addColorStop(1, "#ff5e98");
  ctx.fillStyle = pillG1;
  ctx.shadowColor = "rgba(255, 42, 117, 0.45)";
  ctx.shadowBlur = 10;
  roundRect(ctx, -65, 80, 130, 28, 14);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(creatorName, 0, 99);
  ctx.restore();

  // Right Polaroid: Partner
  ctx.save();
  const driftY2 = Math.cos(timeSec * 1.5 + 1) * 6;
  ctx.translate(w / 2 + 135, polaroidCenterY + driftY2);
  ctx.rotate(0.08); // +4.6 degrees tilt

  // White Polaroid Card Frame
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 22;
  roundRect(ctx, -95, -120, 190, 240, 12);
  ctx.fill();
  ctx.shadowColor = "transparent";

  // Top White Tape
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
  ctx.lineWidth = 1;
  roundRect(ctx, -26, -132, 52, 18, 3);
  ctx.fill();
  ctx.stroke();

  // Photo
  if (partner) {
    drawCoverImage(ctx, partner, -85, -108, 170, 168, 6);
  } else {
    drawAvatarFallback(ctx, -85, -108, 170, 168, partnerName, 6);
  }

  // Pink Bottom Name Pill
  const pillG2 = ctx.createLinearGradient(-65, 80, 65, 108);
  pillG2.addColorStop(0, "#ff2a75");
  pillG2.addColorStop(1, "#ff5e98");
  ctx.fillStyle = pillG2;
  ctx.shadowColor = "rgba(255, 42, 117, 0.45)";
  ctx.shadowBlur = 10;
  roundRect(ctx, -65, 80, 130, 28, 14);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(partnerName, 0, 99);
  ctx.restore();

  // Center Showcase: Couple Photo Cameo or Crown & "Forever" Heart Seal
  if (couple) {
    ctx.save();
    const coupleScale = 1 + Math.sin(timeSec * 2) * 0.03;
    ctx.translate(w / 2, polaroidCenterY);
    ctx.scale(coupleScale, coupleScale);

    // Glowing Outer Halo
    ctx.beginPath();
    ctx.arc(0, 0, 52, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 79, 129, 0.35)";
    ctx.shadowColor = "rgba(255, 79, 129, 0.85)";
    ctx.shadowBlur = 20;
    ctx.fill();

    // Gold Bezel
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(255, 209, 102, 0.8)";
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.strokeStyle = "#ffd166";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Circular Clipped Couple Photo
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, 45, 0, Math.PI * 2);
    ctx.clip();
    drawCoverImage(ctx, couple, -45, -45, 90, 90);
    ctx.restore();

    // Top Royal Crown
    ctx.font = "26px sans-serif";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(255, 209, 102, 0.9)";
    ctx.shadowBlur = 10;
    ctx.fillText("👑", 0, -50);

    // Bottom Pill: Us Together 💕
    const coupPillG = ctx.createLinearGradient(-50, 42, 50, 66);
    coupPillG.addColorStop(0, "#ff2a75");
    coupPillG.addColorStop(1, "#c9184a");
    ctx.fillStyle = coupPillG;
    ctx.shadowColor = "rgba(201, 24, 74, 0.5)";
    ctx.shadowBlur = 8;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
    ctx.lineWidth = 1;
    roundRect(ctx, -52, 42, 104, 24, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px Georgia, serif";
    ctx.fillText("Us Together 💕", 0, 58);
    ctx.restore();
  } else {
    // Center Seal: Crown & "Forever" Heart
    ctx.save();
    const crownScale = 1 + Math.sin(timeSec * 2.2) * 0.06;
    ctx.translate(w / 2, polaroidCenterY);
    ctx.scale(crownScale, crownScale);

    ctx.font = "32px sans-serif";
    ctx.shadowColor = "rgba(255, 209, 102, 0.7)";
    ctx.shadowBlur = 14;
    ctx.textAlign = "center";
    ctx.fillText("👑", 0, -32);

    // 3D Heart with "Forever"
    const heartSealG = ctx.createRadialGradient(-6, -6, 2, 0, 0, 28);
    heartSealG.addColorStop(0, "#ff5e98");
    heartSealG.addColorStop(1, "#c9184a");
    ctx.fillStyle = heartSealG;
    ctx.shadowColor = "rgba(201, 24, 74, 0.65)";
    ctx.shadowBlur = 16;
    roundRect(ctx, -27, -6, 54, 52, 26);
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "normal 17px 'Great Vibes', cursive";
    ctx.fillText("Forever", 0, 26);
    ctx.restore();
  }

  // Floating Side Pill: "💕 You & Me 💕"
  ctx.save();
  const floatPillY = cardY + 410 + Math.sin(timeSec * 1.3) * 8;
  ctx.fillStyle = "rgba(45, 12, 30, 0.75)";
  ctx.strokeStyle = "rgba(255, 79, 129, 0.55)";
  ctx.lineWidth = 1.2;
  roundRect(ctx, 40, floatPillY, 130, 32, 16);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = "italic 13px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("💕 You & Me 💕", 105, floatPillY + 21);
  ctx.restore();

  // Bottom Footer Note
  ctx.save();
  ctx.font = "italic 15px Georgia, serif";
  ctx.fillStyle = "#ffb3c1";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 8;
  ctx.fillText("💕 A digital love story, created just for the two of you. 💕", w / 2, cardY + 740);
  ctx.restore();

  // ─────────────────────────────────────────────────────────────
  // ─── SCENE 2: OFFICIAL ROMANTIC CERTIFICATE OF ETERNAL LOVE ───
  // ─────────────────────────────────────────────────────────────
  const certW = 660;
  const certH = 920;
  const certX = (w - certW) / 2;
  const certY = SCENE_OFFSET + (SCENE_OFFSET - certH) / 2;

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
  ctx.shadowBlur = 35;
  roundRect(ctx, certX, certY, certW, certH, 22);

  if (certBgImg) {
    ctx.save();
    roundRect(ctx, certX, certY, certW, certH, 22);
    ctx.clip();
    ctx.drawImage(certBgImg, certX, certY, certW, certH);
    ctx.restore();
  } else {
    const certG = ctx.createLinearGradient(certX, certY, certX + certW, certY + certH);
    certG.addColorStop(0, "#fffef7");
    certG.addColorStop(1, "#f5ebd0");
    ctx.fillStyle = certG;
    ctx.fill();
  }

  // Golden Outer Border
  ctx.shadowColor = "rgba(200, 163, 86, 0.5)";
  ctx.shadowBlur = 15;
  ctx.strokeStyle = "rgba(200, 163, 86, 0.8)";
  ctx.lineWidth = 2.5;
  roundRect(ctx, certX, certY, certW, certH, 22);
  ctx.stroke();
  ctx.restore();

  // Certificate Header Section
  ctx.save();
  ctx.textAlign = "center";

  ctx.fillStyle = "#c8a356";
  ctx.font = "normal 22px Georgia, serif";
  ctx.fillText("─── ༺ ♥ ༻ ───", w / 2, certY + 68);

  ctx.fillStyle = "#70101f";
  ctx.font = "700 14px 'Cinzel', Georgia, serif";
  ctx.fillText("— THE OFFICIAL —", w / 2, certY + 104);

  ctx.fillStyle = "#4a0913";
  ctx.font = "bold 28px 'Cinzel', 'Playfair Display', Georgia, serif";
  ctx.fillText("CERTIFICATE OF", w / 2, certY + 146);

  // ETERNAL L❤️VE
  ctx.font = "900 44px 'Cinzel', Georgia, serif";
  const part1 = "ETERNAL L";
  const part2 = "VE";
  const w1 = ctx.measureText(part1).width;
  const w2 = ctx.measureText(part2).width;
  const heartW = 38;
  const totalCertTitleW = w1 + heartW + w2;
  const startCertTitleX = w / 2 - totalCertTitleW / 2;

  ctx.textAlign = "left";
  ctx.fillStyle = "#4a0913";
  ctx.fillText(part1, startCertTitleX, certY + 208);

  ctx.font = "38px sans-serif";
  ctx.fillText("❤️", startCertTitleX + w1 - 2, certY + 204);

  ctx.font = "900 44px 'Cinzel', Georgia, serif";
  ctx.fillText(part2, startCertTitleX + w1 + heartW - 4, certY + 208);

  // — THIS CERTIFIES THAT —
  ctx.textAlign = "center";
  ctx.strokeStyle = "#c8a356";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 190, certY + 252);
  ctx.lineTo(w / 2 - 90, certY + 252);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(w / 2 + 90, certY + 252);
  ctx.lineTo(w / 2 + 190, certY + 252);
  ctx.stroke();

  ctx.fillStyle = "#70101f";
  ctx.font = "700 13px 'Cinzel', Georgia, serif";
  ctx.fillText("THIS CERTIFIES THAT", w / 2, certY + 256);

  ctx.font = "16px sans-serif";
  ctx.fillStyle = "#aa1024";
  ctx.fillText("♥", w / 2, certY + 280);

  // Couple Names Row: Creator ❤️ Partner
  ctx.font = "normal 52px 'Pinyon Script', 'Great Vibes', cursive";
  ctx.fillStyle = "#660714";
  ctx.shadowColor = "rgba(110, 9, 23, 0.25)";
  ctx.shadowBlur = 10;

  const leftNW = ctx.measureText(creatorName).width;
  const rightNW = ctx.measureText(partnerName).width;
  const spacing = 55;

  ctx.fillText(creatorName, w / 2 - (spacing + leftNW / 2), certY + 360);

  ctx.font = "34px sans-serif";
  ctx.fillStyle = "#b80d22";
  ctx.shadowBlur = 12;
  ctx.fillText("❤️", w / 2, certY + 352);

  ctx.font = "normal 52px 'Pinyon Script', 'Great Vibes', cursive";
  ctx.fillStyle = "#660714";
  ctx.shadowBlur = 10;
  ctx.fillText(partnerName, w / 2 + (spacing + rightNW / 2), certY + 360);
  ctx.shadowBlur = 0;

  // Declaration Body Paragraphs
  ctx.font = "italic 17px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "#1f1614";
  ctx.fillText("are hereby declared to be forever bound in love,", w / 2, certY + 425);
  ctx.fillText("in heart, in soul and in every lifetime.", w / 2, certY + 455);

  ctx.font = "italic 21px 'Pinyon Script', 'Great Vibes', cursive";
  ctx.fillStyle = "#8a0c1e";
  ctx.fillText("This bond is certified as timeless, unconditional, and everlasting,", w / 2, certY + 508);

  ctx.font = "italic 16px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "#1f1614";
  ctx.fillText("sealed with trust, respect, care and a love that grows stronger", w / 2, certY + 545);
  ctx.fillText("with every heartbeat.", w / 2, certY + 572);

  // Together Forever Calligraphy
  ctx.font = "normal 44px 'Pinyon Script', 'Great Vibes', cursive";
  ctx.fillStyle = "#5c0d18";
  ctx.fillText("Together Forever", w / 2, certY + 638);

  ctx.fillStyle = "#c8a356";
  ctx.font = "normal 18px Georgia, serif";
  ctx.fillText("─── ༺ ♥ ༻ ───", w / 2, certY + 672);

  // Signatures Row
  // Left: Creator
  ctx.font = "normal 34px 'Pinyon Script', 'Great Vibes', cursive";
  ctx.fillStyle = "#1a1a1a";
  ctx.fillText(creatorName, w / 2 - 165, certY + 750);

  ctx.strokeStyle = "#8b0d1e";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 240, certY + 772);
  ctx.lineTo(w / 2 - 90, certY + 772);
  ctx.stroke();

  ctx.font = "12px sans-serif";
  ctx.fillStyle = "#aa1024";
  ctx.fillText("♥", w / 2 - 165, certY + 776);

  ctx.font = "bold 12px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "#4a0812";
  ctx.fillText("PARTNER IN LIFE", w / 2 - 165, certY + 796);

  // Right: Partner
  ctx.font = "normal 34px 'Pinyon Script', 'Great Vibes', cursive";
  ctx.fillStyle = "#1a1a1a";
  ctx.fillText(partnerName, w / 2 + 165, certY + 750);

  ctx.beginPath();
  ctx.moveTo(w / 2 + 90, certY + 772);
  ctx.lineTo(w / 2 + 240, certY + 772);
  ctx.stroke();

  ctx.font = "12px sans-serif";
  ctx.fillStyle = "#aa1024";
  ctx.fillText("♥", w / 2 + 165, certY + 776);

  ctx.font = "bold 12px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "#4a0812";
  ctx.fillText("PARTNER IN LIFE", w / 2 + 165, certY + 796);

  // Envelope Note (Bottom Left Corner)
  ctx.save();
  ctx.translate(certX + 110, certY + 865);
  ctx.rotate((-12 * Math.PI) / 180);
  ctx.font = "normal 22px 'Pinyon Script', 'Great Vibes', cursive";
  ctx.fillStyle = "#2a1c15";
  ctx.fillText("Forever Looks Better With You ♡", 0, 0);
  ctx.restore();

  // Official Royal 3D Wax Seal Stamp (Center Bottom of Certificate)
  ctx.save();
  const sealX = w / 2;
  const sealY = certY + 830;
  ctx.translate(sealX, sealY);

  // Wax Seal Ribbons
  ctx.fillStyle = "#8a0c1e";
  ctx.beginPath();
  ctx.moveTo(-16, 12);
  ctx.lineTo(-28, 48);
  ctx.lineTo(-14, 42);
  ctx.lineTo(-6, 48);
  ctx.lineTo(-8, 16);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(16, 12);
  ctx.lineTo(28, 48);
  ctx.lineTo(14, 42);
  ctx.lineTo(6, 48);
  ctx.lineTo(8, 16);
  ctx.fill();

  // Outer Gold Scalloped Rim
  ctx.shadowColor = "rgba(200, 163, 86, 0.6)";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(0, 0, 36, 0, Math.PI * 2);
  ctx.fillStyle = "#c8a356";
  ctx.fill();

  // Inner Deep Crimson Wax Circle
  const waxG = ctx.createRadialGradient(-6, -6, 3, 0, 0, 32);
  waxG.addColorStop(0, "#aa1024");
  waxG.addColorStop(0.7, "#700b18");
  waxG.addColorStop(1, "#45050e");
  ctx.fillStyle = waxG;
  ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(0, 0, 31, 0, Math.PI * 2);
  ctx.fill();

  // Gold Inner Rim
  ctx.strokeStyle = "rgba(255, 215, 120, 0.75)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, 26, 0, Math.PI * 2);
  ctx.stroke();

  // Center Seal Text & Crown
  ctx.font = "18px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("👑", 0, -4);

  ctx.font = "bold 9px 'Cinzel', serif";
  ctx.fillStyle = "#ffd166";
  ctx.fillText("CERTIFIED", 0, 11);
  ctx.fillText("LOVE", 0, 21);
  ctx.restore();

  ctx.restore();

  // ─────────────────────────────────────────────────────────────
  // ─── SCENE 3: LOVE LETTER & MEMORIES (IF PRESENT) ─────────────
  // ─────────────────────────────────────────────────────────────
  if (hasExtra) {
    let extraY = SCENE_OFFSET * 2 + 140;

    if (page?.storyText || page?.message) {
      const letterText = page.storyText || page.message;
      ctx.save();
      ctx.fillStyle = "rgba(25, 2, 8, 0.78)";
      ctx.shadowColor = "rgba(230, 28, 93, 0.4)";
      ctx.shadowBlur = 18;
      roundRect(ctx, 45, extraY, w - 90, 420, 20);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 120, 180, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = "#ffd1d9";
      ctx.textAlign = "center";
      ctx.font = "bold 24px 'Cinzel', serif";
      ctx.fillText("💌 Our Love Letter 💌", w / 2, extraY + 52);

      ctx.fillStyle = "#fffcf2";
      ctx.font = "18px 'Cormorant Garamond', Georgia, serif";
      wrapText(ctx, letterText, w / 2, extraY + 115, w - 140, 28);
      ctx.restore();
      extraY += 480;
    }

    if (memCount > 0) {
      memoryImgs.forEach((mem, idx) => {
        ctx.save();
        const tilt = idx % 2 === 0 ? -0.05 : 0.05;
        ctx.translate(w / 2, extraY + 220);
        ctx.rotate(tilt);

        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(0,0,0,0.6)";
        ctx.shadowBlur = 20;
        roundRect(ctx, -160, -180, 320, 370, 16);
        ctx.fill();

        if (mem.loadedImage) {
          drawCoverImage(ctx, mem.loadedImage, -145, -165, 290, 260, 8);
        }

        ctx.fillStyle = "#1a0209";
        ctx.font = "bold 20px Georgia, serif";
        ctx.textAlign = "center";
        ctx.fillText(mem.title || "Our Memory", 0, 135);

        ctx.fillStyle = "#e61c5d";
        ctx.font = "14px sans-serif";
        ctx.fillText(mem.date || "", 0, 162);
        ctx.restore();
        extraY += 440;
      });
    }
  }

  ctx.restore(); // Restore camera translation

  // ─────────────────────────────────────────────────────────────
  // ─── FOREGROUND CASCADING LOVE RAIN (CRAZY LOVE RAIN MATCH) ──
  // ─────────────────────────────────────────────────────────────
  drawLoveRainForeground(ctx, w, h, timeSec);

  // ─────────────────────────────────────────────────────────────
  // ─── FIXED VIEWPORT OVERLAYS (PROGRESS BAR) ──────────────────
  // ─────────────────────────────────────────────────────────────
  ctx.save();
  // Bottom Progress Track
  ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
  roundRect(ctx, 45, 1240, w - 90, 6, 3);
  ctx.fill();

  // Glowing Progress Fill
  const progG = ctx.createLinearGradient(45, 1240, 45 + (w - 90) * t, 1240);
  progG.addColorStop(0, "#ff4d8d");
  progG.addColorStop(1, "#ffd166");
  ctx.fillStyle = progG;
  roundRect(ctx, 45, 1240, Math.max(6, (w - 90) * t), 6, 3);
  ctx.fill();

  // Little Heart Tip
  if (t > 0.02) {
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("💖", 45 + (w - 90) * t, 1246);
  }
  ctx.restore();
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