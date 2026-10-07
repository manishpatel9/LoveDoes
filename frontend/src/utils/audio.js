let ctx;
let nodes = [];

function ensureCtx() {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function stop() {
  nodes.forEach((n) => {
    try { n.stop(); } catch { /* already stopped */ }
  });
  nodes = [];
}

function tone(freq, type = "sine", gain = 0.03) {
  const audio = ensureCtx();
  const osc = audio.createOscillator();
  const g = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  osc.connect(g);
  g.connect(audio.destination);
  osc.start();
  nodes.push(osc);
}

export function playTone(kind) {
  stop();
  if (!kind || kind === "none") return;
  if (kind === "piano") {
    tone(392, "triangle", 0.02);
    tone(523.25, "sine", 0.015);
  } else if (kind === "romantic") {
    tone(329.63, "sine", 0.02);
    tone(493.88, "triangle", 0.012);
  } else if (kind === "acoustic") {
    tone(246.94, "triangle", 0.025);
  } else if (kind === "instrumental") {
    tone(261.63, "sine", 0.018);
    tone(392, "sine", 0.01);
  }
}

export function stopTone() {
  stop();
}
