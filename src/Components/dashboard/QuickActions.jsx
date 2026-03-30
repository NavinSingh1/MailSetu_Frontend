import { useState, useEffect } from "react";
import "./styles/Card.css";
import "./styles/QuickActions.css";
import Timericon     from "../../assets/Dashboard/Cards/Clip_path_group.png";
import EllipseGreen  from "../../assets/Dashboard/Cards/Ellipse 2.png";
import EllipseYellow from "../../assets/Dashboard/Cards/Ellipse 3.png";
import { apiGetProfileStatus } from "../../services/api";

// ─────────────────────────────────────────────
// QuickActions
// Data fetched from: GET /api/dashboard/profile-status/
// Dummy data lives in: src/mocks/dashboardData.js
// ─────────────────────────────────────────────

function QuickActions() {
    const [data, setData]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await apiGetProfileStatus();
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

    const isComplete = data?.profileComplete === true;

    return (
        <div className="card card--dark quick-actions-card">

            {/* ── Ellipse images from assets ── */}
            <img src={EllipseYellow} alt="" className="qa-ellipse qa-ellipse--tr" />
            <img src={EllipseGreen}  alt="" className="qa-ellipse qa-ellipse--bl" />

            {/* ── Content sits above ellipses ── */}
            <div className="qa-content">

                <div className="card-header">
                    <p className="card-label card-label--light">QUICK ACTIONS</p>
                    <button className="card-icon-btn card-icon-btn--light">
                        <img src={Timericon} alt="share icon" width="16" height="16" />
                    </button>
                </div>

                {/* ── Loading state ── */}
                {loading && (
                    <>
                        <p className="quick-actions-title">Loading...</p>
                        <p className="quick-actions-msg">Please wait...</p>
                    </>
                )}

                {/* ── Error state ── */}
                {!loading && error && (
                    <p className="quick-actions-msg">{error}</p>
                )}

                {/* ── Data state ── */}
                {!loading && !error && (
                    <>
                        <p className="quick-actions-title">
                            {isComplete ? "Profile Complete ✅" : "Profile Incomplete"}
                        </p>
                        <p className="quick-actions-msg">
                            {data?.message || "Finish your profile for smarter recommendations"}
                        </p>
                        {!isComplete && (
                            <button className="quick-actions-btn">Complete your profile</button>
                        )}
                    </>
                )}

            </div>
        </div>
    );
}

export default QuickActions;