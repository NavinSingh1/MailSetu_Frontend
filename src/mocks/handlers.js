// ─────────────────────────────────────────────
// src/mocks/handlers.js
// MSW Mock Handlers — all API endpoints
//
// All dummy data lives in dashboardData.js
// To connect real backend → set VITE_MOCK_MODE=false
// ─────────────────────────────────────────────
import { http, HttpResponse } from "msw";
import {
  AUDIENCE_OVERVIEW,
  MAILCHIMP_CONNECTION,
  PROFILE_STATUS,
  TOP_MATCHES,
  RECENT_CAMPAIGNS,
  NOTIFICATIONS,
  USER_PROFILE,
} from "./dashboardData";

const BASE  = import.meta.env.VITE_API_URL_LOCAL || "http://localhost:8000";
const DELAY = Number(import.meta.env.VITE_MOCK_DELAY) || 600;
const delay = (ms = DELAY) => new Promise(res => setTimeout(res, ms));

// ─────────────────────────────────────────────
// Mock DB for auth
// ─────────────────────────────────────────────
const MOCK_DB_KEY = import.meta.env.VITE_MOCK_DB_KEY || "mock_users_db";
function getMockUsers() {
  try { return JSON.parse(localStorage.getItem(MOCK_DB_KEY) || "[]"); }
  catch { return []; }
}
function saveMockUsers(users) {
  localStorage.setItem(MOCK_DB_KEY, JSON.stringify(users));
}

export const handlers = [

  // ────────────────────────────────────────────
  // AUTH ENDPOINTS
  // ────────────────────────────────────────────

  http.post(`${BASE}/api/auth/check-email/`, async ({ request }) => {
    await delay();
    const { email } = await request.json();
    const exists = getMockUsers().find(u => u.email === email);
    if (exists) return HttpResponse.json({ success: false, error: { detail: "Email is already taken.", existing: true }, status_code: 400 }, { status: 400 });
    return HttpResponse.json({ success: true, data: { detail: "Email is available.", existing: false }, status_code: 200 });
  }),

  http.post(`${BASE}/api/auth/signup/`, async ({ request }) => {
    await delay();
    const body  = await request.json();
    const users = getMockUsers();
    if (users.find(u => u.email === body.email)) {
      return HttpResponse.json({ success: false, error: { detail: "A user with this email already exists." }, status_code: 400 }, { status: 400 });
    }
    const newUser = { id: crypto.randomUUID(), email: body.email, first_name: body.first_name, last_name: body.last_name, password: body.password, role: "owner", is_verified: false, date_joined: new Date().toISOString() };
    users.push(newUser);
    saveMockUsers(users);
    console.log("✅ MSW — Registered:", newUser.email);
    return HttpResponse.json({ success: true, data: { id: newUser.id, email: newUser.email, role: newUser.role, is_verified: newUser.is_verified, date_joined: newUser.date_joined }, status_code: 201 }, { status: 201 });
  }),

  http.post(`${BASE}/api/auth/login/`, async ({ request }) => {
    await delay();
    const { email, password } = await request.json();
    const user = getMockUsers().find(u => u.email === email && u.password === password);
    if (!user) return HttpResponse.json({ success: false, error: { detail: "Invalid email or password." }, status_code: 400 }, { status: 400 });
    console.log("✅ MSW — Login:", user.email);
    return HttpResponse.json({ success: true, data: { access: `mock-access-${user.id}-${Date.now()}`, refresh: `mock-refresh-${user.id}-${Date.now()}`, user: { id: user.id, email: user.email, role: user.role, is_verified: user.is_verified } }, status_code: 200 });
  }),

  http.post(`${BASE}/api/auth/forgot-password/`, async ({ request }) => {
    await delay();
    const { email } = await request.json();
    console.log("✅ MSW — Forgot password:", email);
    return HttpResponse.json({ success: true, data: { detail: "If this email exists, a reset link has been sent." }, status_code: 200 });
  }),

  http.post(`${BASE}/api/auth/reset-password/`, async () => {
    await delay();
    return HttpResponse.json({ success: true, data: { detail: "Password reset successfully." }, status_code: 200 });
  }),

  http.post(`${BASE}/api/auth/refresh/`, async ({ request }) => {
    await delay(200);
    const { refresh } = await request.json();
    if (!refresh) return HttpResponse.json({ success: false, error: { detail: "Refresh token required." }, status_code: 400 }, { status: 400 });
    console.log("✅ MSW — Token refreshed");
    return HttpResponse.json({ success: true, data: { access: `mock-access-refreshed-${Date.now()}` }, status_code: 200 });
  }),

  // ────────────────────────────────────────────
  // USER PROFILE
  // GET /api/users/me/
  // ────────────────────────────────────────────
  http.get(`${BASE}/api/users/me/`, async ({ request }) => {
    await delay();
    if (!request.headers.get("Authorization")) {
      return HttpResponse.json({ success: false, error: { detail: "Authentication required." }, status_code: 401 }, { status: 401 });
    }
    const storedUser = JSON.parse(localStorage.getItem(import.meta.env.VITE_TOKEN_KEY_USER || "user") || "{}");
    return HttpResponse.json({
      success: true,
      data: {
        id:           storedUser.id    || USER_PROFILE.name,
        name:         USER_PROFILE.name,
        email:        storedUser.email || USER_PROFILE.email,
        firstLetter:  USER_PROFILE.firstLetter,
        role:         storedUser.role  || USER_PROFILE.role,
        profileImage: USER_PROFILE.profileImage,
        is_verified:  storedUser.is_verified || false,
      },
      status_code: 200,
    });
  }),

  http.patch(`${BASE}/api/users/me/`, async ({ request }) => {
    await delay();
    const data = await request.json();
    return HttpResponse.json({ success: true, data, status_code: 200 });
  }),

  http.put(`${BASE}/api/auth/change-password/`, async () => {
    await delay();
    return HttpResponse.json({ success: true, data: { detail: "Password updated." }, status_code: 200 });
  }),

  http.put(`${BASE}/api/users/me/delete/`, async () => {
    await delay();
    return HttpResponse.json({ success: true, data: { detail: "Account deleted." }, status_code: 200 });
  }),

  // ────────────────────────────────────────────
  // 1. AUDIENCE OVERVIEW
  // GET /api/dashboard/audience-overview/
  // ────────────────────────────────────────────
  http.get(`${BASE}/api/dashboard/audience-overview/`, async () => {
    await delay();
    if (!AUDIENCE_OVERVIEW) {
      return HttpResponse.json({ success: true, data: null, status_code: 200 });
    }
    return HttpResponse.json({ success: true, data: AUDIENCE_OVERVIEW, status_code: 200 });
  }),

  // ────────────────────────────────────────────
  // 2. MAILCHIMP CONNECTION
  // GET /api/dashboard/mailchimp-status/
  // POST /api/dashboard/mailchimp-sync/
  // ────────────────────────────────────────────
  http.get(`${BASE}/api/dashboard/mailchimp-status/`, async () => {
    await delay();
    if (!MAILCHIMP_CONNECTION) {
      return HttpResponse.json({ success: true, data: null, status_code: 200 });
    }
    return HttpResponse.json({ success: true, data: MAILCHIMP_CONNECTION, status_code: 200 });
  }),

  http.post(`${BASE}/api/dashboard/mailchimp-sync/`, async () => {
    await delay(1000);   // sync takes longer
    console.log("✅ MSW — Mailchimp synced");
    return HttpResponse.json({ success: true, data: { status: "Active", lastSync: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" }) }, status_code: 200 });
  }),

  // ────────────────────────────────────────────
  // 3. PROFILE COMPLETION (Quick Actions)
  // GET /api/dashboard/profile-status/
  // ────────────────────────────────────────────
  http.get(`${BASE}/api/dashboard/profile-status/`, async () => {
    await delay();
    if (!PROFILE_STATUS) {
      return HttpResponse.json({ success: true, data: null, status_code: 200 });
    }
    return HttpResponse.json({ success: true, data: PROFILE_STATUS, status_code: 200 });
  }),

  // ────────────────────────────────────────────
  // 4. TOP MATCHES
  // GET /api/dashboard/top-matches/
  // ────────────────────────────────────────────
  http.get(`${BASE}/api/dashboard/top-matches/`, async ({ request }) => {
    await delay();
    const url  = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 3;

    if (!TOP_MATCHES || TOP_MATCHES.length === 0) {
      return HttpResponse.json({ success: true, data: [], pagination: { total: 0, page: 1, hasMore: false }, status_code: 200 });
    }

    const start   = (page - 1) * limit;
    const end     = start + limit;
    const sliced  = TOP_MATCHES.slice(start, end);
    const hasMore = end < TOP_MATCHES.length;

    return HttpResponse.json({
      success: true,
      data: sliced,
      pagination: { total: TOP_MATCHES.length, page, hasMore },
      status_code: 200,
    });
  }),

  // ────────────────────────────────────────────
  // 5. RECENT CAMPAIGNS
  // GET /api/dashboard/recent-campaigns/
  // ────────────────────────────────────────────
  http.get(`${BASE}/api/dashboard/recent-campaigns/`, async () => {
    await delay();
    if (!RECENT_CAMPAIGNS || RECENT_CAMPAIGNS.length === 0) {
      return HttpResponse.json({ success: true, data: [], status_code: 200 });
    }
    return HttpResponse.json({ success: true, data: RECENT_CAMPAIGNS, status_code: 200 });
  }),

  // ────────────────────────────────────────────
  // 6. NOTIFICATIONS
  // GET /api/notifications/
  // ────────────────────────────────────────────
  http.get(`${BASE}/api/notifications/`, async () => {
    await delay();
    if (!NOTIFICATIONS || NOTIFICATIONS.length === 0) {
      return HttpResponse.json({ success: true, data: [], unreadCount: 0, status_code: 200 });
    }
    const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;
    return HttpResponse.json({ success: true, data: NOTIFICATIONS, unreadCount, status_code: 200 });
  }),

];
