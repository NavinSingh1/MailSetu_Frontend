// ─────────────────────────────────────────────
// src/Components/profile/AccountSection.jsx
// API: GET /api/profile/account/
//      POST /api/profile/account/
// ─────────────────────────────────────────────
import { useState, useEffect } from "react";
import { apiGetAccount, apiUpdateAccount } from "../../services/profileApi";
import { ACCOUNT_DATA } from "../../mocks/profileData";

const IS_MOCK = import.meta.env.VITE_MOCK_MODE === "true";

function AccountSection() {
  const [form, setForm]       = useState({ fullName: "", email: "", phoneNumber: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (IS_MOCK) {
          await new Promise(r => setTimeout(r, 600));
          setForm(ACCOUNT_DATA);
        } else {
          const res = await apiGetAccount();
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
        await apiUpdateAccount(form);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  return (
    <div className="profile-card">
      <h2 className="profile-card-title">Your Account</h2>
      <p className="profile-card-subtitle">Enter the details below to complete your profile</p>

      {loading ? (
        <AccountSkeleton />
      ) : (
        <>
          <div className="profile-form-grid">
            <div className="profile-field">
              <label className="profile-label">Full Name</label>
              <input
                className="profile-input"
                placeholder="John Doe"
                value={form.fullName}
                onChange={set("fullName")}
              />
            </div>
            <div className="profile-field">
              <label className="profile-label">Email</label>
              <input
                className="profile-input"
                type="email"
                placeholder="johndoe@gmail.com"
                value={form.email}
                onChange={set("email")}
              />
            </div>
            <div className="profile-field">
              <label className="profile-label">Phone Number</label>
              <input
                className="profile-input"
                placeholder="989-454-6767"
                value={form.phoneNumber}
                onChange={set("phoneNumber")}
              />
            </div>
            <div className="profile-field">
              <label className="profile-label">Address</label>
              <input
                className="profile-input"
                placeholder="123 Canning Street, USA"
                value={form.address}
                onChange={set("address")}
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

          <hr className="profile-divider" />
          <div className="profile-more-link">
            <button>More account settings</button>
          </div>
        </>
      )}
    </div>
  );
}

function AccountSkeleton() {
  return (
    <div className="profile-form-grid">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="profile-field">
          <div className="profile-skeleton profile-skeleton-text" style={{ width: "80px" }} />
          <div className="profile-skeleton profile-skeleton-line" />
        </div>
      ))}
    </div>
  );
}

export default AccountSection;