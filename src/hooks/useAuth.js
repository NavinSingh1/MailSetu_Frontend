import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// ─────────────────────────────────────────────
// useAuth — consume AuthContext anywhere
//
// Usage:
//   const { isAuthenticated, user, login, logout } = useAuth();
// ─────────────────────────────────────────────
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}

export default useAuth;