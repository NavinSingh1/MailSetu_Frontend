// ─────────────────────────────────────────────
// src/services/api.js
//
// Clean API — zero mock logic here
// MSW in src/mocks/handlers.js handles all mocking
//
// To switch environments → update .env only:
//   VITE_API_ENV=local       → VITE_API_URL_LOCAL
//   VITE_API_ENV=staging     → VITE_API_URL_STAGING
//   VITE_API_ENV=production  → VITE_API_URL_PRODUCTION
//
// To connect real backend:
//   VITE_MOCK_MODE=false
// ─────────────────────────────────────────────

const ENV_URLS = {
  local:      import.meta.env.VITE_API_URL_LOCAL      || "http://localhost:8000",
  staging:    import.meta.env.VITE_API_URL_STAGING     || "",
  production: import.meta.env.VITE_API_URL_PRODUCTION  || "",
};

const CURRENT_ENV     = import.meta.env.VITE_API_ENV || "local";
export const BASE_URL = ENV_URLS[CURRENT_ENV] || ENV_URLS.local;

// ─────────────────────────────────────────────
// TOKEN KEYS — from .env
// ─────────────────────────────────────────────
const TOKEN_KEYS = {
  access:  import.meta.env.VITE_TOKEN_KEY_ACCESS  || "access",
  refresh: import.meta.env.VITE_TOKEN_KEY_REFRESH || "refresh",
  user:    import.meta.env.VITE_TOKEN_KEY_USER    || "user",
};

// ─────────────────────────────────────────────
// TOKEN SERVICE
// ─────────────────────────────────────────────
export const TokenService = {
  getAccess:  ()      => localStorage.getItem(TOKEN_KEYS.access),
  getRefresh: ()      => localStorage.getItem(TOKEN_KEYS.refresh),
  getUser:    ()      => JSON.parse(localStorage.getItem(TOKEN_KEYS.user) || "null"),
  setAccess:  (token) => localStorage.setItem(TOKEN_KEYS.access, token),
  setTokens: (access, refresh, user) => {
    localStorage.setItem(TOKEN_KEYS.access,  access);
    localStorage.setItem(TOKEN_KEYS.refresh, refresh);
    localStorage.setItem(TOKEN_KEYS.user,    JSON.stringify(user));
  },
  clearAll: () => {
    localStorage.removeItem(TOKEN_KEYS.access);
    localStorage.removeItem(TOKEN_KEYS.refresh);
    localStorage.removeItem(TOKEN_KEYS.user);
  },
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEYS.access),
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
export function apiUrl(path) { return `${BASE_URL}${path}`; }

export function authHeaders() {
  const token = TokenService.getAccess();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─────────────────────────────────────────────
// AUTO TOKEN REFRESH
// ─────────────────────────────────────────────
let isRefreshing = false;
let refreshQueue = [];

function processQueue(error, token = null) {
  refreshQueue.forEach(({ resolve, reject }) => error ? reject(error) : resolve(token));
  refreshQueue = [];
}

async function refreshAccessToken() {
  const refreshToken = TokenService.getRefresh();
  if (!refreshToken) { TokenService.clearAll(); window.location.href = "/login"; return null; }
  const response = await fetch(`${BASE_URL}/api/auth/refresh/`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  if (!response.ok) { TokenService.clearAll(); window.location.href = "/login"; return null; }
  const data     = await response.json();
  const newToken = data?.data?.access || data?.access;
  if (newToken) TokenService.setAccess(newToken);
  return newToken;
}

// ─────────────────────────────────────────────
// CORE REQUEST
// ─────────────────────────────────────────────
async function request(path, options = {}, withAuth = true) {
  const url    = `${BASE_URL}${path}`;
  const config = { ...options, headers: { ...authHeaders(), ...(options.headers || {}) } };
  if (!withAuth) delete config.headers["Authorization"];

  let response = await fetch(url, config);

  if (response.status === 401 && withAuth) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => { refreshQueue.push({ resolve, reject }); })
        .then(token => { config.headers["Authorization"] = `Bearer ${token}`; return fetch(url, config).then(r => r.json()); });
    }
    isRefreshing = true;
    try {
      const newToken = await refreshAccessToken();
      if (!newToken) return { success: false, error: { detail: "Session expired." }, status_code: 401 };
      processQueue(null, newToken);
      config.headers["Authorization"] = `Bearer ${newToken}`;
      response = await fetch(url, config);
    } catch (err) {
      processQueue(err, null);
      TokenService.clearAll();
      window.location.href = "/login";
      return { success: false, error: { detail: "Session expired." }, status_code: 401 };
    } finally {
      isRefreshing = false;
    }
  }
  return await response.json();
}

// ─────────────────────────────────────────────
// AUTH API
// ─────────────────────────────────────────────
export async function apiCheckEmail(email) {
  return request("/api/auth/check-email/", { method: "POST", body: JSON.stringify({ email }) }, false);
}

export async function apiSignup({ firstName, lastName, email, password, passwordConfirmation }) {
  return request("/api/auth/signup/", { method: "POST", body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password, password_confirmation: passwordConfirmation }) }, false);
}

export async function apiLogin(email, password, captchaToken) {
  return request("/api/auth/login/", { method: "POST", body: JSON.stringify({ email, password, captcha_token: captchaToken }) }, false);
}

export async function apiForgotPassword(email) {
  return request("/api/auth/forgot-password/", { method: "POST", body: JSON.stringify({ email }) }, false);
}

export async function apiResetPassword(token, newPassword) {
  return request("/api/auth/reset-password/", { method: "POST", body: JSON.stringify({ token, new_password: newPassword }) }, false);
}

export async function apiRefreshToken() {
  return request("/api/auth/refresh/", { method: "POST", body: JSON.stringify({ refresh: TokenService.getRefresh() }) }, false);
}

export async function apiGetMe() {
  return request("/api/users/me/", { method: "GET" }, true);
}

export async function apiUpdateMe(data) {
  return request("/api/users/me/", { method: "PATCH", body: JSON.stringify(data) }, true);
}

export async function apiChangePassword(oldPassword, newPassword, confirmNewPassword) {
  return request("/api/auth/change-password/", { method: "PUT", body: JSON.stringify({ old_password: oldPassword, new_password: newPassword, confirm_new_password: confirmNewPassword }) }, true);
}

export async function apiDeleteAccount() {
  return request("/api/users/me/delete/", { method: "PUT" }, true);
}

// ─────────────────────────────────────────────
// DASHBOARD API
// ─────────────────────────────────────────────

// 1. Audience Overview
export async function apiGetAudienceOverview() {
  return request("/api/dashboard/audience-overview/", { method: "GET" }, true);
}

// 2. Mailchimp Connection
export async function apiGetMailchimpStatus() {
  return request("/api/dashboard/mailchimp-status/", { method: "GET" }, true);
}

export async function apiSyncMailchimp() {
  return request("/api/dashboard/mailchimp-sync/", { method: "POST" }, true);
}

// 3. Profile Status (Quick Actions)
export async function apiGetProfileStatus() {
  return request("/api/dashboard/profile-status/", { method: "GET" }, true);
}

// 4. Top Matches (with pagination)
export async function apiGetTopMatches(page = 1, limit = 3) {
  return request(`/api/dashboard/top-matches/?page=${page}&limit=${limit}`, { method: "GET" }, true);
}

// 5. Recent Campaigns
export async function apiGetRecentCampaigns() {
  return request("/api/dashboard/recent-campaigns/", { method: "GET" }, true);
}

// 6. Notifications
export async function apiGetNotifications() {
  return request("/api/notifications/", { method: "GET" }, true);
}
