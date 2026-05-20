// ─────────────────────────────────────────────
// src/Components/profile/PaymentSection.jsx
// API: GET  /api/profile/payment/
//      POST /api/profile/payment/
// ─────────────────────────────────────────────
import { useState, useEffect } from "react";
import { apiGetPayment, apiUpdatePayment } from "../../services/profileApi";
import { PAYMENT_DATA, PAYMENT_METHODS } from "../../mocks/profileData";

const IS_MOCK = import.meta.env.VITE_MOCK_MODE === "true";

function PaymentSection() {
  const [form, setForm] = useState({
    cardholderName: "",
    method:         "Debit Card",
    cardNumber:     "",
    expiryDate:     "",
    cvv:            "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (IS_MOCK) {
          await new Promise(r => setTimeout(r, 600));
          setForm(PAYMENT_DATA);
        } else {
          const res = await apiGetPayment();
          if (res.success) setForm(res.data);
        }
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  // Format card number with dashes
  const handleCardNumber = e => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join("-") || raw;
    setForm(f => ({ ...f, cardNumber: formatted }));
  };

  // Format expiry MM/YY
  const handleExpiry = e => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) raw = raw.slice(0, 2) + "/" + raw.slice(2);
    setForm(f => ({ ...f, expiryDate: raw }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (IS_MOCK) {
        await new Promise(r => setTimeout(r, 700));
      } else {
        await apiUpdatePayment(form);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  return (
    <div className="profile-card">
      <h2 className="profile-card-title">Payment Details</h2>
      <p className="profile-card-subtitle">Enter your payment details below</p>

      {loading ? (
        <PaymentSkeleton />
      ) : (
        <>
          {/* Cardholder Name — full width */}
          <div className="profile-field" style={{ marginBottom: "14px" }}>
            <label className="profile-label">Cardholder Name</label>
            <input
              className="profile-input"
              placeholder="John Doe"
              value={form.cardholderName}
              onChange={set("cardholderName")}
            />
          </div>

          {/* Select Method — full width */}
          <div className="profile-field" style={{ marginBottom: "14px" }}>
            <label className="profile-label">Select Method</label>
            <select
              className="profile-select"
              value={form.method}
              onChange={set("method")}
            >
              {PAYMENT_METHODS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Card Number — full width */}
          <div className="profile-field" style={{ marginBottom: "14px" }}>
            <label className="profile-label">Card Number</label>
            <input
              className="profile-input"
              placeholder="0000-0000-0000-0000"
              value={form.cardNumber}
              onChange={handleCardNumber}
              maxLength={19}
            />
          </div>

          {/* Expiry + CVV — 2 columns */}
          <div className="profile-form-grid">
            <div className="profile-field">
              <label className="profile-label">Expiry Date</label>
              <input
                className="profile-input"
                placeholder="07/28"
                value={form.expiryDate}
                onChange={handleExpiry}
                maxLength={5}
              />
            </div>
            <div className="profile-field">
              <label className="profile-label">CVV</label>
              <input
                className="profile-input"
                placeholder="375"
                type="password"
                value={form.cvv}
                onChange={set("cvv")}
                maxLength={4}
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

function PaymentSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {[1, 2, 3].map(i => (
        <div key={i} className="profile-field">
          <div className="profile-skeleton profile-skeleton-text" style={{ width: "100px" }} />
          <div className="profile-skeleton profile-skeleton-line" />
        </div>
      ))}
      <div className="profile-form-grid">
        {[1, 2].map(i => (
          <div key={i} className="profile-field">
            <div className="profile-skeleton profile-skeleton-text" style={{ width: "80px" }} />
            <div className="profile-skeleton profile-skeleton-line" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaymentSection;