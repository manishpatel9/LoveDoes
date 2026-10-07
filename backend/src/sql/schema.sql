CREATE DATABASE IF NOT EXISTS mylove_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mylove_db;

CREATE TABLE IF NOT EXISTS admins (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(190) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  status ENUM('active','blocked') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(190) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  status ENUM('active','blocked') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS themes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  slug VARCHAR(80) UNIQUE NOT NULL,
  thumbnail VARCHAR(255),
  config JSON NOT NULL,
  status ENUM('active','inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS music (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  artist VARCHAR(120),
  file_url TEXT,
  duration INT UNSIGNED DEFAULT 0,
  tone VARCHAR(40) DEFAULT 'none',
  status ENUM('active','inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS love_pages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL,
  slug VARCHAR(180) UNIQUE NOT NULL,
  creator_name VARCHAR(100) NOT NULL,
  partner_name VARCHAR(100) NOT NULL,
  title VARCHAR(255),
  occasion VARCHAR(120),
  special_date DATE NULL,
  message TEXT,
  audio_url TEXT,
  theme_id BIGINT UNSIGNED NULL,
  music_id BIGINT UNSIGNED NULL,
  status ENUM('draft','active','expired','disabled') DEFAULT 'active',
  is_unlocked TINYINT(1) DEFAULT 0,
  views INT UNSIGNED DEFAULT 0,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (user_id),
  INDEX (theme_id),
  INDEX (music_id),
  INDEX (status),
  CONSTRAINT fk_love_pages_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_love_pages_theme FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE SET NULL,
  CONSTRAINT fk_love_pages_music FOREIGN KEY (music_id) REFERENCES music(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS love_photos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  love_page_id BIGINT UNSIGNED NOT NULL,
  type ENUM('creator','partner','memory','couple') NOT NULL,
  file_url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (love_page_id),
  CONSTRAINT fk_photos_page FOREIGN KEY (love_page_id) REFERENCES love_pages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS memories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  love_page_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(150),
  description TEXT,
  photo_url TEXT,
  memory_date DATE NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (love_page_id),
  CONSTRAINT fk_memories_page FOREIGN KEY (love_page_id) REFERENCES love_pages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS page_views (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  love_page_id BIGINT UNSIGNED NOT NULL,
  ip_hash VARCHAR(64),
  device VARCHAR(40),
  location VARCHAR(150) DEFAULT 'Local Dev / Internal',
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (love_page_id),
  CONSTRAINT fk_views_page FOREIGN KEY (love_page_id) REFERENCES love_pages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  topic VARCHAR(120) NOT NULL DEFAULT 'General Inquiry',
  message TEXT NOT NULL,
  status ENUM('unread', 'read', 'replied', 'archived') DEFAULT 'unread',
  ip_address VARCHAR(80) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (status),
  INDEX (created_at)
);

CREATE TABLE IF NOT EXISTS payment_verifications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  love_page_id BIGINT UNSIGNED NOT NULL,
  slug VARCHAR(180) NOT NULL,
  payer_name VARCHAR(120) NOT NULL,
  utr_id VARCHAR(100) NOT NULL,
  phone_email VARCHAR(160) NOT NULL,
  amount DECIMAL(10, 2) DEFAULT 99.00,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (love_page_id),
  INDEX (slug),
  CONSTRAINT fk_payment_page FOREIGN KEY (love_page_id) REFERENCES love_pages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payment_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);



