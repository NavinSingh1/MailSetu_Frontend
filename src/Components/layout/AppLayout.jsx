// ─────────────────────────────────────────────
// src/Components/layout/AppLayout.jsx
//
// Shared layout wrapper for ALL protected pages.
// Includes: Navbar (top) + page content + Footer
//
// Used via nested route in App.jsx:
//   <Route element={<AppLayout />}>
//     <Route path="/dashboard" element={<Dashboard />} />
//     <Route path="/profile"   element={<Profile />} />
//     // Add new dashboard pages here — they auto get Navbar + Footer
//   </Route>
//
// Auth pages (login, signup, forgot-password, verify-email)
// do NOT use this layout — they have their own layout.
// ─────────────────────────────────────────────
import { Outlet } from "react-router-dom";
import Navbar from "../dashboard/Navbar";
import "./styles/AppLayout.css";

function AppLayout() {
  return (
    <div className="app-layout">
      {/* ── Shared Navbar ── */}
      <Navbar />

      {/* ── Page content renders here via <Outlet /> ── */}
      <main className="app-layout-main">
        <Outlet />
      </main>

      {/* ── Shared Footer ── */}
      <footer className="app-layout-footer">
        <p>© 2026 MailSetu. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default AppLayout;