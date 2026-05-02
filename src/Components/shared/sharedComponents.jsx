// ─────────────────────────────────────────────
// src/Components/shared/SharedComponents.jsx
//
// Shared UI components used across all pages
//
// Usage:
//   import { SubmitButton, LoadingSpinner, ErrorMessage } from "../shared/SharedComponents";
//
//   <SubmitButton loading={loading} onClick={handleSubmit}>
//     Save Changes
//   </SubmitButton>
//
//   <LoadingSpinner message="Loading dashboard..." />
//
//   <ErrorMessage message="Failed to load." onRetry={fetchData} />
// ─────────────────────────────────────────────
import "./SharedComponents.css";

// ─────────────────────────────────────────────
// SubmitButton
// Same button across all pages — text via children
//
// Props:
//   children   → button text (required)
//   loading    → shows loading spinner + disables
//   disabled   → disables without spinner
//   variant    → "primary" (default) | "outline" | "danger"
//   fullWidth  → true (default) | false
//   onClick    → click handler
//   type       → "button" (default) | "submit"
// ─────────────────────────────────────────────
export function SubmitButton({
  children,
  loading    = false,
  disabled   = false,
  variant    = "primary",
  fullWidth  = true,
  onClick,
  type       = "button",
}) {
  return (
    <button
      type={type}
      className={`shared-btn shared-btn--${variant} ${fullWidth ? "shared-btn--full" : ""}`}
      onClick={onClick}
      disabled={loading || disabled}
    >
      {loading ? (
        <span className="shared-btn-loader">
          <span className="shared-btn-spinner" />
          Loading...
        </span>
      ) : children}
    </button>
  );
}

// ─────────────────────────────────────────────
// LoadingSpinner
// Full page or section centered spinner
//
// Props:
//   message → optional text below spinner
//   size    → "sm" | "md" (default) | "lg"
// ─────────────────────────────────────────────
export function LoadingSpinner({ message = "", size = "md" }) {
  return (
    <div className={`shared-spinner-wrap shared-spinner-wrap--${size}`}>
      <div className={`shared-spinner shared-spinner--${size}`} />
      {message && <p className="shared-spinner-msg">{message}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// SectionLoader
// Thin animated shimmer bar for card/section loading
// ─────────────────────────────────────────────
export function SectionLoader() {
  return (
    <div className="shared-section-loader">
      <div className="shared-section-loader-bar" />
    </div>
  );
}

// ─────────────────────────────────────────────
// ErrorMessage
// Inline error banner with optional retry button
//
// Props:
//   message  → error text
//   onRetry  → retry function (optional)
// ─────────────────────────────────────────────
export function ErrorMessage({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="shared-error">
      <span className="shared-error-icon">⚠</span>
      <p className="shared-error-text">{message}</p>
      {onRetry && (
        <button className="shared-error-retry" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SaveButton
// Specific variant for save-with-feedback pattern
//
// Props:
//   saving → shows "Saving..."
//   saved  → shows "Saved ✓" in green
//   onClick → click handler
// ─────────────────────────────────────────────
export function SaveButton({ saving = false, saved = false, onClick }) {
  return (
    <button
      className={`shared-btn shared-btn--save ${saved ? "shared-btn--saved" : ""}`}
      onClick={onClick}
      disabled={saving}
    >
      {saving ? "Saving..." : saved ? "Saved ✓" : "Save"}
    </button>
  );
}