import { useState, useEffect } from "react";
import "./styles/Card.css";
import "./styles/TopMatches.css";
import { apiGetTopMatches } from "../../services/api";

// ─────────────────────────────────────────────
// TopMatches
// Data fetched from: GET /api/dashboard/top-matches/
// Dummy data lives in: src/mocks/dashboardData.js
// ─────────────────────────────────────────────

function MatchScoreBar({ score }) {
    const color = score >= 90 ? "#22c55e" : score >= 80 ? "#f5c800" : "#0ea5a0";
    return (
        <div className="match-score-inner">
            <p className="match-score-label">Match Score</p>
            <div className="match-score-pct">{score}%</div>
            <div className="match-score-bar-wrap">
                <div
                    className="match-score-bar"
                    style={{ width: `${score}%`, background: color }}
                />
            </div>
        </div>
    );
}

function TopMatches() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await apiGetTopMatches(1, 3);
                if (result.success) {
                    setMatches(result.data || []);
                    setHasMore(result.pagination?.hasMore || false);
                } else {
                    setError(result.error?.detail || "Failed to load matches.");
                }
            } catch {
                setError("Something went wrong.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const isEmpty = matches.length === 0;

    return (
        <div className="card card--full">
            <div className="card-header underline">
                <div>
                    <p className="card-section-title">TOP MATCHES</p>
                    <p className="card-section-subtitle">AI curated partners for your audience</p>
                </div>
                <button className="card-icon-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="19" cy="12" r="1" />
                        <circle cx="5" cy="12" r="1" />
                    </svg>
                </button>
            </div>

            {/* ── Loading state ── */}
            {loading && (
                <div className="empty-state">
                    <p className="empty-state-title">Loading matches...</p>
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
                    <p className="empty-state-title">NO MATCHES YET</p>
                    <p className="empty-state-msg">Complete your profile to see matches</p>
                    <button className="empty-state-btn">Complete Profile</button>
                </div>
            )}

            {/* ── Data state ── */}
            {!loading && !error && !isEmpty && (
                <>
                    <div className="matches-list">
                        {matches.map(match => (
                            <div key={match.id} className="match-item">

                                {/* Avatar */}
                                <div className="match-avatar">
                                    {match.name.charAt(0)}
                                </div>

                                {/* Name + tag */}
                                <div className="match-info">
                                    <p className="match-name">{match.name}</p>
                                    <span className="match-tag">{match.type}</span>
                                </div>

                                {/* Score bar + View Profile */}
                                <div className="match-right">
                                    <MatchScoreBar score={match.matchScore} />
                                    <button className="match-view-btn">
                                        View Profile
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                            <polyline points="15 3 21 3 21 9" />
                                            <line x1="10" y1="14" x2="21" y2="3" />
                                        </svg>
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>

                    <div className="card-footer">
                        <button className="card-view-all-btn">
                            {hasMore ? "View all matches →" : "View all matches"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default TopMatches;