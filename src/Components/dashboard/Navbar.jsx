import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./styles/Navbar.css";
import NotificationIcon from '../../assets/Header/notification 1.png';
import MailSetuLogo from '../../assets/Header/MailSetu Logo.png';

// ─────────────────────────────────────────────
// DARK_HEADER
//   true  → dark navbar #2E2E2E (Figma Image 1)
//   false → light navbar #FFFF (Figma Image 2)
// TODO: replace with real condition later
// ─────────────────────────────────────────────
const DARK_HEADER = false;

// ─────────────────────────────────────────────
// DUMMY NOTIFICATIONS
// TODO: Replace with real API call
// API: GET /api/notifications/
// ─────────────────────────────────────────────
const DUMMY_NOTIFICATIONS = [
  {
    id: 1,
    title: "New Match Found",
    message: "Growth Marketing Agency matches your audience.",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    title: "Campaign Completed",
    message: "Your campaign 'New Web Agency' has completed.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    title: "Mailchimp Synced",
    message: "Your Mailchimp account was synced successfully.",
    time: "3 hours ago",
    read: true,
  },
];

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen]               = useState(false);
  const [mobileNavOpen, setMobileNavOpen]     = useState(false);
  const [notifOpen, setNotifOpen]             = useState(false);
  const [notifications, setNotifications]     = useState(DUMMY_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Mark all as read when opening
  const handleNotifToggle = () => {
    setNotifOpen(o => !o);
    setMenuOpen(false);
    if (!notifOpen) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const navLinks = ["Dashboard", "Partners", "Campaigns", "Analytics", "Profile & Settings"];

  return (
    <nav className={`navbar ${DARK_HEADER ? "navbar--dark" : "navbar--light"}`}>
      <div className="navbar-inner">

        {/* Logo */}
        <div className="navbar-logo">
          <img src={MailSetuLogo} alt="MailSetu Logo" width="42" height="42" />
          <span className="navbar-logo-text">MailSetu</span>
        </div>

        {/* Desktop Nav Links */}
        <ul className="navbar-links">
          {navLinks.map(link => (
            <li key={link}>
              <a
                href="#"
                className={`navbar-link ${link === "Dashboard" ? "navbar-link--active" : ""}`}
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side — icons + avatar */}
        <div className="navbar-right">

          {/* Notification bell */}
          <div className="navbar-notif-wrap">
            <button className="navbar-icon-btn" onClick={handleNotifToggle}>
              <img src={NotificationIcon} alt="notifications" width="20" height="20" />
              {unreadCount > 0 && (
                <span className="navbar-badge">{unreadCount}</span>
              )}
            </button>

            {/* Notification dropdown */}
            {notifOpen && (
              <div className="notif-dropdown">
                <div className="notif-dropdown-header">
                  <p className="notif-dropdown-title">Notifications</p>
                  <span className="notif-dropdown-count">{notifications.length} total</span>
                </div>
                <div className="notif-list">
                  {notifications.map(notif => (
                    <div key={notif.id} className={`notif-item ${notif.read ? "notif-item--read" : "notif-item--unread"}`}>
                      <div className="notif-dot" />
                      <div className="notif-content">
                        <p className="notif-title">{notif.title}</p>
                        <p className="notif-message">{notif.message}</p>
                        <p className="notif-time">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="notif-footer">
                  <button className="notif-view-all">View all notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* Avatar + dropdown */}
          <div className="navbar-avatar-wrap">
            <button
              className="navbar-avatar"
              onClick={() => { setMenuOpen(o => !o); setNotifOpen(false); }}
            >
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </button>

            {menuOpen && (
              <div className="navbar-dropdown">
                <p className="navbar-dropdown-email">{user?.email || "user@example.com"}</p>
                <p className="navbar-dropdown-role">{user?.role || "owner"}</p>
                <hr className="navbar-dropdown-divider" />
                <button className="navbar-dropdown-item" onClick={() => navigate("/profile")}>
                  Profile & Settings
                </button>
                <button className="navbar-dropdown-item navbar-dropdown-item--danger" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="navbar-hamburger" onClick={() => setMobileNavOpen(o => !o)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {mobileNavOpen && (
        <div className="navbar-mobile-menu">
          {navLinks.map(link => (
            <a
              key={link}
              href="#"
              className={`navbar-mobile-link ${link === "Dashboard" ? "navbar-mobile-link--active" : ""}`}
              onClick={() => setMobileNavOpen(false)}
            >
              {link}
            </a>
          ))}
          <button className="navbar-mobile-logout" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;