// ─────────────────────────────────────────────
// src/services/userApi.js
// User profile & account API calls
// ─────────────────────────────────────────────
import { request } from "./core";

export async function apiGetMe() {
  return request("/api/users/me/", { method: "GET" }, true);
}

export async function apiUpdateMe(data) {
  return request("/api/users/me/", { method: "PATCH", body: JSON.stringify(data) }, true);
}

export async function apiChangePassword(oldPassword, newPassword, confirmNewPassword) {
  return request("/api/auth/change-password/", {
    method: "PUT",
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword, confirm_new_password: confirmNewPassword }),
  }, true);
}

export async function apiDeleteAccount() {
  return request("/api/users/me/delete/", { method: "PUT" }, true);
}