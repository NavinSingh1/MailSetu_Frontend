// ─────────────────────────────────────────────
// src/services/dashboardApi.js
// All dashboard API calls
// ─────────────────────────────────────────────
import { request } from "./core";

export async function apiGetAudienceOverview() {
  return request("/api/dashboard/audience-overview/", { method: "GET" }, true);
}

export async function apiGetMailchimpStatus() {
  return request("/api/dashboard/mailchimp-status/", { method: "GET" }, true);
}

export async function apiSyncMailchimp() {
  return request("/api/dashboard/mailchimp-sync/", { method: "POST" }, true);
}

export async function apiGetProfileStatus() {
  return request("/api/dashboard/profile-status/", { method: "GET" }, true);
}

export async function apiGetTopMatches(page = 1, limit = 3) {
  return request(`/api/dashboard/top-matches/?page=${page}&limit=${limit}`, { method: "GET" }, true);
}

export async function apiGetRecentCampaigns() {
  return request("/api/dashboard/recent-campaigns/", { method: "GET" }, true);
}

export async function apiGetNotifications() {
  return request("/api/notifications/", { method: "GET" }, true);
}