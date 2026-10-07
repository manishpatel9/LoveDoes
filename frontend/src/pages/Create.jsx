import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import PhotoUploader from "../components/PhotoUploader.jsx";
import LovePreview from "../components/LovePreview.jsx";
import PublicLayout from "../layouts/PublicLayout.jsx";
import HeartField from "../components/HeartField.jsx";
import RosePetals from "../components/RosePetals.jsx";
import { COUPLE_AVATARS } from "../components/CoupleAvatars.jsx";
import { createLovePage, listMusic, listThemes } from "../services/api.js";
import { compressImage } from "../utils/compress.js";

const ROMANTIC_QUOTES = [
  "“In all the world, there is no heart for me like yours.”",
  "“You are my today and all of my tomorrows.”",
  "“Every love story is beautiful, but ours is my favorite.”",
  "“I loved you yesterday, love you still, always have, always will.”",
];

const OCCASION_CHIPS = [
  { label: "Valentine", icon: "💖" },
  { label: "Anniversary", icon: "💍" },
  { label: "Birthday", icon: "🎂" },
  { label: "Proposal", icon: "🌹" },
  { label: "Just Because", icon: "✨" },
  { label: "Romantic Trip", icon: "✈️" },
];

const emptyMemory = () => ({ title: "", description: "", date: "", file: null, preview: "" });

function readPreview(file, setter) {
  const reader = new FileReader();
  reader.onload = (e) => setter(e.target.result);
  reader.readAsDataURL(file);
}

function RoyalLiveSanctuaryCard({ form, activeAvatarPreset, selectedTheme, music }) {
  const selectedMusic = music.find((m) => m.id === form.musicId);
  const themePrimary = selectedTheme?.config?.primary || "#ff4f81";
  const themeBg = selectedTheme?.config?.background || "#1a0610";

  return (
    <div className="royal-preview-card">
      <div className="royal-preview-badge">
        <span>👑 ROYAL SANCTUARY LIVE PREVIEW</span>
      </div>

      <div
        className="royal-preview-sanctuary"
        style={{
          background: `linear-gradient(145deg, ${themeBg}ee 0%, rgba(20, 3, 14, 0.95) 100%)`,
          borderColor: themePrimary,
        }}
      >
        <div className="royal-preview-header">
          <span className="royal-occasion-chip">✨ {form.occasion || "Love Story"}</span>
          {form.specialDate ? (
            <span className="royal-date-chip">📅 {new Date(form.specialDate).toLocaleDateString()}</span>
          ) : (
            <span className="royal-date-chip">📅 Forever</span>
          )}
        </div>

        <div className="royal-avatars-row">
          <div className="royal-avatar-box">
            {form.creatorPreview ? (
              <img src={form.creatorPreview} alt="Creator" />
            ) : (
              activeAvatarPreset.creatorSvg
            )}
            <span className="royal-avatar-label">{form.creatorName || "Your Name"}</span>
          </div>

          <div className="royal-heart-pulse">
            <span>💖</span>
          </div>

          <div className="royal-avatar-box">
            {form.partnerPreview ? (
              <img src={form.partnerPreview} alt="Partner" />
            ) : (
              activeAvatarPreset.partnerSvg
            )}
            <span className="royal-avatar-label">{form.partnerName || "Partner Name"}</span>
          </div>
        </div>

        <h4 className="royal-preview-title">{form.title || "Two hearts, one story"}</h4>

        <div className="royal-preview-quote">
          "{form.message ? form.message.slice(0, 110) + (form.message.length > 110 ? "..." : "") : "Your love letter & romantic memories will bloom beautifully right here..."}"
        </div>

        <div className="royal-preview-footer">
          {form.audioFile ? (
            <span className="royal-music-pill">🎵 Custom Track</span>
          ) : selectedMusic ? (
            <span className="royal-music-pill">🎵 {selectedMusic.title}</span>
          ) : (
            <span className="royal-music-pill">🎵 Romantic Melody</span>
          )}
          <span className="royal-theme-pill" style={{ color: themePrimary, fontWeight: 600 }}>
            🎨 {selectedTheme?.name || "Vibe"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Create() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = location.state || {};

  const [step, setStep] = useState(0);
  const [themes, setThemes] = useState([]);
  const [music, setMusic] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [activeAvatarPreset, setActiveAvatarPreset] = useState(COUPLE_AVATARS[0]);

  const [form, setForm] = useState({
    creatorName: prefill.creatorName || "",
    partnerName: prefill.partnerName || "",
    title: "Two hearts, one story",
    occasion: prefill.occasion || "Valentine",
    specialDate: "",
    message: "",
    themeId: null,
    musicId: null,
    creatorFile: null,
    partnerFile: null,
    coupleFile: null,
    audioFile: null,
    creatorPreview: "",
    partnerPreview: "",
    couplePreview: "",
    audioPreview: "",
    memories: [],
  });

  useEffect(() => {
    Promise.all([listThemes(), listMusic()])
      .then(([t, m]) => {
        setThemes(t.themes);
        setMusic(m.music);
        setForm((prev) => ({
          ...prev,
          themeId: prev.themeId || t.themes[0]?.id,
          musicId: prev.musicId || m.music[0]?.id,
        }));
      })
      .catch(() => setError("Could not load themes. Is the API running?"));

    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % ROMANTIC_QUOTES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const selectedTheme = themes.find((t) => t.id === form.themeId);
  const labels = ["Couple", "Photos", "Memories", "Message", "Music", "Theme", "Preview"];
  const tabIcons = ["💑 Couple", "📸 Photos", "📖 Memories", "💌 Letter", "🎵 Song", "🎨 Vibe", "✨ Preview"];

  const canNext = useMemo(() => {
    if (step === 0) return form.creatorName.trim() && form.partnerName.trim();
    if (step === 1) return true; // Photos or avatars available
    return true;
  }, [step, form]);

  function update(partial) {
    setForm((prev) => ({ ...prev, ...partial }));
    setError("");
  }

  async function onPhoto(kind, event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setError("Each photo must be under 8 MB before compression.");
      return;
    }
    const compact = await compressImage(file);
    const map = {
      creator: ["creatorFile", "creatorPreview"],
      partner: ["partnerFile", "partnerPreview"],
      couple: ["coupleFile", "couplePreview"],
    };
    const [fileKey, previewKey] = map[kind];
    readPreview(compact, (preview) => update({ [fileKey]: compact, [previewKey]: preview }));
  }

  function onAudio(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 12 * 1024 * 1024) {
      setError("Audio must be under 12 MB.");
      return;
    }
    const url = URL.createObjectURL(file);
    update({ audioFile: file, audioPreview: url });
  }

  function addMemory() {
    if (form.memories.length >= 10) return;
    update({ memories: [...form.memories, emptyMemory()] });
  }

  function patchMemory(index, partial) {
    const next = form.memories.map((m, i) => (i === index ? { ...m, ...partial } : m));
    update({ memories: next });
  }

  async function onMemoryPhoto(index, event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const compact = await compressImage(file);
    readPreview(compact, (preview) => patchMemory(index, { file: compact, preview }));
  }

  async function submit() {
    setSaving(true);
    setError("");
    try {
      const data = new FormData();
      data.append("creatorName", form.creatorName.trim());
      data.append("partnerName", form.partnerName.trim());
      data.append("title", form.title.trim());
      data.append("occasion", form.occasion.trim());
      data.append("specialDate", form.specialDate);
      data.append("message", form.message.trim());
      data.append("themeId", String(form.themeId));
      data.append("musicId", String(form.musicId));
      if (form.creatorFile) data.append("creatorPhoto", form.creatorFile);
      if (form.partnerFile) data.append("partnerPhoto", form.partnerFile);
      if (form.coupleFile) data.append("couplePhoto", form.coupleFile);
      if (form.audioFile) data.append("audioFile", form.audioFile);
      data.append(
        "memories",
        JSON.stringify(
          form.memories.map((m) => ({
            title: m.title,
            description: m.description,
            date: m.date || null,
            hasPhoto: Boolean(m.file),
          }))
        )
      );
      form.memories.forEach((m) => {
        if (m.file) data.append("memoryPhotos", m.file);
      });
      const result = await createLovePage(data);
      navigate("/success", { state: result.page });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <PublicLayout>
      {/* Ambient background particles */}
      <HeartField count={30} dense />
      <RosePetals count={18} />

      <section className="wizard">
        <div className="card wizard-card">
          <div className="wizard-header-wrapper">
            <div className="royal-wizard-badge">
              👑 ROYAL LOVE SANCTUARY CREATOR
            </div>
            <h1 className="royal-wizard-title">Craft Your Eternal Love Sanctuary</h1>
            <div className="romantic-quote-ticker">
              <span>✨</span>
              <span>{ROMANTIC_QUOTES[quoteIndex]}</span>
              <span>✨</span>
            </div>
          </div>

          {/* Dynamic Love Couple Showcase Banner */}
          <div className="couple-showcase-banner">
            <div className="couple-avatar-slot">
              <div className="couple-avatar-frame">
                {form.creatorPreview ? (
                  <img src={form.creatorPreview} alt="Creator" />
                ) : (
                  activeAvatarPreset.creatorSvg
                )}
              </div>
              <span className="couple-avatar-name">{form.creatorName || "You"}</span>
            </div>

            <div className="couple-connector">
              <span className="couple-heart-badge">💖</span>
              <span className="couple-title-sub">{form.title || "Our Story"}</span>
            </div>

            <div className="couple-avatar-slot">
              <div className="couple-avatar-frame">
                {form.partnerPreview ? (
                  <img src={form.partnerPreview} alt="Partner" />
                ) : (
                  activeAvatarPreset.partnerSvg
                )}
              </div>
              <span className="couple-avatar-name">{form.partnerName || "Partner"}</span>
            </div>
          </div>

          {/* Stepper Navigation Tabs */}
          <div className="step-tabs">
            {tabIcons.map((tabLabel, idx) => (
              <button
                key={idx}
                type="button"
                className={`step-tab-btn ${step === idx ? "active" : ""} ${idx < step ? "done" : ""}`}
                onClick={() => {
                  if (idx <= step || canNext) setStep(idx);
                }}
              >
                {tabLabel}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: "0.82rem", color: "#ffd166", fontWeight: 600 }}>
              Step {step + 1} of 7: {labels[step]} Details
            </span>
            <span style={{ fontSize: "0.82rem", color: "#ff9ebb", fontWeight: 600 }}>
              {Math.round(((step + 1) / 7) * 100)}% Complete
            </span>
          </div>

          <div className="progress">
            {labels.map((_, i) => (
              <span key={i} className={i <= step ? "done" : ""} />
            ))}
          </div>

          <div className="wizard-split-layout">
            <div className="wizard-form-column">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.3 }}
                >
              {step === 0 && (
                <>
                  <p style={{ color: "var(--muted)", fontStyle: "italic", marginBottom: 18 }}>
                    Tell us about your love story — softly, honestly, from the bottom of your heart.
                  </p>

                  <div className="grid-2">
                    <div className="field">
                      <label htmlFor="creator">👤 Your Name</label>
                      <input
                        id="creator"
                        value={form.creatorName}
                        onChange={(e) => update({ creatorName: e.target.value })}
                        placeholder="e.g. Rahul"
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="partner">💖 Partner's Name</label>
                      <input
                        id="partner"
                        value={form.partnerName}
                        onChange={(e) => update({ partnerName: e.target.value })}
                        placeholder="e.g. Priya"
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label>🎉 Occasion Preset</label>
                    <div className="chip-grid">
                      {OCCASION_CHIPS.map((chip) => (
                        <button
                          key={chip.label}
                          type="button"
                          className={`chip-btn ${form.occasion === chip.label ? "selected" : ""}`}
                          onClick={() => update({ occasion: chip.label })}
                        >
                          <span>{chip.icon}</span>
                          <span>{chip.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="field">
                      <label htmlFor="occasion">🏷️ Custom Occasion Title</label>
                      <input
                        id="occasion"
                        value={form.occasion}
                        onChange={(e) => update({ occasion: e.target.value })}
                        placeholder="Valentine / Anniversary"
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="specialDate">📅 Special Anniversary Date</label>
                      <input
                        id="specialDate"
                        type="date"
                        value={form.specialDate}
                        onChange={(e) => update({ specialDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="title">💌 Relationship Title / Subtitle</label>
                    <input
                      id="title"
                      value={form.title}
                      onChange={(e) => update({ title: e.target.value })}
                      placeholder="Two hearts, one story"
                    />
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <p style={{ color: "var(--muted)", fontStyle: "italic", marginBottom: 16 }}>
                    Upload real photos of you both, or select an animated couple avatar style below.
                  </p>

                  <div className="grid-2" style={{ marginBottom: 20 }}>
                    <PhotoUploader
                      label="Your Photo"
                      hint="JPG PNG WEBP · camera or gallery"
                      file={form.creatorFile}
                      preview={form.creatorPreview}
                      onChange={(e) => onPhoto("creator", e)}
                      onClear={() => update({ creatorFile: null, creatorPreview: "" })}
                    />
                    <PhotoUploader
                      label="Their Photo"
                      hint="JPG PNG WEBP"
                      file={form.partnerFile}
                      preview={form.partnerPreview}
                      onChange={(e) => onPhoto("partner", e)}
                      onClear={() => update({ partnerFile: null, partnerPreview: "" })}
                    />
                  </div>

                  <PhotoUploader
                    label="Couple Photo (Together)"
                    hint="Optional special photo of you together"
                    file={form.coupleFile}
                    preview={form.couplePreview}
                    onChange={(e) => onPhoto("couple", e)}
                    onClear={() => update({ coupleFile: null, couplePreview: "" })}
                  />

                  {(!form.creatorPreview || !form.partnerPreview) && (
                    <div style={{ marginTop: 24 }}>
                      <p className="avatar-presets-title">✨ Or choose a romantic animated couple style:</p>
                      <div className="avatar-presets-grid">
                        {COUPLE_AVATARS.map((preset) => (
                          <div
                            key={preset.id}
                            className={`avatar-preset-card ${activeAvatarPreset.id === preset.id ? "selected" : ""}`}
                            onClick={() => setActiveAvatarPreset(preset)}
                          >
                            <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
                              {preset.creatorSvg}
                              {preset.partnerSvg}
                            </div>
                            <div className="avatar-preset-name">{preset.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {step === 2 && (
                <>
                  <p style={{ color: "var(--muted)", fontStyle: "italic", marginBottom: 16 }}>
                    Add special memories — your first meeting, first date, or a favorite journey together.
                  </p>
                  {form.memories.map((m, i) => (
                    <div
                      className="memory-edit-card"
                      key={i}
                      style={{
                        marginBottom: 18,
                        background: "rgba(35, 6, 22, 0.85)",
                        border: "1.5px solid rgba(255, 180, 205, 0.35)",
                        borderRadius: 24,
                        padding: 24,
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      <div className="field">
                        <label style={{ color: "#ff9ebb" }}>📖 Memory #{i + 1} Title</label>
                        <input
                          value={m.title}
                          onChange={(e) => patchMemory(i, { title: e.target.value })}
                          placeholder="e.g. First Date at Coffee Shop"
                        />
                      </div>
                      <div className="field">
                        <label style={{ color: "#ffebf5" }}>📝 What happened</label>
                        <textarea
                          value={m.description}
                          onChange={(e) => patchMemory(i, { description: e.target.value })}
                          placeholder="Tell the story of this memory..."
                        />
                      </div>
                      <div className="field">
                        <label style={{ color: "#ffebf5" }}>📅 Date</label>
                        <input
                          type="date"
                          value={m.date}
                          onChange={(e) => patchMemory(i, { date: e.target.value })}
                        />
                      </div>
                      <PhotoUploader
                        label="Memory Photo"
                        hint="Optional photo for this memory"
                        file={m.file}
                        preview={m.preview}
                        onChange={(e) => onMemoryPhoto(i, e)}
                        onClear={() => patchMemory(i, { file: null, preview: "" })}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-memory-btn"
                    onClick={addMemory}
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "999px",
                      background: "linear-gradient(135deg, rgba(255, 0, 85, 0.25), rgba(255, 79, 129, 0.35))",
                      border: "1.5px solid rgba(255, 180, 205, 0.5)",
                      color: "#ffffff",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      cursor: "pointer",
                      boxShadow: "0 6px 20px rgba(255, 0, 85, 0.25)",
                      transition: "all 0.25s ease",
                    }}
                  >
                    ✨ + Add Memory Highlight
                  </button>
                </>
              )}

              {step === 3 && (
                <div className="field">
                  <label htmlFor="message" style={{ fontSize: "1.1rem" }}>
                    Write something deep & romantic from your heart ❤️
                  </label>
                  <textarea
                    id="message"
                    maxLength={1000}
                    value={form.message}
                    onChange={(e) => update({ message: e.target.value })}
                    placeholder="Some people come into our lives and make everything more beautiful. You are my home, my favorite song, and my forever..."
                  />
                  <p className="hint">{form.message.length} / 1000 characters</p>
                </div>
              )}

              {step === 4 && (
                <>
                  <h3>🎵 Your Personal Love Song</h3>
                  <p className="hint">Upload your favorite song from your device. It plays when your partner opens the page.</p>
                  <div className="field">
                    <label htmlFor="audio">Upload Audio Track (MP3/MPEG/WAV/M4A)</label>
                    <input
                      id="audio"
                      type="file"
                      accept="audio/mpeg,audio/mp3,audio/x-mpeg,audio/wav,audio/mp4,audio/aac,audio/ogg,.mp3,.mpeg,.wav,.m4a"
                      onChange={onAudio}
                    />
                  </div>
                  {form.audioPreview ? <audio controls src={form.audioPreview} style={{ width: "100%", margin: "12px 0" }} /> : null}
                  {form.audioFile ? (
                    <button type="button" className="btn secondary" onClick={() => update({ audioFile: null, audioPreview: "" })} style={{ marginBottom: 18 }}>
                      Remove Song
                    </button>
                  ) : null}

                  <h3 style={{ marginTop: 24 }}>🎶 Or Choose from Admin Songs List</h3>
                  {music.length > 0 ? (
                    music.map((track) => (
                      <div
                        key={track.id}
                        className={`music-card ${form.musicId === track.id ? "selected" : ""}`}
                        onClick={() => update({ musicId: track.id })}
                        style={{
                          width: "100%",
                          marginBottom: 10,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 18px",
                          cursor: "pointer",
                          borderRadius: 16,
                          border: form.musicId === track.id ? "2px solid #ff4f81" : "1px solid rgba(255, 180, 205, 0.3)",
                          background: form.musicId === track.id ? "rgba(255, 79, 129, 0.25)" : "rgba(25, 4, 16, 0.75)",
                          transition: "all 0.2s ease"
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", gap: 2, textAlign: "left" }}>
                          <strong style={{ color: "#ffffff", fontSize: "0.95rem" }}>🎵 {track.title}</strong>
                          {track.artist && <span style={{ color: "rgba(255, 235, 245, 0.7)", fontSize: "0.82rem" }}>by {track.artist}</span>}
                          {track.tone && <span style={{ color: "#ff9ebb", fontSize: "0.78rem" }}>Vibe: {track.tone}</span>}
                        </div>
                        {track.file_url ? (
                          <audio controls src={track.file_url} style={{ height: 32, maxWidth: 200 }} onClick={(e) => e.stopPropagation()} />
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <p className="hint">No preset songs available in library.</p>
                  )}
                </>
              )}

              {step === 5 && (
                <div>
                  <h3 style={{ marginBottom: 8 }}>🎨 Select Aesthetic Vibe</h3>
                  <p className="hint" style={{ marginBottom: 16 }}>Choose how your love sanctuary will look and feel to your partner.</p>
                  <div className="theme-grid">
                    {themes.map((theme) => (
                      <button
                        type="button"
                        key={theme.id}
                        className={`theme-card ${form.themeId === theme.id ? "selected" : ""}`}
                        onClick={() => update({ themeId: theme.id })}
                      >
                        <div
                          className="swatch"
                          style={{
                            background: `linear-gradient(135deg, ${theme.config.primary}, ${theme.config.background})`,
                          }}
                        />
                        <strong style={{ fontSize: "0.95rem" }}>{theme.name}</strong>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 6 && (
                <>
                  <LovePreview
                    data={{
                      creatorName: form.creatorName,
                      partnerName: form.partnerName,
                      title: form.title,
                      message: form.message,
                      creatorPreview: form.creatorPreview,
                      partnerPreview: form.partnerPreview,
                    }}
                  />
                  <p className="hint" style={{ marginTop: 12, textAlign: "center" }}>
                    🎉 {form.occasion} · {selectedTheme?.name}{form.audioFile ? " · Personal Song Attached" : ""}
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
            </div>

            {/* Sticky Royal Live Preview Column */}
            <div className="wizard-preview-column">
              <RoyalLiveSanctuaryCard
                form={form}
                activeAvatarPreset={activeAvatarPreset}
                selectedTheme={selectedTheme}
                music={music}
              />
            </div>
          </div>

          {error ? <p className="error">{error}</p> : null}

          <div className="row-actions">
            <button
              type="button"
              className="btn secondary"
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
            >
              ← Back
            </button>
            {step < 6 ? (
              <button
                type="button"
                className="btn"
                disabled={!canNext}
                onClick={() => setStep((s) => s + 1)}
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                className="btn glow"
                disabled={saving || !canNext}
                onClick={submit}
              >
                {saving ? "Creating sanctuary..." : "Create Love Sanctuary ❤️"}
              </button>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
