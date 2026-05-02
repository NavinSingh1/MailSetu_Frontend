# MailSetu — Frontend

A React-based web application for the MailSetu platform. Includes a fully built authentication flow and user dashboard with responsive UI, state management, and API integration structure.

---

## 🚀 Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router DOM | Client-side routing |
| Context API + useReducer | Global state management |
| Vite | Build tool |
| CSS (External files) | Styling — zero inline styles |
| react-google-recaptcha | Google reCAPTCHA v2 |

---

## 📁 Project Structure

```
src/
│
├── assets/
│   └── icons/
│       └── index.jsx
│   └── Dashboard/
│       └── Cards/                 # All dashboard card PNG assets
│           ├── people_1.png
│           ├── vector.png
│           ├── sync.png
│           ├── Clip_path_group.png
│           ├── Ellipse 2.png
│           ├── Ellipse 3.png ...
│           ├── Frame 81.png ...
│           └── Frame 82.png
│
├── common/
│   ├── ProtectedRoute.jsx         # Guards private pages → /login if not authenticated
│   └── PublicRoute.jsx            # Guards auth pages → /dashboard if already logged in
│
├── Components/
│   ├── auth/                      # Auth components
│   │   ├── CaptchaBox.jsx         # Google reCAPTCHA v2 (dev mode toggle)
│   │   ├── CaptchaBox.css
│   │   ├── InputField.jsx
│   │   ├── InputField.css
│   │   ├── LeftPanel.jsx          # "Welcome Back" or "Join the Network"
│   │   ├── LeftPanel.css
│   │   ├── LoginForm.jsx
│   │   ├── LoginForm.css
│   │   ├── SignupForm.jsx
│   │   └── SignupForm.css
│   │
│   ├── ForgotPassword/
│   │   ├── ForgotPasswordForm.jsx
│   │   └── ForgotPasswordForm.css
│   │
│   └── dashboard/                 # Dashboard components
│       ├── styles/
│       │   ├── Card.css           # Shared base card styles
│       │   ├── Navbar.css
│       │   ├── AudienceOverview.css
│       │   ├── MailchimpConnection.css
│       │   ├── QuickActions.css
│       │   ├── TopMatches.css
│       │   └── RecentCampaigns.css
│       ├── Navbar.jsx             # Dashboard navbar with theme toggle
│       ├── AudienceOverview.jsx   # Subscribers, open rate, click rate
│       ├── MailchimpConnection.jsx # Mailchimp status + sync
│       ├── QuickActions.jsx       # Profile incomplete CTA
│       ├── TopMatches.jsx         # AI matched partners list
│       └── RecentCampaigns.jsx    # Campaign performance list
│
├── Constants/
│   └── colors.js
│
├── context/
│   ├── AuthContext.jsx            # Global auth state
│   └── AppContext.jsx             # Global notifications
│
├── hooks/
│   ├── useAuth.js
│   └── useApp.js
│
├── pages/
│   ├── Login.jsx
│   ├── Login.css
│   ├── SignUp.jsx
│   ├── SignUp.css
│   ├── ForgotPassword.jsx
│   ├── ForgotPassword.css
│   ├── Dashboard.jsx              # Dashboard page (Protected)
│   └── Styles/
│       └── Dashboard.css
│
├── services/
│   └── api.js                     # Central API + mock mode
│
├── App.jsx
├── App.css
├── main.jsx
└── index.css                      # Global styles + CSS variables + font
```

---

## 🌐 Routes

| Path | Component | Access | Guard |
|---|---|---|---|
| `/` | Redirects to `/signup` | Public | — |
| `/signup` | SignUp | Public | `PublicRoute` → `/dashboard` if logged in |
| `/login` | Login | Public | `PublicRoute` → `/dashboard` if logged in |
| `/forgot-password` | ForgotPassword | Public | `PublicRoute` → `/dashboard` if logged in |
| `/dashboard` | Dashboard | Protected | `ProtectedRoute` → `/login` if not logged in |
| `/reset-password` | *(coming soon)* | Public | `PublicRoute` |

---

## 🎨 Design System

- **Font:** Inter (global via `index.css`)
- **Colors:** CSS variables in `:root` — `index.css`
- **CSS:** Zero inline styles — all in external `.css` files
- **Responsive:** Mobile + Tablet breakpoints (`768px`, `480px`)

### CSS Variables
```css
:root {
  --color-black:        #0a0a0a;
  --color-white:        #ffffff;
  --color-off-white:    #f5f5f5;
  --color-gray:         #6b7280;
  --color-light-gray:   #e5e7eb;
  --color-yellow:       #f5c800;
  --color-yellow-hover: #e0b800;
  --color-green:        #22c55e;
  --color-dark-green:   #1a4a2e;
  --color-teal:         #0ea5a0;
}
```

---

## 🏠 Dashboard Page

### Components

| Component | Description | API (TODO) |
|---|---|---|
| `Navbar` | Logo, nav links, bell, avatar, logout | — |
| `AudienceOverview` | Total subscribers, open/click rate | `GET /api/dashboard/audience-overview/` |
| `MailchimpConnection` | Active status, last sync, sync now | `GET /api/dashboard/mailchimp-status/` |
| `QuickActions` | Profile incomplete CTA | `GET /api/dashboard/profile-status/` |
| `TopMatches` | AI matched partners, score bar | `GET /api/dashboard/top-matches/` |
| `RecentCampaigns` | Campaign list, open rate, report | `GET /api/dashboard/recent-campaigns/` |

### Toggles

**Navbar theme** — change in `Navbar.jsx`:
```js
const HEADER_THEME = "dark";   // #2E2E2E
const HEADER_THEME = "light";  // #D9D9D9
const HEADER_THEME = "white";  // #ffffff
```

**Card colored theme** — change in each card:
```js
const COLORED_THEME = true;   // colored background (Figma)
const COLORED_THEME = false;  // plain white
```

**Empty state** — change in each card:
```js
const DUMMY_DATA = null;  // [] for lists — shows empty state
const DUMMY_DATA = { ... } // real data — shows filled state
```

---

## 🔐 Authentication Flow

### State Management
```js
// AuthContext state shape
{
  isAuthenticated: false,
  user: null,           // { id, email, role, is_verified }
  accessToken: null,
  refreshToken: null,
  loading: true,
}

// Functions
login(accessToken, refreshToken, user)  // saves to state + localStorage
logout()                                 // clears state + localStorage
setUser(user)                            // updates user info
```

### localStorage keys after login
```
access          → JWT access token
refresh         → JWT refresh token
user            → { id, email, role, is_verified }
mock_users_db   → mock registered users (dev only)
```

### Route Guards
```
PublicRoute    → /login, /signup, /forgot-password
               logged in  → redirect to /dashboard
               not logged in → show page

ProtectedRoute → /dashboard
               logged in  → show page
               not logged in → redirect to /login
```

---

## 🤖 Google reCAPTCHA

```
VITE_DEV_MODE = true  → simple checkbox (no Google call)
VITE_DEV_MODE = false → real Google reCAPTCHA v2
```

### `.env` file
```
VITE_RECAPTCHA_SITE_KEY=your_site_key_here
VITE_DEV_MODE=true
```

---

## 📡 API Integration (`services/api.js`)

```js
const BASE_URL  = "http://localhost:8000";  // ← change to production URL
const MOCK_MODE = true;                      // ← false = real Django backend
```

### All Endpoints

| Function | Method | Endpoint | Status |
|---|---|---|---|
| `apiSignup()` | POST | `/api/auth/signup/` | ✅ Wired |
| `apiLogin()` | POST | `/api/auth/login/` | ✅ Wired |
| `apiCheckEmail()` | POST | `/api/auth/check-email/` | ✅ Wired |
| `apiForgotPassword()` | POST | `/api/auth/forgot-password/` | ✅ Wired |
| `apiResetPassword()` | POST | `/api/auth/reset-password/` | 🔜 Pending |
| `apiRefreshToken()` | POST | `/api/auth/refresh/` | 🔜 Pending |
| `apiGetMe()` | GET | `/api/users/me/` | 🔜 Pending |
| `apiUpdateMe()` | PATCH | `/api/users/me/` | 🔜 Pending |
| `apiChangePassword()` | PUT | `/api/auth/change-password/` | 🔜 Pending |
| `apiDeleteAccount()` | PUT | `/api/users/me/delete/` | 🔜 Pending |

---

## ✅ Form Validation

### Login
| Field | Rules |
|---|---|
| Email | Required, valid format |
| Password | Required, min 6 characters |
| Captcha | Must be completed |

### Signup
| Field | Rules |
|---|---|
| Full Name | Required, min 2 characters |
| Email | Required, valid format, API duplicate check |
| Password | Min 6 chars, 1 uppercase, 1 number |
| Confirm Password | Must match password |
| Captcha | Must be completed |

### Forgot Password
| Field | Rules |
|---|---|
| Email | Required, valid format |

---

## 🔜 What's Next

- [ ] Reset Password page (`/reset-password`)
- [ ] Connect real Django backend (`MOCK_MODE = false`)
- [ ] Wire dashboard API endpoints (replace `DUMMY_DATA`)
- [ ] Token refresh logic (`/api/auth/refresh/`)
- [ ] User profile/settings page
- [ ] Notification UI component (AppContext ready)

---

## 🛠️ Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📝 Notes

- All CSS in external files — zero inline styles, zero `<style>` blocks
- `ProtectedRoute` + `PublicRoute` = complete auth guard system
- Session restored from `localStorage` on page refresh automatically
- reCAPTCHA bypassed in dev via `VITE_DEV_MODE=true`
- Never commit `.env` to GitHub
- Dashboard data is all `DUMMY_DATA` — replace with real API when backend ready
