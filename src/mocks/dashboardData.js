// ─────────────────────────────────────────────
// src/mocks/dashboardData.js
//
// ⭐ CENTRAL PLACE FOR ALL DASHBOARD DUMMY DATA
//
// To use dummy data:
//   Set data → shows filled state
//   Set null → shows empty state
//
// To connect real backend:
//   Step 1 → Set VITE_MOCK_MODE=false in .env
//   Step 2 → Remove handlers from handlers.js
//   Step 3 → Done ✅ — components fetch from real API
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// 1. AUDIENCE OVERVIEW
// API: GET /api/dashboard/audience-overview/
// ─────────────────────────────────────────────
export const AUDIENCE_OVERVIEW = {
  totalSubscribers: "12,500",
  avgOpenRate:      "22%",
  avgClickRate:     "3.5%",
};
// export const AUDIENCE_OVERVIEW = null; // ← empty state

// ─────────────────────────────────────────────
// 2. MAILCHIMP CONNECTION
// API: GET /api/dashboard/mailchimp-status/
// ─────────────────────────────────────────────
export const MAILCHIMP_CONNECTION = {
  status:   "Active",    // "Active" | "Inactive" | "Not Connected"
  lastSync: "25 Nov",
};
// export const MAILCHIMP_CONNECTION = null; // ← empty state

// ─────────────────────────────────────────────
// 3. PROFILE COMPLETION (Quick Actions card)
// API: GET /api/dashboard/profile-status/
// ─────────────────────────────────────────────
export const PROFILE_STATUS = {
  profileComplete:      false,
  completionPercentage: 40,     // 0-100
  message:              "Finish your profile for smarter recommendations",
  ctaState:             "incomplete",  // "incomplete" | "complete"
};
// export const PROFILE_STATUS = null; // ← empty state

// ─────────────────────────────────────────────
// 4. TOP MATCHES
// API: GET /api/dashboard/top-matches/
// ─────────────────────────────────────────────
export const TOP_MATCHES = [
  { id: 1, name: "Growth Marketing Agency", type: "Agency",  matchScore: 92, profileUrl: "#" },
  { id: 2, name: "Growth Marketing Agency", type: "Agency",  matchScore: 85, profileUrl: "#" },
  { id: 3, name: "Growth Marketing Agency", type: "Agency",  matchScore: 78, profileUrl: "#" },
];
// export const TOP_MATCHES = []; // ← empty state

// ─────────────────────────────────────────────
// 5. RECENT CAMPAIGNS
// API: GET /api/dashboard/recent-campaigns/
// ─────────────────────────────────────────────
export const RECENT_CAMPAIGNS = [
  { id: 1, name: "Growth Marketing Agency", date: "Sent 22 Nov", status: "Active",    openRate: "48%", reportUrl: "#" },
  { id: 2, name: "New Web Agency",          date: "Sent 15 Nov", status: "Completed", openRate: "48%", reportUrl: "#" },
];
// export const RECENT_CAMPAIGNS = []; // ← empty state

// ─────────────────────────────────────────────
// 6. NOTIFICATIONS
// API: GET /api/notifications/
// ─────────────────────────────────────────────
export const NOTIFICATIONS = [
  { id: 1, title: "New Match Found",    message: "Growth Marketing Agency matches your audience.", time: "2 min ago",   read: false },
  { id: 2, title: "Campaign Completed", message: "Your campaign 'New Web Agency' has completed.",  time: "1 hour ago",  read: false },
  { id: 3, title: "Mailchimp Synced",   message: "Your Mailchimp account was synced successfully.", time: "3 hours ago", read: true  },
];
// export const NOTIFICATIONS = []; // ← empty state

// ─────────────────────────────────────────────
// 7. USER PROFILE (avatar top-right)
// API: GET /api/users/me/
// ─────────────────────────────────────────────
export const USER_PROFILE = {
  name:         "John Doe",
  firstLetter:  "J",
  email:        "john@mailsetu.com",
  role:         "owner",
  profileImage: null,   // null = show first letter, string = show image URL
};
