// ─────────────────────────────────────────────
// src/Components/profile/InsightsSection.jsx
// API: GET /api/profile/insights/
// ─────────────────────────────────────────────
import { useState, useEffect } from "react";
import { apiGetInsights } from "../../services/profileApi";
import { INSIGHTS_DATA } from "../../mocks/profileData";

const IS_MOCK = import.meta.env.VITE_MOCK_MODE === "true";

// Icons for each metric card (matching Figma)
const METRICS = [
  {
    key:   "totalSubscribers",
    label: "TOTAL\nSUBSCRIBERS",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    key:   "avgOpenRate",
    label: "AVERAGE\nOPEN RATE",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6"  y1="20" x2="6"  y2="14"/>
      </svg>
    ),
  },
  {
    key:   "avgClickRate",
    label: "AVERAGE\nCLICK RATE",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
        <path d="M21.5 2.5l-6 17-4-4-4 4-4-6 18-11z"/>
      </svg>
    ),
  },
  {
    key:   "topDomains",
    label: "TOP\nDOMAINS",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
];

function InsightsSection() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (IS_MOCK) {
          await new Promise(r => setTimeout(r, 700));
          setData(INSIGHTS_DATA);
        } else {
          const res = await apiGetInsights();
          if (res.success) setData(res.data);
        }
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  return (
    <div className="profile-card">
      <h2 className="profile-card-title">Audience and Campaign Insights</h2>
      <p className="profile-card-subtitle">
        Connecting your account allows us to securely fetch anonymized data to help you find the best partners
      </p>

      <div className="insights-grid">
        {METRICS.map(metric => (
          <InsightCard
            key={metric.key}
            label={metric.label}
            icon={metric.icon}
            value={data?.[metric.key]}
            loading={loading}
          />
        ))}
      </div>

      <style>{`
        .insights-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .insight-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 14px 12px 12px;
          min-height: 120px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .insight-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .insight-card-label {
          font-size: 10px;
          font-weight: 700;
          color: #374151;
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.3px;
          line-height: 1.4;
          white-space: pre-line;
        }
        .insight-card-value {
          font-size: 22px;
          font-weight: 800;
          color: #111827;
          font-family: 'Georgia', serif;
        }
        .insight-skeleton-block {
          height: 10px;
          border-radius: 4px;
          margin-top: 4px;
        }
        @media (max-width: 600px) {
          .insights-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

function InsightCard({ label, icon, value, loading }) {
  return (
    <div className="insight-card">
      <div className="insight-card-header">
        <span className="insight-card-label">{label}</span>
        {icon}
      </div>
      {loading ? (
        <>
          <div className="profile-skeleton insight-skeleton-block" style={{ width: "60%" }} />
          <div className="profile-skeleton insight-skeleton-block" style={{ width: "80%" }} />
          <div className="profile-skeleton insight-skeleton-block" style={{ width: "50%" }} />
        </>
      ) : (
        <div className="insight-card-value">{value ?? "—"}</div>
      )}
    </div>
  );
}

export default InsightsSection;