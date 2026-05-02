import { useContext } from "react";
import { AppContext } from "../context/AppContext";

// ─────────────────────────────────────────────
// useApp — consume AppContext anywhere
//
// Usage:
//   const { showNotification, notification } = useApp();
// ─────────────────────────────────────────────
function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside <AppProvider>");
  }
  return context;
}

export default useApp;