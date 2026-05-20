// ─────────────────────────────────────────────
// src/mocks/profileHandlers.js
// MSW handlers for all profile endpoints
//
// Imported in browser.js:
//   import { profileHandlers } from "./profileHandlers";
//   setupWorker(...handlers, ...profileHandlers)
// ─────────────────────────────────────────────
import { http, HttpResponse } from "msw";
import {
  PROFILE_COMPLETION,
  ACCOUNT_DATA,
  NEWSLETTER_PROFILE,
  MAILCHIMP_INTEGRATION,
  INSIGHTS_DATA,
  PRIVACY_DATA,
  PAYMENT_DATA,
  PAYMENT_METHODS,
} from "./profileData";

const BASE  = import.meta.env.VITE_API_URL_LOCAL || "http://localhost:8000";
const DELAY = Number(import.meta.env.VITE_MOCK_DELAY) || 600;
const delay = (ms = DELAY) => new Promise(r => setTimeout(r, ms));

// In-session stores so saves persist during the session
let accountStore    = { ...ACCOUNT_DATA };
let newsletterStore = { ...NEWSLETTER_PROFILE };
let mailchimpStore  = { ...MAILCHIMP_INTEGRATION };
let privacyStore    = { ...PRIVACY_DATA };
let paymentStore    = { ...PAYMENT_DATA };

export const profileHandlers = [

  // ── GET /api/profile/completion/ ────────────
  http.get(`${BASE}/api/profile/completion/`, async () => {
    await delay(500);
    return HttpResponse.json({ success: true, data: PROFILE_COMPLETION, status_code: 200 });
  }),

  // ── GET /api/profile/account/ ───────────────
  http.get(`${BASE}/api/profile/account/`, async () => {
    await delay();
    return HttpResponse.json({ success: true, data: accountStore, status_code: 200 });
  }),

  // ── POST /api/profile/account/ ──────────────
  http.post(`${BASE}/api/profile/account/`, async ({ request }) => {
    await delay();
    const body   = await request.json();
    accountStore = { ...accountStore, ...body };
    console.log("✅ MSW — Account saved:", accountStore);
    return HttpResponse.json({ success: true, data: accountStore, status_code: 200 });
  }),

  // ── GET /api/profile/newsletter/ ────────────
  http.get(`${BASE}/api/profile/newsletter/`, async () => {
    await delay();
    return HttpResponse.json({ success: true, data: newsletterStore, status_code: 200 });
  }),

  // ── POST /api/profile/newsletter/ ───────────
  http.post(`${BASE}/api/profile/newsletter/`, async ({ request }) => {
    await delay();
    const body      = await request.json();
    newsletterStore = { ...newsletterStore, ...body };
    console.log("✅ MSW — Newsletter saved:", newsletterStore);
    return HttpResponse.json({ success: true, data: newsletterStore, status_code: 200 });
  }),

  // ── GET /api/profile/mailchimp/ ─────────────
  http.get(`${BASE}/api/profile/mailchimp/`, async () => {
    await delay();
    return HttpResponse.json({ success: true, data: mailchimpStore, status_code: 200 });
  }),

  // ── POST /api/profile/mailchimp/connect/ ────
  http.post(`${BASE}/api/profile/mailchimp/connect/`, async () => {
    await delay(900);
    mailchimpStore = { connected: true, status: "Connected", email: "user@mailchimp.com" };
    console.log("✅ MSW — Mailchimp connected");
    return HttpResponse.json({ success: true, data: mailchimpStore, status_code: 200 });
  }),

  // ── POST /api/profile/mailchimp/disconnect/ ──
  http.post(`${BASE}/api/profile/mailchimp/disconnect/`, async () => {
    await delay();
    mailchimpStore = { connected: false, status: "Disconnected", email: "" };
    console.log("✅ MSW — Mailchimp disconnected");
    return HttpResponse.json({ success: true, data: mailchimpStore, status_code: 200 });
  }),

  // ── GET /api/profile/insights/ ──────────────
  http.get(`${BASE}/api/profile/insights/`, async () => {
    await delay(700);
    return HttpResponse.json({ success: true, data: INSIGHTS_DATA, status_code: 200 });
  }),

  // ── GET /api/profile/privacy/ ───────────────
  http.get(`${BASE}/api/profile/privacy/`, async () => {
    await delay(500);
    return HttpResponse.json({ success: true, data: privacyStore, status_code: 200 });
  }),

  // ── POST /api/profile/privacy/ ──────────────
  http.post(`${BASE}/api/profile/privacy/`, async ({ request }) => {
    await delay(400);
    const body   = await request.json();
    privacyStore = { ...privacyStore, ...body };
    console.log("✅ MSW — Privacy saved:", privacyStore);
    return HttpResponse.json({ success: true, data: privacyStore, status_code: 200 });
  }),

  // ── GET /api/profile/payment/ ───────────────
  http.get(`${BASE}/api/profile/payment/`, async () => {
    await delay();
    return HttpResponse.json({
      success: true,
      data: { ...paymentStore, paymentMethods: PAYMENT_METHODS },
      status_code: 200,
    });
  }),

  // ── POST /api/profile/payment/ ──────────────
  http.post(`${BASE}/api/profile/payment/`, async ({ request }) => {
    await delay();
    const body   = await request.json();
    paymentStore = { ...paymentStore, ...body };
    console.log("✅ MSW — Payment saved:", paymentStore);
    return HttpResponse.json({ success: true, data: paymentStore, status_code: 200 });
  }),

];