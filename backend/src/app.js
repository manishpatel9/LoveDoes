import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import "./config/db.js";
import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import api from "./routes/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const uploadDir = path.resolve(process.env.UPLOAD_DIR || "uploads");

app.use(compression());
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
const allowedOrigins = new Set([
  process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
]);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow specific origins, no origin (Postman/Server), or any Vercel preview domain
      if (!origin || allowedOrigins.has(origin) || origin.endsWith('.vercel.app')) {
        cb(null, true);
        return;
      }
      cb(null, false);
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(uploadDir, {
  index: false,
  fallthrough: false,
  maxAge: "7d",
  etag: true
}));
app.use("/api/v1", api);

app.use((err, _req, res, _next) => {
  const message = err.message || "Something went wrong";
  const status = /file|image|audio|upload|too large/i.test(message) ? 400 : 500;
  res.status(status).json({ success: false, error: message });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`Love API listening on http://localhost:${port}`);
});

