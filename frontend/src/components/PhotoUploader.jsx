import { motion } from "framer-motion";

export default function PhotoUploader({ label, hint, file, preview, onChange, onClear }) {
  return (
    <div className="field photo-uploader-field">
      <label className="uploader-label">
        <span>{label}</span>
      </label>
      <motion.div
        className={`upload-box ${preview ? "has-preview" : ""}`}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
      >
        {preview ? (
          <div className="polaroid-preview-frame">
            <img src={preview} alt={label} className="polaroid-img" />
            <div className="polaroid-heart-tag">💖</div>
            <div className="polaroid-caption">{file?.name ? file.name.substring(0, 20) + "..." : label}</div>
          </div>
        ) : (
          <div className="upload-placeholder">
            <motion.div
              className="upload-icon-pulse"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              📸
            </motion.div>
            <strong className="upload-title">Select or drop a photo</strong>
            <p className="upload-hint">{hint || "JPG, PNG, WEBP up to 8MB"}</p>
          </div>
        )}
        <input
          type="file"
          className="upload-file-input"
          accept="image/jpeg,image/png,image/webp"
          onChange={onChange}
        />
      </motion.div>
      {preview && onClear && (
        <button type="button" className="photo-remove-btn" onClick={onClear}>
          🗑️ Remove Photo
        </button>
      )}
    </div>
  );
}
