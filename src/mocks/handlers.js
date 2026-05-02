// ─────────────────────────────────────────────
// src/mocks/handlers.js
// MSW Mock Handlers — auth + dashboard
// ─────────────────────────────────────────────
import { http, HttpResponse } from "msw";
import {
  AUDIENCE_OVERVIEW, MAILCHIMP_CONNECTION, PROFILE_STATUS,
  TOP_MATCHES, RECENT_CAMPAIGNS, NOTIFICATIONS,
} from "./dashboardData";

const BASE  = import.meta.env.VITE_API_URL_LOCAL || "http://localhost:8000";
const DELAY = Number(import.meta.env.VITE_MOCK_DELAY) || 600;
const delay = (ms = DELAY) => new Promise(res => setTimeout(res, ms));

const MOCK_DB_KEY = import.meta.env.VITE_MOCK_DB_KEY || "mock_users_db";
function getMockUsers() {
  try { return JSON.parse(localStorage.getItem(MOCK_DB_KEY) || "[]"); }
  catch { return []; }
}
function saveMockUsers(users) {
  localStorage.setItem(MOCK_DB_KEY, JSON.stringify(users));
}

export const handlers = [

  // ── POST /api/auth/check-email/ ─────────────
  http.post(`${BASE}/api/auth/check-email/`, async ({ request }) => {
    await delay();
    const { email } = await request.json();
    const exists = getMockUsers().find(u => u.email === email);
    if (exists) return HttpResponse.json({ success: false, error: { detail: "Email is already taken.", existing: true }, status_code: 400 }, { status: 400 });
    return HttpResponse.json({ success: true, data: { detail: "Email is available.", existing: false }, status_code: 200 });
  }),

  // ── POST /api/auth/signup/ ───────────────────
  http.post(`${BASE}/api/auth/signup/`, async ({ request }) => {
    await delay();
    const body  = await request.json();
    const users = getMockUsers();
    if (users.find(u => u.email === body.email)) {
      return HttpResponse.json({ success: false, error: { detail: "A user with this email already exists." }, status_code: 400 }, { status: 400 });
    }
    const newUser = {
      id:          crypto.randomUUID(),
      email:       body.email,
      first_name:  body.first_name  || "",
      last_name:   body.last_name   || "",
      password:    body.password,
      role:        "owner",
      is_verified: false,
      date_joined: new Date().toISOString(),
    };
    users.push(newUser);
    saveMockUsers(users);
    console.log("✅ MSW — Registered:", newUser.email);
    return HttpResponse.json({
      success: true,
      data: { id: newUser.id, email: newUser.email, role: newUser.role, is_verified: false, date_joined: newUser.date_joined },
      status_code: 201,
    }, { status: 201 });
  }),

  // ── POST /api/auth/login/ ────────────────────
  http.post(`${BASE}/api/auth/login/`, async ({ request }) => {
    await delay();
    const { email, password } = await request.json();
    const users = getMockUsers();
    const user  = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return HttpResponse.json({ success: false, error: { detail: "Invalid email or password." }, status_code: 400 }, { status: 400 });
    }
    console.log("✅ MSW — Login:", user.email, "| is_verified:", user.is_verified, "| role:", user.role);
    return HttpResponse.json({
      success: true,
      data: {
        access:  `mock-access-${user.id}-${Date.now()}`,
        refresh: `mock-refresh-${user.id}-${Date.now()}`,
        user: {
          id:          user.id,
          email:       user.email,
          role:        user.role,
          is_verified: user.is_verified,
          first_name:  user.first_name || "",
          last_name:   user.last_name  || "",
        },
      },
      status_code: 200,
    });
  }),

  // ── GET /api/auth/verify-email/?token=xxx ────
  // Token format: mock-verify-EMAIL-TIMESTAMP
  // Finds user by email extracted from token and sets is_verified = true
  http.get(`${BASE}/api/auth/verify-email/`, async ({ request }) => {
    await delay();
    const url   = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return HttpResponse.json({ success: false, error: { detail: "Token is required." }, status_code: 400 }, { status: 400 });
    }

    const users = getMockUsers();

    // ── Parse email from token: mock-verify-{email}-{timestamp} ──
    // email can contain "-" so we find the last "-" as timestamp boundary
    if (token.startsWith("mock-verify-")) {
      const withoutPrefix = token.replace("mock-verify-", ""); // "email@example.com-1234567890"
      const lastDashIdx   = withoutPrefix.lastIndexOf("-");
      const emailFromToken = withoutPrefix.substring(0, lastDashIdx); // "email@example.com"

      const userIdx = users.findIndex(u => u.email === emailFromToken);
      if (userIdx !== -1) {
        users[userIdx].is_verified = true;
        saveMockUsers(users);
        console.log("✅ MSW — Email verified for:", users[userIdx].email);
      } else {
        console.warn("⚠️ MSW — User not found for email:", emailFromToken, "— accepting token anyway");
      }
    }

    return HttpResponse.json({
      success: true,
      data: { detail: "Email successfully verified" },
      status_code: 200,
    });
  }),

  // ── POST /api/auth/resend-verification/ ──────
  http.post(`${BASE}/api/auth/resend-verification/`, async ({ request }) => {
    await delay();
    const { email } = await request.json();
    const users = getMockUsers();
    const user  = users.find(u => u.email === email);

    if (user?.is_verified) {
      return HttpResponse.json({ success: false, error: { detail: "This email is already verified." }, status_code: 400 }, { status: 400 });
    }

    // Generate mock token with email embedded
    const mockToken  = `mock-verify-${email}-${Date.now()}`;
    const mockVerifyUrl = `${typeof window !== "undefined" ? window.location.origin : "http://localhost:5173"}/verify-email?token=${mockToken}`;

    console.log("📧 MSW — Resend verification for:", email);
    console.log("📧 MSW — Mock verify URL (click to verify):", mockVerifyUrl);

    return HttpResponse.json({ success: true, data: { detail: "Verification email sent." }, status_code: 200 });
  }),

  // ── POST /api/auth/forgot-password/ ─────────
  http.post(`${BASE}/api/auth/forgot-password/`, async ({ request }) => {
    await delay();
    const { email } = await request.json();
    console.log("✅ MSW — Forgot password for:", email);
    return HttpResponse.json({ success: true, data: { detail: "If this email exists, a reset link has been sent." }, status_code: 200 });
  }),

  // ── POST /api/auth/reset-password/ ──────────
  http.post(`${BASE}/api/auth/reset-password/`, async () => {
    await delay();
    return HttpResponse.json({ success: true, data: { detail: "Password reset successfully." }, status_code: 200 });
  }),

  // ── POST /api/auth/refresh/ ──────────────────
  http.post(`${BASE}/api/auth/refresh/`, async ({ request }) => {
    await delay(200);
    const { refresh } = await request.json();
    if (!refresh) return HttpResponse.json({ success: false, error: { detail: "Refresh token required." }, status_code: 400 }, { status: 400 });
    return HttpResponse.json({ success: true, data: { access: `mock-access-refreshed-${Date.now()}` }, status_code: 200 });
  }),

  // ── GET /api/users/me/ ───────────────────────
  http.get(`${BASE}/api/users/me/`, async ({ request }) => {
    await delay();
    if (!request.headers.get("Authorization")) {
      return HttpResponse.json({ success: false, error: { detail: "Authentication required." }, status_code: 401 }, { status: 401 });
    }
    const user = JSON.parse(localStorage.getItem(import.meta.env.VITE_TOKEN_KEY_USER || "user") || "{}");
    return HttpResponse.json({ success: true, data: { id: user.id || "mock-uuid", email: user.email || "", role: user.role || "owner", is_verified: user.is_verified || false, first_name: user.first_name || "", last_name: user.last_name || "" }, status_code: 200 });
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

  // ── Dashboard ────────────────────────────────
  http.get(`${BASE}/api/dashboard/audience-overview/`, async () => {
    await delay();
    return HttpResponse.json({ success: true, data: AUDIENCE_OVERVIEW, status_code: 200 });
  }),

  http.get(`${BASE}/api/dashboard/mailchimp-status/`, async () => {
    await delay();
    return HttpResponse.json({ success: true, data: MAILCHIMP_CONNECTION, status_code: 200 });
  }),

  http.post(`${BASE}/api/dashboard/mailchimp-sync/`, async () => {
    await delay(1000);
    return HttpResponse.json({ success: true, data: { status: "Active", lastSync: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" }) }, status_code: 200 });
  }),

  http.get(`${BASE}/api/dashboard/profile-status/`, async () => {
    await delay();
    return HttpResponse.json({ success: true, data: PROFILE_STATUS, status_code: 200 });
  }),

  http.get(`${BASE}/api/dashboard/top-matches/`, async ({ request }) => {
    await delay();
    const url   = new URL(request.url);
    const page  = Number(url.searchParams.get("page"))  || 1;
    const limit = Number(url.searchParams.get("limit")) || 3;
    if (!TOP_MATCHES || TOP_MATCHES.length === 0) {
      return HttpResponse.json({ success: true, data: [], pagination: { total: 0, page: 1, hasMore: false }, status_code: 200 });
    }
    const start   = (page - 1) * limit;
    const sliced  = TOP_MATCHES.slice(start, start + limit);
    const hasMore = start + limit < TOP_MATCHES.length;
    return HttpResponse.json({ success: true, data: sliced, pagination: { total: TOP_MATCHES.length, page, hasMore }, status_code: 200 });
  }),

  http.get(`${BASE}/api/dashboard/recent-campaigns/`, async () => {
    await delay();
    return HttpResponse.json({ success: true, data: RECENT_CAMPAIGNS || [], status_code: 200 });
  }),

  http.get(`${BASE}/api/notifications/`, async () => {
    await delay();
    const unreadCount = (NOTIFICATIONS || []).filter(n => !n.read).length;
    return HttpResponse.json({ success: true, data: NOTIFICATIONS || [], unreadCount, status_code: 200 });
  }),

];