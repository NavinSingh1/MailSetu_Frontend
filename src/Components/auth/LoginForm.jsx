import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";   // ← Link prevents reload
import InputField from "./InputField";
import CaptchaBox from "./CaptchaBox";
import EmailIcon from "../../assets/icons/Email.png";
import useAuth from "../../hooks/useAuth";
import useApp from "../../hooks/useApp";
import { apiLogin } from "../../services/authApi";
import "./Styles/LoginForm.css";

// ─────────────────────────────────────────────
// LoginForm
//
// FIX: Uses <Link> from react-router-dom
// instead of <a href> for navigation.
// This prevents full page reload when switching
// between /login ↔ /signup ↔ /forgot-password
// ─────────────────────────────────────────────

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showNotification } = useApp();

  const [form, setForm]                 = useState({ email: "", password: "" });
  const [captchaToken, setCaptchaToken] = useState(null);
  const [errors, setErrors]             = useState({});
  const [apiError, setApiError]         = useState("");
  const [loading, setLoading]           = useState(false);

  const set = key => e => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: "" }));
    if (apiError) setApiError("");
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    if (errors.captcha) setErrors(prev => ({ ...prev, captcha: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Please enter a valid email address.";
    if (!form.password) newErrors.password = "Password is required.";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (!captchaToken) newErrors.captcha = "Please complete the reCAPTCHA.";
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setErrors({});
    setLoading(true);

    try {
      const result = await apiLogin(form.email, form.password, captchaToken);

      if (result.success) {
        const { access, refresh, user } = result.data;

        // ── Email not verified → go to verify-email ──
        if (!user?.is_verified) {
          login(access, refresh, user);
          showNotification("Please verify your email to continue.", "warning");
          navigate(`/verify-email?email=${encodeURIComponent(form.email)}`);
          return;
        }

        // ── Verified → dashboard ──────────────────
        login(access, refresh, user);
        showNotification("Welcome back! You're logged in.", "success");
        navigate("/dashboard");

      } else {
        setApiError(result.error?.detail || "Login failed. Please try again.");
      }
    } catch {
      setApiError("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-wrap">
      <div className="login-form-inner">

        <h2 className="login-title">Login to your account</h2>

        <p className="login-subtitle">
          Don't have an account?{" "}
          {/* ← Link: no page reload */}
          <Link to="/signup" className="login-link">Sign up</Link>
        </p>

        <div className="login-fields">

          {apiError && <div className="api-error-box">⚠ {apiError}</div>}

          <div>
            <InputField
              label="Email"
              type="email"
              icon={<img src={EmailIcon} alt="Email" style={{ width: "20px", height: "15px" }} />}
              value={form.email}
              onChange={set("email")}
              hasError={!!errors.email}
            />
            {errors.email && <p className="field-error">⚠ {errors.email}</p>}
          </div>

          <div>
            <InputField label="Password" type="password" value={form.password} onChange={set("password")} hasError={!!errors.password} />
            <div className={`login-password-footer ${errors.password ? "login-password-footer--error" : ""}`}>
              {errors.password && <p className="field-error no-margin">⚠ {errors.password}</p>}
              {/* ← Link: no page reload */}
              <Link to="/forgot-password" className="login-forgot-link">Forgot Password?</Link>
            </div>
          </div>

          <div>
            <CaptchaBox onChange={handleCaptchaChange} />
            {errors.captcha && <p className="field-error">⚠ {errors.captcha}</p>}
          </div>

          <button className="login-submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default LoginForm;