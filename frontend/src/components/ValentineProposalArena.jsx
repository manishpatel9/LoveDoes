import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RunawayNo from "./RunawayNo.jsx";
import ConfettiBurst from "./ConfettiBurst.jsx";
import RosePetals from "./RosePetals.jsx";
import Fireworks from "./Fireworks.jsx";
import RomanticCertificate from "./RomanticCertificate.jsx";
import { playRomanticChime, playSparkleSound, playHeartbeatSound } from "../utils/audioSynth.js";

export default function ValentineProposalArena() {
  const [accepted, setAccepted] = useState(false);
  const [taunt, setTaunt] = useState("");

  const handleYes = () => {
    playRomanticChime();
    setAccepted(true);
  };

  const handleReset = () => {
    playSparkleSound();
    setAccepted(false);
    setTaunt("");
  };

  return (
    <section className="section proposal-section" id="proposal-arena">
      {accepted && (
        <>
          <ConfettiBurst />
          <RosePetals count={24} />
          <Fireworks />
        </>
      )}

      <motion.div
        className="card proposal-card"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="proposal-header">
          <span className="proposal-eyebrow">✨ AN INTERACTIVE VALENTINE MOMENT ✨</span>
          <h2 className="display proposal-title">
            {accepted ? "Your Heart Has Chosen! 💖" : "Will You Be My Valentine?"}
          </h2>
          <p className="lede proposal-subtitle">
            {accepted
              ? "A true match made in heaven. Here is your official Digital Valentine Certificate!"
              : "Try tapping the options below. One of them is full of endless love... the other might play hard to get! 😜"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!accepted ? (
            <motion.div
              key="quiz"
              className="proposal-actions-area"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {taunt && <p className="taunt-text">{taunt}</p>}

              <div className="button-group">
                <button
                  type="button"
                  className="btn glow yes-btn"
                  onClick={handleYes}
                  onMouseEnter={() => playHeartbeatSound()}
                >
                  YES, ABSOLUTELY! ❤️
                </button>

                <div className="runaway-container">
                  <RunawayNo
                    onTaunt={(msg) => {
                      playSparkleSound();
                      setTaunt(msg);
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="certificate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ width: "100%" }}
            >
              <RomanticCertificate
                creatorName="Prince"
                partnerName="Princess"
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
