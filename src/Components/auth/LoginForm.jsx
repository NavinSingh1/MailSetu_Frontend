import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField";
import CaptchaBox from "./CaptchaBox";
import { MailIcon } from "../../assets/icons";
import useAuth from "../../hooks/useAuth";
import useApp from "../../hooks/useApp";
import { apiLogin } from "../../services/api";
import "./Styles/LoginForm.css";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showNotification } = useApp();

  const [form, setForm]                 = useState({ email: "", password: "" });
  const [captchaToken, setCaptchaToken] = useState(null);   // ← real Google token
  const [errors, setErrors]             = useState({});
  const [apiError, setApiError]         = useState("");
  const [loading, setLoading]           = useState(false);

  const set = key => e => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: "" }));
    if (apiError) setApiError("");
  };

  // ── Called by ReCAPTCHA when user completes or captcha expires ──
  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);  // string when done, null when expired
    if (errors.captcha) setErrors(prev => ({ ...prev, captcha: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (!captchaToken) {
      newErrors.captcha = "Please complete the reCAPTCHA.";
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      // ✅ Pass captchaToken to backend for verification
      // Django verifies via: POST https://www.google.com/recaptcha/api/siteverify
      const result = await apiLogin(form.email, form.password, captchaToken);

      if (result.success) {
        login(
          result.data.access,
          result.data.refresh,
          result.data.user ?? { email: form.email }
        );
        showNotification("Welcome back! You're logged in.", "success");
        navigate("/dashboard");
      } else {
        setApiError(result.error?.detail || "Login failed. Please try again.");
      }
    } catch (err) {
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
          <a href="/signup" className="login-link">Sign up</a>
        </p>

        <div className="login-fields">

          {apiError && (
            <div className="api-error-box">⚠ {apiError}</div>
          )}

          {/* Email */}
          <div>
            <InputField
              label="Email"
              type="email"
              icon={<MailIcon />}
              value={form.email}
              onChange={set("email")}
              hasError={!!errors.email}
            />
            {errors.email && <p className="field-error">⚠ {errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <InputField
              label="Password"
              type="password"
              value={form.password}
              onChange={set("password")}
              hasError={!!errors.password}
            />
            <div className={`login-password-footer ${errors.password ? "login-password-footer--error" : ""}`}>
              {errors.password && (
                <p className="field-error no-margin">⚠ {errors.password}</p>
              )}
              <a href="/forgot-password" className="login-forgot-link">
                Forgot Password?
              </a>
            </div>
          </div>

          {/* Real Google reCAPTCHA */}
          <div>
            <CaptchaBox onChange={handleCaptchaChange} />
            {errors.captcha && <p className="field-error">⚠ {errors.captcha}</p>}
          </div>

          {/* Submit */}
          <button
            className="login-submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default LoginForm;