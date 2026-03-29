import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// ─────────────────────────────────────────────
// PublicRoute
//
// Wraps pages that should NOT be accessible
// when the user is already logged in.
// (Login, Signup, ForgotPassword)
//
// If authenticated  → redirect to /dashboard
// If loading        → wait (avoid flash)
// If not logged in  → show the page normally
//
// Usage in App.jsx:
//   <Route path="/login" element={
//     <PublicRoute><Login /></PublicRoute>
//   } />
// ─────────────────────────────────────────────
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Still restoring session from localStorage — wait
  if (loading) return null;

  // Already logged in — redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Not logged in — show the page
  return children;
}

export default PublicRoute;