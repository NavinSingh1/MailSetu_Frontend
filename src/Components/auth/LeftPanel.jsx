import "./Styles/LeftPanel.css";
import MailSetu from "../../assets/Header/MailSetu Logo.png";

function LeftPanel({ mode = "signup" }) {
  const isLogin = mode === "login";

  return (
    <div className="left-panel">
      <div className="left-panel-circle left-panel-circle--top-right"></div>
      <div className="left-panel-circle left-panel-circle--middle-left"></div>
      <div className="left-panel-circle left-panel-circle--bottom-right"></div>

      <div className="left-panel-logo">
        <img src={MailSetu} alt="logo" />
        <span className="left-panel-logo-text">MailSetu</span>
      </div>

      <div className="left-panel-content">
        <h1 className="left-panel-heading">
          {isLogin ? "Welcome Back" : "Join the Network"}
        </h1>
        <p className="left-panel-subheading">
          Connect. Collaborate. Grow with MailSetu
        </p>
        <div className="left-panel-bullets">
          <FeatureBullet text="Smart Mailchimp Sync" />
          <FeatureBullet text="AI powered partner suggestions" />
        </div>
      </div>

      <div className="left-panel-footer">
        <span className="left-panel-copyright">© 2026 MailSetu</span>
      </div>
    </div>
  );
}

function FeatureBullet({ text }) {
  return (
    <div className="feature-bullet">
      <div className="feature-bullet-icon">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2.5 7L5.5 10L11.5 4"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="feature-bullet-text">{text}</span>
    </div>
  );
}

export default LeftPanel;
