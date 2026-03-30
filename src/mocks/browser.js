// ─────────────────────────────────────────────
// src/mocks/browser.js
// MSW Browser Worker Setup
// ─────────────────────────────────────────────
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// Create the worker with all handlers
export const worker = setupWorker(...handlers);