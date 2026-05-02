import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";   // ← Link prevents reload
import InputField from "./InputField";
import CaptchaBox from "./CaptchaBox";
import ProfileIcon from "../../assets/icons/Profile.png";
import EmailIcon from "../../assets/icons/Email.png";
import useApp from "../../hooks/useApp";
import { apiSignup, apiCheckEmail } from "../../services/authApi";
import "./Styles/SignupForm.css";

// ─────────────────────────────────────────────
// SignupForm
//
// FIX: Uses <Link> from react-router-dom
// instead of <a href> for navigation.
// This prevents full page reload when switching
// between /signup ↔ /login
// ─────────────────────────────────────────────

function splitName(fullName) {
  const parts = fullName.trim().split(" ");
  return { firstName: parts[0] || "", lastName: parts.slice(1).join(" ") || "" };
}

function SignupForm() {
  const navigate = useNavigate();
  const { showNotification } = useApp();

  const [form, setForm]                 = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
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
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required.";
    else if (form.fullName.trim().length < 2) newErrors.fullName = "Name must be at least 2 characters.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Please enter a valid email address.";
    if (!form.password) newErrors.password = "Password is required.";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    else if (!/[A-Z]/.test(form.password)) newErrors.password = "Password must contain at least one uppercase letter.";
    else if (!/[0-9]/.test(form.password)) newErrors.password = "Password must contain at least one number.";
    if (!form.confirmPassword) newErrors.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    if (!captchaToken) newErrors.captcha = "Please complete the reCAPTCHA.";
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setErrors({});
    setLoading(true);

    try {
      // Step 1 — check email availability
      const emailCheck = await apiCheckEmail(form.email);
      if (!emailCheck.success) {
        setErrors(prev => ({ ...prev, email: "This email is already registered." }));
        setLoading(false);
        return;
      }

      // Step 2 — register
      const { firstName, lastName } = splitName(form.fullName);
      const result = await apiSignup({
        firstName,
        lastName,
        email:               form.email,
        password:            form.password,
        passwordConfirmation: form.confirmPassword,
        captchaToken,
      });

      if (result.success) {
        showNotification("Account created! Please verify your email.", "success");
        navigate(`/verify-email?email=${encodeURIComponent(form.email)}`);
      } else {
        setApiError(result.error?.detail || "Signup failed. Please try again.");
      }
    } catch {
      setApiError("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-form-wrap">
      <div className="signup-form-inner">

        <h2 className="signup-title">Create your account</h2>

        <p className="signup-subtitle">
          Already have an account?{" "}
          {/* ← Link: no page reload */}
          <Link to="/login" className="signup-link">Log in</Link>
        </p>

        <div className="signup-fields">

          {apiError && <div className="api-error-box">⚠ {apiError}</div>}

          <div>
            <InputField
              label="Full Name"
              type="text"
              icon={<img src={ProfileIcon} alt="Profile" className="input-icon-image" />}
              value={form.fullName}
              onChange={set("fullName")}
              hasError={!!errors.fullName}
            />
            {errors.fullName && <p className="field-error">⚠ {errors.fullName}</p>}
          </div>

          <div>
            <InputField
              label="Email"
              type="email"
              icon={<img src={EmailIcon} alt="Email" style={{ width: "18px", height: "15px" }} />}
              value={form.email}
              onChange={set("email")}
              hasError={!!errors.email}
            />
            {errors.email && <p className="field-error">⚠ {errors.email}</p>}
          </div>

          <div>
            <InputField label="Password" type="password" value={form.password} onChange={set("password")} hasError={!!errors.password} />
            {errors.password && <p className="field-error">⚠ {errors.password}</p>}
          </div>

          <div>
            <InputField label="Confirm Password" type="password" value={form.confirmPassword} onChange={set("confirmPassword")} hasError={!!errors.confirmPassword} />
            {errors.confirmPassword && <p className="field-error">⚠ {errors.confirmPassword}</p>}
          </div>

          <div>
            <CaptchaBox onChange={handleCaptchaChange} />
            {errors.captcha && <p className="field-error">⚠ {errors.captcha}</p>}
          </div>

          <p className="signup-terms">
            By creating an account, you agree to our{" "}
            <a href="#" className="signup-terms-link">Terms of Service</a>{" "}and{" "}
            <a href="#" className="signup-terms-link">Privacy Policy</a>
          </p>

          <button className="signup-submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default SignupForm;