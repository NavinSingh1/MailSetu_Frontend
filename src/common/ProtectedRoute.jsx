import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// ─────────────────────────────────────────────
// ProtectedRoute
// Wraps private pages like /dashboard
// Not logged in? → redirects to /login
// Still loading? → waits (avoids flash)
// Logged in?     → shows the page
// ─────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;