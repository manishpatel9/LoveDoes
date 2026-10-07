import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");

const themes = [
  {
    name: "Classic Love",
    slug: "classic",
    config: {
      primary: "#ff4f81",
      background: "#fff1f5",
      accent: "#c9184a",
      font: "Playfair Display",
      animation: "hearts",
    },
  },
  {
    name: "Elegant",
    slug: "elegant",
    config: {
      primary: "#d4af37",
      background: "#14110f",
      accent: "#f5e6c8",
      font: "Cormorant Garamond",
      animation: "sparkle",
    },
  },
  {
    name: "Cute",
    slug: "cute",
    config: {
      primary: "#ff8fab",
      background: "#fff0f6",
      accent: "#7b2cbf",
      font: "Quicksand",
      animation: "stickers",
    },
  },
  {
    name: "Sunset",
    slug: "sunset",
    config: {
      primary: "#ff7b54",
      background: "#fff4e6",
      accent: "#c1121f",
      font: "Poppins",
      animation: "glow",
    },
  },
  {
    name: "Forever",
    slug: "forever",
    config: {
      primary: "#e8b4b8",
      background: "#0b1026",
      accent: "#f8f4ff",
      font: "Cormorant Garamond",
      animation: "stars",
    },
  },
];

const musicRows = [
  ["No Music", "Silent", "none"],
  ["Soft Piano", "Original", "piano"],
  ["Romantic", "Original", "romantic"],
  ["Acoustic", "Original", "acoustic"],
  ["Instrumental", "Original", "instrumental"],
];

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
  });

  await connection.query(schema);

  async function addColumn(sql) {
    try {
      await connection.query(sql);
    } catch (err) {
      if (!/Duplicate column|already exists/i.test(err.message)) throw err;
    }
  }

  await addColumn("ALTER TABLE mylove_db.love_pages ADD COLUMN occasion VARCHAR(120) NULL");
  await addColumn("ALTER TABLE mylove_db.love_pages ADD COLUMN special_date DATE NULL");
  await addColumn("ALTER TABLE mylove_db.love_pages ADD COLUMN audio_url TEXT NULL");
  await addColumn("ALTER TABLE mylove_db.love_pages ADD COLUMN is_unlocked TINYINT(1) DEFAULT 0");
  await addColumn("ALTER TABLE mylove_db.page_views ADD COLUMN location VARCHAR(150) NULL DEFAULT 'Local Dev / Internal'");
  try {
    await connection.query(
      "ALTER TABLE mylove_db.love_photos MODIFY type ENUM('creator','partner','memory','couple') NOT NULL"
    );
  } catch {
    /* already migrated */
  }

  const email = (process.env.ADMIN_EMAIL || "admin@lovedoes.local").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "LoveAdmin@123";
  const hash = await bcrypt.hash(password, 12);
  await connection.query(
    `INSERT INTO mylove_db.admins (email, password_hash, status)
     VALUES (?, ?, 'active')
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), status = 'active'`,
    [email, hash]
  );

  for (const theme of themes) {
    await connection.query(
      `INSERT INTO mylove_db.themes (name, slug, config, status)
       VALUES (?, ?, ?, 'active')
       ON DUPLICATE KEY UPDATE name = VALUES(name), config = VALUES(config), status = 'active'`,
      [theme.name, theme.slug, JSON.stringify(theme.config)]
    );
  }

  const [existingMusic] = await connection.query("SELECT COUNT(*) AS c FROM mylove_db.music");
  if (!existingMusic[0].c) {
    for (const [title, artist, tone] of musicRows) {
      await connection.query(
        "INSERT INTO mylove_db.music (title, artist, tone, status) VALUES (?, ?, ?, 'active')",
        [title, artist, tone]
      );
    }
  }

  await connection.query(`
    CREATE TABLE IF NOT EXISTS mylove_db.payment_settings (
      setting_key VARCHAR(100) PRIMARY KEY,
      setting_value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await connection.query(
    `INSERT IGNORE INTO mylove_db.payment_settings (setting_key, setting_value)
     VALUES ('upi_id', 'lovedoes@ybl'), ('qr_code_url', '')`
  );

  await connection.end();
  console.log("Database mylove_db is ready.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
