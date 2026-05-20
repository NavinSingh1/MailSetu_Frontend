// ─────────────────────────────────────────────
// src/Components/profile/MailchimpSection.jsx
// API: GET  /api/profile/mailchimp/
//      POST /api/profile/mailchimp/connect/
//      POST /api/profile/mailchimp/disconnect/
// ─────────────────────────────────────────────
import { useState, useEffect } from "react";
import {
  apiGetMailchimpIntegration,
  apiConnectMailchimp,
  apiDisconnectMailchimp,
} from "../../services/profileApi";
import { MAILCHIMP_INTEGRATION } from "../../mocks/profileData";

const IS_MOCK = import.meta.env.VITE_MOCK_MODE === "true";

function MailchimpSection() {
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (IS_MOCK) {
          await new Promise(r => setTimeout(r, 600));
          setData(MAILCHIMP_INTEGRATION);
        } else {
          const res = await apiGetMailchimpIntegration();
          if (res.success) setData(res.data);
        }
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      if (IS_MOCK) {
        await new Promise(r => setTimeout(r, 800));
        setData({ connected: true, status: "Connected", email: "user@mailchimp.com" });
      } else {
        const res = await apiConnectMailchimp();
        if (res.success) setData(res.data);
      }
    } catch { /* silent */ }
    finally { setConnecting(false); }
  };

  const handleDisconnect = async () => {
    setConnecting(true);
    try {
      if (IS_MOCK) {
        await new Promise(r => setTimeout(r, 600));
        setData({ connected: false, status: "Disconnected", email: "" });
      } else {
        const res = await apiDisconnectMailchimp();
        if (res.success) setData(res.data);
      }
    } catch { /* silent */ }
    finally { setConnecting(false); }
  };

  const isConnected = data?.connected;

  return (
    <div className="profile-card">
      <h2 className="profile-card-title">Mailchimp Integration</h2>
      <p className="profile-card-subtitle">
        Connecting your account allows us to securely fetch anonymized data to help you find the best partners
      </p>

      {loading ? (
        <MailchimpSkeleton />
      ) : (
        <div className="mailchimp-row">
          {/* Status */}
          <div className="mailchimp-status-wrap">
            {/* Envelope icon */}
            <svg width="20" height="16" viewBox="0 0 24 20" fill="none" className="mailchimp-icon">
              <rect x="0" y="0" width="24" height="20" rx="3" stroke="#9ca3af" strokeWidth="1.5" fill="none" />
              <path d="M0 4l12 8 12-8" stroke="#9ca3af" strokeWidth="1.5" />
            </svg>
            <span className="mailchimp-status-label">Connection Status:</span>
            <span className={`mailchimp-status-value ${isConnected ? "mailchimp-connected" : "mailchimp-disconnected"}`}>
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>

          {/* Connect / Disconnect button */}
          <button
            className={`mailchimp-btn ${isConnected ? "mailchimp-btn--disconnect" : ""}`}
            onClick={isConnected ? handleDisconnect : handleConnect}
            disabled={connecting}
          >
            {connecting
              ? "Please wait..."
              : isConnected
                ? "Disconnect Mailchimp"
                : "Connect to Mailchimp"}
          </button>
        </div>
      )}

      <style>{`
        .mailchimp-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 16px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          flex-wrap: wrap;
        }
        .mailchimp-status-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .mailchimp-icon { flex-shrink: 0; }
        .mailchimp-status-label {
          font-size: 14px;
          color: #374151;
          font-family: 'Inter', sans-serif;
        }
        .mailchimp-status-value {
          font-size: 14px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
        }
        .mailchimp-connected    { color: #01c67e; }
        .mailchimp-disconnected { color: #ef4444; }
        .mailchimp-btn {
          height: 38px;
          padding: 0 20px;
          background: #01c67e;
          color: #fff;
          border: none;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: background 0.15s;
          white-space: nowrap;
        }
        .mailchimp-btn:hover            { background: #00a86b; }
        .mailchimp-btn:disabled         { opacity: 0.6; cursor: not-allowed; }
        .mailchimp-btn--disconnect      { background: #ef4444; }
        .mailchimp-btn--disconnect:hover{ background: #dc2626; }
      `}</style>
    </div>
  );
}

function MailchimpSkeleton() {
  return (
    <div className="profile-skeleton profile-skeleton-line" style={{ height: "56px", borderRadius: "8px" }} />
  );
}

export default MailchimpSection;