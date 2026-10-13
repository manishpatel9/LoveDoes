import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import crypto from "node:crypto";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const uploadRoot = path.resolve(process.env.UPLOAD_DIR || "uploads");
const imageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const audioTypes = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/x-mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/m4a",
  "audio/x-m4a",
  "audio/aac",
  "audio/ogg",
  "audio/webm",
  "audio/opus",
  "audio/amr",
  "audio/3gpp",
  "video/mp4",
  "application/octet-stream",
]);
const maxImage = Number(process.env.MAX_FILE_SIZE_MB || 5) * 1024 * 1024;
const maxAudio = Number(process.env.MAX_AUDIO_MB || 12) * 1024 * 1024;

fs.mkdirSync(uploadRoot, { recursive: true });

// Configure Cloudinary explicitly from env vars (CLOUDINARY_URL auto-config may
// not work if dotenv hasn't run yet when this module is first imported).
const useCloud = Boolean(process.env.CLOUDINARY_URL || process.env.CLOUDINARY_CLOUD_NAME);
if (useCloud) {
  // If CLOUDINARY_URL is set the SDK auto-configures, but we also support
  // individual env vars as a fallback.
  if (!process.env.CLOUDINARY_URL && process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
  console.log("☁️  Cloudinary storage ACTIVE — uploads will persist in the cloud.");
} else {
  console.log("💾  Using local disk storage for uploads (files lost on Render restart!).");
}

/**
 * Return the public-facing URL for an uploaded file.
 * Works for both Cloudinary (file.path = full https URL) and disk storage.
 */
export function fileUrl(file) {
  if (!file) return null;
  // Cloudinary: multer-storage-cloudinary puts the full URL in file.path
  if (file.path && file.path.startsWith("http")) return file.path;
  // Disk storage fallback
  return `/uploads/${file.filename}`;
}

const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const imageExt = [".jpg", ".jpeg", ".png", ".webp"].includes(ext) ? ext : null;
    const audioExt = [".mp3", ".mpeg", ".wav", ".m4a", ".aac", ".ogg", ".webm", ".opus", ".amr", ".3gp", ".m4r"].includes(ext) ? ext : null;
    const safeExt = imageTypes.has(file.mimetype)
      ? imageExt || ".jpg"
      : audioExt || ".mpeg";
    cb(null, `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${safeExt}`);
  },
});

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'lovedoes',
    resource_type: 'auto',
    public_id: (_req, _file) => `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`
  },
});

const activeStorage = useCloud ? cloudStorage : diskStorage;

export const createUpload = multer({
  storage: activeStorage,
  limits: { fileSize: maxAudio, files: 14 },
  fileFilter: (_req, file, cb) => {
    if (file.fieldname === "audioFile") {
      if (!audioTypes.has(file.mimetype) && !/\.(mp3|mpeg|wav|m4a|aac|ogg|webm|opus|amr|3gp|m4r)$/i.test(file.originalname || "")) {
        cb(new Error("Audio must be MP3, MPEG, WAV, M4A, AAC, OGG, WEBM, or OPUS"));
        return;
      }
      if (file.size && file.size > maxAudio) {
        cb(new Error("Audio must be under 12 MB"));
        return;
      }
      cb(null, true);
      return;
    }
    if (!imageTypes.has(file.mimetype)) {
      cb(new Error("Only JPEG, PNG, and WEBP images are allowed"));
      return;
    }
    cb(null, true);
  },
}).fields([
  { name: "creatorPhoto", maxCount: 1 },
  { name: "partnerPhoto", maxCount: 1 },
  { name: "couplePhoto", maxCount: 1 },
  { name: "audioFile", maxCount: 1 },
  { name: "memoryPhotos", maxCount: 10 },
]);

export const multiAudioUpload = multer({
  storage: activeStorage,
  limits: { fileSize: maxAudio, files: 100 },
  fileFilter: (_req, file, cb) => {
    if (!audioTypes.has(file.mimetype) && !/\.(mp3|mpeg|wav|m4a|aac|ogg|webm|opus|amr|3gp|m4r)$/i.test(file.originalname || "")) {
      cb(new Error("Audio must be MP3, MPEG, WAV, M4A, AAC, OGG, WEBM, or OPUS"));
      return;
    }
    cb(null, true);
  },
}).fields([
  { name: "audioFile", maxCount: 1 },
  { name: "audioFiles", maxCount: 100 },
]);

export function handleAudioUpload(req, res, next) {
  multiAudioUpload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_UNEXPECTED_FILE") {
          res.status(400).json({
            success: false,
            error: "Too many files uploaded at once. Maximum limit is 100 audio files per batch.",
          });
          return;
        }
        if (err.code === "LIMIT_FILE_SIZE") {
          res.status(400).json({
            success: false,
            error: "One or more audio files exceed the 12 MB size limit.",
          });
          return;
        }
      }
      res.status(400).json({ success: false, error: err.message || "Audio upload failed." });
      return;
    }
    next();
  });
}

export const singleImageUpload = multer({
  storage: activeStorage,
  limits: { fileSize: maxImage },
  fileFilter: (_req, file, cb) => {
    if (!imageTypes.has(file.mimetype)) {
      cb(new Error("Only JPEG, PNG, and WEBP images are allowed"));
      return;
    }
    cb(null, true);
  },
}).single("image");

export function handleImageUpload(req, res, next) {
  singleImageUpload(req, res, (err) => {
    if (err) {
      res.status(400).json({ success: false, error: err.message || "Image upload failed." });
      return;
    }
    next();
  });
}

export { maxImage };

