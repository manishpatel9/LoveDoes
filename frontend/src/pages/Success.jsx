import { useLocation, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import PublicLayout from "../layouts/PublicLayout.jsx";
import ConfettiBurst from "../components/ConfettiBurst.jsx";

export default function Success() {
  const { state } = useLocation();
  if (!state?.slug) return <Navigate to="/create" replace />;

  const fullUrl = `${window.location.origin}/love/${state.slug}`;
  const wa = `https://wa.me/?text=${encodeURIComponent(`I made something special for you ❤️\n\nOpen this:\n${fullUrl}\n\nDon't open it until you're ready 🥰`)}`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(fullUrl)}`;

  async function copy() {
    await navigator.clipboard.writeText(fullUrl);
  }

  return (
    <PublicLayout>
      <section className="success">
        <motion.div
          className="card"
          style={{ textAlign: "center", maxWidth: 640, margin: "48px auto", position: "relative", overflow: "hidden" }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <ConfettiBurst />
          <p className="heart-pulse">✨</p>
          <h1 className="display" style={{ fontSize: "2.6rem" }}>It’s alive. It’s theirs.</h1>
          <p className="script-name" style={{ fontSize: "2.4rem", color: "var(--rose)" }}>
            {state.creatorName} & {state.partnerName}
          </p>
          <p className="hint">{fullUrl}</p>
          <img className="qr" src={qr} alt="QR code for the love page" />
          <div className="share-row">
            <button className="btn secondary" onClick={copy} type="button">Copy link</button>
            <a className="btn" href={wa} target="_blank" rel="noreferrer">WhatsApp</a>
            <Link className="btn glow" to={`/love/${state.slug}`}>Open the surprise</Link>
          </div>
        </motion.div>
      </section>
    </PublicLayout>
  );
}
