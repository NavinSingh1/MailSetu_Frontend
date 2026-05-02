import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import LeftPanel from "../Components/auth/LeftPanel";
import useAuth from "../hooks/useAuth";
import { apiVerifyEmail, apiResendVerification } from "../services/authApi";
import "./Styles/VerifyEmail.css";

const IS_MOCK = import.meta.env.VITE_MOCK_MODE === "true";

// ─────────────────────────────────────────────
// Steps indicator — shows progress
// ─────────────────────────────────────────────
function Steps({ currentStep }) {
  const steps = ["Sign Up", "Verify Email", "Dashboard"];
  return (
    <div className="ve-steps">
      {steps.map((label, i) => {
        const idx   = i + 1;
        const done  = idx < currentStep;
        const active = idx === currentStep;
        return (
          <div key={label} style={{ display: "flex", alignItems: "center" }}>
            <div className={`ve-step ${done ? "ve-step--done" : active ? "ve-step--active" : ""}`}>
              <div className="ve-step-circle">
                {done ? "✓" : idx}
              </div>
              <span className="ve-step-label">{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`ve-step-line ${done ? "ve-step-line--done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function VerifyEmail() {
  const [searchParams]            = useSearchParams();
  const navigate                  = useNavigate();
  const { setVerified }           = useAuth();

  const token                     = searchParams.get("token");
  const email                     = searchParams.get("email") || "";

  const [status, setStatus]       = useState(token ? "verifying" : "idle");
  const [errorMsg, setErrorMsg]   = useState("");
  const [resending, setResending] = useState(false);
  const [mockVerifyUrl, setMockVerifyUrl] = useState("");

  // ── Auto-verify when token in URL ──────────
  useEffect(() => {
    if (!token) return;
    setStatus("verifying");
    apiVerifyEmail(token)
      .then(result => {
        if (result.success) {
          setVerified();
          setStatus("success");
          setTimeout(() => navigate("/dashboard", { replace: true }), 2500);
        } else {
          setStatus("error");
          setErrorMsg(result.error?.detail || "Verification link is invalid or expired.");
        }
      })
      .catch(() => {
        setStatus("error");
        setErrorMsg("Something went wrong. Please try again.");
      });
  }, [token]);

  // ── Generate mock URL on first load ────────
  useEffect(() => {
    if (!IS_MOCK || !email || token) return;
    setMockVerifyUrl(`${window.location.origin}/verify-email?token=mock-verify-${email}-${Date.now()}`);
  }, [email]);

  // ── Resend handler ──────────────────────────
  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setErrorMsg("");
    try {
      const result = await apiResendVerification(email);
      if (result.success) {
        setStatus("resent");
        if (IS_MOCK) {
          setMockVerifyUrl(`${window.location.origin}/verify-email?token=mock-verify-${email}-${Date.now()}`);
        }
      } else {
        setErrorMsg(result.error?.detail || "Failed to resend. Please try again.");
      }
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="verify-page">
      <LeftPanel mode="login" />
      <div className="ve-form-wrap">
        <div className="ve-form-inner">
          {renderContent()}
        </div>
      </div>
    </div>
  );

  function renderContent() {

    // ── Verifying ──────────────────────────────
    if (status === "verifying") {
      return (
        <>
          <Steps currentStep={2} />
          <div className="ve-spinner" />
          <h2 className="ve-title">Verifying your email...</h2>
          <p className="ve-subtitle">Please wait a moment.</p>
        </>
      );
    }

    // ── Success ────────────────────────────────
    if (status === "success") {
      return (
        <>
          <Steps currentStep={3} />
          <div className="ve-icon ve-icon--success">✓</div>
          <h2 className="ve-title">Email Verified!</h2>
          <p className="ve-subtitle">
            Your account is ready. Taking you to the dashboard.
          </p>
          <div className="ve-redirect-note">
            <div className="ve-redirect-dot" />
            Redirecting to dashboard...
          </div>
          <button className="ve-submit-btn" onClick={() => navigate("/dashboard", { replace: true })}>
            Go to Dashboard →
          </button>
        </>
      );
    }

    // ── Error ──────────────────────────────────
    if (status === "error") {
      return (
        <>
          <Steps currentStep={2} />
          <div className="ve-icon ve-icon--error">✕</div>
          <h2 className="ve-title">Verification Failed</h2>
          <p className="ve-subtitle">{errorMsg}</p>
          {email && (
            <button className="ve-submit-btn" onClick={handleResend} disabled={resending}>
              {resending ? "Sending..." : "✉ Resend Verification Email"}
            </button>
          )}
          <p className="ve-back">
            Wrong account?{" "}
            <Link to="/signup" className="ve-back-link">Back to Signup</Link>
          </p>
        </>
      );
    }

    // ── Resent ─────────────────────────────────
    if (status === "resent") {
      return (
        <>
          <Steps currentStep={2} />
          <div className="ve-icon ve-icon--success">✉</div>
          <h2 className="ve-title">Email Sent!</h2>
          <p className="ve-subtitle">We've sent a new verification link to</p>
          <div className="ve-email-chip">{email}</div>

          {IS_MOCK && mockVerifyUrl && (
            <div className="ve-mock-box">
              <p className="ve-mock-label">🧪 Dev Mode — Click to verify instantly:</p>
              <a href={mockVerifyUrl} className="ve-mock-link">{mockVerifyUrl}</a>
            </div>
          )}

          <p className="ve-back">
            Didn't receive it?{" "}
            <button className="ve-resend-link" onClick={() => { setStatus("idle"); setMockVerifyUrl(""); }}>
              Try again
            </button>
          </p>
          <p className="ve-back">
            Wrong account?{" "}
            <Link to="/signup" className="ve-back-link">Back to Signup</Link>
          </p>
        </>
      );
    }

    // ── Default: idle ──────────────────────────
    return (
      <>
        <Steps currentStep={2} />
        <div className="ve-icon ve-icon--email">✉</div>
        <h2 className="ve-title">Check Your Email</h2>
        <p className="ve-subtitle">
          We've sent a verification link to
        </p>
        <div className="ve-email-chip">{email || "your email address"}</div>

        <div className="ve-info">
          <span className="ve-info-icon">⚠</span>
          You must verify your email before accessing the dashboard.
        </div>

        {IS_MOCK && mockVerifyUrl && (
          <div className="ve-mock-box">
            <p className="ve-mock-label">🧪 Dev Mode — Click to verify instantly:</p>
            <a href={mockVerifyUrl} className="ve-mock-link">{mockVerifyUrl}</a>
          </div>
        )}

        {errorMsg && <div className="api-error-box" style={{ marginBottom: "16px" }}>⚠ {errorMsg}</div>}

        <div className="ve-divider">
          <span className="ve-divider-text">Didn't receive it?</span>
        </div>

        {email && (
          <button
            className="ve-submit-btn ve-submit-btn--outline"
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? "Sending..." : "✉ Resend Verification Email"}
          </button>
        )}

        <p className="ve-back">
          Wrong account?{" "}
          <Link to="/signup" className="ve-back-link">Back to Signup</Link>
        </p>
      </>
    );
  }
}

export default VerifyEmail;