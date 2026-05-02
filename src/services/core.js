// ─────────────────────────────────────────────
// src/services/core.js
// Base request engine — used by all API files
// ─────────────────────────────────────────────

const ENV_URLS = {
  local:      import.meta.env.VITE_API_URL_LOCAL      || "http://localhost:8000",
  staging:    import.meta.env.VITE_API_URL_STAGING     || "",
  production: import.meta.env.VITE_API_URL_PRODUCTION  || "",
};

const CURRENT_ENV     = import.meta.env.VITE_API_ENV || "local";
export const BASE_URL = ENV_URLS[CURRENT_ENV] || ENV_URLS.local;

const TOKEN_KEYS = {
  access:  import.meta.env.VITE_TOKEN_KEY_ACCESS  || "access",
  refresh: import.meta.env.VITE_TOKEN_KEY_REFRESH || "refresh",
  user:    import.meta.env.VITE_TOKEN_KEY_USER    || "user",
};

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

export function apiUrl(path) { return `${BASE_URL}${path}`; }

export function authHeaders() {
  const token = TokenService.getAccess();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

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
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  if (!response.ok) { TokenService.clearAll(); window.location.href = "/login"; return null; }
  const data     = await response.json();
  const newToken = data?.data?.access || data?.access;
  if (newToken) TokenService.setAccess(newToken);
  return newToken;
}

export async function request(path, options = {}, withAuth = true) {
  const url    = `${BASE_URL}${path}`;
  const config = { ...options, headers: { ...authHeaders(), ...(options.headers || {}) } };
  if (!withAuth) delete config.headers["Authorization"];

  let response = await fetch(url, config);

  if (response.status === 401 && withAuth) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => { refreshQueue.push({ resolve, reject }); })
        .then(token => {
          config.headers["Authorization"] = `Bearer ${token}`;
          return fetch(url, config).then(r => r.json());
        });
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