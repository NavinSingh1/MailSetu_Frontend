// ─────────────────────────────────────────────
// src/services/authApi.js
// All authentication API calls
// ─────────────────────────────────────────────
import { request, TokenService } from "./core";

// POST /api/auth/signup/
export async function apiSignup({ firstName, lastName, email, password, passwordConfirmation }) {
  return request("/api/auth/signup/", {
    method: "POST",
    body: JSON.stringify({
      first_name:            firstName,
      last_name:             lastName,
      email,
      password,
      password_confirmation: passwordConfirmation,
    }),
  }, false);
}

// POST /api/auth/check-email/
export async function apiCheckEmail(email) {
  return request("/api/auth/check-email/", {
    method: "POST",
    body: JSON.stringify({ email }),
  }, false);
}

// POST /api/auth/login/
export async function apiLogin(email, password, captchaToken) {
  return request("/api/auth/login/", {
    method: "POST",
    body: JSON.stringify({ email, password, captcha_token: captchaToken }),
  }, false);
}

// POST /api/auth/forgot-password/
export async function apiForgotPassword(email) {
  return request("/api/auth/forgot-password/", {
    method: "POST",
    body: JSON.stringify({ email }),
  }, false);
}

// POST /api/auth/reset-password/
export async function apiResetPassword(token, newPassword) {
  return request("/api/auth/reset-password/", {
    method: "POST",
    body: JSON.stringify({ token, new_password: newPassword }),
  }, false);
}

// POST /api/auth/refresh/
export async function apiRefreshToken() {
  return request("/api/auth/refresh/", {
    method: "POST",
    body: JSON.stringify({ refresh: TokenService.getRefresh() }),
  }, false);
}

// GET /api/auth/verify-email/?token=xxx
export async function apiVerifyEmail(token) {
  return request(`/api/auth/verify-email/?token=${token}`, {
    method: "GET",
  }, false);
}

// POST /api/auth/resend-verification/
export async function apiResendVerification(email) {
  return request("/api/auth/resend-verification/", {
    method: "POST",
    body: JSON.stringify({ email }),
  }, false);
}