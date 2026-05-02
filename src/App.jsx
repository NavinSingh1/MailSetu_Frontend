import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { AppProvider }  from './context/AppContext';

// ── Route guards ──────────────────────────────
import ProtectedRoute from './common/ProtectedRoute';
import PublicRoute    from './common/PublicRoute';

// ── Shared layout (Navbar + Footer) ──────────
import AppLayout from './Components/layout/AppLayout';

// ── Auth pages (no Navbar/Footer) ────────────
import SignUp          from './pages/SignUp';
import Login           from './pages/Login';
import ForgotPassword  from './pages/ForgotPassword';
import VerifyEmail     from './pages/VerifyEmail';

// ── Dashboard pages (all wrapped by AppLayout) ─
import Dashboard from './pages/Dashboard';
import Profile   from './pages/Profile';
// import Partners  from './pages/Partners';   ← add new pages here
// import Campaigns from './pages/Campaigns';  ← they auto get Navbar + Footer

// ─────────────────────────────────────────────
// ROUTING ARCHITECTURE
//
// Auth pages  → no AppLayout → no Navbar/Footer
// Dashboard pages → nested inside AppLayout
//                 → auto get Navbar + Footer
//
// To add new dashboard page:
//   1. Create the page component
//   2. Import it here
//   3. Add <Route path="/new-page" element={<NewPage />} />
//      inside the nested AppLayout route
//   Done ✅ — Navbar + Footer appear automatically
// ─────────────────────────────────────────────

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Routes>

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/signup" replace />} />

          {/* ─────────────────────────────────────
              AUTH PAGES — no Navbar / Footer
              Using <Link> inside these pages
              prevents full page reload
          ───────────────────────────────────── */}
          <Route path="/signup" element={
            <PublicRoute><SignUp /></PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute><Login /></PublicRoute>
          } />
          <Route path="/forgot-password" element={
            <PublicRoute><ForgotPassword /></PublicRoute>
          } />

          {/* Email verify — public, no layout */}
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* ─────────────────────────────────────
              DASHBOARD PAGES — wrapped by AppLayout
              All routes here auto get Navbar + Footer
              Add new pages by adding more <Route>
              children inside this block
          ───────────────────────────────────── */}
          <Route element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile"   element={<Profile />} />

            {/* ── Add future dashboard pages here ──
            <Route path="/partners"  element={<Partners />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/analytics" element={<Analytics />} />
            */}
          </Route>

        </Routes>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;