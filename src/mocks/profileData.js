// ─────────────────────────────────────────────
// src/mocks/profileData.js
//
// ⭐ CENTRAL PLACE FOR ALL PROFILE DUMMY DATA
// Edit values here — components read from here
// Set VITE_MOCK_MODE=false to use real backend
// ─────────────────────────────────────────────

// 1. PROFILE COMPLETION
export const PROFILE_COMPLETION = {
  percentage: 15,
  message:    "Complete your profile to get the best matches!",
};

// 2. ACCOUNT
export const ACCOUNT_DATA = {
  fullName:    "",
  email:       "",
  phoneNumber: "",
  address:     "",
};

// 3. NEWSLETTER PROFILE
export const NEWSLETTER_PROFILE = {
  newsletterName:       "",
  primaryIndustry:      "",
  targetAudience:       "",
  description:          "",
  audienceDemographics: "",
};

export const INDUSTRY_OPTIONS = [
  "Select Industry",
  "Technology",
  "Marketing",
  "Finance",
  "Health & Wellness",
  "Education",
  "E-commerce",
  "Travel",
  "Food & Beverage",
  "Real Estate",
  "Entertainment",
  "Other",
];

// 4. MAILCHIMP INTEGRATION
export const MAILCHIMP_INTEGRATION = {
  connected: false,
  status:    "Disconnected",
  email:     "",
};

// 5. AUDIENCE & CAMPAIGN INSIGHTS
export const INSIGHTS_DATA = {
  totalSubscribers: null,
  avgOpenRate:      null,
  avgClickRate:     null,
  topDomains:       null,
};

// 6. PRIVACY
export const PRIVACY_DATA = {
  publicProfile: true,
};

// 7. PAYMENT
export const PAYMENT_DATA = {
  cardholderName: "",
  method:         "Debit Card",
  cardNumber:     "",
  expiryDate:     "",
  cvv:            "",
};

export const PAYMENT_METHODS = [
  "Debit Card",
  "Credit Card",
  "PayPal",
  "Bank Transfer",
];