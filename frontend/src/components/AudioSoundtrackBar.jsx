import { useState } from "react";
import { toggleAmbientSoundtrack, playSparkleSound } from "../utils/audioSynth.js";

export default function AudioSoundtrackBar() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggle = () => {
    playSparkleSound();
    const active = toggleAmbientSoundtrack((state) => setIsPlaying(state));
    setIsPlaying(active);
  };

  return (
    <div className="audio-soundtrack-bar">
      <button
        type="button"
        className={`soundtrack-btn ${isPlaying ? "playing" : ""}`}
        onClick={handleToggle}
        title={isPlaying ? "Mute Romantic Atmosphere Audio" : "Play Romantic Atmosphere Audio"}
      >
        <span className="icon">{isPlaying ? "🎶" : "🎵"}</span>
        <span className="text">{isPlaying ? "Romantic Soundscape Active" : "Play Ambient Melody"}</span>
        {isPlaying && (
          <span className="wave-bars">
            <span className="bar b1" />
            <span className="bar b2" />
            <span className="bar b3" />
          </span>
        )}
      </button>
    </div>
  );
}
