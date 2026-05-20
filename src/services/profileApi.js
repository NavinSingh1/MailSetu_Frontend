// ─────────────────────────────────────────────
// src/services/profileApi.js
//
// ⭐ ALL PROFILE API CALLS LIVE HERE
//
// To switch to real backend:
//   Set VITE_MOCK_MODE=false in .env
//   Components stay exactly the same
// ─────────────────────────────────────────────
import { request } from "./core";

// ── 1. Profile Completion ──────────────────
// GET /api/profile/completion/
export async function apiGetProfileCompletion() {
  return request("/api/profile/completion/", { method: "GET" }, true);
}

// ── 2. Account ─────────────────────────────
// GET  /api/profile/account/
export async function apiGetAccount() {
  return request("/api/profile/account/", { method: "GET" }, true);
}

// POST /api/profile/account/
export async function apiUpdateAccount(data) {
  return request("/api/profile/account/", {
    method: "POST",
    body:   JSON.stringify(data),
  }, true);
}

// ── 3. Newsletter Profile ──────────────────
// GET  /api/profile/newsletter/
export async function apiGetNewsletterProfile() {
  return request("/api/profile/newsletter/", { method: "GET" }, true);
}

// POST /api/profile/newsletter/
export async function apiUpdateNewsletterProfile(data) {
  return request("/api/profile/newsletter/", {
    method: "POST",
    body:   JSON.stringify(data),
  }, true);
}

// ── 4. Mailchimp Integration ───────────────
// GET  /api/profile/mailchimp/
export async function apiGetMailchimpIntegration() {
  return request("/api/profile/mailchimp/", { method: "GET" }, true);
}

// POST /api/profile/mailchimp/connect/
export async function apiConnectMailchimp() {
  return request("/api/profile/mailchimp/connect/", { method: "POST" }, true);
}

// POST /api/profile/mailchimp/disconnect/
export async function apiDisconnectMailchimp() {
  return request("/api/profile/mailchimp/disconnect/", { method: "POST" }, true);
}

// ── 5. Insights ────────────────────────────
// GET /api/profile/insights/
export async function apiGetInsights() {
  return request("/api/profile/insights/", { method: "GET" }, true);
}

// ── 6. Privacy ─────────────────────────────
// GET  /api/profile/privacy/
export async function apiGetPrivacy() {
  return request("/api/profile/privacy/", { method: "GET" }, true);
}

// POST /api/profile/privacy/
export async function apiUpdatePrivacy(data) {
  return request("/api/profile/privacy/", {
    method: "POST",
    body:   JSON.stringify(data),
  }, true);
}

// ── 7. Payment ─────────────────────────────
// GET  /api/profile/payment/
export async function apiGetPayment() {
  return request("/api/profile/payment/", { method: "GET" }, true);
}

// POST /api/profile/payment/
export async function apiUpdatePayment(data) {
  return request("/api/profile/payment/", {
    method: "POST",
    body:   JSON.stringify(data),
  }, true);
}