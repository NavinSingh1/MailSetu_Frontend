import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useApp from "../../hooks/useApp";
import InputField from "../auth/InputField";
import { apiForgotPassword } from "../../services/api";
import "./styles/ForgotPasswordForm.css";

function ForgotPasswordForm() {
  const navigate = useNavigate();
  const { showNotification } = useApp();

  const [email, setEmail]         = useState("");
  const [error, setError]         = useState("");
  const [apiError, setApiError]   = useState("");
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
    if (apiError) setApiError("");
  };

  const validate = () => {
    if (!email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
    return "";
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const result = await apiForgotPassword(email);
      if (result.success) {
        setSubmitted(true);
        showNotification("Reset link sent! Check your email.", "success");
      } else {
        setApiError(result.error?.detail || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setApiError("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ──────────────────────────
  if (submitted) {
    return (
      <div className="fp-form-wrap">
        <div className="fp-form-inner">
          <div className="fp-success-icon">✉</div>
          <h2 className="fp-title">Check your email</h2>
          <p className="fp-success-msg">
            We've sent a password reset link to <strong>{email}</strong>.
            Please check your inbox and follow the instructions.
          </p>
          <p className="fp-success-note">
            Didn't receive it? Check your spam folder or{" "}
            <button className="fp-resend-btn" onClick={() => setSubmitted(false)}>
              try again
            </button>
          </p>
          <button className="fp-submit-btn" onClick={() => navigate("/login")}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // ── Form screen ─────────────────────────────
  return (
    <div className="fp-form-wrap">
      <div className="fp-form-inner">

        <h2 className="fp-title">Forgot Password?</h2>
        <p className="fp-subtitle">
          Enter your registered email and we'll send you a link to reset your password.
        </p>

        <div className="fp-fields">

          {apiError && (
            <div className="api-error-box">⚠ {apiError}</div>
          )}

          <div>
            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={handleChange}
              hasError={!!error}
            />
            {error && <p className="field-error">⚠ {error}</p>}
          </div>

          <button
            className="fp-submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <p className="fp-back">
            Remember your password?{" "}
            <a href="/login" className="fp-back-link">Back to Login</a>
          </p>

        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;