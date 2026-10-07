import { motion } from "framer-motion";
import PublicLayout from "../layouts/PublicLayout.jsx";
import CursorStardust from "../components/CursorStardust.jsx";
import AudioSoundtrackBar from "../components/AudioSoundtrackBar.jsx";
import LoveBubbles from "../components/LoveBubbles.jsx";
import RosePetals from "../components/RosePetals.jsx";
import { playSparkleSound } from "../utils/audioSynth.js";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function About() {
  return (
    <PublicLayout>
      <CursorStardust />
      <AudioSoundtrackBar />
      <LoveBubbles count={16} showMessages />
      <RosePetals count={10} />

      <div className="about-page-wrapper">
        <motion.div className="about-hero" initial="hidden" animate="show" variants={fadeUp}>
          <div className="lp-mini-tag">✨ WHY LOVEDOES EXISTS ✨</div>
          <h1 className="about-title">Crafted for Hearts That Feel Deeply ♡</h1>
          <p className="about-sub">
            LoveDoes was born out of a simple belief: standard text messages and generic gifts can never truly capture the warmth of a genuine love story.
          </p>
        </motion.div>

        {/* 3 CORE PILLARS GRID */}
        <div className="about-pillars-grid">
          <motion.div className="pillar-card" initial="hidden" animate="show" variants={fadeUp} custom={1} onClick={() => playSparkleSound()}>
            <div className="pillar-icon">🕯️</div>
            <h3>Intimate & Private</h3>
            <p>
              Your page isn't indexable by search engines or shared publicly unless you choose to. It's a sanctuary created strictly for the two of you.
            </p>
          </motion.div>

          <motion.div className="pillar-card" initial="hidden" animate="show" variants={fadeUp} custom={2} onClick={() => playSparkleSound()}>
            <div className="pillar-icon">🎵</div>
            <h3>Emotional UI Design</h3>
            <p>
              From gentle ambient soundscapes to floating multilingual love notes, every interaction is engineered to evoke genuine happy tears.
            </p>
          </motion.div>

          <motion.div className="pillar-card" initial="hidden" animate="show" variants={fadeUp} custom={3} onClick={() => playSparkleSound()}>
            <div className="pillar-icon">♾️</div>
            <h3>Forever Preservation</h3>
            <p>
              Your love story, timeline memories, secret letters, and photo galleries stay live indefinitely so you can revisit your romantic sanctuary anytime.
            </p>
          </motion.div>
        </div>

        {/* FOUNDER MANIFESTO */}
        <motion.div className="about-manifesto-card" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <span className="lp-mini-tag">📜 OUR ROMANTIC MANIFESTO</span>
          <h2 className="manifesto-heading">“Slow reveals. Soft light. A link that feels like an opening letter.”</h2>
          <p className="manifesto-text">
            We believe that in a fast-paced world, love deserves patience, artistry, and emotional resonance. When your special someone opens your LoveDoes link, we want time to stand still — if only for a few unforgettable minutes.
          </p>
          <div className="manifesto-signature">
            Crafted with ❤️ & Vision by <strong>Er. Manish Patel</strong> ♡
          </div>
        </motion.div>
      </div>
    </PublicLayout>
  );
}
