import crypto from "node:crypto";

function slugPart(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);
}

export function makeSlug(creatorName, partnerName) {
  const left = slugPart(creatorName) || "love";
  const right = slugPart(partnerName) || "story";
  const suffix = crypto.randomBytes(3).toString("hex");
  return `${left}-${right}-${suffix}`;
}

export function hashIp(ip) {
  return crypto.createHash("sha256").update(String(ip || "unknown")).digest("hex");
}
