const API = "/api/v1";

async function parse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || "Request failed");
    error.status = res.status;
    error.expired = data.expired;
    throw error;
  }
  return data;
}

const cred = { credentials: "include" };

export function listThemes() {
  return fetch(`${API}/themes`).then(parse);
}

export function listMusic() {
  return fetch(`${API}/music`).then(parse);
}

export function createLovePage(formData) {
  return fetch(`${API}/love-pages`, { method: "POST", body: formData }).then(parse);
}

export function getPublicPage(slug) {
  return fetch(`${API}/public/love/${slug}`).then(parse);
}

export function recordView(slug) {
  // Fire view recording immediately to keep page load fast
  return fetch(`${API}/public/love/${slug}/view`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ location: "" }),
  }).then(parse);
}

export function adminLogin(email, password) {
  return fetch(`${API}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    ...cred,
  }).then(parse);
}

export function adminLogout() {
  return fetch(`${API}/admin/logout`, { method: "POST", ...cred }).then(parse);
}

export function adminMe() {
  return fetch(`${API}/admin/me`, cred).then(parse);
}

export function adminStats() {
  return fetch(`${API}/admin/stats`, cred).then(parse);
}

export function adminPages(params = {}) {
  const query = new URLSearchParams(params).toString();
  return fetch(`${API}/admin/pages${query ? `?${query}` : ""}`, cred).then(parse);
}

export function adminPage(id) {
  return fetch(`${API}/admin/pages/${id}`, cred).then(parse);
}

export function adminUpdatePage(id, data) {
  return fetch(`${API}/admin/pages/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    ...cred,
  }).then(parse);
}

export function adminTogglePageStatus(id, status) {
  return fetch(`${API}/admin/pages/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
    ...cred,
  }).then(parse);
}

export function adminExtendPage(id, days) {
  return fetch(`${API}/admin/pages/${id}/extend`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ days }),
    ...cred,
  }).then(parse);
}

export function adminDeletePage(id) {
  return fetch(`${API}/admin/pages/${id}`, {
    method: "DELETE",
    ...cred,
  }).then(parse);
}

export function adminGetPageLogs(id) {
  return fetch(`${API}/admin/pages/${id}/logs`, cred).then(parse);
}

export function adminUsers() {
  return fetch(`${API}/admin/users`, cred).then(parse);
}

export function adminToggleUserStatus(id, status) {
  return fetch(`${API}/admin/users/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
    ...cred,
  }).then(parse);
}

export function adminMusic() {
  return fetch(`${API}/admin/music`, cred).then(parse);
}

export function adminAddMusic(data) {
  if (data instanceof FormData) {
    return fetch(`${API}/admin/music`, {
      method: "POST",
      body: data,
      ...cred,
    }).then(parse);
  }
  return fetch(`${API}/admin/music`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    ...cred,
  }).then(parse);
}

export function adminDeleteMusic(id) {
  return fetch(`${API}/admin/music/${id}`, {
    method: "DELETE",
    ...cred,
  }).then(parse);
}

export function adminThemes() {
  return fetch(`${API}/admin/themes`, cred).then(parse);
}

export function adminAddTheme(data) {
  if (data instanceof FormData) {
    return fetch(`${API}/admin/themes`, {
      method: "POST",
      body: data,
      ...cred,
    }).then(parse);
  }
  return fetch(`${API}/admin/themes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    ...cred,
  }).then(parse);
}

export function adminUpdateTheme(id, data) {
  if (data instanceof FormData) {
    return fetch(`${API}/admin/themes/${id}`, {
      method: "PUT",
      body: data,
      ...cred,
    }).then(parse);
  }
  return fetch(`${API}/admin/themes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    ...cred,
  }).then(parse);
}

export function adminDeleteTheme(id) {
  return fetch(`${API}/admin/themes/${id}`, {
    method: "DELETE",
    ...cred,
  }).then(parse);
}

export function adminToggleThemeStatus(id, status) {
  return fetch(`${API}/admin/themes/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
    ...cred,
  }).then(parse);
}

export function adminLogs() {
  return fetch(`${API}/admin/logs`, cred).then(parse);
}

export function adminUpdateAccount(data) {
  return fetch(`${API}/admin/account`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    ...cred,
  }).then(parse);
}

export function submitContactMessage(data) {
  return fetch(`${API}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(parse);
}

export function adminMessages() {
  return fetch(`${API}/admin/messages`, cred).then(parse);
}

export function adminUpdateMessageStatus(id, status) {
  return fetch(`${API}/admin/messages/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
    ...cred,
  }).then(parse);
}

export function adminDeleteMessage(id) {
  return fetch(`${API}/admin/messages/${id}`, {
    method: "DELETE",
    ...cred,
  }).then(parse);
}

export function submitPaymentVerification(slug, data) {
  return fetch(`${API}/public/love/${slug}/submit-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(parse);
}

export function checkAccessStatus(slug, utr = "") {
  return fetch(`${API}/public/love/${slug}/access-status?utr=${encodeURIComponent(utr)}`).then(parse);
}

export function adminPayments() {
  return fetch(`${API}/admin/payments`, cred).then(parse);
}

export function adminUpdatePaymentStatus(id, status) {
  return fetch(`${API}/admin/payments/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
    ...cred,
  }).then(parse);
}

export function adminTogglePageUnlock(id, is_unlocked) {
  return fetch(`${API}/admin/pages/${id}/unlock`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_unlocked }),
    ...cred,
  }).then(parse);
}

export function adminDeletePayment(id) {
  return fetch(`${API}/admin/payments/${id}`, {
    method: "DELETE",
    ...cred,
  }).then(parse);
}

export function getPublicPaymentSettings() {
  return fetch(`${API}/public/payment-settings`).then(parse);
}

export function adminGetPaymentSettings() {
  return fetch(`${API}/admin/payment-settings`, cred).then(parse);
}

export function adminUpdatePaymentSettings(data) {
  if (data instanceof FormData) {
    return fetch(`${API}/admin/payment-settings`, {
      method: "PUT",
      body: data,
      ...cred,
    }).then(parse);
  }
  return fetch(`${API}/admin/payment-settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    ...cred,
  }).then(parse);
}


