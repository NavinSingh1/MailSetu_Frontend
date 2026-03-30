import { useState, useEffect } from "react";
import "./styles/Card.css";
import "./styles/AudienceOverview.css";
import CopyIcon  from "../../assets/Dashboard/Cards/people_1.png";
import EllipseTR from "../../assets/Dashboard/Cards/Ellipse 3 (1).png";
import EllipseBL from "../../assets/Dashboard/Cards/Ellipse 4.png";
import WaveTL    from "../../assets/Dashboard/Cards/Frame 81 (1).png";
import WaveBR    from "../../assets/Dashboard/Cards/Frame 82 (1).png";
import { apiGetAudienceOverview } from "../../services/api";

// ─────────────────────────────────────────────
// AudienceOverview
// Data fetched from: GET /api/dashboard/audience-overview/
// Dummy data lives in: src/mocks/dashboardData.js
//
// COLORED_THEME:
//   true  → yellow background card with ellipses (Figma design)
//   false → plain white card
// ─────────────────────────────────────────────
const COLORED_THEME = true;

function AudienceOverview() {
    const [data, setData]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await apiGetAudienceOverview();
                if (result.success) setData(result.data);
                else setError(result.error?.detail || "Failed to load.");
            } catch {
                setError("Something went wrong.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const isEmpty = !data;

    return (
        <div className={`card ${COLORED_THEME ? "card--audience" : ""}`}>

            {/* Decorative images — only shown in colored theme */}
            {COLORED_THEME && (
                <>
                    <img src={EllipseTR} alt="" className="ao-ellipse ao-ellipse--tr" />
                    <img src={EllipseBL} alt="" className="ao-ellipse ao-ellipse--bl" />
                    <img src={WaveTL}    alt="" className="ao-wave ao-wave--tl" />
                    <img src={WaveBR}    alt="" className="ao-wave ao-wave--br" />
                </>
            )}

            {/* Content sits above all decorative images */}
            <div className="ao-content">

                <div className="card-header">
                    <p className="card-label">AUDIENCE OVERVIEW</p>
                    <button className="card-icon-btn">
                        <img src={CopyIcon} alt="icon" width="16" height="16" />
                    </button>
                </div>

                {/* ── Loading state ── */}
                {loading && (
                    <>
                        <p className="card-big-number card-big-number--empty">------</p>
                        <p className="card-sublabel">Total Subscribers</p>
                        <div className="card-stats-row">
                            <div className="card-stat">
                                <p className="card-stat-value card-stat-value--empty">--</p>
                                <p className="card-stat-label">Avg Open Rate</p>
                            </div>
                            <div className="card-stat">
                                <p className="card-stat-value card-stat-value--empty">--</p>
                                <p className="card-stat-label">Avg Click Rate</p>
                            </div>
                        </div>
                    </>
                )}

                {/* ── Error state ── */}
                {!loading && error && (
                    <p className="ao-error">{error}</p>
                )}

                {/* ── Data state ── */}
                {!loading && !error && (
                    <>
                        <p className={`card-big-number ${isEmpty ? "card-big-number--empty" : ""}`}>
                            {isEmpty ? "------" : data.totalSubscribers}
                        </p>
                        <p className="card-sublabel">Total Subscribers</p>

                        <div className="card-stats-row">
                            <div className="card-stat">
                                <p className={`card-stat-value ${isEmpty ? "card-stat-value--empty" : ""}`}>
                                    {isEmpty ? "--" : data.avgOpenRate}
                                </p>
                                <p className="card-stat-label">Avg Open Rate</p>
                            </div>
                            <div className="card-stat">
                                <p className={`card-stat-value ${isEmpty ? "card-stat-value--empty" : ""}`}>
                                    {isEmpty ? "--" : data.avgClickRate}
                                </p>
                                <p className="card-stat-label">Avg Click Rate</p>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}

export default AudienceOverview;