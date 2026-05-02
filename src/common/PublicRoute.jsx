import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// ─────────────────────────────────────────────
// PublicRoute
// Guards: /login, /signup, /forgot-password
//
// If logged in + verified   → /dashboard
// If logged in + unverified → /verify-email
// If not logged in          → show page
// ─────────────────────────────────────────────
function PublicRoute({ children }) {
  const { isAuthenticated, isVerified, loading, user } = useAuth();

  if (loading) return null;

  if (isAuthenticated && isVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isAuthenticated && !isVerified) {
    const email = user?.email ? `?email=${encodeURIComponent(user.email)}` : "";
    return <Navigate to={`/verify-email${email}`} replace />;
  }

  return children;
}

export default PublicRoute;