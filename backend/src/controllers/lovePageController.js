import { query } from "../config/db.js";
import { hashIp, makeSlug } from "../utils/slug.js";

const apiCache = new Map();

export function clearApiCache(keyPrefix) {
  if (!keyPrefix) {
    apiCache.clear();
    return;
  }
  for (const k of apiCache.keys()) {
    if (k.startsWith(keyPrefix)) apiCache.delete(k);
  }
}

async function getOrSetCache(key, ttlMs, fetcher) {
  const cached = apiCache.get(key);
  if (cached && Date.now() - cached.timestamp < ttlMs) {
    return cached.data;
  }
  const data = await fetcher();
  apiCache.set(key, { data, timestamp: Date.now() });
  return data;
}

function publicUrl(file) {
  if (!file) return null;
  // If it's a multer-storage-cloudinary file, it provides a direct URL in 'path'
  if (typeof file === "object" && file.path && file.path.startsWith("http")) {
    return file.path;
  }
  const name = typeof file === "object" ? file.filename : file;
  if (!name) return null;
  if (name.startsWith("http")) return name;
  return `/uploads/${name}`;
}

function parseMemories(raw) {
  if (!raw) return [];
  try {
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(data) ? data.slice(0, 10) : [];
  } catch {
    return [];
  }
}

function deviceFromUa(ua = "") {
  if (/mobile/i.test(ua)) return "mobile";
  if (/tablet|ipad/i.test(ua)) return "tablet";
  return "desktop";
}

export async function listThemes(_req, res) {
  const themes = await getOrSetCache("public_themes", 60000, async () => {
    const rows = await query(
      "SELECT id, name, slug, config FROM themes WHERE status = 'active' ORDER BY id"
    );
    return rows.map((row) => ({
      ...row,
      config: typeof row.config === "string" ? JSON.parse(row.config) : row.config,
    }));
  });
  res.json({ success: true, themes });
}

export async function listMusic(_req, res) {
  const music = await getOrSetCache("public_music", 60000, async () => {
    return query(
      "SELECT id, title, artist, tone FROM music WHERE status = 'active' ORDER BY id"
    );
  });
  res.json({ success: true, music });
}

export async function createLovePage(req, res) {
  const creatorName = String(req.body.creatorName || "").trim().slice(0, 100);
  const partnerName = String(req.body.partnerName || "").trim().slice(0, 100);
  const title = String(req.body.title || "").trim().slice(0, 255);
  const occasion = String(req.body.occasion || "Valentine").trim().slice(0, 120);
  const specialDate = req.body.specialDate || null;
  const message = String(req.body.message || "").trim().slice(0, 1000);
  const themeId = Number(req.body.themeId);
  const musicId = Number(req.body.musicId);
  const memories = parseMemories(req.body.memories);

  if (!creatorName || !partnerName) {
    res.status(400).json({ success: false, error: "Please enter both names." });
    return;
  }

  const creatorPhoto = req.files?.creatorPhoto?.[0];
  const partnerPhoto = req.files?.partnerPhoto?.[0];
  if (!creatorPhoto || !partnerPhoto) {
    res.status(400).json({ success: false, error: "Please upload both photos." });
    return;
  }

  const themeRows = await query("SELECT id FROM themes WHERE id = ? AND status = 'active'", [themeId]);
  if (!themeRows.length) {
    res.status(400).json({ success: false, error: "Please choose a theme." });
    return;
  }

  const musicRows = await query("SELECT id FROM music WHERE id = ? AND status = 'active'", [musicId]);
  const resolvedMusicId = musicRows[0]?.id || null;

  const slug = makeSlug(creatorName, partnerName);
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const couplePhoto = req.files?.couplePhoto?.[0];
  const audioFile = req.files?.audioFile?.[0];

  const result = await query(
    `INSERT INTO love_pages
      (slug, creator_name, partner_name, title, occasion, special_date, message, audio_url, theme_id, music_id, status, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?)`,
    [
      slug,
      creatorName,
      partnerName,
      title || `${creatorName} & ${partnerName}`,
      occasion,
      specialDate || null,
      message,
      audioFile ? publicUrl(audioFile) : null,
      themeId,
      resolvedMusicId,
      expires,
    ]
  );

  const pageId = result.insertId;

  await query(
    "INSERT INTO love_photos (love_page_id, type, file_url, sort_order) VALUES (?, 'creator', ?, 0), (?, 'partner', ?, 1)",
    [pageId, publicUrl(creatorPhoto), pageId, publicUrl(partnerPhoto)]
  );
  if (couplePhoto) {
    await query(
      "INSERT INTO love_photos (love_page_id, type, file_url, sort_order) VALUES (?, 'couple', ?, 2)",
      [pageId, publicUrl(couplePhoto)]
    );
  }

  const memoryFiles = req.files?.memoryPhotos || [];
  let fileIndex = 0;
  for (let i = 0; i < memories.length; i += 1) {
    const memory = memories[i];
    const photo = memory.hasPhoto ? memoryFiles[fileIndex++] : null;
    await query(
      `INSERT INTO memories (love_page_id, title, description, photo_url, memory_date, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        pageId,
        String(memory.title || "Memory").slice(0, 150),
        String(memory.description || "").slice(0, 500),
        photo ? publicUrl(photo) : null,
        memory.date || null,
        i,
      ]
    );
  }

  res.status(201).json({
    success: true,
    page: {
      id: pageId,
      slug,
      url: `/love/${slug}`,
      creatorName,
      partnerName,
    },
  });
}

async function loadPublicPage(slug) {
  const pages = await query(
    `SELECT p.*, t.name AS theme_name, t.slug AS theme_slug, t.config AS theme_config,
            m.title AS music_title, m.tone AS music_tone
     FROM love_pages p
     LEFT JOIN themes t ON t.id = p.theme_id
     LEFT JOIN music m ON m.id = p.music_id
     WHERE p.slug = ?`,
    [slug]
  );
  const page = pages[0];
  if (!page) return null;
  if (page.status !== "active" || (page.expires_at && new Date(page.expires_at) < new Date())) {
    return { expired: true };
  }

  const photos = await query(
    "SELECT type, file_url, sort_order FROM love_photos WHERE love_page_id = ? ORDER BY sort_order",
    [page.id]
  );
  const memories = await query(
    "SELECT title, description, photo_url, memory_date, sort_order FROM memories WHERE love_page_id = ? ORDER BY sort_order",
    [page.id]
  );

  return {
    slug: page.slug,
    creatorName: page.creator_name,
    partnerName: page.partner_name,
    title: page.title,
    occasion: page.occasion,
    specialDate: page.special_date,
    message: page.message,
    audioUrl: page.audio_url,
    views: page.views,
    isUnlocked: Boolean(page.is_unlocked),
    theme: {
      name: page.theme_name,
      slug: page.theme_slug,
      config: typeof page.theme_config === "string" ? JSON.parse(page.theme_config) : page.theme_config,
    },
    music: { title: page.music_title, tone: page.music_tone },
    photos,
    memories,
  };
}

export async function getPublicPage(req, res) {
  const data = await loadPublicPage(req.params.slug);
  if (!data) {
    res.status(404).json({ success: false, error: "Love page not found." });
    return;
  }
  if (data.expired) {
    res.status(410).json({ success: false, expired: true, error: "This love page is no longer available." });
    return;
  }
  res.json({ success: true, page: data });
}

export async function recordView(req, res) {
  const pages = await query("SELECT id FROM love_pages WHERE slug = ? AND status = 'active'", [req.params.slug]);
  if (!pages[0]) {
    res.status(404).json({ success: false });
    return;
  }
  const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0] || req.socket?.remoteAddress || "0.0.0.0";
  const location = String(req.body.location || "Unknown Location").trim().slice(0, 150);
  await query("INSERT INTO page_views (love_page_id, ip_hash, device, location) VALUES (?, ?, ?, ?)", [
    pages[0].id,
    hashIp(ip),
    deviceFromUa(req.headers["user-agent"]),
    location,
  ]);
  await query("UPDATE love_pages SET views = views + 1 WHERE id = ?", [pages[0].id]);
  res.json({ success: true });
}

export async function submitContactMessage(req, res) {
  const name = String(req.body.name || "").trim().slice(0, 100);
  const email = String(req.body.email || "").trim().slice(0, 160);
  const topic = String(req.body.topic || req.body.subject || "General Inquiry").trim().slice(0, 120);
  const message = String(req.body.message || "").trim().slice(0, 2000);

  if (!name || !email || !message) {
    res.status(400).json({ success: false, error: "Name, email, and message are required." });
    return;
  }

  const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0] || req.socket?.remoteAddress || "0.0.0.0";

  await query(
    "INSERT INTO contact_messages (name, email, topic, message, status, ip_address) VALUES (?, ?, ?, ?, 'unread', ?)",
    [name, email, topic, message, hashIp(ip)]
  );

  res.status(201).json({ success: true, message: "Your message has been sent!" });
}

export async function submitPaymentVerification(req, res) {
  const slug = String(req.params.slug || "").trim();
  const payerName = String(req.body.payerName || "").trim().slice(0, 120);
  const utrId = String(req.body.utrId || "").trim().slice(0, 100);
  const phoneEmail = String(req.body.phoneEmail || "").trim().slice(0, 160);
  const notes = String(req.body.notes || "").trim().slice(0, 500);

  if (!payerName || !utrId || !phoneEmail) {
    res.status(400).json({ success: false, error: "Payer Name, UPI UTR Transaction ID, and Contact info are required." });
    return;
  }

  const pages = await query("SELECT id FROM love_pages WHERE slug = ? AND status = 'active'", [slug]);
  if (!pages[0]) {
    res.status(404).json({ success: false, error: "Love page not found." });
    return;
  }

  const pageId = pages[0].id;

  // Insert payment verification request
  try {
    await query(
      `INSERT INTO payment_verifications (love_page_id, slug, payer_name, utr_id, phone_email, amount, status, notes)
       VALUES (?, ?, ?, ?, ?, 99.00, 'pending', ?)`,
      [pageId, slug, payerName, utrId, phoneEmail, notes]
    );

    res.status(201).json({
      success: true,
      message: "Payment verification details submitted successfully! Admin will verify your payment shortly.",
      status: "pending",
      utrId,
    });
  } catch (err) {
    if (err.message?.includes("Duplicate")) {
      res.status(400).json({ success: false, error: "This UPI UTR / Transaction ID has already been submitted for verification." });
      return;
    }
    throw err;
  }
}

export async function checkAccessStatus(req, res) {
  const slug = String(req.params.slug || "").trim();
  const utrId = String(req.query.utr || "").trim();

  const pages = await query("SELECT id, is_unlocked FROM love_pages WHERE slug = ?", [slug]);
  if (!pages[0]) {
    res.status(404).json({ success: false, error: "Love page not found." });
    return;
  }

  const isUnlocked = Boolean(pages[0].is_unlocked);
  if (isUnlocked) {
    res.json({ success: true, isUnlocked: true, status: "approved" });
    return;
  }

  if (utrId) {
    const verifications = await query(
      "SELECT status FROM payment_verifications WHERE slug = ? AND utr_id = ? ORDER BY id DESC LIMIT 1",
      [slug, utrId]
    );
    if (verifications[0]) {
      const verStatus = verifications[0].status;
      if (verStatus === "approved") {
        // Auto unlock page if payment approved
        await query("UPDATE love_pages SET is_unlocked = 1 WHERE id = ?", [pages[0].id]);
        res.json({ success: true, isUnlocked: true, status: "approved" });
        return;
      }
      res.json({ success: true, isUnlocked: false, status: verStatus });
      return;
    }
  }

  res.json({ success: true, isUnlocked: false, status: "none" });
}

export async function getPublicPaymentSettings(_req, res) {
  try {
    const settings = await getOrSetCache("public_payment_settings", 60000, async () => {
      const rows = await query("SELECT setting_key, setting_value FROM payment_settings");
      const settingsMap = {};
      for (const row of rows) {
        settingsMap[row.setting_key] = row.setting_value;
      }
      return {
        upiId: settingsMap.upi_id || "lovedoes@ybl",
        qrCodeUrl: settingsMap.qr_code_url || "",
      };
    });
    res.json({ success: true, ...settings });
  } catch (err) {
    res.json({
      success: true,
      upiId: "lovedoes@ybl",
      qrCodeUrl: "",
    });
  }
}



