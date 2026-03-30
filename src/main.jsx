// ─────────────────────────────────────────────
// src/main.jsx
// ─────────────────────────────────────────────
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// ─────────────────────────────────────────────
// START MSW BEFORE REACT RENDERS
//
// VITE_MOCK_MODE=true  → MSW starts → intercepts all requests
// VITE_MOCK_MODE=false → MSW skipped → real backend used
// ─────────────────────────────────────────────
async function enableMocking() {
  if (import.meta.env.VITE_MOCK_MODE !== "true") {
    console.log("🌐 Mock mode OFF — using real backend");
    return;
  }

  const { worker } = await import("./mocks/browser");

  return worker.start({
    onUnhandledRequest: "bypass",   // silently ignore unhandled requests
  });
}

// Start MSW first → then render React
enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
});