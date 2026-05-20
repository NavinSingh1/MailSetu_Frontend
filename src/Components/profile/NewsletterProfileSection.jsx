// ─────────────────────────────────────────────
// src/Components/profile/NewsletterProfileSection.jsx
// API: GET /api/profile/newsletter/
//      POST /api/profile/newsletter/
// ─────────────────────────────────────────────
import { useState, useEffect } from "react";
import { apiGetNewsletterProfile, apiUpdateNewsletterProfile } from "../../services/profileApi";
import { NEWSLETTER_PROFILE, INDUSTRY_OPTIONS } from "../../mocks/profileData";

const IS_MOCK = import.meta.env.VITE_MOCK_MODE === "true";

function NewsletterProfileSection() {
  const [form, setForm]       = useState({ newsletterName: "", primaryIndustry: "", targetAudience: "", description: "", audienceDemographics: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (IS_MOCK) {
          await new Promise(r => setTimeout(r, 600));
          setForm(NEWSLETTER_PROFILE);
        } else {
          const res = await apiGetNewsletterProfile();
          if (res.success) setForm(res.data);
        }
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      if (IS_MOCK) {
        await new Promise(r => setTimeout(r, 600));
      } else {
        await apiUpdateNewsletterProfile(form);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  return (
    <div className="profile-card">
      <h2 className="profile-card-title">Your Newsletter Profile</h2>
      <p className="profile-card-subtitle">Enter the details below to complete your profile</p>

      {loading ? (
        <NewsletterSkeleton />
      ) : (
        <>
          <div className="profile-form-grid">
            <div className="profile-field">
              <label className="profile-label">Newsletter Name</label>
              <input
                className="profile-input"
                placeholder="The Tech Report"
                value={form.newsletterName}
                onChange={set("newsletterName")}
              />
            </div>
            <div className="profile-field">
              <label className="profile-label">Primary Industry</label>
              <select
                className="profile-select"
                value={form.primaryIndustry}
                onChange={set("primaryIndustry")}
              >
                {INDUSTRY_OPTIONS.map(opt => (
                  <option key={opt} value={opt === "Select Industry" ? "" : opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="profile-field">
              <label className="profile-label">Target Audience</label>
              <input
                className="profile-input"
                placeholder="Freelance marketers, Founders, etc"
                value={form.targetAudience}
                onChange={set("targetAudience")}
              />
            </div>
            <div className="profile-field">
              <label className="profile-label">Description</label>
              <input
                className="profile-input"
                placeholder="A brief overview of your newsletter's content and focus"
                value={form.description}
                onChange={set("description")}
              />
            </div>
            <div className="profile-field profile-field--full">
              <label className="profile-label">Audience Demographics</label>
              <input
                className="profile-input"
                placeholder="Primarily Male, ages 25-45, located in North America"
                value={form.audienceDemographics}
                onChange={set("audienceDemographics")}
              />
            </div>
          </div>

          <div className="profile-save-row">
            <button
              className={`profile-save-btn ${saved ? "profile-save-btn--saved" : ""}`}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : saved ? "Saved ✓" : "Save"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function NewsletterSkeleton() {
  return (
    <div className="profile-form-grid">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="profile-field">
          <div className="profile-skeleton profile-skeleton-text" style={{ width: "90px" }} />
          <div className="profile-skeleton profile-skeleton-line" />
        </div>
      ))}
      <div className="profile-field profile-field--full">
        <div className="profile-skeleton profile-skeleton-text" style={{ width: "130px" }} />
        <div className="profile-skeleton profile-skeleton-line" />
      </div>
    </div>
  );
}

export default NewsletterProfileSection;