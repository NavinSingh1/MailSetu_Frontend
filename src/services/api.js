// ─────────────────────────────────────────────
// src/services/api.js
// ⭐ Central re-export — import everything from here
//
// OR import directly from specific file:
//   import { apiLogin } from "./authApi"
//   import { apiGetMe } from "./userApi"
//   import { apiGetTopMatches } from "./dashboardApi"
//   import { request, TokenService } from "./core"
// ─────────────────────────────────────────────

export { request, BASE_URL, TokenService, apiUrl, authHeaders } from "./core";

export {
  apiSignup, apiCheckEmail, apiLogin, apiForgotPassword,
  apiResetPassword, apiRefreshToken, apiVerifyEmail, apiResendVerification,
} from "./authApi";

export { apiGetMe, apiUpdateMe, apiChangePassword, apiDeleteAccount } from "./userApi";

export {
  apiGetAudienceOverview, apiGetMailchimpStatus, apiSyncMailchimp,
  apiGetProfileStatus, apiGetTopMatches, apiGetRecentCampaigns, apiGetNotifications,
} from "./dashboardApi";

export {
  apiGetAccount, apiUpdateAccount, apiGetNewsletterProfile, apiUpdateNewsletterProfile,
  apiGetMailchimpIntegration, apiConnectMailchimp, apiDisconnectMailchimp,
  apiGetInsights, apiGetPrivacy, apiUpdatePrivacy, apiGetPayment,
  apiUpdatePayment, apiGetProfileCompletion,
} from "./profileApi";