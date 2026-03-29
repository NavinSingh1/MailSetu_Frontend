import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "../../assets/icons";
import "./Styles/InputField.css";

function InputField({ label, type = "text", icon, value, onChange, hasError }) {
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPass ? "text" : "password") : type;

  return (
    <div className="input-field-wrap">
      <label className="input-label">{label}</label>
      <div className="input-inner">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          className={`input-box ${hasError ? "input-box--error" : ""}`}
          onFocus={e => e.target.classList.add("input-box--focus")}
          onBlur={e => e.target.classList.remove("input-box--focus")}
        />
        <div
          className={`input-icon ${isPassword ? "input-icon--clickable" : ""}`}
          onClick={() => isPassword && setShowPass(p => !p)}
        >
          {isPassword ? (showPass ? <EyeOffIcon /> : <EyeIcon />) : icon}
        </div>
      </div>
    </div>
  );
}

export default InputField;