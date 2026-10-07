import { useEffect, useRef, useState } from "react";

export default function PersonalAudio({ src, autoStart = false }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = volume;
    el.muted = muted;
  }, [volume, muted]);

  useEffect(() => {
    if (autoStart && src) {
      audioRef.current?.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [autoStart, src]);

  if (!src) return null;

  async function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      await el.play();
      setPlaying(true);
    }
  }

  return (
    <div className="audio-bar" onClick={(e) => e.stopPropagation()}>
      <audio ref={audioRef} src={src} loop />
      <button type="button" className="btn secondary" onClick={toggle}>{playing ? "Pause" : "Play"} 🎵</button>
      <button type="button" className="btn secondary" onClick={() => setMuted((m) => !m)}>{muted ? "Unmute" : "Mute"}</button>
      <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(Number(e.target.value))} aria-label="Volume" />
    </div>
  );
}
