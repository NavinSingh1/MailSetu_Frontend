import { useState, useEffect } from "react";
import "./styles/Card.css";
import "./styles/RecentCampaigns.css";
import MsgIcon from "../../assets/Header/msg.png";
import { apiGetRecentCampaigns } from "../../services/api";

// ─────────────────────────────────────────────
// RecentCampaigns
// Data fetched from: GET /api/dashboard/recent-campaigns/
// Dummy data lives in: src/mocks/dashboardData.js
// ─────────────────────────────────────────────

const STATUS_STYLES = {
    Active:    { bg: "#01C67E", color: "#FFFFFF" },
    Completed: { bg: "#D9D9D9", color: "#2E2E2E" },
    Draft:     { bg: "#fef9c3", color: "#ca8a04" },
};

function RecentCampaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState(null);

    // ── Search state ──
    const [searchOpen, setSearchOpen]   = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await apiGetRecentCampaigns();
                if (result.success) setCampaigns(result.data || []);
                else setError(result.error?.detail || "Failed to load campaigns.");
            } catch {
                setError("Something went wrong.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter campaigns by search query
    const filteredCampaigns = campaigns.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.date.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearchToggle = () => {
        setSearchOpen(o => !o);
        setSearchQuery("");
    };

    const isEmpty = campaigns.length === 0;

    return (
        <div className="card card--full">
            <div className="card-header underline">
                <div>
                    <p className="card-section-title">RECENT CAMPAIGNS</p>
                    <p className="card-section-subtitle">Performance of your latest outreaches</p>
                </div>

                {/* Search icon button */}
                <button className="card-icon-btn rc-search-btn" onClick={handleSearchToggle}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </button>
            </div>

            {/* ── Search input ── */}
            {searchOpen && (
                <div className="rc-search-wrap">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="rc-search-icon">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        className="rc-search-input"
                        placeholder="Search campaigns..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                    {searchQuery && (
                        <button className="rc-search-clear" onClick={() => setSearchQuery("")}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    )}
                </div>
            )}

            {/* ── Loading state ── */}
            {loading && (
                <div className="empty-state">
                    <p className="empty-state-title">Loading campaigns...</p>
                </div>
            )}

            {/* ── Error state ── */}
            {!loading && error && (
                <div className="empty-state">
                    <p className="empty-state-title">Failed to load</p>
                    <p className="empty-state-msg">{error}</p>
                </div>
            )}

            {/* ── Empty state ── */}
            {!loading && !error && isEmpty && (
                <div className="empty-state">
                    <p className="empty-state-title">NO CAMPAIGN DATA YET</p>
                    <p className="empty-state-msg">Start creating campaigns to see performance insights here</p>
                    <button className="empty-state-btn">Create Campaign</button>
                </div>
            )}

            {/* ── Data state ── */}
            {!loading && !error && !isEmpty && (
                <>
                    {/* No results found */}
                    {searchOpen && searchQuery && filteredCampaigns.length === 0 && (
                        <div className="rc-no-results">
                            <p>No campaigns found for "<strong>{searchQuery}</strong>"</p>
                        </div>
                    )}

                    <div className="campaigns-list">
                        {(searchOpen ? filteredCampaigns : campaigns).map(campaign => {
                            const statusStyle = STATUS_STYLES[campaign.status] || STATUS_STYLES.Draft;
                            return (
                                <div key={campaign.id} className="campaign-item">

                                    {/* Left — icon + info */}
                                    <div className="campaign-left">
                                        <div className="campaign-icon">
                                            <img src={MsgIcon} alt="campaign icon" width="40" height="40" />
                                        </div>
                                        <div className="campaign-info">
                                            <p className="campaign-name">{campaign.name}</p>
                                            <div className="campaign-meta">
                                                <span className="campaign-date">{campaign.date}</span>
                                                <span
                                                    className="campaign-status"
                                                    style={{ background: statusStyle.bg, color: statusStyle.color }}
                                                >
                                                    {campaign.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right — open rate + half pill button */}
                                    <div className="campaign-right half-border">
                                        <div className="campaign-rate-wrap">
                                            <p className="campaign-rate-label">Open Rate</p>
                                            <p className="campaign-rate">{campaign.openRate}</p>
                                        </div>
                                        <button className="campaign-report-btn">
                                            View Report
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                <polyline points="15 3 21 3 21 9" />
                                                <line x1="10" y1="14" x2="21" y2="3" />
                                            </svg>
                                        </button>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

export default RecentCampaigns;