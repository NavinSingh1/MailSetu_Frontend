// ─────────────────────────────────────────────
// src/Components/profile/ProfileCompletionSection.jsx
// API: GET /api/profile/completion/
// ─────────────────────────────────────────────
import { useState, useEffect } from "react";
import { apiGetProfileCompletion } from "../../services/profileApi";
import { PROFILE_COMPLETION } from "../../mocks/profileData";

const IS_MOCK = import.meta.env.VITE_MOCK_MODE === "true";

function ProfileCompletionSection() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (IS_MOCK) {
          await new Promise(r => setTimeout(r, 500));
          setData(PROFILE_COMPLETION);
        } else {
          const res = await apiGetProfileCompletion();
          if (res.success) setData(res.data);
        }
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  return (
    <div className="profile-card">
      <h2 className="profile-card-title">Complete Your Profile</h2>
      <p className="profile-card-subtitle" style={{ marginBottom: "14px" }}>
        {data?.message || "Complete your profile to get the best matches!"}
      </p>

      {loading ? (
        <div className="profile-skeleton profile-skeleton-line" style={{ height: "10px" }} />
      ) : (
        <div className="completion-bar-wrap">
          <div
            className="completion-bar-fill"
            style={{ width: `${data?.percentage ?? 0}%` }}
          />
        </div>
      )}

      <style>{`
        .completion-bar-wrap {
          width: 100%;
          height: 10px;
          background: #e5e7eb;
          border-radius: 999px;
          overflow: hidden;
        }
        .completion-bar-fill {
          height: 100%;
          background: #01c67e;
          border-radius: 999px;
          transition: width 0.6s ease;
        }
      `}</style>
    </div>
  );
}

export default ProfileCompletionSection;