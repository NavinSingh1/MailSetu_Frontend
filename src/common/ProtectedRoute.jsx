import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// ─────────────────────────────────────────────
// ProtectedRoute
// Guards: /dashboard, /profile, etc.
//
// Check order:
//   1. loading    → wait
//   2. not logged in → /login
//   3. logged in but not verified → /verify-email
//   4. wrong role → /dashboard
//   5. all good   → render children
// ─────────────────────────────────────────────
function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, isVerified, role, loading, user } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isVerified) {
    const email = user?.email ? `?email=${encodeURIComponent(user.email)}` : "";
    return <Navigate to={`/verify-email${email}`} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;