import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  adminAddMusic,
  adminAddTheme,
  adminDeleteMusic,
  adminDeletePage,
  adminDeleteTheme,
  adminExtendPage,
  adminGetPageLogs,
  adminLogs,
  adminLogout,
  adminMe,
  adminMusic,
  adminPages,
  adminStats,
  adminThemes,
  adminTogglePageStatus,
  adminToggleThemeStatus,
  adminToggleUserStatus,
  adminUpdateAccount,
  adminUpdatePage,
  adminUpdateTheme,
  adminUsers,
  adminMessages,
  adminUpdateMessageStatus,
  adminDeleteMessage,
  adminPayments,
  adminUpdatePaymentStatus,
  adminTogglePageUnlock,
  adminDeletePayment,
  adminGetPaymentSettings,
  adminUpdatePaymentSettings,
} from "../../services/api.js";
import defaultQrImage from "../../assets/qr_phonepe.png";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Stats & Data state
  const [stats, setStats] = useState(null);
  const [pages, setPages] = useState([]);
  const [users, setUsers] = useState([]);
  const [music, setMusic] = useState([]);
  const [themes, setThemes] = useState([]);
  const [logs, setLogs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [payments, setPayments] = useState([]);

  // Payment Settings State
  const [paymentSettings, setPaymentSettings] = useState({ upiId: "lovedoes@ybl", qrCodeUrl: "" });
  const [paymentSettingsForm, setPaymentSettingsForm] = useState({
    upiId: "lovedoes@ybl",
    file: null,
    previewUrl: "",
  });
  const [savingPaymentSettings, setSavingPaymentSettings] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [occasionFilter, setOccasionFilter] = useState("all");
  const [messageFilter, setMessageFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  // UI state
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [editingPage, setEditingPage] = useState(null);
  const [previewSlug, setPreviewSlug] = useState(null);
  const [previewDevice, setPreviewDevice] = useState("desktop"); // "desktop" or "mobile"

  // New Music Track Form State
  const [newTrack, setNewTrack] = useState({ title: "", artist: "", file_url: "", tone: "romantic" });
  const [uploadMode, setUploadMode] = useState("multiple"); // "multiple", "file", or "url"
  const [audioFile, setAudioFile] = useState(null);
  const [audioFilePreview, setAudioFilePreview] = useState("");
  const [batchFileItems, setBatchFileItems] = useState([]); // [{ file, name, size, title, previewUrl }]
  const [addingMusic, setAddingMusic] = useState(false);

  // Account Settings Form State
  const [accountForm, setAccountForm] = useState({ email: "", currentPassword: "", newPassword: "" });
  const [updatingAccount, setUpdatingAccount] = useState(false);

  // Visitor Viewers Modal State
  const [viewersModal, setViewersModal] = useState({ open: false, loading: false, page: null, logs: [] });

  async function handleOpenViewersModal(page) {
    setViewersModal({ open: true, loading: true, page, logs: [] });
    try {
      const res = await adminGetPageLogs(page.id);
      setViewersModal({ open: true, loading: false, page, logs: res.logs || [] });
    } catch (err) {
      showToast(err.message || "Could not fetch visitor logs for page.", "error");
      setViewersModal({ open: false, loading: false, page: null, logs: [] });
    }
  }

  // Theme & Background Image Modal State
  const [themeModal, setThemeModal] = useState({ open: false, isEditing: false, themeId: null });
  const [themeForm, setThemeForm] = useState({
    name: "",
    slug: "",
    primary: "#ff4f81",
    background: "#fff1f5",
    accent: "#c9184a",
    font: "Playfair Display",
    animation: "hearts",
    backgroundImage: "",
    file: null,
    previewUrl: "",
  });
  const [savingTheme, setSavingTheme] = useState(false);

  function handleOpenAddTheme() {
    setThemeForm({
      name: "",
      slug: "",
      primary: "#ff4f81",
      background: "#fff1f5",
      accent: "#c9184a",
      font: "Playfair Display",
      animation: "hearts",
      backgroundImage: "",
      file: null,
      previewUrl: "",
    });
    setThemeModal({ open: true, isEditing: false, themeId: null });
  }

  function handleOpenEditTheme(t) {
    let cfg = {};
    try {
      cfg = typeof t.config === "string" ? JSON.parse(t.config) : (t.config || {});
    } catch {
      cfg = {};
    }
    setThemeForm({
      name: t.name || "",
      slug: t.slug || "",
      primary: cfg.primary || "#ff4f81",
      background: cfg.background || "#fff1f5",
      accent: cfg.accent || "#c9184a",
      font: cfg.font || "Playfair Display",
      animation: cfg.animation || "hearts",
      backgroundImage: cfg.backgroundImage || t.thumbnail || "",
      file: null,
      previewUrl: cfg.backgroundImage || t.thumbnail || "",
    });
    setThemeModal({ open: true, isEditing: true, themeId: t.id });
  }

  function handleThemeFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file (JPEG, PNG, WEBP).", "error");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setThemeForm((prev) => ({
      ...prev,
      file,
      previewUrl,
    }));
  }

  async function handleSaveTheme(e) {
    e.preventDefault();
    if (!themeForm.name.trim()) {
      showToast("Please enter a theme name.", "error");
      return;
    }
    setSavingTheme(true);

    try {
      const formData = new FormData();
      formData.append("name", themeForm.name.trim());
      formData.append("slug", themeForm.slug.trim() || themeForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
      formData.append("primary", themeForm.primary);
      formData.append("background", themeForm.background);
      formData.append("accent", themeForm.accent);
      formData.append("font", themeForm.font);
      formData.append("animation", themeForm.animation);

      if (themeForm.backgroundImage && !themeForm.file) {
        formData.append("backgroundImage", themeForm.backgroundImage);
      }
      if (themeForm.file) {
        formData.append("image", themeForm.file);
      }

      let res;
      if (themeModal.isEditing) {
        res = await adminUpdateTheme(themeModal.themeId, formData);
      } else {
        res = await adminAddTheme(formData);
      }

      if (res.success) {
        showToast(res.message || "Theme & background image saved successfully!");
        setThemeModal({ open: false, isEditing: false, themeId: null });
        const tRes = await adminThemes();
        setThemes(tRes.themes || []);
      } else {
        showToast(res.error || "Failed to save theme.", "error");
      }
    } catch (err) {
      showToast(err.message || "An error occurred while saving theme.", "error");
    } finally {
      setSavingTheme(false);
    }
  }

  async function handleToggleThemeStatus(t) {
    const nextStatus = t.status === "active" ? "inactive" : "active";
    try {
      const res = await adminToggleThemeStatus(t.id, nextStatus);
      if (res.success) {
        showToast(`Theme status changed to ${nextStatus}.`);
        setThemes((prev) => prev.map((item) => (item.id === t.id ? { ...item, status: nextStatus } : item)));
      } else {
        showToast(res.error || "Could not update status.", "error");
      }
    } catch (err) {
      showToast(err.message || "Failed to toggle status.", "error");
    }
  }

  async function handleDeleteTheme(id) {
    if (!window.confirm("Are you sure you want to delete this theme/background?")) return;
    try {
      const res = await adminDeleteTheme(id);
      if (res.success) {
        showToast("Theme deleted successfully.");
        setThemes((prev) => prev.filter((item) => item.id !== id));
      } else {
        showToast(res.error || "Could not delete theme.", "error");
      }
    } catch (err) {
      showToast(err.message || "Failed to delete theme.", "error");
    }
  }

  // Initial Auth & Data Load
  useEffect(() => {
    loadAllData();
  }, [navigate]);

  async function loadAllData() {
    setLoading(true);
    try {
      const meRes = await adminMe();
      setAdminUser(meRes.admin);
      setAccountForm((prev) => ({ ...prev, email: meRes.admin.email || "" }));

      const [sRes, pRes, uRes, mRes, tRes, lRes, msgRes, payRes, paySetRes] = await Promise.allSettled([
        adminStats(),
        adminPages(),
        adminUsers(),
        adminMusic(),
        adminThemes(),
        adminLogs(),
        adminMessages(),
        adminPayments(),
        adminGetPaymentSettings(),
      ]);

      if (sRes.status === "fulfilled") setStats(sRes.value.stats);
      if (pRes.status === "fulfilled") setPages(pRes.value.pages || []);
      if (uRes.status === "fulfilled") setUsers(uRes.value.users || []);
      if (mRes.status === "fulfilled") setMusic(mRes.value.tracks || []);
      if (tRes.status === "fulfilled") setThemes(tRes.value.themes || []);
      if (lRes.status === "fulfilled") setLogs(lRes.value.logs || []);
      if (msgRes.status === "fulfilled") setMessages(msgRes.value.messages || []);
      if (payRes.status === "fulfilled") setPayments(payRes.value.payments || []);
      if (paySetRes.status === "fulfilled" && paySetRes.value?.settings) {
        const s = paySetRes.value.settings;
        setPaymentSettings({ upiId: s.upiId || "lovedoes@ybl", qrCodeUrl: s.qrCodeUrl || "" });
        setPaymentSettingsForm((prev) => ({
          ...prev,
          upiId: s.upiId || "lovedoes@ybl",
          previewUrl: s.qrCodeUrl || "",
        }));
      }
    } catch {
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  }

  // Payment QR & UPI Settings Handlers
  function handlePaymentQrFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file (JPEG, PNG, WEBP).", "error");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setPaymentSettingsForm((prev) => ({
      ...prev,
      file,
      previewUrl,
    }));
  }

  async function handleSavePaymentSettings(e) {
    e.preventDefault();
    if (!paymentSettingsForm.upiId.trim()) {
      showToast("Please enter a valid UPI ID.", "error");
      return;
    }
    setSavingPaymentSettings(true);
    try {
      const formData = new FormData();
      formData.append("upiId", paymentSettingsForm.upiId.trim());
      if (paymentSettingsForm.file) {
        formData.append("image", paymentSettingsForm.file);
      }

      const res = await adminUpdatePaymentSettings(formData);
      if (res.success) {
        showToast(res.message || "Payment QR Code image and UPI ID updated successfully! 🎉");
        const newSettings = res.settings || { upiId: paymentSettingsForm.upiId, qrCodeUrl: paymentSettingsForm.previewUrl };
        setPaymentSettings(newSettings);
        setPaymentSettingsForm((prev) => ({
          ...prev,
          upiId: newSettings.upiId,
          file: null,
          previewUrl: newSettings.qrCodeUrl || prev.previewUrl,
        }));
      } else {
        showToast(res.error || "Failed to update payment settings.", "error");
      }
    } catch (err) {
      showToast(err.message || "Failed to update payment settings.", "error");
    } finally {
      setSavingPaymentSettings(false);
    }
  }

  // Payment Verification & Page Unlock Handlers
  async function handleUpdatePaymentStatus(id, status) {
    try {
      const res = await adminUpdatePaymentStatus(id, status);
      if (res.success) {
        showToast(res.message || `Payment status updated to '${status}'.`);
        setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
        const [pRes, sRes] = await Promise.all([adminPages(), adminStats()]);
        if (pRes.success) setPages(pRes.pages);
        if (sRes.success) setStats(sRes.stats);
      } else {
        showToast(res.error || "Failed to update payment status.", "error");
      }
    } catch (err) {
      showToast(err.message || "Failed to update payment status.", "error");
    }
  }

  async function handleTogglePageUnlock(id, currentUnlocked) {
    const nextUnlocked = !currentUnlocked;
    try {
      const res = await adminTogglePageUnlock(id, nextUnlocked);
      if (res.success) {
        showToast(nextUnlocked ? "Page unlocked for unlimited lifetime access! 🔓" : "Page access reset to 3 free views limit 🔒");
        setPages((prev) => prev.map((p) => (p.id === id ? { ...p, is_unlocked: nextUnlocked ? 1 : 0 } : p)));
      } else {
        showToast(res.error || "Failed to change page unlock status.", "error");
      }
    } catch (err) {
      showToast(err.message || "Failed to change page unlock status.", "error");
    }
  }

  async function handleDeletePayment(id) {
    if (!window.confirm("Are you sure you want to delete this payment record?")) return;
    try {
      const res = await adminDeletePayment(id);
      if (res.success) {
        showToast("Payment record deleted.");
        setPayments((prev) => prev.filter((p) => p.id !== id));
      } else {
        showToast(res.error || "Failed to delete payment record.", "error");
      }
    } catch (err) {
      showToast(err.message || "Failed to delete payment record.", "error");
    }
  }

  // Message Handlers
  async function handleUpdateMessageStatus(id, status) {
    try {
      const res = await adminUpdateMessageStatus(id, status);
      if (res.success) {
        showToast(`Message marked as ${status}.`);
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage((prev) => (prev ? { ...prev, status } : null));
        }
      } else {
        showToast(res.error || "Failed to update status", "error");
      }
    } catch (err) {
      showToast(err.message || "Failed to update status", "error");
    }
  }

  async function handleDeleteMessage(id) {
    if (!window.confirm("Are you sure you want to delete this contact message?")) return;
    try {
      const res = await adminDeleteMessage(id);
      if (res.success) {
        showToast("Contact message deleted.");
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage(null);
        }
      } else {
        showToast(res.error || "Failed to delete message", "error");
      }
    } catch (err) {
      showToast(err.message || "Failed to delete message", "error");
    }
  }

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 4000);
  }

  async function handleLogout() {
    await adminLogout();
    navigate("/admin/login");
  }

  // Reload Pages with Filters
  async function reloadPages() {
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (statusFilter !== "all") params.status = statusFilter;
    if (occasionFilter !== "all") params.occasion = occasionFilter;
    try {
      const pRes = await adminPages(params);
      setPages(pRes.pages || []);
    } catch (err) {
      showToast(err.message || "Failed to filter pages", "error");
    }
  }

  useEffect(() => {
    if (activeTab === "pages") {
      reloadPages();
    }
  }, [searchQuery, statusFilter, occasionFilter]);

  // Page Action Handlers
  async function handleToggleStatus(pageId, currentStatus) {
    const nextStatus = currentStatus === "active" ? "disabled" : "active";
    try {
      await adminTogglePageStatus(pageId, nextStatus);
      showToast(`Page status updated to ${nextStatus.toUpperCase()}`);
      setPages((prev) =>
        prev.map((p) => (p.id === pageId ? { ...p, status: nextStatus } : p))
      );
    } catch (err) {
      showToast(err.message || "Status toggle failed", "error");
    }
  }

  async function handleExtendPage(pageId, days) {
    try {
      const res = await adminExtendPage(pageId, days);
      showToast(`Extended page for ${days > 0 ? days + " days" : "Unlimited"}`);
      setPages((prev) =>
        prev.map((p) =>
          p.id === pageId
            ? { ...p, status: "active", expires_at: res.expires_at }
            : p
        )
      );
    } catch (err) {
      showToast(err.message || "Extension failed", "error");
    }
  }

  async function handleDeletePage(pageId, slug) {
    if (!window.confirm(`Are you sure you want to permanently delete love page '${slug}'?`)) {
      return;
    }
    try {
      await adminDeletePage(pageId);
      showToast(`Love page '${slug}' deleted successfully`);
      setPages((prev) => prev.filter((p) => p.id !== pageId));
    } catch (err) {
      showToast(err.message || "Deletion failed", "error");
    }
  }

  async function handleSaveEditedPage(e) {
    e.preventDefault();
    if (!editingPage) return;
    try {
      const res = await adminUpdatePage(editingPage.id, editingPage);
      showToast("Love page updated successfully!");
      setPages((prev) =>
        prev.map((p) => (p.id === editingPage.id ? { ...p, ...res.page } : p))
      );
      setEditingPage(null);
    } catch (err) {
      showToast(err.message || "Update failed", "error");
    }
  }

  // User Action Handlers
  async function handleToggleUser(userId, currentStatus) {
    const nextStatus = currentStatus === "active" ? "blocked" : "active";
    try {
      await adminToggleUserStatus(userId, nextStatus);
      showToast(`User account set to ${nextStatus.toUpperCase()}`);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
      );
    } catch (err) {
      showToast(err.message || "User toggle failed", "error");
    }
  }

  // Music Handlers
  function handleSongFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 12 * 1024 * 1024) {
      showToast("Audio file size must be under 12 MB", "error");
      return;
    }
    setAudioFile(file);
    setAudioFilePreview(URL.createObjectURL(file));
    if (!newTrack.title) {
      const rawName = file.name.replace(/\.[^/.]+$/, "");
      setNewTrack((prev) => ({ ...prev, title: rawName }));
    }
  }

  function handleBatchFilesSelect(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const validItems = [];
    let oversizedCount = 0;

    files.forEach((file) => {
      if (file.size > 12 * 1024 * 1024) {
        oversizedCount++;
        return;
      }
      const rawName = file.name.replace(/\.[^/.]+$/, "");
      validItems.push({
        file,
        name: file.name,
        size: file.size,
        title: rawName,
        previewUrl: URL.createObjectURL(file),
      });
    });

    if (oversizedCount > 0) {
      showToast(`${oversizedCount} file(s) skipped because they exceed 12 MB size limit`, "error");
    }

    if (validItems.length > 0) {
      setBatchFileItems((prev) => {
        const combined = [...prev, ...validItems];
        if (combined.length > 100) {
          showToast("Batch queue capped at maximum 100 songs per upload", "error");
          return combined.slice(0, 100);
        }
        return combined;
      });
    }
  }

  function handleBatchTitleChange(index, newTitle) {
    setBatchFileItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, title: newTitle } : item))
    );
  }

  function handleRemoveBatchFile(index) {
    setBatchFileItems((prev) => prev.filter((_, i) => i !== index));
  }

  function resetMusicForm() {
    setNewTrack({ title: "", artist: "", file_url: "", tone: "romantic" });
    setAudioFile(null);
    setAudioFilePreview("");
    setBatchFileItems([]);
  }

  async function handleAddMusicTrack(e) {
    e.preventDefault();

    if (uploadMode === "multiple") {
      if (batchFileItems.length === 0) {
        showToast("Please select at least one audio file to upload", "error");
        return;
      }
      setAddingMusic(true);
      try {
        const data = new FormData();
        batchFileItems.forEach((item) => {
          data.append("audioFiles", item.file);
        });
        const titles = batchFileItems.map((item) => item.title.trim() || item.name);
        data.append("titles", JSON.stringify(titles));
        data.append("artist", newTrack.artist.trim());
        data.append("tone", newTrack.tone);

        await adminAddMusic(data);
        showToast(`🎉 Successfully uploaded ${batchFileItems.length} songs to list!`);
        resetMusicForm();
        const mRes = await adminMusic();
        setMusic(mRes.tracks || []);
      } catch (err) {
        showToast(err.message || "Failed to upload batch songs", "error");
      } finally {
        setAddingMusic(false);
      }
    } else if (uploadMode === "file") {
      if (!audioFile) {
        showToast("Please select an audio file to upload", "error");
        return;
      }
      if (!newTrack.title) {
        showToast("Track title is required", "error");
        return;
      }
      setAddingMusic(true);
      try {
        const data = new FormData();
        data.append("audioFile", audioFile);
        data.append("title", newTrack.title.trim());
        data.append("artist", newTrack.artist.trim());
        data.append("tone", newTrack.tone);
        await adminAddMusic(data);
        showToast("Song uploaded and added to list of songs!");
        resetMusicForm();
        const mRes = await adminMusic();
        setMusic(mRes.tracks || []);
      } catch (err) {
        showToast(err.message || "Failed to upload song file", "error");
      } finally {
        setAddingMusic(false);
      }
    } else {
      if (!newTrack.title || !newTrack.file_url) {
        showToast("Title and Audio URL are required", "error");
        return;
      }
      setAddingMusic(true);
      try {
        await adminAddMusic(newTrack);
        showToast("Soundtrack added to list of songs!");
        resetMusicForm();
        const mRes = await adminMusic();
        setMusic(mRes.tracks || []);
      } catch (err) {
        showToast(err.message || "Failed to add music track", "error");
      } finally {
        setAddingMusic(false);
      }
    }
  }

  async function handleDeleteMusicTrack(musicId, title) {
    if (!window.confirm(`Delete soundtrack '${title}'?`)) return;
    try {
      await adminDeleteMusic(musicId);
      showToast(`Track '${title}' removed`);
      setMusic((prev) => prev.filter((m) => m.id !== musicId));
    } catch (err) {
      showToast(err.message || "Failed to delete track", "error");
    }
  }

  // Account Settings Handler
  async function handleUpdateAccountSubmit(e) {
    e.preventDefault();
    setUpdatingAccount(true);
    try {
      await adminUpdateAccount(accountForm);
      showToast("Admin security & account settings updated!");
      setAccountForm((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
    } catch (err) {
      showToast(err.message || "Account update failed", "error");
    } finally {
      setUpdatingAccount(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-shell" style={{ display: "grid", placeItems: "center", minHeight: "80vh" }}>
        <div className="admin-loading-card">
          <div className="spinner" />
          <p>Loading Admin Control Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-root">
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast.message && (
          <motion.div
            className={`admin-toast ${toast.type}`}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <span>{toast.type === "success" ? "✅" : "⚠️"}</span>
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER BAR */}
      <header className="admin-top-bar">
        <div className="admin-brand">
          <div className="admin-logo-icon">👑</div>
          <div>
            <h1 className="admin-brand-title">LoveDoes Control Center</h1>
            <span className="admin-brand-sub">Master Management System</span>
          </div>
        </div>

        <div className="admin-top-actions">
          <div className="admin-clock-badge">
            <span>📅</span>
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="system-health-badge">
            <span className="pulse-dot" />
            <span>DB Online</span>
          </div>
          <div className="admin-user-pill">
            <span className="avatar">🛡️</span>
            <span className="email">{adminUser?.email || "admin@lovedoes.local"}</span>
          </div>
          <button type="button" className="btn secondary admin-logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="admin-container">
        {/* SIDEBAR NAVIGATION */}
        <aside className="admin-sidebar">
          <div>
            <div className="admin-nav-group">
              <h4 className="admin-nav-group-title">MAIN DASHBOARD</h4>
              <nav className="admin-nav">
                <button
                  type="button"
                  className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
                  onClick={() => setActiveTab("overview")}
                >
                  <div className="nav-item-content">
                    <span className="nav-icon">📊</span>
                    <span>Overview & Analytics</span>
                  </div>
                </button>
              </nav>
            </div>

            <div className="admin-nav-group">
              <h4 className="admin-nav-group-title">SANCTUARY CONTENT</h4>
              <nav className="admin-nav">
                <button
                  type="button"
                  className={`nav-item ${activeTab === "pages" ? "active" : ""}`}
                  onClick={() => setActiveTab("pages")}
                >
                  <div className="nav-item-content">
                    <span className="nav-icon">💌</span>
                    <span>Love Pages</span>
                  </div>
                  <span className="nav-badge-pill">{pages.length}</span>
                </button>

                <button
                  type="button"
                  className={`nav-item ${activeTab === "music" ? "active" : ""}`}
                  onClick={() => setActiveTab("music")}
                >
                  <div className="nav-item-content">
                    <span className="nav-icon">🎵</span>
                    <span>Soundtracks</span>
                  </div>
                  <span className="nav-badge-pill">{music.length}</span>
                </button>

                <button
                  type="button"
                  className={`nav-item ${activeTab === "themes" ? "active" : ""}`}
                  onClick={() => setActiveTab("themes")}
                >
                  <div className="nav-item-content">
                    <span className="nav-icon">🎨</span>
                    <span>Themes & Styles</span>
                  </div>
                  <span className="nav-badge-pill">{themes.length}</span>
                </button>
              </nav>
            </div>

            <div className="admin-nav-group">
              <h4 className="admin-nav-group-title">FINANCE & AUDIT</h4>
              <nav className="admin-nav">
                <button
                  type="button"
                  className={`nav-item ${activeTab === "payments" ? "active" : ""}`}
                  onClick={() => setActiveTab("payments")}
                >
                  <div className="nav-item-content">
                    <span className="nav-icon">💰</span>
                    <span>Payments</span>
                  </div>
                  {payments.filter((p) => p.status === "pending").length > 0 ? (
                    <span className="nav-badge-pill alert">
                      {payments.filter((p) => p.status === "pending").length} Pending
                    </span>
                  ) : (
                    <span className="nav-badge-pill">{payments.length}</span>
                  )}
                </button>

                <button
                  type="button"
                  className={`nav-item ${activeTab === "logs" ? "active" : ""}`}
                  onClick={() => setActiveTab("logs")}
                >
                  <div className="nav-item-content">
                    <span className="nav-icon">👁️</span>
                    <span>Visitor Logs</span>
                  </div>
                  <span className="nav-badge-pill">{logs.length}</span>
                </button>
              </nav>
            </div>

            <div className="admin-nav-group">
              <h4 className="admin-nav-group-title">COMMUNICATION & SYSTEM</h4>
              <nav className="admin-nav">
                <button
                  type="button"
                  className={`nav-item ${activeTab === "users" ? "active" : ""}`}
                  onClick={() => setActiveTab("users")}
                >
                  <div className="nav-item-content">
                    <span className="nav-icon">👥</span>
                    <span>Users</span>
                  </div>
                  <span className="nav-badge-pill">{users.length}</span>
                </button>

                <button
                  type="button"
                  className={`nav-item ${activeTab === "messages" ? "active" : ""}`}
                  onClick={() => setActiveTab("messages")}
                >
                  <div className="nav-item-content">
                    <span className="nav-icon">📬</span>
                    <span>Love Notes</span>
                  </div>
                  {messages.filter((m) => m.status === "unread").length > 0 ? (
                    <span className="nav-badge-pill alert">
                      {messages.filter((m) => m.status === "unread").length} new
                    </span>
                  ) : (
                    <span className="nav-badge-pill">{messages.length}</span>
                  )}
                </button>

                <button
                  type="button"
                  className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
                  onClick={() => setActiveTab("settings")}
                >
                  <div className="nav-item-content">
                    <span className="nav-icon">⚙️</span>
                    <span>Security & Account</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>
        </aside>

        {/* CONTENT AREA */}
        <main className="admin-content-area">
          {/* TAB 1: OVERVIEW & ANALYTICS */}
          {activeTab === "overview" && stats && (
            <div className="admin-tab-pane">
              {/* HERO WELCOME BANNER CARD */}
              <div className="admin-welcome-banner">
                <div className="welcome-text">
                  <h2>Welcome back, Admin 👋</h2>
                  <p>LoveDoes Control Center is operational. Monitor statistics, verify ₹99 payments, and manage sanctuaries.</p>
                </div>
                <div className="quick-shortcuts-row">
                  <button type="button" className="quick-btn" onClick={() => setActiveTab("music")}>
                    <span>🎵 Upload Songs</span>
                  </button>
                  <button type="button" className="quick-btn" onClick={() => setActiveTab("themes")}>
                    <span>🎨 Custom Theme</span>
                  </button>
                  <button type="button" className="quick-btn" onClick={() => setActiveTab("payments")}>
                    <span>💳 Payments ({payments.filter((p) => p.status === "pending").length})</span>
                  </button>
                  <button type="button" className="quick-btn" onClick={() => setActiveTab("messages")}>
                    <span>📬 Whispers ({messages.filter((m) => m.status === "unread").length})</span>
                  </button>
                </div>
              </div>

              <h2 className="pane-title">📊 System Metrics & Analytics</h2>

              <div className="stats-grid">
                <div className="stat-card gold">
                  <div className="stat-icon">💌</div>
                  <div className="stat-info">
                    <span className="stat-label">Total Love Pages</span>
                    <strong className="stat-value">{stats.total}</strong>
                    <span className="stat-trend">📈 Active Growth</span>
                  </div>
                </div>

                <div className="stat-card green">
                  <div className="stat-icon">🟢</div>
                  <div className="stat-info">
                    <span className="stat-label">Active Pages</span>
                    <strong className="stat-value">{stats.active}</strong>
                    <span className="stat-trend">✨ {Math.round((stats.active / (stats.total || 1)) * 100)}% Online Rate</span>
                  </div>
                </div>

                <div className="stat-card blue">
                  <div className="stat-icon">👁️</div>
                  <div className="stat-info">
                    <span className="stat-label">Total Page Views</span>
                    <strong className="stat-value">{stats.totalViews.toLocaleString()}</strong>
                    <span className="stat-trend">🔥 High Engagement</span>
                  </div>
                </div>

                <div className="stat-card purple">
                  <div className="stat-icon">✨</div>
                  <div className="stat-info">
                    <span className="stat-label">Created Today</span>
                    <strong className="stat-value">{stats.today}</strong>
                    <span className="stat-trend">⚡ Live Record</span>
                  </div>
                </div>

                <div className="stat-card pink">
                  <div className="stat-icon">📸</div>
                  <div className="stat-info">
                    <span className="stat-label">Photos Uploaded</span>
                    <strong className="stat-value">{stats.photosCount}</strong>
                    <span className="stat-trend">🖼️ Media Storage</span>
                  </div>
                </div>

                <div className="stat-card orange">
                  <div className="stat-icon">💖</div>
                  <div className="stat-info">
                    <span className="stat-label">Memories Shared</span>
                    <strong className="stat-value">{stats.memoriesCount}</strong>
                    <span className="stat-trend">💎 Precious Moments</span>
                  </div>
                </div>
              </div>

              {/* TOP OCCASIONS BREAKDOWN */}
              <div className="admin-card" style={{ marginTop: 24 }}>
                <h3>Popular Occasions Breakdown</h3>
                <div className="occasions-bar-list">
                  {stats.topOccasions && stats.topOccasions.length > 0 ? (
                    stats.topOccasions.map((occ) => (
                      <div key={occ.occasion} className="occasion-bar-item">
                        <div className="occ-header">
                          <span className="occ-name">💖 {occ.occasion}</span>
                          <span className="occ-count">{occ.count} pages ({Math.round((occ.count / (stats.total || 1)) * 100)}%)</span>
                        </div>
                        <div className="occ-progress-track">
                          <div
                            className="occ-progress-fill"
                            style={{ width: `${Math.min(100, (occ.count / (stats.total || 1)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="subtext">No occasion data recorded yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOVE PAGES CONTROL CENTER */}
          {activeTab === "pages" && (
            <div className="admin-tab-pane">
              <div className="pane-header-row">
                <h2 className="pane-title">Love Pages Manager ({pages.length})</h2>

                {/* SEARCH & FILTERS */}
                <div className="filters-bar">
                  <input
                    type="text"
                    className="admin-input search-input"
                    placeholder="🔍 Search names, titles, slugs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <select
                    className="admin-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active Only</option>
                    <option value="disabled">Disabled Only</option>
                    <option value="expired">Expired Only</option>
                  </select>

                  <select
                    className="admin-select"
                    value={occasionFilter}
                    onChange={(e) => setOccasionFilter(e.target.value)}
                  >
                    <option value="all">All Occasions</option>
                    <option value="Valentine's Day">Valentine's Day</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Proposal">Proposal</option>
                  </select>

                  <button type="button" className="btn secondary" onClick={loadAllData}>
                    🔄 Refresh
                  </button>
                </div>
              </div>

              {/* LOVE PAGES TABLE */}
              <div className="admin-card table-card">
                <div className="table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Couple Names</th>
                        <th>Slug & Occasion</th>
                        <th>Views</th>
                        <th>Paywall Access</th>
                        <th>Status</th>
                        <th>Created Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pages.length > 0 ? (
                        pages.map((p) => (
                          <tr key={p.id} className={p.status === "disabled" ? "disabled-row" : ""}>
                            <td>
                              <div className="couple-cell">
                                <strong>{p.creator_name} ❤️ {p.partner_name}</strong>
                                {p.title && <span className="cell-sub">{p.title}</span>}
                              </div>
                            </td>

                            <td>
                              <div className="slug-cell">
                                <a
                                  href={`/love/${p.slug}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="slug-link"
                                >
                                  /love/{p.slug} ↗
                                </a>
                                <span className="badge-tag">{p.occasion || "Love"}</span>
                              </div>
                            </td>

                            <td>
                              <span
                                className="views-badge"
                                style={{ cursor: "pointer", background: "rgba(255, 158, 187, 0.15)", border: "1px solid rgba(255, 158, 187, 0.3)", color: "#ff9ebb" }}
                                title="Click to view visitor details for this page"
                                onClick={() => handleOpenViewersModal(p)}
                              >
                                👁️ {p.views}
                              </span>
                            </td>

                            <td>
                              <button
                                type="button"
                                className="action-btn"
                                style={{
                                  padding: "4px 10px",
                                  fontSize: "0.78rem",
                                  fontWeight: 600,
                                  background: p.is_unlocked ? "rgba(46, 204, 113, 0.2)" : "rgba(241, 196, 15, 0.2)",
                                  color: p.is_unlocked ? "#2ecc71" : "#f1c40f",
                                  border: p.is_unlocked ? "1px solid rgba(46, 204, 113, 0.5)" : "1px solid rgba(241, 196, 15, 0.5)",
                                }}
                                title={p.is_unlocked ? "Click to lock page to 3 free views limit" : "Click to give unlimited access to this page"}
                                onClick={() => handleTogglePageUnlock(p.id, Boolean(p.is_unlocked))}
                              >
                                {p.is_unlocked ? "🔓 Unlocked" : "🔒 3 Free Views"}
                              </button>
                            </td>

                            <td>
                              <span className={`status-pill ${p.status}`}>
                                {p.status}
                              </span>
                            </td>

                            <td>
                              <span className="date-cell">
                                {new Date(p.created_at).toLocaleDateString()}
                              </span>
                            </td>

                            <td>
                              <div className="action-buttons-group">
                                <button
                                  type="button"
                                  className="action-btn viewers"
                                  title="See who viewed this love page"
                                  style={{ background: "rgba(255, 158, 187, 0.2)", color: "#ff9ebb", border: "1px solid rgba(255, 158, 187, 0.4)" }}
                                  onClick={() => handleOpenViewersModal(p)}
                                >
                                  👥 Viewers
                                </button>

                                <button
                                  type="button"
                                  className="action-btn preview"
                                  title="Live Preview"
                                  onClick={() => setPreviewSlug(p.slug)}
                                >
                                  👁️ Preview
                                </button>

                                <button
                                  type="button"
                                  className="action-btn edit"
                                  title="Edit Love Page"
                                  onClick={() => setEditingPage(p)}
                                >
                                  ✏️ Edit
                                </button>

                                <button
                                  type="button"
                                  className={`action-btn ${p.status === "active" ? "disable" : "enable"}`}
                                  title={p.status === "active" ? "Disable Page" : "Enable Page"}
                                  onClick={() => handleToggleStatus(p.id, p.status)}
                                >
                                  {p.status === "active" ? "🚫 Disable" : "✅ Enable"}
                                </button>

                                <button
                                  type="button"
                                  className="action-btn extend"
                                  title="Extend Expiration (+30 Days)"
                                  onClick={() => handleExtendPage(p.id, 30)}
                                >
                                  ⏳ +30D
                                </button>

                                <button
                                  type="button"
                                  className="action-btn delete"
                                  title="Delete Page"
                                  onClick={() => handleDeletePage(p.id, p.slug)}
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="empty-cell" style={{ textAlign: "center", padding: 30, color: "rgba(255,255,255,0.6)" }}>
                            No love pages found matching your filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: USERS & CREATORS */}
          {activeTab === "users" && (
            <div className="admin-tab-pane">
              <h2 className="pane-title">Registered Users ({users.length})</h2>

              <div className="admin-card table-card">
                <div className="table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Pages Created</th>
                        <th>Status</th>
                        <th>Joined Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((u) => (
                          <tr key={u.id}>
                            <td>#{u.id}</td>
                            <td><strong>{u.name}</strong></td>
                            <td>{u.email}</td>
                            <td><span className="badge-tag">{u.page_count} pages</span></td>
                            <td><span className={`status-pill ${u.status}`}>{u.status}</span></td>
                            <td>{new Date(u.created_at).toLocaleDateString()}</td>
                            <td>
                              <button
                                type="button"
                                className={`action-btn ${u.status === "active" ? "disable" : "enable"}`}
                                onClick={() => handleToggleUser(u.id, u.status)}
                              >
                                {u.status === "active" ? "🚫 Block User" : "✅ Unblock User"}
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="empty-cell">No registered users found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SOUNDTRACK LIBRARY */}
          {activeTab === "music" && (
            <div className="admin-tab-pane">
              <div className="pane-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 className="pane-title" style={{ margin: 0 }}>Soundtrack & Music Library ({music.length})</h2>
                <button type="button" className="btn secondary" onClick={loadAllData}>
                  🔄 Refresh List
                </button>
              </div>

              {/* UPLOAD & ADD MUSIC FORM */}
              <div className="admin-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                  <h3 style={{ margin: 0 }}>➕ Upload & Add Songs to Library</h3>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className={`btn secondary ${uploadMode === "multiple" ? "glow" : ""}`}
                      style={{ padding: "6px 14px", fontSize: "0.85rem" }}
                      onClick={() => setUploadMode("multiple")}
                    >
                      📁 Upload Multiple Songs
                    </button>
                    <button
                      type="button"
                      className={`btn secondary ${uploadMode === "file" ? "glow" : ""}`}
                      style={{ padding: "6px 14px", fontSize: "0.85rem" }}
                      onClick={() => setUploadMode("file")}
                    >
                      🎵 Single Song File
                    </button>
                    <button
                      type="button"
                      className={`btn secondary ${uploadMode === "url" ? "glow" : ""}`}
                      style={{ padding: "6px 14px", fontSize: "0.85rem" }}
                      onClick={() => setUploadMode("url")}
                    >
                      🔗 Audio URL
                    </button>
                  </div>
                </div>

                <form onSubmit={handleAddMusicTrack} className="admin-music-upload-form">
                  {/* METADATA FIELDS */}
                  <div className="grid-2" style={{ marginBottom: 16 }}>
                    {uploadMode !== "multiple" && (
                      <div className="admin-field-group">
                        <label className="admin-label">🎵 Track Title *</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. Perfect Symphony"
                          value={newTrack.title}
                          onChange={(e) => setNewTrack({ ...newTrack, title: e.target.value })}
                          required={uploadMode !== "multiple"}
                        />
                      </div>
                    )}

                    <div className="admin-field-group">
                      <label className="admin-label">👤 Artist Name {uploadMode === "multiple" ? "(Default for Batch)" : ""}</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. Ed Sheeran / Acoustic Studio"
                        value={newTrack.artist}
                        onChange={(e) => setNewTrack({ ...newTrack, artist: e.target.value })}
                      />
                    </div>

                    <div className="admin-field-group">
                      <label className="admin-label">🎭 Music Tone / Vibe {uploadMode === "multiple" ? "(Default for Batch)" : ""}</label>
                      <select
                        className="admin-input"
                        value={newTrack.tone}
                        onChange={(e) => setNewTrack({ ...newTrack, tone: e.target.value })}
                      >
                        <option value="romantic">💖 Romantic Melody</option>
                        <option value="acoustic">🎸 Acoustic Guitar</option>
                        <option value="piano">🎹 Soulful Piano</option>
                        <option value="upbeat">✨ Pop / Upbeat</option>
                        <option value="lofi">🎧 Lofi Chill Beats</option>
                        <option value="ambient">🌌 Cinematic Ambient</option>
                      </select>
                    </div>

                    {uploadMode === "url" && (
                      <div className="admin-field-group">
                        <label className="admin-label">🔗 Direct Audio File URL *</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="https://example.com/song.mp3 or /uploads/song.mp3"
                          value={newTrack.file_url}
                          onChange={(e) => setNewTrack({ ...newTrack, file_url: e.target.value })}
                          required
                        />
                      </div>
                    )}

                    {uploadMode === "file" && (
                      <div className="admin-field-group">
                        <label className="admin-label">📁 Choose Song File (MP3, MPEG, WAV, M4A, OGG, WEBM under 12MB) *</label>
                        <input
                          type="file"
                          accept="audio/mpeg,audio/mp3,audio/x-mpeg,audio/wav,audio/mp4,audio/m4a,audio/aac,audio/ogg,audio/webm,.mp3,.mpeg,.wav,.m4a,.ogg,.aac"
                          className="admin-input"
                          style={{ padding: "10px 14px", height: "auto" }}
                          onChange={handleSongFileSelect}
                          required={!audioFile}
                        />
                      </div>
                    )}
                  </div>

                  {/* MULTIPLE FILES UPLOAD INPUT & QUEUE */}
                  {uploadMode === "multiple" && (
                    <div style={{ marginBottom: 20 }}>
                      <div className="admin-field-group" style={{ marginBottom: 16 }}>
                        <label className="admin-label">📁 Choose Multiple Songs (Select multiple MP3, MPEG, WAV, M4A files) *</label>
                        <input
                          type="file"
                          multiple
                          accept="audio/mpeg,audio/mp3,audio/x-mpeg,audio/wav,audio/mp4,audio/m4a,audio/aac,audio/ogg,audio/webm,.mp3,.mpeg,.wav,.m4a,.ogg,.aac"
                          className="admin-input"
                          style={{ padding: "12px 16px", height: "auto", cursor: "pointer" }}
                          onChange={handleBatchFilesSelect}
                        />
                      </div>

                      {/* BATCH FILES QUEUE LIST */}
                      {batchFileItems.length > 0 && (
                        <div className="batch-queue-container" style={{ background: "rgba(20, 3, 14, 0.8)", border: "1px solid rgba(255, 180, 205, 0.3)", borderRadius: 18, padding: 16 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                            <strong style={{ color: "#ff9ebb", fontSize: "0.95rem" }}>
                              🎶 Selected Queue ({batchFileItems.length} songs):
                            </strong>
                            <button
                              type="button"
                              className="btn secondary"
                              style={{ padding: "4px 10px", fontSize: "0.78rem" }}
                              onClick={() => setBatchFileItems([])}
                            >
                              Clear Queue
                            </button>
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 320, overflowY: "auto", paddingRight: 6 }}>
                            {batchFileItems.map((item, idx) => (
                              <div
                                key={idx}
                                style={{
                                  background: "rgba(255, 255, 255, 0.05)",
                                  border: "1px solid rgba(255, 182, 193, 0.2)",
                                  borderRadius: 14,
                                  padding: "10px 14px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: 12,
                                  flexWrap: "wrap",
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 220 }}>
                                  <span style={{ fontSize: "1.1rem" }}>🎵</span>
                                  <div style={{ flex: 1 }}>
                                    <input
                                      type="text"
                                      className="admin-input"
                                      style={{ height: 34, fontSize: "0.88rem", padding: "0 10px" }}
                                      value={item.title}
                                      onChange={(e) => handleBatchTitleChange(idx, e.target.value)}
                                      placeholder="Track Title"
                                      required
                                    />
                                    <div style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
                                      {item.name} ({(item.size / (1024 * 1024)).toFixed(2)} MB)
                                    </div>
                                  </div>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  <audio controls src={item.previewUrl} style={{ height: 32, maxWidth: 190 }} />
                                  <button
                                    type="button"
                                    className="action-btn delete"
                                    style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                                    onClick={() => handleRemoveBatchFile(idx)}
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SINGLE FILE PREVIEW */}
                  {uploadMode === "file" && audioFilePreview && (
                    <div className="audio-preview-card" style={{ background: "rgba(255,255,255,0.06)", padding: "12px 18px", borderRadius: 14, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                      <div>
                        <span style={{ fontSize: "0.88rem", color: "#ff9ebb", fontWeight: 600 }}>🎧 Selected File Preview: </span>
                        <span style={{ fontSize: "0.85rem", color: "#ffffff" }}>{audioFile?.name} ({(audioFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                      </div>
                      <audio controls src={audioFilePreview} style={{ height: 36, maxWidth: 280 }} />
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                    {(audioFile || batchFileItems.length > 0) && (
                      <button type="button" className="btn secondary" onClick={resetMusicForm}>
                        Clear All
                      </button>
                    )}
                    <button type="submit" className="btn glow" disabled={addingMusic}>
                      {addingMusic
                        ? `⏳ Uploading ${uploadMode === "multiple" ? `${batchFileItems.length} Songs` : "Song"}...`
                        : uploadMode === "multiple"
                        ? `🎵 Upload ${batchFileItems.length || "Multiple"} Songs`
                        : "🎵 Upload & Add Song to List"}
                    </button>
                  </div>
                </form>
              </div>

              {/* MUSIC LIST TABLE */}
              <div className="admin-card table-card" style={{ marginTop: 24 }}>
                <h3>List of Songs ({music.length})</h3>
                <div className="table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Artist</th>
                        <th>Tone</th>
                        <th>Audio Player</th>
                        <th>File Source</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {music.length > 0 ? (
                        music.map((m) => (
                          <tr key={m.id}>
                            <td>#{m.id}</td>
                            <td><strong>🎵 {m.title}</strong></td>
                            <td>{m.artist || "—"}</td>
                            <td><span className="badge-tag">{m.tone}</span></td>
                            <td>
                              {m.file_url ? (
                                <audio controls src={m.file_url} style={{ height: 34, maxWidth: 220 }} />
                              ) : (
                                <span className="cell-sub">No Audio File</span>
                              )}
                            </td>
                            <td>
                              <code style={{ fontSize: "0.78rem", opacity: 0.85, wordBreak: "break-all" }}>
                                {m.file_url}
                              </code>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="action-btn delete"
                                onClick={() => handleDeleteMusicTrack(m.id, m.title)}
                              >
                                🗑️ Remove
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="empty-cell">
                            No songs in library. Use the form above to upload songs to the list!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: THEMES & BACKGROUND IMAGES */}
          {activeTab === "themes" && (
            <div className="admin-tab-pane">
              <div className="pane-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <h2 className="pane-title" style={{ margin: 0 }}>Themes & Background Images ({themes.length})</h2>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.88rem", color: "rgba(255,255,255,0.7)" }}>
                    Manage visual themes and upload custom background images for Love Page sanctuaries.
                  </p>
                </div>
                <button type="button" className="btn glow" onClick={handleOpenAddTheme}>
                  🖼️ Upload Background / Add Theme
                </button>
              </div>

              <div className="themes-grid">
                {themes.map((t) => {
                  let cfg = {};
                  try {
                    cfg = typeof t.config === "string" ? JSON.parse(t.config) : (t.config || {});
                  } catch {
                    cfg = {};
                  }
                  const bgUrl = cfg.backgroundImage || t.thumbnail;

                  return (
                    <div key={t.id} className="theme-admin-card" style={{ position: "relative", overflow: "hidden", background: "rgba(20, 6, 16, 0.7)", border: "1px solid rgba(255, 158, 187, 0.2)", borderRadius: 16 }}>
                      <div
                        className="theme-thumb-preview"
                        style={{
                          height: 140,
                          borderRadius: "14px 14px 0 0",
                          backgroundImage: bgUrl ? `url(${bgUrl})` : `linear-gradient(135deg, ${cfg.primary || '#ff4f81'}, ${cfg.background || '#0b1026'})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          display: "flex",
                          alignItems: "flex-end",
                          padding: 12,
                          boxSizing: "border-box",
                        }}
                      >
                        <div style={{ background: "rgba(0, 0, 0, 0.65)", backdropFilter: "blur(6px)", padding: "4px 10px", borderRadius: 8, fontSize: "0.78rem", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>
                          🎨 {cfg.font || "Font"} • ✨ {cfg.animation || "FX"}
                        </div>
                      </div>

                      <div className="theme-info" style={{ padding: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <h4 style={{ margin: 0, fontSize: "1.1rem", color: "#fff" }}>{t.name}</h4>
                          <button
                            type="button"
                            className={`status-pill ${t.status}`}
                            onClick={() => handleToggleThemeStatus(t)}
                            title="Click to toggle status"
                            style={{ cursor: "pointer", border: "none" }}
                          >
                            {t.status}
                          </button>
                        </div>
                        <code style={{ fontSize: "0.8rem", color: "#ff9ebb", display: "block", marginBottom: 12 }}>
                          slug: {t.slug}
                        </code>

                        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                          <button
                            type="button"
                            className="btn secondary"
                            style={{ flex: 1, padding: "6px 10px", fontSize: "0.82rem" }}
                            onClick={() => handleOpenEditTheme(t)}
                          >
                            ✏️ Change BG / Edit
                          </button>
                          <button
                            type="button"
                            className="btn icon-btn danger"
                            style={{ padding: "6px 10px", fontSize: "0.82rem" }}
                            onClick={() => handleDeleteTheme(t.id)}
                            title="Delete Theme"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: CONTACT MESSAGES / LOVE NOTES INBOX */}
          {activeTab === "messages" && (
            <div className="admin-tab-pane">
              <div className="pane-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <h2 className="pane-title" style={{ margin: 0 }}>Love Notes & Inquiry Inbox ({messages.length})</h2>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.88rem", color: "rgba(255,255,255,0.7)" }}>
                    Read and respond to love notes, theme requests, and support inquiries submitted by users.
                  </p>
                </div>
              </div>

              {/* SUMMARY STAT CARDS */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 20 }}>
                <div style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 158, 187, 0.25)", borderRadius: 16, padding: "16px 20px" }}>
                  <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Inquiries</div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#ff9ebb", marginTop: 4 }}>📬 {messages.length}</div>
                </div>

                <div style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 158, 187, 0.25)", borderRadius: 16, padding: "16px 20px" }}>
                  <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Unread Whispers</div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#ffd166", marginTop: 4 }}>
                    ⚡ {messages.filter((m) => m.status === "unread").length}
                  </div>
                </div>

                <div style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 158, 187, 0.25)", borderRadius: 16, padding: "16px 20px" }}>
                  <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Replied / Handled</div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#4ade80", marginTop: 4 }}>
                    💖 {messages.filter((m) => m.status === "replied").length}
                  </div>
                </div>
              </div>

              {/* FILTER PILLS */}
              <div className="filter-bar" style={{ marginBottom: 20 }}>
                {["all", "unread", "read", "replied", "archived"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`filter-chip ${messageFilter === st ? "active" : ""}`}
                    onClick={() => setMessageFilter(st)}
                  >
                    {st.charAt(0).toUpperCase() + st.slice(1)} (
                    {st === "all" ? messages.length : messages.filter((m) => m.status === st).length})
                  </button>
                ))}
              </div>

              {/* MESSAGES TABLE */}
              <div className="admin-card table-card">
                <div className="table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Sender Details</th>
                        <th>Topic</th>
                        <th>Message Preview</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {messages
                        .filter((m) => (messageFilter === "all" ? true : m.status === messageFilter))
                        .map((m) => (
                          <tr key={m.id} style={{ background: m.status === "unread" ? "rgba(255, 158, 187, 0.05)" : "transparent" }}>
                            <td style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                              {new Date(m.created_at).toLocaleString()}
                            </td>
                            <td>
                              <div style={{ fontWeight: 600, color: "#ffffff" }}>{m.name}</div>
                              <a href={`mailto:${m.email}`} style={{ fontSize: "0.82rem", color: "#ff9ebb" }}>
                                {m.email}
                              </a>
                            </td>
                            <td>
                              <span style={{ fontSize: "0.82rem", background: "rgba(255, 255, 255, 0.08)", padding: "3px 10px", borderRadius: 12, border: "1px solid rgba(255, 182, 193, 0.2)" }}>
                                {m.topic}
                              </span>
                            </td>
                            <td style={{ maxWidth: 260 }}>
                              <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "0.88rem", opacity: 0.9 }}>
                                "{m.message}"
                              </div>
                            </td>
                            <td>
                              <span className={`status-pill ${m.status}`}>
                                {m.status}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: 6 }}>
                                <button
                                  type="button"
                                  className="btn secondary"
                                  style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                                  onClick={() => {
                                    setSelectedMessage(m);
                                    if (m.status === "unread") handleUpdateMessageStatus(m.id, "read");
                                  }}
                                >
                                  👁️ Read Note
                                </button>
                                {m.status !== "replied" && (
                                  <button
                                    type="button"
                                    className="btn glow"
                                    style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                                    onClick={() => handleUpdateMessageStatus(m.id, "replied")}
                                    title="Mark as Replied"
                                  >
                                    💬 Replied
                                  </button>
                                )}
                                <button
                                  type="button"
                                  className="btn icon-btn danger"
                                  style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                                  onClick={() => handleDeleteMessage(m.id)}
                                  title="Delete Message"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      {messages.filter((m) => (messageFilter === "all" ? true : m.status === messageFilter)).length === 0 && (
                        <tr>
                          <td colSpan="6" className="empty-cell" style={{ padding: "40px 0" }}>
                            No love notes or inquiries found matching this filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: PAYMENTS & ACCESS CONTROL */}
          {activeTab === "payments" && (
            <div className="admin-tab-pane">
              <div className="pane-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <h2 className="pane-title" style={{ margin: 0 }}>₹99 Payment Gateway &amp; Unlocks ({payments.length})</h2>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.88rem", color: "rgba(255,255,255,0.7)" }}>
                    Manage payment QR image, UPI ID, and verify visitor transactions to unlock unlimited lifetime views.
                  </p>
                </div>

                <div className="filters-bar">
                  <select
                    className="admin-select"
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                  >
                    <option value="all">All Statuses ({payments.length})</option>
                    <option value="pending">Pending Verification ({payments.filter((p) => p.status === "pending").length})</option>
                    <option value="approved">Approved &amp; Unlocked ({payments.filter((p) => p.status === "approved").length})</option>
                    <option value="rejected">Rejected ({payments.filter((p) => p.status === "rejected").length})</option>
                  </select>

                  <button type="button" className="btn secondary" onClick={loadAllData}>
                    🔄 Refresh
                  </button>
                </div>
              </div>

              {/* QR CODE & UPI SETTINGS MANAGEMENT CARD */}
              <div
                className="admin-card"
                style={{
                  marginBottom: 24,
                  background: "linear-gradient(135deg, rgba(35, 12, 28, 0.85) 0%, rgba(18, 5, 15, 0.95) 100%)",
                  border: "1px solid rgba(255, 158, 187, 0.3)",
                  borderRadius: 20,
                  padding: 24,
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#ff9ebb", display: "flex", alignItems: "center", gap: 8 }}>
                      <span>💳 Payment QR Code &amp; UPI Configuration</span>
                    </h3>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>
                      Update the QR code scanner image and UPI ID shown on public paywall modals.
                    </p>
                  </div>
                  <span
                    style={{
                      background: "rgba(46, 204, 113, 0.15)",
                      color: "#2ecc71",
                      border: "1px solid rgba(46, 204, 113, 0.35)",
                      padding: "4px 12px",
                      borderRadius: 20,
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#2ecc71", display: "inline-block" }} />
                    Active Gateway Settings
                  </span>
                </div>

                <form onSubmit={handleSavePaymentSettings} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, alignItems: "start" }}>
                  {/* QR CODE PREVIEW & UPLOAD COL */}
                  <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px dashed rgba(255, 158, 187, 0.25)", borderRadius: 16, padding: 18 }}>
                    <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, color: "#ff9ebb", marginBottom: 10 }}>
                      📷 Payment QR Code Image
                    </label>
                    <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                      <div
                        style={{
                          position: "relative",
                          width: 110,
                          height: 110,
                          borderRadius: 14,
                          overflow: "hidden",
                          background: "#ffffff",
                          border: "2px solid #ff4f81",
                          boxShadow: "0 4px 12px rgba(255, 79, 129, 0.25)",
                          flexShrink: 0,
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <img
                          src={paymentSettingsForm.previewUrl || defaultQrImage}
                          alt="Current QR Code"
                          style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }}
                        />
                      </div>

                      <div style={{ flex: 1, minWidth: 160 }}>
                        <input
                          type="file"
                          id="admin-qr-file-input"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handlePaymentQrFileChange}
                          style={{ display: "none" }}
                        />
                        <label
                          htmlFor="admin-qr-file-input"
                          className="btn secondary"
                          style={{
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "8px 14px",
                            fontSize: "0.85rem",
                            marginBottom: 8,
                          }}
                        >
                          📁 Upload QR Code Image
                        </label>

                        <p style={{ margin: 0, fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.4 }}>
                          Supports JPG, PNG, WEBP.
                          {paymentSettingsForm.file ? (
                            <span style={{ color: "#2ecc71", display: "block", marginTop: 4, fontWeight: 600 }}>
                              ✓ Selected: {paymentSettingsForm.file.name}
                            </span>
                          ) : paymentSettings.qrCodeUrl ? (
                            <span style={{ color: "#ff9ebb", display: "block", marginTop: 4 }}>Custom QR active</span>
                          ) : (
                            <span style={{ color: "rgba(255,255,255,0.5)", display: "block", marginTop: 4 }}>Default PhonePe QR in use</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* UPI ID INPUT & ACTIONS COL */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 16, justifyContent: "space-between", height: "100%" }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: "0.88rem", fontWeight: 600, color: "#ff9ebb", marginBottom: 8, display: "block" }}>
                        💳 Payment UPI ID (VPA)
                      </label>
                      <div className="input-field-wrap">
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. lovedoes@ybl or merchant@upi"
                          value={paymentSettingsForm.upiId}
                          onChange={(e) => setPaymentSettingsForm((prev) => ({ ...prev, upiId: e.target.value }))}
                          style={{
                            fontSize: "1rem",
                            fontWeight: 600,
                            letterSpacing: "0.5px",
                            color: "#ffffff",
                            background: "rgba(0,0,0,0.3)",
                            borderColor: "rgba(255,158,187,0.3)",
                          }}
                          required
                        />
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                        <span>Live Paywall Copy ID:</span>
                        <code style={{ background: "rgba(255, 209, 102, 0.15)", color: "#ffd166", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>
                          {paymentSettingsForm.upiId || "lovedoes@ybl"}
                        </code>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <button
                        type="submit"
                        className="btn glow"
                        disabled={savingPaymentSettings}
                        style={{ padding: "10px 22px", fontSize: "0.92rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8 }}
                      >
                        {savingPaymentSettings ? "⏳ Saving Settings..." : "💾 Save QR Code & UPI Settings"}
                      </button>

                      {paymentSettingsForm.file && (
                        <button
                          type="button"
                          className="btn secondary"
                          onClick={() => setPaymentSettingsForm((prev) => ({ ...prev, file: null, previewUrl: paymentSettings.qrCodeUrl || "" }))}
                          style={{ padding: "10px 14px", fontSize: "0.85rem" }}
                        >
                          Reset File
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>

              {/* STATS ROW FOR PAYMENTS */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 20 }}>
                <div style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 158, 187, 0.25)", borderRadius: 16, padding: "16px 20px" }}>
                  <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Payment Claims</div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#ff9ebb", marginTop: 4 }}>💰 {payments.length}</div>
                </div>

                <div style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 158, 187, 0.25)", borderRadius: 16, padding: "16px 20px" }}>
                  <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Pending Action</div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#ffd166", marginTop: 4 }}>
                    ⏳ {payments.filter((p) => p.status === "pending").length}
                  </div>
                </div>

                <div style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 158, 187, 0.25)", borderRadius: 16, padding: "16px 20px" }}>
                  <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Approved &amp; Unlocked</div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#4ade80", marginTop: 4 }}>
                    🔓 {payments.filter((p) => p.status === "approved").length}
                  </div>
                </div>

                <div style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 158, 187, 0.25)", borderRadius: 16, padding: "16px 20px" }}>
                  <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Verified Revenue</div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#f472b6", marginTop: 4 }}>
                    ₹{payments.filter((p) => p.status === "approved").length * 99}
                  </div>
                </div>
              </div>

              {/* PAYMENTS TABLE */}
              <div className="admin-card table-card">
                <div className="table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Couple Page</th>
                        <th>Payer Name</th>
                        <th>UPI UTR / Transaction ID</th>
                        <th>Phone / Email</th>
                        <th>Amount</th>
                        <th>Submission Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments
                        .filter((p) => (paymentFilter === "all" ? true : p.status === paymentFilter))
                        .map((pay) => (
                          <tr key={pay.id} style={{ background: pay.status === "pending" ? "rgba(255, 209, 102, 0.05)" : "transparent" }}>
                            <td>
                              <div className="couple-cell">
                                <strong>{pay.creator_name} ❤️ {pay.partner_name}</strong>
                                <a href={`/love/${pay.slug}`} target="_blank" rel="noreferrer" className="slug-link">
                                  /love/{pay.slug} ↗
                                </a>
                              </div>
                            </td>

                            <td>
                              <div style={{ fontWeight: 600, color: "#ffffff" }}>{pay.payer_name}</div>
                              {pay.notes && <span className="cell-sub" style={{ fontStyle: "italic" }}>"{pay.notes}"</span>}
                            </td>

                            <td>
                              <code
                                style={{
                                  background: "rgba(255, 209, 102, 0.15)",
                                  border: "1px solid rgba(255, 209, 102, 0.4)",
                                  padding: "4px 8px",
                                  borderRadius: 6,
                                  color: "#ffd166",
                                  fontWeight: 700,
                                  fontSize: "0.9rem",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                {pay.utr_id}
                              </code>
                            </td>

                            <td>
                              <span style={{ fontSize: "0.86rem", color: "#ff9ebb" }}>{pay.phone_email}</span>
                            </td>

                            <td>
                              <strong style={{ color: "#2ecc71", fontSize: "1.05rem" }}>₹{pay.amount}</strong>
                            </td>

                            <td>
                              <span className="date-cell">
                                {new Date(pay.created_at).toLocaleString()}
                              </span>
                            </td>

                            <td>
                              <span
                                className={`status-pill ${pay.status}`}
                                style={{
                                  background:
                                    pay.status === "approved"
                                      ? "rgba(46, 204, 113, 0.2)"
                                      : pay.status === "pending"
                                      ? "rgba(241, 196, 15, 0.2)"
                                      : "rgba(231, 76, 60, 0.2)",
                                  color:
                                    pay.status === "approved"
                                      ? "#2ecc71"
                                      : pay.status === "pending"
                                      ? "#f1c40f"
                                      : "#e74c3c",
                                  border:
                                    pay.status === "approved"
                                      ? "1px solid rgba(46, 204, 113, 0.4)"
                                      : pay.status === "pending"
                                      ? "1px solid rgba(241, 196, 15, 0.4)"
                                      : "1px solid rgba(231, 76, 60, 0.4)",
                                }}
                              >
                                {pay.status === "approved" ? "Approved 🔓" : pay.status === "pending" ? "Pending ⏳" : "Rejected ❌"}
                              </span>
                            </td>

                            <td>
                              <div className="action-buttons-group">
                                {pay.status !== "approved" && (
                                  <button
                                    type="button"
                                    className="action-btn activate"
                                    style={{ background: "rgba(46, 204, 113, 0.2)", color: "#2ecc71", border: "1px solid rgba(46, 204, 113, 0.5)", fontWeight: 600 }}
                                    title="Approve ₹99 payment and unlock full page access"
                                    onClick={() => handleUpdatePaymentStatus(pay.id, "approved")}
                                  >
                                    ✅ Approve &amp; Unlock
                                  </button>
                                )}

                                {pay.status !== "rejected" && (
                                  <button
                                    type="button"
                                    className="action-btn disable"
                                    style={{ background: "rgba(231, 76, 60, 0.2)", color: "#e74c3c", border: "1px solid rgba(231, 76, 60, 0.4)" }}
                                    onClick={() => handleUpdatePaymentStatus(pay.id, "rejected")}
                                  >
                                    ❌ Reject
                                  </button>
                                )}

                                <button
                                  type="button"
                                  className="action-btn delete"
                                  title="Delete payment claim record"
                                  onClick={() => handleDeletePayment(pay.id)}
                                >
                                  🗑
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      {payments.filter((p) => (paymentFilter === "all" ? true : p.status === paymentFilter)).length === 0 && (
                        <tr>
                          <td colSpan="8" className="empty-cell" style={{ padding: "40px 0" }}>
                            No payment claims found for this filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: VISITOR LOGS */}
          {activeTab === "logs" && (
            <div className="admin-tab-pane">
              <h2 className="pane-title">Live Visitor Audit Trail ({logs.length})</h2>
              <div className="admin-card table-card">
                <div className="table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Visited Page</th>
                        <th>Location</th>
                        <th>IP Hash</th>
                        <th>Device</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((l) => (
                        <tr key={l.id}>
                          <td>{new Date(l.viewed_at).toLocaleString()}</td>
                          <td>
                            <a href={`/love/${l.slug}`} target="_blank" rel="noreferrer" className="slug-link">
                              {l.creator_name} ❤️ {l.partner_name} (/love/{l.slug})
                            </a>
                          </td>
                          <td>
                            <span style={{ color: "#ff9ebb", fontWeight: 600, fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: 4 }}>
                              📍 {l.location || "Local Dev / Internal"}
                            </span>
                          </td>
                          <td><code>{l.ip_hash || "anonymized"}</code></td>
                          <td><span className="badge-tag">{l.device || "Desktop/Mobile"}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SECURITY & ACCOUNT */}
          {activeTab === "settings" && (
            <div className="admin-tab-pane">
              <h2 className="pane-title">Admin Account & Security Settings</h2>
              <div className="admin-card" style={{ maxWidth: 540 }}>
                <h3>🛡️ Update Admin Credentials</h3>
                <form onSubmit={handleUpdateAccountSubmit} className="admin-form-col">
                  <div className="form-group">
                    <label>Admin Email Address</label>
                    <input
                      type="email"
                      className="admin-input"
                      value={accountForm.email}
                      onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Current Password (required to change password)</label>
                    <input
                      type="password"
                      className="admin-input"
                      placeholder="••••••••"
                      value={accountForm.currentPassword}
                      onChange={(e) => setAccountForm({ ...accountForm, currentPassword: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>New Password (leave blank to keep current)</label>
                    <input
                      type="password"
                      className="admin-input"
                      placeholder="New password"
                      value={accountForm.newPassword}
                      onChange={(e) => setAccountForm({ ...accountForm, newPassword: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn glow" disabled={updatingAccount}>
                    {updatingAccount ? "Saving..." : "💾 Update Admin Settings"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* EDIT LOVE PAGE MODAL */}
      {editingPage && (
        <div className="admin-modal-overlay" onClick={() => setEditingPage(null)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close-x" onClick={() => setEditingPage(null)}>
              ✕
            </button>
            <h3>✏️ Edit Love Page (#{editingPage.id})</h3>

            <form onSubmit={handleSaveEditedPage} className="modal-edit-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Creator Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editingPage.creator_name}
                    onChange={(e) => setEditingPage({ ...editingPage, creator_name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Partner Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editingPage.partner_name}
                    onChange={(e) => setEditingPage({ ...editingPage, partner_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Occasion</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editingPage.occasion || ""}
                    onChange={(e) => setEditingPage({ ...editingPage, occasion: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    className="admin-select"
                    value={editingPage.status}
                    onChange={(e) => setEditingPage({ ...editingPage, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Theme / Background Style</label>
                  <select
                    className="admin-select"
                    value={editingPage.theme_id || ""}
                    onChange={(e) => setEditingPage({ ...editingPage, theme_id: e.target.value ? Number(e.target.value) : null })}
                  >
                    <option value="">Default Theme</option>
                    {themes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.slug})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Page Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={editingPage.title || ""}
                  onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Romantic Message</label>
                <textarea
                  className="admin-input textarea"
                  rows="4"
                  value={editingPage.message || ""}
                  onChange={(e) => setEditingPage({ ...editingPage, message: e.target.value })}
                />
              </div>

              <div className="modal-actions-row">
                <button type="button" className="btn secondary" onClick={() => setEditingPage(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn glow">
                  💾 Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIVE PREVIEW MODAL */}
      {previewSlug && (
        <div className="admin-modal-overlay" onClick={() => setPreviewSlug(null)}>
          <div className="admin-modal-preview-box" onClick={(e) => e.stopPropagation()}>
            <div className="preview-modal-header">
              <h3>👁️ Live Preview: /love/{previewSlug}</h3>
              <button type="button" className="modal-close-x" onClick={() => setPreviewSlug(null)}>
                ✕
              </button>
            </div>
            <iframe
              src={`/love/${previewSlug}`}
              title="Live Love Page Preview"
              className="preview-iframe"
            />
          </div>
        </div>
      )}

      {/* PAGE VISITORS AUDIT MODAL */}
      {viewersModal.open && viewersModal.page && (
        <div className="admin-modal-overlay" onClick={() => setViewersModal({ open: false, loading: false, page: null, logs: [] })}>
          <div className="admin-modal" style={{ maxWidth: 780, background: "rgba(18, 4, 14, 0.96)", border: "1px solid rgba(255, 158, 187, 0.35)", borderRadius: 22, padding: 24 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, gap: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.3rem", color: "#ff9ebb", display: "flex", alignItems: "center", gap: 8 }}>
                  <span>👥 Visitor Audit Trail:</span>
                  <span style={{ color: "#ffffff" }}>{viewersModal.page.creator_name} ❤️ {viewersModal.page.partner_name}</span>
                </h3>
                <div style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
                  Page Path: <a href={`/love/${viewersModal.page.slug}`} target="_blank" rel="noreferrer" style={{ color: "#ff9ebb", fontWeight: 600 }}>/love/{viewersModal.page.slug} ↗</a>
                </div>
              </div>
              <button
                type="button"
                className="btn secondary"
                style={{ padding: "6px 14px", fontSize: "0.85rem" }}
                onClick={() => setViewersModal({ open: false, loading: false, page: null, logs: [] })}
              >
                ✕ Close
              </button>
            </div>

            {viewersModal.loading ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#ff9ebb", fontSize: "1.05rem" }}>
                ⏳ Loading visitor logs for this page...
              </div>
            ) : (
              <div>
                {/* SUMMARY STAT CARDS */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
                  <div style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 182, 193, 0.2)", borderRadius: 14, padding: "12px 16px" }}>
                    <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Page Views</div>
                    <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#ff9ebb", marginTop: 2 }}>
                      👁️ {viewersModal.page.views}
                    </div>
                  </div>

                  <div style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 182, 193, 0.2)", borderRadius: 14, padding: "12px 16px" }}>
                    <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Unique Devices / IPs</div>
                    <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#ff9ebb", marginTop: 2 }}>
                      👤 {new Set(viewersModal.logs.map((l) => l.ip_hash)).size}
                    </div>
                  </div>

                  <div style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 182, 193, 0.2)", borderRadius: 14, padding: "12px 16px" }}>
                    <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Top Location</div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#ffffff", marginTop: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      📍 {viewersModal.logs[0]?.location || "Local Dev / Internal"}
                    </div>
                  </div>
                </div>

                {/* VISITORS AUDIT LIST TABLE */}
                <div className="table-wrap" style={{ maxHeight: 340, overflowY: "auto", border: "1px solid rgba(255, 182, 193, 0.2)", borderRadius: 14 }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Visitor Location</th>
                        <th>Device</th>
                        <th>IP Hash</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewersModal.logs.length > 0 ? (
                        viewersModal.logs.map((l) => (
                          <tr key={l.id}>
                            <td style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                              {new Date(l.viewed_at).toLocaleString()}
                            </td>
                            <td>
                              <span style={{ color: "#ff9ebb", fontWeight: 600, fontSize: "0.88rem", display: "inline-flex", alignItems: "center", gap: 4 }}>
                                📍 {l.location || "Local Dev / Internal"}
                              </span>
                            </td>
                            <td>
                              <span className="badge-tag">{l.device || "desktop"}</span>
                            </td>
                            <td>
                              <code style={{ fontSize: "0.76rem", opacity: 0.85 }}>
                                {l.ip_hash ? `${l.ip_hash.slice(0, 16)}...` : "anonymized"}
                              </code>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="empty-cell" style={{ padding: "30px 0" }}>
                            No visitor view logs recorded for this page yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* THEME & BACKGROUND IMAGE MODAL */}
      {themeModal.open && (
        <div className="admin-modal-overlay" onClick={() => setThemeModal({ open: false, isEditing: false, themeId: null })}>
          <div className="admin-modal-box" style={{ maxWidth: 620, background: "rgba(18, 4, 14, 0.96)", border: "1px solid rgba(255, 158, 187, 0.35)", borderRadius: 22, padding: 24 }} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-x"
              onClick={() => setThemeModal({ open: false, isEditing: false, themeId: null })}
            >
              ✕
            </button>
            <h3 style={{ margin: "0 0 20px 0", color: "#ff9ebb", fontSize: "1.3rem" }}>
              {themeModal.isEditing ? "🖼️ Edit Theme & Change Background Image" : "✨ Create Theme / Upload Background"}
            </h3>

            <form onSubmit={handleSaveTheme} className="modal-edit-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Theme Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Royal Burgundy"
                    value={themeForm.name}
                    onChange={(e) => setThemeForm({ ...themeForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Slug Identifier</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. royal-burgundy"
                    value={themeForm.slug}
                    onChange={(e) => setThemeForm({ ...themeForm, slug: e.target.value })}
                  />
                </div>
              </div>

              {/* BACKGROUND IMAGE UPLOAD OR URL */}
              <div className="form-group" style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px dashed rgba(255, 158, 187, 0.4)", borderRadius: 14, padding: 16, marginBottom: 16 }}>
                <label style={{ color: "#ff9ebb", fontWeight: 700, display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <span>🖼️ Background Image</span>
                  <span style={{ fontSize: "0.78rem", fontWeight: 400, color: "rgba(255,255,255,0.7)" }}>(Upload file or enter URL)</span>
                </label>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="admin-input"
                    onChange={handleThemeFileChange}
                  />

                  <div style={{ textAlign: "center", fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>— OR DIRECT IMAGE URL —</div>

                  <input
                    type="text"
                    className="admin-input"
                    placeholder="https://example.com/background.jpg or /uploads/bg.jpg"
                    value={themeForm.backgroundImage}
                    onChange={(e) => setThemeForm({ ...themeForm, backgroundImage: e.target.value, previewUrl: e.target.value })}
                  />

                  {themeForm.previewUrl && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontSize: "0.8rem", color: "#ff9ebb", marginBottom: 4 }}>Background Preview:</div>
                      <img
                        src={themeForm.previewUrl}
                        alt="Background Preview"
                        style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 10, border: "1px solid rgba(255,255,255,0.2)" }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="form-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div className="form-group">
                  <label>Primary Color</label>
                  <input
                    type="color"
                    className="admin-input"
                    style={{ height: 42, padding: 4, cursor: "pointer" }}
                    value={themeForm.primary}
                    onChange={(e) => setThemeForm({ ...themeForm, primary: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Background Color</label>
                  <input
                    type="color"
                    className="admin-input"
                    style={{ height: 42, padding: 4, cursor: "pointer" }}
                    value={themeForm.background}
                    onChange={(e) => setThemeForm({ ...themeForm, background: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Accent Color</label>
                  <input
                    type="color"
                    className="admin-input"
                    style={{ height: 42, padding: 4, cursor: "pointer" }}
                    value={themeForm.accent}
                    onChange={(e) => setThemeForm({ ...themeForm, accent: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Font Family</label>
                  <select
                    className="admin-select"
                    value={themeForm.font}
                    onChange={(e) => setThemeForm({ ...themeForm, font: e.target.value })}
                  >
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Cormorant Garamond">Cormorant Garamond</option>
                    <option value="Cinzel">Cinzel</option>
                    <option value="Pinyon Script">Pinyon Script</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Quicksand">Quicksand</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Animation FX</label>
                  <select
                    className="admin-select"
                    value={themeForm.animation}
                    onChange={(e) => setThemeForm({ ...themeForm, animation: e.target.value })}
                  >
                    <option value="hearts">Floating Hearts</option>
                    <option value="sparkle">Golden Sparkles</option>
                    <option value="stars">Twinkling Stars</option>
                    <option value="glow">Romantic Glow</option>
                    <option value="stickers">Cute Stickers</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions-row" style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => setThemeModal({ open: false, isEditing: false, themeId: null })}
                >
                  Cancel
                </button>
                <button type="submit" className="btn glow" disabled={savingTheme}>
                  {savingTheme ? "⏳ Saving..." : "💾 Save Theme & Background"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT LOVE PAGE MODAL */}
      {editingPage && (
        <div className="admin-modal-overlay" onClick={() => setEditingPage(null)}>
          <div className="admin-modal-box" style={{ maxWidth: 650 }} onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close-x" onClick={() => setEditingPage(null)}>
              ✕
            </button>

            <h3 style={{ margin: "0 0 16px", color: "#ffffff", fontSize: "1.25rem", display: "flex", alignItems: "center", gap: 10 }}>
              <span>✏️ Edit Love Page (#{editingPage.id})</span>
            </h3>

            <form onSubmit={handleSaveEditedPage} className="modal-edit-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Creator Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editingPage.creator_name || ""}
                    onChange={(e) => setEditingPage({ ...editingPage, creator_name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Partner Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editingPage.partner_name || ""}
                    onChange={(e) => setEditingPage({ ...editingPage, partner_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Occasion</label>
                  <select
                    className="admin-select"
                    value={editingPage.occasion || "Valentine's Day"}
                    onChange={(e) => setEditingPage({ ...editingPage, occasion: e.target.value })}
                  >
                    <option value="Valentine's Day">Valentine's Day</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Just Because">Just Because</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Special Date</label>
                  <input
                    type="date"
                    className="admin-input"
                    value={editingPage.special_date ? editingPage.special_date.substring(0, 10) : ""}
                    onChange={(e) => setEditingPage({ ...editingPage, special_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Page Title / Headline</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Two hearts, one story..."
                  value={editingPage.title || ""}
                  onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Love Message / Letter</label>
                <textarea
                  className="admin-input"
                  style={{ minHeight: 100, fontFamily: "inherit" }}
                  value={editingPage.message || ""}
                  onChange={(e) => setEditingPage({ ...editingPage, message: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Background Soundtrack URL</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="https://example.com/audio.mp3 or /music/romantic.mp3"
                  value={editingPage.audio_url || ""}
                  onChange={(e) => setEditingPage({ ...editingPage, audio_url: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Paywall Access Status</label>
                  <select
                    className="admin-select"
                    value={editingPage.is_unlocked ? "unlocked" : "locked"}
                    onChange={(e) => setEditingPage({ ...editingPage, is_unlocked: e.target.value === "unlocked" ? 1 : 0 })}
                  >
                    <option value="locked">🔒 3 Free Views Limit</option>
                    <option value="unlocked">🔓 Unlocked (Lifetime Unlimited)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Page Status</label>
                  <select
                    className="admin-select"
                    value={editingPage.status || "active"}
                    onChange={(e) => setEditingPage({ ...editingPage, status: e.target.value })}
                  >
                    <option value="active">🟢 Active</option>
                    <option value="disabled">🚫 Disabled</option>
                    <option value="expired">🔴 Expired</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions-row" style={{ marginTop: 20 }}>
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => setEditingPage(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn glow">
                  💾 Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOVE NOTE MESSAGE DETAIL MODAL */}
      {selectedMessage && (
        <div className="admin-modal-overlay" onClick={() => setSelectedMessage(null)}>
          <div className="admin-modal-box" style={{ maxWidth: 640, background: "rgba(18, 4, 14, 0.96)", border: "1px solid rgba(255, 158, 187, 0.35)", borderRadius: 22, padding: 26 }} onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close-x" onClick={() => setSelectedMessage(null)}>
              ✕
            </button>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: "1.3rem", color: "#ff9ebb", display: "flex", alignItems: "center", gap: 8 }}>
                <span>💌 Love Note Inquiry (#{selectedMessage.id})</span>
              </h3>
              <span className={`status-pill ${selectedMessage.status}`}>{selectedMessage.status}</span>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 182, 193, 0.2)", borderRadius: 16, padding: 16, marginBottom: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12, fontSize: "0.9rem" }}>
                <div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", textTransform: "uppercase" }}>Sender Name</div>
                  <strong style={{ color: "#ffffff", fontSize: "1rem" }}>{selectedMessage.name}</strong>
                </div>
                <div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", textTransform: "uppercase" }}>Email Address</div>
                  <a href={`mailto:${selectedMessage.email}`} style={{ color: "#ff9ebb", fontWeight: 600 }}>{selectedMessage.email} ↗</a>
                </div>
                <div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", textTransform: "uppercase" }}>Topic / Subject</div>
                  <span style={{ color: "#ffd166", fontWeight: 600 }}>{selectedMessage.topic}</span>
                </div>
                <div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", textTransform: "uppercase" }}>Submitted At</div>
                  <span style={{ color: "rgba(255,255,255,0.9)" }}>{new Date(selectedMessage.created_at).toLocaleString()}</span>
                </div>
              </div>
              <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>
                IP Address: <code>{selectedMessage.ip_address || "127.0.0.1"}</code>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: "0.85rem", color: "#ff9ebb", fontWeight: 700, marginBottom: 8, textTransform: "uppercase" }}>Full Love Note Message:</div>
              <div style={{ background: "rgba(10, 2, 8, 0.8)", border: "1px solid rgba(255, 158, 187, 0.25)", borderRadius: 14, padding: 18, color: "#ffffff", fontSize: "1.05rem", lineHeight: 1.65, fontFamily: "'Georgia', serif", fontStyle: "italic", whiteSpace: "pre-wrap" }}>
                "{selectedMessage.message}"
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, borderTop: "1px solid rgba(255, 158, 187, 0.2)", paddingTop: 16 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>Update Status:</span>
                {["unread", "read", "replied", "archived"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`btn secondary ${selectedMessage.status === st ? "glow" : ""}`}
                    style={{ padding: "4px 10px", fontSize: "0.78rem" }}
                    onClick={() => handleUpdateMessageStatus(selectedMessage.id, st)}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.topic)}`}
                  className="btn glow"
                  style={{ textDecoration: "none", fontSize: "0.88rem", padding: "8px 16px" }}
                  onClick={() => handleUpdateMessageStatus(selectedMessage.id, "replied")}
                >
                  ✉️ Reply via Email
                </a>
                <button
                  type="button"
                  className="btn secondary"
                  style={{ fontSize: "0.88rem", padding: "8px 16px" }}
                  onClick={() => setSelectedMessage(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIVE SANCTUARY PREVIEW MODAL */}
      {previewSlug && (
        <div className="admin-modal-overlay" onClick={() => setPreviewSlug(null)}>
          <div className="admin-modal-preview-box" onClick={(e) => e.stopPropagation()}>
            <div className="preview-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#ffffff", display: "flex", alignItems: "center", gap: 8 }}>
                  <span>👁️ Live Preview:</span>
                  <code style={{ color: "#ff9ebb", background: "rgba(255,42,117,0.15)", padding: "2px 8px", borderRadius: 6 }}>/love/{previewSlug}</code>
                </h3>
                <a
                  href={`/love/${previewSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "0.8rem", color: "#60a5fa", textDecoration: "none", fontWeight: 600 }}
                >
                  Open in New Tab ↗
                </a>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Device Frame Switcher */}
                <div style={{ display: "flex", background: "rgba(255,255,255,0.08)", padding: 3, borderRadius: 10 }}>
                  <button
                    type="button"
                    className={`btn ${previewDevice === "desktop" ? "glow" : "secondary"}`}
                    style={{ padding: "4px 12px", fontSize: "0.78rem", borderRadius: 8 }}
                    onClick={() => setPreviewDevice("desktop")}
                  >
                    🖥️ Desktop
                  </button>
                  <button
                    type="button"
                    className={`btn ${previewDevice === "mobile" ? "glow" : "secondary"}`}
                    style={{ padding: "4px 12px", fontSize: "0.78rem", borderRadius: 8 }}
                    onClick={() => setPreviewDevice("mobile")}
                  >
                    📱 Mobile
                  </button>
                </div>

                <button type="button" className="modal-close-x" onClick={() => setPreviewSlug(null)}>
                  ✕
                </button>
              </div>
            </div>

            <div className="preview-iframe-wrapper">
              <iframe
                src={`/love/${previewSlug}`}
                title={`Preview ${previewSlug}`}
                className={`preview-iframe ${previewDevice}`}
              />
            </div>
          </div>
        </div>
      )}

      {/* VISITOR AUDIT LOG MODAL */}
      {viewersModal.open && (
        <div className="admin-modal-overlay" onClick={() => setViewersModal({ open: false, loading: false, page: null, logs: [] })}>
          <div className="admin-modal-box" style={{ maxWidth: 680 }} onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close-x" onClick={() => setViewersModal({ open: false, loading: false, page: null, logs: [] })}>
              ✕
            </button>

            <h3 style={{ margin: "0 0 6px", color: "#ffffff", fontSize: "1.25rem", display: "flex", alignItems: "center", gap: 10 }}>
              <span>👥 Visitor Audit Log</span>
            </h3>
            {viewersModal.page && (
              <p style={{ margin: "0 0 18px", color: "#ff9ebb", fontSize: "0.9rem" }}>
                Sanctuary: <strong>{viewersModal.page.creator_name} & {viewersModal.page.partner_name}</strong> (<code>/love/{viewersModal.page.slug}</code>)
              </p>
            )}

            {viewersModal.loading ? (
              <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.7)" }}>
                <div className="spinner" style={{ margin: "0 auto 12px" }} />
                <span>Fetching visitor records...</span>
              </div>
            ) : viewersModal.logs.length === 0 ? (
              <div style={{ padding: 30, textAlign: "center", color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.03)", borderRadius: 14 }}>
                No visitor views recorded for this page yet.
              </div>
            ) : (
              <div style={{ maxHeight: 360, overflowY: "auto", borderRadius: 12, border: "1px solid rgba(255,182,193,0.15)" }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>IP Hash</th>
                      <th>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewersModal.logs.map((lg) => (
                      <tr key={lg.id}>
                        <td>{new Date(lg.viewed_at).toLocaleString()}</td>
                        <td><code>{lg.ip_hash ? lg.ip_hash.substring(0, 12) + "..." : "127.0.0.1"}</code></td>
                        <td>📍 {lg.location || "Unknown City"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div style={{ marginTop: 20, textAlign: "right" }}>
              <button
                type="button"
                className="btn secondary"
                onClick={() => setViewersModal({ open: false, loading: false, page: null, logs: [] })}
              >
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
