import { useState, useEffect } from "react";
import "./styles/Card.css";
import "./styles/MailchimpConnection.css";
import VectorIcon from "../../assets/Dashboard/Cards/vector.png";
import SyncIcon   from "../../assets/Dashboard/Cards/sync.png";
import EllipseTR  from "../../assets/Dashboard/Cards/Ellipse 3 (2).png";
import EllipseBL  from "../../assets/Dashboard/Cards/Ellipse 4 (1).png";
import WaveTL     from "../../assets/Dashboard/Cards/Frame 81 (2).png";
import WaveBR     from "../../assets/Dashboard/Cards/Frame 82.png";
import { apiGetMailchimpStatus, apiSyncMailchimp } from "../../services/api";

// ─────────────────────────────────────────────
// MailchimpConnection
// Data fetched from: GET /api/dashboard/mailchimp-status/
// Sync button calls: POST /api/dashboard/mailchimp-sync/
// Dummy data lives in: src/mocks/dashboardData.js
//
// COLORED_THEME:
//   true  → green background card (Figma design)
//   false → plain white card
// ─────────────────────────────────────────────
const COLORED_THEME = true;

function MailchimpConnection() {
    const [data, setData]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [error, setError]     = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await apiGetMailchimpStatus();
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

    // ── Sync Now button handler ──
    const handleSync = async () => {
        try {
            setSyncing(true);
            const result = await apiSyncMailchimp();
            if (result.success) setData(result.data);
        } catch {
            setError("Sync failed.");
        } finally {
            setSyncing(false);
        }
    };

    const isActive = data?.status === "Active";

    return (
        <div className={`card ${COLORED_THEME ? "card--mailchimp" : ""}`}>

            {/* Decorative images — only shown in colored theme */}
            {COLORED_THEME && (
                <>
                    <img src={EllipseTR} alt="" className="mc-ellipse mc-ellipse--tr" />
                    <img src={EllipseBL} alt="" className="mc-ellipse mc-ellipse--bl" />
                    <img src={WaveTL}    alt="" className="mc-wave mc-wave--tl" />
                    <img src={WaveBR}    alt="" className="mc-wave mc-wave--br" />
                </>
            )}

            {/* Content sits above all decorative images */}
            <div className="mc-content">

                <div className="card-header">
                    <p className="card-label">MAILCHIMP CONNECTION</p>
                    <button className="card-icon-btn">
                        <img src={VectorIcon} alt="refresh icon" width="16" height="16" />
                    </button>
                </div>

                {/* ── Loading state ── */}
                {loading && (
                    <>
                        <div className="mailchimp-status">
                            <div className="mailchimp-status-dot" />
                            <span className="mailchimp-status-text">Loading...</span>
                        </div>
                        <p className="card-sublabel">Checking connection...</p>
                    </>
                )}

                {/* ── Error state ── */}
                {!loading && error && (
                    <p className="mc-error">{error}</p>
                )}

                {/* ── Data state ── */}
                {!loading && !error && (
                    <>
                        <div className="mailchimp-status">
                            {isActive ? (
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="12" fill="#22c55e" />
                                    <path d="M7 12.5l3.5 3.5 6.5-7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <div className="mailchimp-status-dot mailchimp-status-dot--inactive" />
                            )}
                            <span className={`mailchimp-status-text ${isActive ? "mailchimp-status-text--active" : ""}`}>
                                {data?.status || "Not Connected"}
                            </span>
                        </div>

                        <p className="card-sublabel">You are connected to mailchimp</p>

                        <div className="mailchimp-footer">
                            <div>
                                <p className="card-stat-label">Last Sync</p>
                                <p className="card-stat-value">{data?.lastSync || "--"}</p>
                            </div>
                            <button
                                className="mailchimp-sync-btn"
                                onClick={handleSync}
                                disabled={syncing}
                            >
                                <img src={SyncIcon} alt="sync icon" width="13" height="13" />
                                {syncing ? "Syncing..." : "Sync Now"}
                            </button>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}

export default MailchimpConnection;