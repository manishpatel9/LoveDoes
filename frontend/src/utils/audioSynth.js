// Web Audio API Synthesizer for Romantic Soundscapes & Micro-Interactions
// Safe, self-contained, no external MP3 dependencies required.

let audioCtx = null;
let ambientOscs = [];
let ambientGain = null;
let isAmbientPlaying = false;
let loveSongPreviewInterval = null;

const LOVE_SONG_PREVIEWS = [
  [261.63, 329.63, 392, 493.88, 392, 329.63, 293.66, 349.23],
  [220, 277.18, 329.63, 440, 392, 329.63, 277.18, 246.94],
  [293.66, 369.99, 440, 587.33, 493.88, 440, 369.99, 329.63],
];

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playHeartbeatSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const playThump = (delay, freq, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + delay + duration);

      gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    };

    playThump(0, 70, 0.18);
    playThump(0.22, 60, 0.22);
  } catch (e) {
    console.debug("Audio play failed:", e);
  }
}

export function playRomanticChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.08;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 1.2);
    });
  } catch (e) {
    console.debug("Chime failed:", e);
  }
}

export function playSparkleSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const freqs = [880, 1108.73, 1318.51, 1760];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const st = ctx.currentTime + i * 0.05;

      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, st);

      gain.gain.setValueAtTime(0.1, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(st);
      osc.stop(st + 0.4);
    });
  } catch (e) {
    console.debug("Sparkle failed:", e);
  }
}

export function startLoveSongPreview(trackIndex = 0) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    stopLoveSongPreview();
    const notes = LOVE_SONG_PREVIEWS[trackIndex % LOVE_SONG_PREVIEWS.length];
    let noteIndex = 0;

    const playNote = () => {
      const startTime = ctx.currentTime;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(notes[noteIndex], startTime);
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.07, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.42);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.45);
      noteIndex = (noteIndex + 1) % notes.length;
    };

    playNote();
    loveSongPreviewInterval = setInterval(playNote, 480);
    return true;
  } catch (error) {
    console.debug("Love song preview failed:", error);
    return false;
  }
}

export function stopLoveSongPreview() {
  if (loveSongPreviewInterval) {
    clearInterval(loveSongPreviewInterval);
    loveSongPreviewInterval = null;
  }
}

export function toggleAmbientSoundtrack(onStateChange) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    if (isAmbientPlaying) {
      stopAmbientSoundtrack();
      if (onStateChange) onStateChange(false);
      return false;
    } else {
      startAmbientSoundtrack();
      if (onStateChange) onStateChange(true);
      return true;
    }
  } catch (e) {
    console.debug("Ambient toggle failed:", e);
    return false;
  }
}

export function startAmbientSoundtrack() {
  try {
    const ctx = getAudioContext();
    if (!ctx || isAmbientPlaying) return;

    ambientGain = ctx.createGain();
    ambientGain.gain.setValueAtTime(0.05, ctx.currentTime);

    // Warm ambient pad frequencies (A Major 7 / F#m7 chords)
    const freqs = [220, 277.18, 329.63, 440, 554.37];
    ambientOscs = freqs.map((f) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, ctx.currentTime);
      osc.connect(ambientGain);
      osc.start();
      return osc;
    });

    ambientGain.connect(ctx.destination);
    isAmbientPlaying = true;
  } catch (e) {
    console.debug("Start ambient failed:", e);
  }
}

export function stopAmbientSoundtrack() {
  try {
    if (ambientGain && audioCtx) {
      ambientGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
    }
    setTimeout(() => {
      ambientOscs.forEach((o) => {
        try { o.stop(); } catch (e) {}
      });
      ambientOscs = [];
      isAmbientPlaying = false;
    }, 500);
  } catch (e) {
    isAmbientPlaying = false;
  }
}

export function getAmbientStatus() {
  return isAmbientPlaying;
}
