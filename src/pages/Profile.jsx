// ─────────────────────────────────────────────
// src/pages/Profile.jsx
// Profile & Settings Page — orchestrates all sections
// Navbar + Footer come from AppLayout (nested route)
// ─────────────────────────────────────────────
import "./Styles/Profile.css";
import ProfileCompletionSection  from "../Components/profile/ProfileCompletionSection";
import AccountSection            from "../Components/profile/AccountSection";
import NewsletterProfileSection  from "../Components/profile/NewsletterProfileSection";
import MailchimpSection          from "../Components/profile/MailchimpSection";
import InsightsSection           from "../Components/profile/InsightsSection";
import PrivacySection            from "../Components/profile/PrivacySection";
import PaymentSection            from "../Components/profile/PaymentSection";

function Profile() {
  return (
    <div className="profile-page">
      <div className="profile-container">
        <ProfileCompletionSection />
        <AccountSection />
        <NewsletterProfileSection />
        <MailchimpSection />
        <InsightsSection />
        <PrivacySection />
        <PaymentSection />
      </div>
    </div>
  );
}

export default Profile;