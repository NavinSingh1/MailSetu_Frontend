import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField";
import CaptchaBox from "./CaptchaBox";
import { UserIcon, MailIcon } from "../../assets/icons";
import useApp from "../../hooks/useApp";
import { apiSignup, apiCheckEmail } from "../../services/api";
import "./Styles/SignupForm.css";

function splitName(fullName) {
  const parts = fullName.trim().split(" ");
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
  };
}

function SignupForm() {
  const navigate = useNavigate();
  const { showNotification } = useApp();

  const [form, setForm]                 = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
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
    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (form.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters.";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = "Password must contain at least one uppercase letter.";
    } else if (!/[0-9]/.test(form.password)) {
      newErrors.password = "Password must contain at least one number.";
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
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
      // 1. Check email availability
      const emailCheck = await apiCheckEmail(form.email);
      if (!emailCheck.success) {
        setErrors(prev => ({ ...prev, email: "This email is already registered." }));
        setLoading(false);
        return;
      }

      // 2. Register user
      // ✅ captchaToken passed to backend for verification
      const { firstName, lastName } = splitName(form.fullName);
      const result = await apiSignup({
        firstName,
        lastName,
        email: form.email,
        password: form.password,
        passwordConfirmation: form.confirmPassword,
        captchaToken,   // ← sent to Django for Google verification
      });

      if (result.success) {
        showNotification("Account created! Please log in.", "success");
        navigate("/login");
      } else {
        setApiError(result.error?.detail || "Signup failed. Please try again.");
      }
    } catch (err) {
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
          <a href="/login" className="signup-link">Log in</a>
        </p>

        <div className="signup-fields">

          {apiError && (
            <div className="api-error-box">⚠ {apiError}</div>
          )}

          {/* Full Name */}
          <div>
            <InputField label="Full Name" type="text" icon={<UserIcon />} value={form.fullName} onChange={set("fullName")} hasError={!!errors.fullName} />
            {errors.fullName && <p className="field-error">⚠ {errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <InputField label="Email" type="email" icon={<MailIcon />} value={form.email} onChange={set("email")} hasError={!!errors.email} />
            {errors.email && <p className="field-error">⚠ {errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <InputField label="Password" type="password" value={form.password} onChange={set("password")} hasError={!!errors.password} />
            {errors.password && <p className="field-error">⚠ {errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <InputField label="Confirm Password" type="password" value={form.confirmPassword} onChange={set("confirmPassword")} hasError={!!errors.confirmPassword} />
            {errors.confirmPassword && <p className="field-error">⚠ {errors.confirmPassword}</p>}
          </div>

          {/* Real Google reCAPTCHA */}
          <div>
            <CaptchaBox onChange={handleCaptchaChange} />
            {errors.captcha && <p className="field-error">⚠ {errors.captcha}</p>}
          </div>

          {/* Terms */}
          <p className="signup-terms">
            By creating an account, you agree to our{" "}
            <a href="#" className="signup-terms-link">Terms of Service</a>{" "}and{" "}
            <a href="#" className="signup-terms-link">Privacy Policy</a>
          </p>

          {/* Submit */}
          <button
            className="signup-submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default SignupForm;