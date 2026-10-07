import { Router } from "express";
import rateLimit from "express-rate-limit";
import { createUpload, handleAudioUpload, handleImageUpload } from "../middleware/upload.js";
import { requireAdmin } from "../middleware/auth.js";
import {
  createLovePage,
  getPublicPage,
  listMusic,
  listThemes,
  recordView,
  submitContactMessage,
  submitPaymentVerification,
  checkAccessStatus,
  getPublicPaymentSettings,
} from "../controllers/lovePageController.js";
import {
  adminGetPage,
  adminListPages,
  adminLogin,
  adminLogout,
  adminMe,
  adminStats,
  adminUpdatePage,
  adminTogglePageStatus,
  adminExtendPage,
  adminDeletePage,
  adminListUsers,
  adminToggleUserStatus,
  adminListMusic as adminGetMusic,
  adminAddMusic,
  adminDeleteMusic,
  adminListThemes as adminGetThemes,
  adminAddTheme,
  adminUpdateTheme,
  adminDeleteTheme,
  adminToggleThemeStatus,
  adminListMessages,
  adminUpdateMessageStatus,
  adminDeleteMessage,
  adminGetLogs,
  adminGetPageLogs,
  adminUpdateAccount,
  adminListPayments,
  adminUpdatePaymentStatus,
  adminTogglePageUnlock,
  adminDeletePayment,
  getPaymentSettings,
  updatePaymentSettings,
} from "../controllers/adminController.js";

const router = Router();
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

function handleUpload(req, res, next) {
  createUpload(req, res, (err) => (err ? next(err) : next()));
}

const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 12,
  standardHeaders: true,
  legacyHeaders: false,
});
const createLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/health", (_req, res) => res.json({ ok: true }));
router.get("/themes", wrap(listThemes));
router.get("/music", wrap(listMusic));
router.post("/love-pages", createLimit, handleUpload, wrap(createLovePage));
router.get("/public/love/:slug", wrap(getPublicPage));
router.post("/public/love/:slug/view", wrap(recordView));
router.post("/contact", wrap(submitContactMessage));
router.get("/public/payment-settings", wrap(getPublicPaymentSettings));
router.post("/public/love/:slug/submit-payment", wrap(submitPaymentVerification));
router.get("/public/love/:slug/access-status", wrap(checkAccessStatus));

// ADMIN AUTHENTICATION & CORE
router.post("/admin/login", loginLimit, wrap(adminLogin));
router.post("/admin/logout", wrap(adminLogout));
router.get("/admin/me", requireAdmin, wrap(adminMe));
router.get("/admin/stats", requireAdmin, wrap(adminStats));

// ADMIN LOVE PAGES CONTROL CENTER
router.get("/admin/pages", requireAdmin, wrap(adminListPages));
router.get("/admin/pages/:id", requireAdmin, wrap(adminGetPage));
router.get("/admin/pages/:id/logs", requireAdmin, wrap(adminGetPageLogs));
router.put("/admin/pages/:id", requireAdmin, wrap(adminUpdatePage));
router.patch("/admin/pages/:id/status", requireAdmin, wrap(adminTogglePageStatus));
router.patch("/admin/pages/:id/extend", requireAdmin, wrap(adminExtendPage));
router.patch("/admin/pages/:id/unlock", requireAdmin, wrap(adminTogglePageUnlock));
router.delete("/admin/pages/:id", requireAdmin, wrap(adminDeletePage));

// ADMIN PAYMENTS & QR ACCESS CONTROL
router.get("/admin/payments", requireAdmin, wrap(adminListPayments));
router.patch("/admin/payments/:id/status", requireAdmin, wrap(adminUpdatePaymentStatus));
router.delete("/admin/payments/:id", requireAdmin, wrap(adminDeletePayment));
router.get("/admin/payment-settings", requireAdmin, wrap(getPaymentSettings));
router.put("/admin/payment-settings", requireAdmin, handleImageUpload, wrap(updatePaymentSettings));

// ADMIN USERS MANAGEMENT
router.get("/admin/users", requireAdmin, wrap(adminListUsers));
router.patch("/admin/users/:id/status", requireAdmin, wrap(adminToggleUserStatus));

// ADMIN MUSIC & THEMES LIBRARIES
router.get("/admin/music", requireAdmin, wrap(adminGetMusic));
router.post("/admin/music", requireAdmin, handleAudioUpload, wrap(adminAddMusic));
router.delete("/admin/music/:id", requireAdmin, wrap(adminDeleteMusic));
router.get("/admin/themes", requireAdmin, wrap(adminGetThemes));
router.post("/admin/themes", requireAdmin, handleImageUpload, wrap(adminAddTheme));
router.put("/admin/themes/:id", requireAdmin, handleImageUpload, wrap(adminUpdateTheme));
router.delete("/admin/themes/:id", requireAdmin, wrap(adminDeleteTheme));
router.patch("/admin/themes/:id/status", requireAdmin, wrap(adminToggleThemeStatus));

// ADMIN CONTACT MESSAGES
router.get("/admin/messages", requireAdmin, wrap(adminListMessages));
router.patch("/admin/messages/:id/status", requireAdmin, wrap(adminUpdateMessageStatus));
router.delete("/admin/messages/:id", requireAdmin, wrap(adminDeleteMessage));

// ADMIN SYSTEM LOGS & ACCOUNT SETTINGS
router.get("/admin/logs", requireAdmin, wrap(adminGetLogs));
router.put("/admin/account", requireAdmin, wrap(adminUpdateAccount));

export default router;
