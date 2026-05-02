import ReCAPTCHA from "react-google-recaptcha";
import "./Styles/CaptchaBox.css";

// ─────────────────────────────────────────────
// VITE_DEV_MODE=true  → skips real reCAPTCHA,
//                       shows a simple checkbox
// VITE_DEV_MODE=false → shows real Google reCAPTCHA
// ─────────────────────────────────────────────
const IS_DEV  = import.meta.env.VITE_DEV_MODE === "true";
const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

function CaptchaBox({ onChange }) {

  // ── Dev mode — simple checkbox, no Google call ──
  if (IS_DEV) {
    return (
      <div className="captcha-wrap captcha-wrap--dev">
        <label className="captcha-dev-label">
          <input
            type="checkbox"
            className="captcha-dev-checkbox"
            onChange={(e) => onChange(e.target.checked ? "dev-token" : null)}
          />
          <span className="captcha-dev-text">I'm not a robot</span>
        </label>
        <span className="captcha-dev-badge">DEV MODE</span>
      </div>
    );
  }

  // ── Production — real Google reCAPTCHA ──────
  return (
    <div className="captcha-wrap">
      <ReCAPTCHA
        sitekey={SITE_KEY}
        onChange={onChange}
        size="normal"
        theme="light"
      />
    </div>
  );
}

export default CaptchaBox;