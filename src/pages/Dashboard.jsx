import Navbar from "../Components/dashboard/Navbar";
import AudienceOverview from "../Components/dashboard/AudienceOverview";
import MailchimpConnection from "../Components/dashboard/MailchimpConnection";
import QuickActions from "../Components/dashboard/QuickActions";
import TopMatches from "../Components/dashboard/TopMatches";
import RecentCampaigns from "../Components/dashboard/RecentCampaigns";
import "./Styles/Dashboard.css";

// ─────────────────────────────────────────────
// Dashboard Page
//
// Protected route — only accessible when logged in
// All data is currently DUMMY DATA
//
// TODO: When APIs are ready, replace DUMMY_DATA
// inside each component with real API calls:
//   AudienceOverview    → GET /api/dashboard/audience-overview/
//   MailchimpConnection → GET /api/dashboard/mailchimp-status/
//   QuickActions        → GET /api/dashboard/profile-status/
//   TopMatches          → GET /api/dashboard/top-matches/
//   RecentCampaigns     → GET /api/dashboard/recent-campaigns/
// ─────────────────────────────────────────────

function Dashboard() {
    return (
        <div className="dashboard-page">
            <Navbar />

            <main className="dashboard-main">
                <div className="dashboard-container">

                    {/* ── Row 1: 3 cards same width ──── */}
                    <div className="dashboard-top-row">
                        <AudienceOverview />
                        <MailchimpConnection />
                        <QuickActions />
                    </div>

                    {/* ── Row 2: Top Matches ────────── */}
                    <TopMatches />

                    {/* ── Row 3: Recent Campaigns ───── */}
                    <RecentCampaigns />

                </div>
            </main>

            {/* ── Footer ──────────────────────────── */}
            <footer className="dashboard-footer">
                <p>© 2026 MailSetu. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Dashboard;