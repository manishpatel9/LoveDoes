import bcrypt from "bcryptjs";
import { query } from "../config/db.js";
import { authCookie, signAdmin } from "../middleware/auth.js";
import { clearApiCache } from "./lovePageController.js";

// Admin Login
export async function adminLogin(req, res) {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (!email || !password) {
    res.status(400).json({ success: false, error: "Email and password are required." });
    return;
  }
  const rows = await query("SELECT id, email, password_hash, status FROM admins WHERE email = ?", [email]);
  const admin = rows[0];
  if (!admin || admin.status !== "active") {
    res.status(401).json({ success: false, error: "Invalid credentials or admin account disabled." });
    return;
  }
  const ok = await bcrypt.compare(password, admin.password_hash);
  if (!ok) {
    res.status(401).json({ success: false, error: "Invalid credentials." });
    return;
  }
  authCookie(signAdmin(admin), res);
  res.json({ success: true, admin: { id: admin.id, email: admin.email } });
}

// Admin Logout
export function adminLogout(_req, res) {
  res.clearCookie("lovedoes_admin", { 
    path: "/", 
    sameSite: "none", 
    secure: true 
  });
  res.json({ success: true });
}

// Get Current Admin Info
export function adminMe(req, res) {
  res.json({ success: true, admin: req.admin });
}

// Comprehensive Dashboard Statistics & Analytics
export async function adminStats(_req, res) {
  const [total] = await query("SELECT COUNT(*) AS c FROM love_pages");
  const [active] = await query("SELECT COUNT(*) AS c FROM love_pages WHERE status = 'active'");
  const [disabled] = await query("SELECT COUNT(*) AS c FROM love_pages WHERE status = 'disabled'");
  const [expired] = await query("SELECT COUNT(*) AS c FROM love_pages WHERE status = 'expired'");
  const [today] = await query("SELECT COUNT(*) AS c FROM love_pages WHERE DATE(created_at) = CURDATE()");
  const [views] = await query("SELECT COALESCE(SUM(views),0) AS c FROM love_pages");
  const [viewsToday] = await query("SELECT COUNT(*) AS c FROM page_views WHERE DATE(viewed_at) = CURDATE()");
  
  const [photosCount] = await query("SELECT COUNT(*) AS c FROM love_photos");
  const [memoriesCount] = await query("SELECT COUNT(*) AS c FROM memories");
  const [usersCount] = await query("SELECT COUNT(*) AS c FROM users");
  const [pendingPayments] = await query("SELECT COUNT(*) AS c FROM payment_verifications WHERE status = 'pending'");
  const [approvedPayments] = await query("SELECT COUNT(*) AS c FROM payment_verifications WHERE status = 'approved'");

  const topOccasions = await query(
    `SELECT occasion, COUNT(*) AS count
     FROM love_pages
     WHERE occasion IS NOT NULL AND occasion != ''
     GROUP BY occasion
     ORDER BY count DESC
     LIMIT 5`
  );

  res.json({
    success: true,
    stats: {
      total: total.c || 0,
      active: active.c || 0,
      disabled: disabled.c || 0,
      expired: expired.c || 0,
      today: today.c || 0,
      totalViews: views.c || 0,
      viewsToday: viewsToday.c || 0,
      photosCount: photosCount.c || 0,
      memoriesCount: memoriesCount.c || 0,
      usersCount: usersCount.c || 0,
      pendingPayments: pendingPayments.c || 0,
      approvedPayments: approvedPayments.c || 0,
      topOccasions,
    },
  });
}

// List Love Pages with Search, Filter & Metrics
export async function adminListPages(req, res) {
  const { search, status, occasion } = req.query;
  let sql = `
    SELECT p.id, p.slug, p.creator_name, p.partner_name, p.title, p.occasion, p.special_date, p.message,
           p.audio_url, p.status, p.is_unlocked, p.views, p.expires_at, p.created_at,
           (SELECT COUNT(*) FROM love_photos WHERE love_page_id = p.id) AS photo_count,
           (SELECT COUNT(*) FROM memories WHERE love_page_id = p.id) AS memory_count
    FROM love_pages p
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    sql += ` AND (p.creator_name LIKE ? OR p.partner_name LIKE ? OR p.slug LIKE ? OR p.title LIKE ?)`;
    const term = `%${search}%`;
    params.push(term, term, term, term);
  }

  if (status) {
    sql += ` AND p.status = ?`;
    params.push(status);
  }

  if (occasion) {
    sql += ` AND p.occasion = ?`;
    params.push(occasion);
  }

  sql += ` ORDER BY p.created_at DESC LIMIT 300`;

  const rows = await query(sql, params);
  res.json({ success: true, pages: rows });
}

// Get Single Page Details with Photos, Memories & View Logs
export async function adminGetPage(req, res) {
  const id = req.params.id;
  const pages = await query("SELECT * FROM love_pages WHERE id = ?", [id]);
  const page = pages[0];
  if (!page) {
    res.status(404).json({ success: false, error: "Love page not found." });
    return;
  }
  const photos = await query("SELECT id, type, file_url, sort_order FROM love_photos WHERE love_page_id = ? ORDER BY sort_order", [id]);
  const memories = await query("SELECT id, title, description, photo_url, memory_date FROM memories WHERE love_page_id = ? ORDER BY sort_order", [id]);
  const recentViews = await query("SELECT id, ip_hash, device, viewed_at FROM page_views WHERE love_page_id = ? ORDER BY viewed_at DESC LIMIT 20", [id]);

  res.json({ success: true, page, photos, memories, recentViews });
}

// Update Love Page Details (Edit Names, Occasion, Message, Dates, Theme, Status)
export async function adminUpdatePage(req, res) {
  const id = req.params.id;
  const { creator_name, partner_name, title, occasion, special_date, message, theme_id, status, expires_at } = req.body;

  const existing = await query("SELECT id FROM love_pages WHERE id = ?", [id]);
  if (!existing.length) {
    res.status(404).json({ success: false, error: "Page not found." });
    return;
  }

  await query(
    `UPDATE love_pages
     SET creator_name = ?, partner_name = ?, title = ?, occasion = ?,
         special_date = ?, message = ?, theme_id = ?, status = ?, expires_at = ?
     WHERE id = ?`,
    [
      creator_name || "Creator",
      partner_name || "Partner",
      title || null,
      occasion || "Love",
      special_date || null,
      message || "",
      theme_id || null,
      status || "active",
      expires_at || null,
      id,
    ]
  );

  const updated = await query("SELECT * FROM love_pages WHERE id = ?", [id]);
  res.json({ success: true, page: updated[0], message: "Love page updated successfully." });
}

// Quick Status Toggle (Active / Disabled / Expired)
export async function adminTogglePageStatus(req, res) {
  const id = req.params.id;
  const { status } = req.body;

  if (!["active", "disabled", "expired", "draft"].includes(status)) {
    res.status(400).json({ success: false, error: "Invalid status value." });
    return;
  }

  if (status === "active") {
    // Check if current page is expired; if so, update status AND extend expiration by +30 days
    const rows = await query("SELECT expires_at FROM love_pages WHERE id = ?", [id]);
    const currentExpires = rows[0]?.expires_at;
    if (currentExpires && new Date(currentExpires) < new Date()) {
      const newExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await query("UPDATE love_pages SET status = 'active', expires_at = ? WHERE id = ?", [newExpiresAt, id]);
      res.json({ success: true, message: "Page activated & extended by 30 days." });
      return;
    }
  }

  await query("UPDATE love_pages SET status = ? WHERE id = ?", [status, id]);
  res.json({ success: true, message: `Status updated to '${status}'.` });
}

// Extend Page Expiration Date
export async function adminExtendPage(req, res) {
  const id = req.params.id;
  const { days } = req.body; // e.g. 30, 90, 365, or -1 for never expire (NULL)

  let newExpiresAt = null;
  if (days && days > 0) {
    const d = new Date();
    d.setDate(d.getDate() + Number(days));
    newExpiresAt = d.toISOString().slice(0, 19).replace('T', ' ');
  }

  await query("UPDATE love_pages SET expires_at = ?, status = 'active' WHERE id = ?", [newExpiresAt, id]);
  res.json({ success: true, message: "Page expiration extended successfully.", expires_at: newExpiresAt });
}

// Delete Love Page Permanently
export async function adminDeletePage(req, res) {
  const id = req.params.id;
  const existing = await query("SELECT id FROM love_pages WHERE id = ?", [id]);
  if (!existing.length) {
    res.status(404).json({ success: false, error: "Page not found." });
    return;
  }

  await query("DELETE FROM love_pages WHERE id = ?", [id]);
  res.json({ success: true, message: "Love page deleted permanently." });
}

// List Users
export async function adminListUsers(_req, res) {
  const users = await query(
    `SELECT u.id, u.name, u.email, u.status, u.created_at,
            COUNT(p.id) AS page_count
     FROM users u
     LEFT JOIN love_pages p ON p.user_id = u.id
     GROUP BY u.id
     ORDER BY u.created_at DESC`
  );
  res.json({ success: true, users });
}

// Toggle User Status (Active vs Blocked)
export async function adminToggleUserStatus(req, res) {
  const id = req.params.id;
  const { status } = req.body;
  if (!["active", "blocked"].includes(status)) {
    res.status(400).json({ success: false, error: "Invalid status." });
    return;
  }
  await query("UPDATE users SET status = ? WHERE id = ?", [status, id]);
  res.json({ success: true, message: `User status changed to ${status}.` });
}

// Music Library Control
export async function adminListMusic(_req, res) {
  const tracks = await query("SELECT * FROM music ORDER BY id DESC");
  res.json({ success: true, tracks });
}

export async function adminAddMusic(req, res) {
  const audioFiles = req.files?.audioFiles || (req.file ? [req.file] : req.files?.audioFile || []);

  if (audioFiles.length > 1) {
    const defaultArtist = String(req.body.artist || "").trim();
    const defaultTone = String(req.body.tone || "romantic").trim();
    let titles = [];
    try {
      if (typeof req.body.titles === "string") {
        titles = JSON.parse(req.body.titles);
      } else if (Array.isArray(req.body.titles)) {
        titles = req.body.titles;
      }
    } catch {
      titles = [];
    }

    const insertedTracks = [];
    for (let i = 0; i < audioFiles.length; i++) {
      const file = audioFiles[i];
      const file_url = `/uploads/${file.filename}`;
      const title = String(titles[i] || file.originalname.replace(/\.[^/.]+$/, "")).trim() || `Track ${i + 1}`;
      const artist = defaultArtist;
      const tone = defaultTone;

      const result = await query(
        "INSERT INTO music (title, artist, file_url, duration, tone, status) VALUES (?, ?, ?, 0, ?, 'active')",
        [title, artist, file_url, tone]
      );

      insertedTracks.push({
        id: result.insertId,
        title,
        artist,
        file_url,
        tone,
        status: "active",
      });
    }

    res.json({
      success: true,
      count: insertedTracks.length,
      tracks: insertedTracks,
      message: `${insertedTracks.length} music tracks added successfully.`,
    });
    return;
  }

  const singleFile = audioFiles[0] || req.file;
  let file_url = req.body.file_url;
  if (singleFile) {
    file_url = `/uploads/${singleFile.filename}`;
  }

  let title = String(req.body.title || "").trim();
  if (!title && singleFile) {
    title = singleFile.originalname.replace(/\.[^/.]+$/, "");
  }

  if (!title) {
    res.status(400).json({ success: false, error: "Track title is required." });
    return;
  }

  if (!file_url) {
    res.status(400).json({ success: false, error: "Audio file upload or Audio URL is required." });
    return;
  }

  const artist = String(req.body.artist || "").trim();
  const duration = Number(req.body.duration) || 0;
  const tone = String(req.body.tone || "romantic").trim();

  const result = await query(
    "INSERT INTO music (title, artist, file_url, duration, tone, status) VALUES (?, ?, ?, ?, ?, 'active')",
    [title, artist, file_url, duration, tone]
  );

  const track = {
    id: result.insertId,
    title,
    artist,
    file_url,
    duration,
    tone,
    status: "active",
  };

  res.json({ success: true, id: result.insertId, track, message: "Music track added successfully." });
}

export async function adminDeleteMusic(req, res) {
  await query("DELETE FROM music WHERE id = ?", [req.params.id]);
  res.json({ success: true, message: "Music track deleted." });
}

// Themes & Background Images Control
export async function adminListThemes(_req, res) {
  const themes = await query("SELECT * FROM themes ORDER BY id DESC");
  res.json({ success: true, themes });
}

export async function adminAddTheme(req, res) {
  const name = String(req.body.name || "").trim();
  const slug = String(req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-")).trim();

  if (!name || !slug) {
    res.status(400).json({ success: false, error: "Theme name and slug are required." });
    return;
  }

  let bgImage = req.body.backgroundImage || "";
  if (req.file) {
    bgImage = `/uploads/${req.file.filename}`;
  }

  const config = {
    primary: req.body.primary || "#ff4f81",
    background: req.body.background || "#fff1f5",
    accent: req.body.accent || "#c9184a",
    font: req.body.font || "Playfair Display",
    animation: req.body.animation || "hearts",
    backgroundImage: bgImage,
  };

  const thumbnail = bgImage || req.body.thumbnail || "";

  try {
    const result = await query(
      "INSERT INTO themes (name, slug, thumbnail, config, status) VALUES (?, ?, ?, ?, 'active')",
      [name, slug, thumbnail, JSON.stringify(config)]
    );

    const newTheme = {
      id: result.insertId,
      name,
      slug,
      thumbnail,
      config,
      status: "active",
    };

    res.json({ success: true, theme: newTheme, message: "Theme & background image created successfully." });
  } catch (err) {
    if (err.message?.includes("Duplicate")) {
      res.status(400).json({ success: false, error: "A theme with this slug already exists." });
      return;
    }
    throw err;
  }
}

export async function adminUpdateTheme(req, res) {
  const id = req.params.id;
  const existingRows = await query("SELECT * FROM themes WHERE id = ?", [id]);
  if (!existingRows.length) {
    res.status(404).json({ success: false, error: "Theme not found." });
    return;
  }

  const existing = existingRows[0];
  let currentConfig = {};
  try {
    currentConfig = typeof existing.config === "string" ? JSON.parse(existing.config) : (existing.config || {});
  } catch {
    currentConfig = {};
  }

  const name = String(req.body.name || existing.name).trim();
  const slug = String(req.body.slug || existing.slug).trim();
  const status = req.body.status || existing.status;

  let bgImage = req.body.backgroundImage || currentConfig.backgroundImage || "";
  if (req.file) {
    bgImage = `/uploads/${req.file.filename}`;
  }

  const config = {
    ...currentConfig,
    primary: req.body.primary || currentConfig.primary || "#ff4f81",
    background: req.body.background || currentConfig.background || "#fff1f5",
    accent: req.body.accent || currentConfig.accent || "#c9184a",
    font: req.body.font || currentConfig.font || "Playfair Display",
    animation: req.body.animation || currentConfig.animation || "hearts",
    backgroundImage: bgImage,
  };

  const thumbnail = bgImage || req.body.thumbnail || existing.thumbnail || "";

  await query(
    "UPDATE themes SET name = ?, slug = ?, thumbnail = ?, config = ?, status = ? WHERE id = ?",
    [name, slug, thumbnail, JSON.stringify(config), status, id]
  );

  const updatedRows = await query("SELECT * FROM themes WHERE id = ?", [id]);
  res.json({ success: true, theme: updatedRows[0], message: "Background image & theme updated successfully." });
}

export async function adminDeleteTheme(req, res) {
  const id = req.params.id;
  await query("DELETE FROM themes WHERE id = ?", [id]);
  res.json({ success: true, message: "Theme deleted successfully." });
}

export async function adminToggleThemeStatus(req, res) {
  const id = req.params.id;
  const { status } = req.body;
  if (!["active", "inactive"].includes(status)) {
    res.status(400).json({ success: false, error: "Invalid status value." });
    return;
  }
  await query("UPDATE themes SET status = ? WHERE id = ?", [status, id]);
  res.json({ success: true, message: `Theme status changed to ${status}.` });
}

// System Visitor Logs
export async function adminGetLogs(_req, res) {
  const logs = await query(
    `SELECT v.id, v.ip_hash, v.device, v.location, v.viewed_at, p.slug, p.creator_name, p.partner_name
     FROM page_views v
     JOIN love_pages p ON v.love_page_id = p.id
     ORDER BY v.viewed_at DESC
     LIMIT 100`
  );
  res.json({ success: true, logs });
}

export async function adminGetPageLogs(req, res) {
  const pageId = Number(req.params.id);
  const pageRows = await query(
    "SELECT id, slug, creator_name, partner_name, views, created_at FROM love_pages WHERE id = ?",
    [pageId]
  );
  if (!pageRows[0]) {
    res.status(404).json({ success: false, error: "Love page not found." });
    return;
  }
  const page = pageRows[0];

  const logs = await query(
    `SELECT v.id, v.ip_hash, v.device, v.location, v.viewed_at
     FROM page_views v
     WHERE v.love_page_id = ?
     ORDER BY v.viewed_at DESC
     LIMIT 200`,
    [pageId]
  );

  res.json({ success: true, page, logs });
}

// Admin Account Settings Update
export async function adminUpdateAccount(req, res) {
  const adminId = req.admin.id;
  const { email, currentPassword, newPassword } = req.body;

  const rows = await query("SELECT id, password_hash FROM admins WHERE id = ?", [adminId]);
  const admin = rows[0];
  if (!admin) {
    res.status(404).json({ success: false, error: "Admin not found." });
    return;
  }

  if (newPassword) {
    if (!currentPassword) {
      res.status(400).json({ success: false, error: "Current password is required to change password." });
      return;
    }
    const ok = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!ok) {
      res.status(401).json({ success: false, error: "Current password is incorrect." });
      return;
    }
    const newHash = await bcrypt.hash(newPassword, 10);
    await query("UPDATE admins SET password_hash = ? WHERE id = ?", [newHash, adminId]);
  }

  if (email && email !== req.admin.email) {
    await query("UPDATE admins SET email = ? WHERE id = ?", [email.trim().toLowerCase(), adminId]);
  }

  res.json({ success: true, message: "Admin account settings updated successfully." });
}

// Contact Messages & Love Notes Control
export async function adminListMessages(_req, res) {
  const messages = await query("SELECT * FROM contact_messages ORDER BY created_at DESC");
  res.json({ success: true, messages });
}

export async function adminUpdateMessageStatus(req, res) {
  const id = req.params.id;
  const { status } = req.body;
  if (!["unread", "read", "replied", "archived"].includes(status)) {
    res.status(400).json({ success: false, error: "Invalid status value." });
    return;
  }
  await query("UPDATE contact_messages SET status = ? WHERE id = ?", [status, id]);
  res.json({ success: true, message: `Message status updated to ${status}.` });
}

export async function adminDeleteMessage(req, res) {
  const id = req.params.id;
  await query("DELETE FROM contact_messages WHERE id = ?", [id]);
  res.json({ success: true, message: "Contact message deleted." });
}

// Payment Verifications & QR Paywall Control Center
export async function adminListPayments(_req, res) {
  const payments = await query(
    `SELECT v.*, p.creator_name, p.partner_name, p.title, p.status AS page_status, p.is_unlocked
     FROM payment_verifications v
     JOIN love_pages p ON v.love_page_id = p.id
     ORDER BY v.created_at DESC`
  );
  res.json({ success: true, payments });
}

export async function adminUpdatePaymentStatus(req, res) {
  const id = req.params.id;
  const { status } = req.body;

  if (!["approved", "rejected", "pending"].includes(status)) {
    res.status(400).json({ success: false, error: "Invalid status value." });
    return;
  }

  const rows = await query("SELECT love_page_id FROM payment_verifications WHERE id = ?", [id]);
  if (!rows[0]) {
    res.status(404).json({ success: false, error: "Payment verification record not found." });
    return;
  }

  const pageId = rows[0].love_page_id;

  await query("UPDATE payment_verifications SET status = ? WHERE id = ?", [status, id]);

  if (status === "approved") {
    await query("UPDATE love_pages SET is_unlocked = 1 WHERE id = ?", [pageId]);
  } else if (status === "rejected") {
    await query("UPDATE love_pages SET is_unlocked = 0 WHERE id = ?", [pageId]);
  }

  res.json({
    success: true,
    message: status === "approved" ? "Payment approved and page unlocked successfully!" : `Payment status updated to '${status}'.`,
  });
}

export async function adminTogglePageUnlock(req, res) {
  const id = req.params.id;
  const { is_unlocked } = req.body;
  const val = is_unlocked ? 1 : 0;
  await query("UPDATE love_pages SET is_unlocked = ? WHERE id = ?", [val, id]);
  res.json({ success: true, message: `Page unlock status changed to ${val ? "Unlocked" : "Locked (3 Free Views)"}.` });
}

export async function adminDeletePayment(req, res) {
  const id = req.params.id;
  await query("DELETE FROM payment_verifications WHERE id = ?", [id]);
  res.json({ success: true, message: "Payment verification record deleted." });
}

// Payment Settings Control (UPI ID & QR Code Image)
export async function getPaymentSettings(_req, res) {
  try {
    const rows = await query("SELECT setting_key, setting_value FROM payment_settings");
    const settingsMap = {};
    for (const row of rows) {
      settingsMap[row.setting_key] = row.setting_value;
    }
    res.json({
      success: true,
      settings: {
        upiId: settingsMap.upi_id || "lovedoes@ybl",
        qrCodeUrl: settingsMap.qr_code_url || "",
      },
    });
  } catch (err) {
    res.json({
      success: true,
      settings: {
        upiId: "lovedoes@ybl",
        qrCodeUrl: "",
      },
    });
  }
}

export async function updatePaymentSettings(req, res) {
  let upiId = String(req.body.upiId || req.body.upi_id || "").trim();
  let qrCodeUrl = req.body.qrCodeUrl || req.body.qr_code_url;

  if (req.file) {
    qrCodeUrl = `/uploads/${req.file.filename}`;
  }

  // Ensure table exists
  await query(`
    CREATE TABLE IF NOT EXISTS payment_settings (
      setting_key VARCHAR(100) PRIMARY KEY,
      setting_value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  if (upiId) {
    await query(
      `INSERT INTO payment_settings (setting_key, setting_value)
       VALUES ('upi_id', ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      [upiId]
    );
  }

  if (qrCodeUrl !== undefined && qrCodeUrl !== null) {
    await query(
      `INSERT INTO payment_settings (setting_key, setting_value)
       VALUES ('qr_code_url', ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      [qrCodeUrl]
    );
  }

  const rows = await query("SELECT setting_key, setting_value FROM payment_settings");
  const settingsMap = {};
  for (const row of rows) {
    settingsMap[row.setting_key] = row.setting_value;
  }

  clearApiCache("public_payment_settings");

  res.json({
    success: true,
    message: "Payment QR Code image and UPI ID updated successfully!",
    settings: {
      upiId: settingsMap.upi_id || "lovedoes@ybl",
      qrCodeUrl: settingsMap.qr_code_url || "",
    },
  });
}


