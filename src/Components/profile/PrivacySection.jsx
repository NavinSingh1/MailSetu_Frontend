// ─────────────────────────────────────────────
// src/Components/profile/PrivacySection.jsx
// API: GET  /api/profile/privacy/
//      POST /api/profile/privacy/
// ─────────────────────────────────────────────
import { useState, useEffect } from "react";
import { apiGetPrivacy, apiUpdatePrivacy } from "../../services/profileApi";
import { PRIVACY_DATA } from "../../mocks/profileData";

const IS_MOCK = import.meta.env.VITE_MOCK_MODE === "true";

function PrivacySection() {
  const [publicProfile, setPublicProfile] = useState(true);
  const [loading, setLoading]             = useState(true);
  const [saving, setSaving]               = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (IS_MOCK) {
          await new Promise(r => setTimeout(r, 500));
          setPublicProfile(PRIVACY_DATA.publicProfile);
        } else {
          const res = await apiGetPrivacy();
          if (res.success) setPublicProfile(res.data.publicProfile);
        }
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleToggle = async () => {
    const newVal = !publicProfile;
    setPublicProfile(newVal);
    setSaving(true);
    try {
      if (!IS_MOCK) await apiUpdatePrivacy({ publicProfile: newVal });
      else await new Promise(r => setTimeout(r, 400));
    } catch { setPublicProfile(!newVal); /* revert on error */ }
    finally { setSaving(false); }
  };

  return (
    <div className="profile-card">
      <div className="privacy-row">
        <div>
          <h2 className="profile-card-title" style={{ marginBottom: "2px" }}>
            Privacy and Preferences
          </h2>
          <p style={{ margin: 0, fontSize: "13px", color: "#6b7280", fontFamily: "'Inter', sans-serif" }}>
            Open my profile for partnership requests
          </p>
        </div>

        {loading ? (
          <div
            className="profile-skeleton"
            style={{ width: "52px", height: "28px", borderRadius: "999px", flexShrink: 0 }}
          />
        ) : (
          <button
            className={`toggle-switch ${publicProfile ? "toggle-switch--on" : ""}`}
            onClick={handleToggle}
            disabled={saving}
            aria-label="Toggle public profile"
          >
            <span className="toggle-thumb" />
          </button>
        )}
      </div>

      <style>{`
        .privacy-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .toggle-switch {
          position: relative;
          width: 52px;
          height: 28px;
          border-radius: 999px;
          background: #d1d5db;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
          flex-shrink: 0;
          padding: 0;
        }
        .toggle-switch--on {
          background: #01c67e;
        }
        .toggle-switch:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .toggle-thumb {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 22px;
          height: 22px;
          background: #fff;
          border-radius: 50%;
          transition: left 0.2s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.18);
        }
        .toggle-switch--on .toggle-thumb {
          left: calc(100% - 25px);
        }
      `}</style>
    </div>
  );
}

export default PrivacySection;