// ─────────────────────────────────────────────
// src/mocks/browser.js
// MSW Browser Worker — combines all handlers
// ─────────────────────────────────────────────
import { setupWorker } from "msw/browser";
import { handlers }        from "./handlers";
import { profileHandlers } from "./profileHandlers";

// Combine all handlers:
//   handlers        → auth + dashboard
//   profileHandlers → profile & settings page
export const worker = setupWorker(...handlers, ...profileHandlers);