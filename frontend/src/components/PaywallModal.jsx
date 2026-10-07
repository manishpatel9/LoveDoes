import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitPaymentVerification, checkAccessStatus, getPublicPaymentSettings } from "../services/api.js";
import defaultQrImage from "../assets/qr_phonepe.png";

export default function PaywallModal({ slug, creatorName, partnerName, onUnlocked }) {
  const [payerName, setPayerName] = useState("");
  const [utrId, setUtrId] = useState("");
  const [phoneEmail, setPhoneEmail] = useState("");
  const [notes, setNotes] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [enlargedQr, setEnlargedQr] = useState(false);

  const [paymentSettings, setPaymentSettings] = useState({ upiId: "lovedoes@ybl", qrCodeUrl: "" });

  const savedUtrKey = `lovedoes_pending_utr_${slug}`;
  const [pendingUtr, setPendingUtr] = useState(() => localStorage.getItem(savedUtrKey) || "");

  // Load payment settings (UPI ID & QR Code Image)
  useEffect(() => {
    getPublicPaymentSettings()
      .then((res) => {
        if (res && res.success) {
          setPaymentSettings({
            upiId: res.upiId || "lovedoes@ybl",
            qrCodeUrl: res.qrCodeUrl || "",
          });
        }
      })
      .catch(() => {});
  }, []);

  const currentQrImage = paymentSettings.qrCodeUrl || defaultQrImage;
  const currentUpiId = paymentSettings.upiId || "lovedoes@ybl";

  // Auto-check status on mount if UTR is pending, and set interval polling
  useEffect(() => {
    let interval;
    if (pendingUtr) {
      handleCheckStatus(pendingUtr);
      interval = setInterval(() => {
        handleCheckStatus(pendingUtr);
      }, 10000); // Auto re-check every 10s so user unlocks live when admin approves!
    }
    return () => clearInterval(interval);
  }, [pendingUtr]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(currentUpiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCheckStatus = async (utrToCheck = utrId || pendingUtr) => {
    if (!utrToCheck) return;
    setChecking(true);
    setError("");
    try {
      const res = await checkAccessStatus(slug, utrToCheck);
      if (res.isUnlocked) {
        localStorage.removeItem(savedUtrKey);
        if (onUnlocked) onUnlocked();
      } else if (res.status === "rejected") {
        setError("Your submitted transaction ID was rejected by Admin. Please verify your UTR and re-submit.");
        localStorage.removeItem(savedUtrKey);
        setPendingUtr("");
      } else if (res.status === "pending") {
        setMessage(`Payment verification pending for UTR: ${utrToCheck}. Checking automatically...`);
      }
    } catch {
      /* ignore */
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanUtr = utrId.replace(/\s+/g, "").trim();
    if (!payerName.trim() || !cleanUtr || !phoneEmail.trim()) {
      setError("Please fill in your Name, 12-Digit UPI UTR, and Contact Details.");
      return;
    }
    if (cleanUtr.length < 6) {
      setError("Please enter a valid UPI UTR / Transaction ID (typically 12 digits).");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await submitPaymentVerification(slug, {
        payerName: payerName.trim(),
        utrId: cleanUtr,
        phoneEmail: phoneEmail.trim(),
        notes: notes.trim(),
      });

      if (res.success) {
        localStorage.setItem(savedUtrKey, cleanUtr);
        setPendingUtr(cleanUtr);
        setMessage("✨ Payment details submitted! Admin is verifying your transaction. Auto-refreshing status...");
      }
    } catch (err) {
      setError(err.message || "Failed to submit payment details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isUtrValid = utrId.replace(/\s+/g, "").length >= 10;

  return (
    <div className="paywall-overlay">
      {/* BACKGROUND FLOATING HEART AMBIENCE */}
      <div className="paywall-bg-glow" />

      <motion.div
        className="paywall-card royal-glass-card"
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
      >
        {/* CROWN & HEART EMBLEM */}
        <div className="paywall-emblem-ring">
          <div className="emblem-inner">
            <span className="royal-crown">👑</span>
            <span className="glowing-heart">💖</span>
          </div>
        </div>

        {/* TITLE */}
        <h2 className="paywall-title">
          Unlock Unlimited <span className="gold-text-shimmer">Lifetime Access</span>
        </h2>
        <p className="paywall-sub">
          You have enjoyed your <strong>3 free preview views</strong> of{" "}
          <span className="couple-names">
            {creatorName || "Couple"} ❤️ {partnerName || "Story"}
          </span>
        </p>

        {/* STEP PROGRESS TRACKER */}
        <div className="paywall-steps-bar">
          <div className={`step-item ${!pendingUtr ? "active" : "completed"}`}>
            <span className="step-num">1</span>
            <span className="step-txt">Scan QR &amp; Pay ₹99</span>
          </div>
          <div className="step-arrow">➔</div>
          <div className={`step-item ${pendingUtr ? "active" : ""}`}>
            <span className="step-num">2</span>
            <span className="step-txt">Submit UTR Code</span>
          </div>
          <div className="step-arrow">➔</div>
          <div className="step-item">
            <span className="step-num">3</span>
            <span className="step-txt">Instant Access</span>
          </div>
        </div>

        {/* PRICING BANNER */}
        <div className="paywall-price-card">
          <div className="price-badge-glow">ONE-TIME PASS</div>
          <div className="price-flex">
            <div className="price-amount-wrap">
              <span className="currency">₹</span>
              <span className="amount">99</span>
            </div>
            <div className="price-details">
              <strong>Lifetime Access Pass</strong>
              <span>Watch full video, photos, love notes &amp; Certificate forever</span>
            </div>
          </div>
        </div>

        {/* QR CODE & UPI BOX */}
        <div className="paywall-qr-box">
          <div className="qr-container" onClick={() => setEnlargedQr(true)} title="Click to view full screen QR">
            <div className="scanner-beam" />
            <img src={currentQrImage} alt="Payment UPI QR Code" className="qr-img" />
            <span className="zoom-hint">🔍 Tap to Zoom</span>
          </div>

          <div className="qr-right-col">
            <div className="upi-app-badges">
              <span className="app-badge phonepe">PhonePe</span>
              <span className="app-badge gpay">GPay</span>
              <span className="app-badge paytm">Paytm</span>
              <span className="app-badge bhim">BHIM</span>
            </div>

            <p className="qr-instructions-text">
              Scan QR code above with any UPI App or copy UPI ID below to pay ₹99:
            </p>

            <div className="upi-copy-row">
              <code className="upi-id-code">{currentUpiId}</code>
              <button type="button" className="copy-btn" onClick={handleCopyUpi}>
                {copied ? "✓ Copied!" : "📋 Copy ID"}
              </button>
            </div>
          </div>
        </div>

        {/* ALERT FEEDBACK NOTIFICATIONS */}
        <AnimatePresence>
          {message && (
            <motion.div
              className="paywall-toast success"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <span className="toast-icon">⏳</span>
              <div>
                <strong>Verification Request Submitted</strong>
                <p>{message}</p>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              className="paywall-toast error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <span className="toast-icon">⚠️</span>
              <div>
                <strong>Payment Verification Alert</strong>
                <p>{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PAYMENT SUBMISSION FORM */}
        <form onSubmit={handleSubmit} className="paywall-sleek-form">
          <div className="form-grid">
            <div className="input-group">
              <label>
                <span>👤 Your Full Name / Payer Name *</span>
              </label>
              <div className="input-field-wrap">
                <input
                  type="text"
                  placeholder="e.g. Manish Kumar"
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>💳 UPI UTR / Transaction ID *</span>
                {utrId && (
                  <span className={`utr-counter ${isUtrValid ? "valid" : ""}`}>
                    {utrId.replace(/\s+/g, "").length} digits {isUtrValid ? "✓" : ""}
                  </span>
                )}
              </label>
              <div className="input-field-wrap">
                <input
                  type="text"
                  placeholder="e.g. 427819028491 (12 digits)"
                  value={utrId}
                  onChange={(e) => setUtrId(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label>📱 Phone Number or Email *</label>
              <div className="input-field-wrap">
                <input
                  type="text"
                  placeholder="e.g. +91 9876543210"
                  value={phoneEmail}
                  onChange={(e) => setPhoneEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>📝 Note / Remarks (Optional)</label>
              <div className="input-field-wrap">
                <input
                  type="text"
                  placeholder="e.g. Paid via PhonePe"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="paywall-actions">
            <button
              type="submit"
              className="paywall-submit-btn-glow"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-spinner">⏳ Submitting Request...</span>
              ) : (
                <span>Submit Payment for Verification ✦</span>
              )}
            </button>

            {pendingUtr && (
              <button
                type="button"
                className="paywall-check-btn-glass"
                onClick={() => handleCheckStatus()}
                disabled={checking}
              >
                {checking ? "Checking Approval..." : "🔄 Re-check Admin Status"}
              </button>
            )}
          </div>
        </form>

        <p className="paywall-footer-note">
          🔒 Secure 256-Bit SSL Encrypted Verification • Instant Approval by Admin
        </p>
      </motion.div>

      {/* ENLARGED QR LIGHTBOX MODAL */}
      {enlargedQr && (
        <div className="paywall-qr-lightbox" onClick={() => setEnlargedQr(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="lightbox-close" onClick={() => setEnlargedQr(false)}>✕</button>
            <h3>📷 Payment UPI QR Code (₹99)</h3>
            <img src={currentQrImage} alt="Payment QR Code Fullscreen" className="lightbox-img" />
            <p className="lightbox-sub">Scan using PhonePe, Google Pay, Paytm, or BHIM</p>
          </div>
        </div>
      )}
    </div>
  );
}

