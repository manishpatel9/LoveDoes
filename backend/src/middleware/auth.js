import jwt from "jsonwebtoken";
import { query } from "../config/db.js";

export function signAdmin(admin) {
  return jwt.sign(
    { id: admin.id, email: admin.email, role: "admin" },
    process.env.JWT_SECRET || "dev-secret-change-me",
    { expiresIn: "12h" }
  );
}

export function authCookie(token, res) {
  res.cookie("lovedoes_admin", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 12 * 60 * 60 * 1000,
    path: "/",
  });
}

export async function requireAdmin(req, res, next) {
  try {
    const token = req.cookies?.lovedoes_admin;
    if (!token) {
      res.status(401).json({ success: false, error: "Please sign in." });
      return;
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret-change-me");
    if (payload.role !== "admin") {
      res.status(403).json({ success: false, error: "Forbidden." });
      return;
    }
    const rows = await query("SELECT id, email FROM admins WHERE id = ? AND status = 'active'", [payload.id]);
    if (!rows[0]) {
      res.status(401).json({ success: false, error: "Please sign in." });
      return;
    }
    req.admin = rows[0];
    next();
  } catch {
    res.status(401).json({ success: false, error: "Please sign in." });
  }
}
