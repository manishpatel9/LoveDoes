import { motion } from "framer-motion";

export default function LoveFinaleStageDecoration() {
  return (
    <div className="target-stage-decorations" aria-hidden="true">
      {/* ─── LEFT SIDE DECORATIONS ─── */}
      <div className="stage-left-decor">
        {/* Floating Neon Heart Frame with "I Love You" */}
        <motion.div
          className="left-neon-heart-frame"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <svg className="neon-heart-svg" viewBox="0 0 120 110" fill="none">
            <path
              d="M60 98 C20 70 5 45 5 28 C5 12 18 2 34 2 C46 2 54 8 60 16 C66 8 74 2 86 2 C102 2 115 12 115 28 C115 45 100 70 60 98 Z"
              stroke="#ff2a75"
              strokeWidth="3.5"
              fill="rgba(255, 42, 117, 0.08)"
              filter="drop-shadow(0 0 12px #ff2a75)"
            />
          </svg>
          <span className="neon-heart-text">I Love You</span>
        </motion.div>

        {/* Left Floating Pill Badges */}
        <motion.div className="decor-pill pill-l1" animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
          I Love You 💕
        </motion.div>
        <motion.div className="decor-pill pill-l2" animate={{ y: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
          Forever
        </motion.div>
        <motion.div className="decor-pill pill-l3" animate={{ y: [0, -6, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
          My Heart 💕
        </motion.div>
        <motion.div className="decor-pill pill-l4" animate={{ y: [0, 6, 0] }} transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}>
          You & Me 💕
        </motion.div>

        {/* Bottom Left 3D Cloud Beds & Heart Balloons */}
        <div className="bottom-cloud-bed cloud-left">
          <div className="cloud-puff puff-1" />
          <div className="cloud-puff puff-2" />
          <div className="cloud-puff puff-3" />
          <div className="heart-balloon balloon-1">💖</div>
          <div className="heart-balloon balloon-2">💗</div>
        </div>
      </div>

      {/* ─── RIGHT SIDE DECORATIONS ─── */}
      <div className="stage-right-decor">
        {/* "Together Forever ♡" Handwritten Calligraphy */}
        <motion.div
          className="together-forever-text"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <span>Together</span>
          <span className="script-sub">Forever ♡</span>
          <svg className="arrow-underline" viewBox="0 0 80 20">
            <path d="M5 5 C30 15 50 15 75 5 M70 2 L77 6 L70 10" stroke="#ffd166" strokeWidth="2" fill="none" />
          </svg>
        </motion.div>

        {/* Right Multilingual Pill Badges */}
        <motion.div className="decor-pill pill-r1" animate={{ y: [0, -7, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}>
          प्यार हमेशा 💕
        </motion.div>
        <motion.div className="decor-pill pill-r2" animate={{ y: [0, 7, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}>
          என்றும் நான் உன்னுடன் 💕
        </motion.div>
        <motion.div className="decor-pill pill-r3" animate={{ y: [0, -5, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}>
          愛してる 💕
        </motion.div>

        {/* Bottom Right 3D Cloud Beds & Heart Balloons */}
        <div className="bottom-cloud-bed cloud-right">
          <div className="cloud-puff puff-1" />
          <div className="cloud-puff puff-2" />
          <div className="cloud-puff puff-3" />
          <div className="heart-balloon balloon-3">💖</div>
          <div className="heart-balloon balloon-4">💕</div>
        </div>
      </div>
    </div>
  );
}
