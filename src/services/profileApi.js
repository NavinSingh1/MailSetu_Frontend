// ─────────────────────────────────────────────
// src/services/profileApi.js
// Profile-related API calls
// ─────────────────────────────────────────────
import { request } from "./core";

export async function apiGetAccount() {
  return request("/api/profile/account/", { method: "GET" }, true);
}

export async function apiUpdateAccount(data) {
  return request("/api/profile/account/", { method: "PATCH", body: JSON.stringify(data) }, true);
}

export async function apiGetNewsletterProfile() {
  return request("/api/profile/newsletter/", { method: "GET" }, true);
}

export async function apiUpdateNewsletterProfile(data) {
  return request("/api/profile/newsletter/", { method: "PATCH", body: JSON.stringify(data) }, true);
}

export async function apiGetMailchimpIntegration() {
  return request("/api/profile/mailchimp-integration/", { method: "GET" }, true);
}

export async function apiConnectMailchimp(data) {
  return request("/api/profile/mailchimp-connect/", { method: "POST", body: JSON.stringify(data) }, true);
}

export async function apiDisconnectMailchimp() {
  return request("/api/profile/mailchimp-disconnect/", { method: "POST" }, true);
}

export async function apiGetInsights() {
  return request("/api/profile/insights/", { method: "GET" }, true);
}

export async function apiGetPrivacy() {
  return request("/api/profile/privacy/", { method: "GET" }, true);
}

export async function apiUpdatePrivacy(data) {
  return request("/api/profile/privacy/", { method: "PATCH", body: JSON.stringify(data) }, true);
}

export async function apiGetPayment() {
  return request("/api/profile/payment/", { method: "GET" }, true);
}

export async function apiUpdatePayment(data) {
  return request("/api/profile/payment/", { method: "PATCH", body: JSON.stringify(data) }, true);
}

export async function apiGetProfileCompletion() {
  return request("/api/profile/completion/", { method: "GET" }, true);
}
