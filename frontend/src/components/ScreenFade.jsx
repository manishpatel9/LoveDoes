import { motion } from "framer-motion";

export default function ScreenFade({ children, screenKey }) {
  return (
    <motion.div
      key={screenKey}
      className="screen-fade"
      initial={{ opacity: 0, y: 28, scale: 0.96, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -18, scale: 1.02, filter: "blur(8px)" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
