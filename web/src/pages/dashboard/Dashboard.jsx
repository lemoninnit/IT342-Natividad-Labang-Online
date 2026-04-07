import { useState, useEffect } from "react";
import "./Dashboard.css";

// Dashboard Component
export default function Dashboard() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const sessionData = sessionStorage.getItem("labangonline_session");
    if (!sessionData) {
      window.location.href = "/login";
      return;
    }
    const user = JSON.parse(sessionData);
    setSession(user);
    setLoading(false);
  }, []);

  function handleLogout() {
    window.location.href = "/logout";
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">🏘️ LabangOnline</div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          <a href="#personal-info" className="nav-item active">
            <span className="nav-icon">👤</span>
            <span>Personal Information</span>
          </a>
          <a href="#document-request" className="nav-item">
            <span className="nav-icon">📄</span>
            <span>Document Request</span>
          </a>
          <a href="#file-report" className="nav-item">
            <span className="nav-icon">📋</span>
            <span>File a Report</span>
          </a>
          <a href="#announcements" className="nav-item">
            <span className="nav-icon">📢</span>
            <span>Announcements</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Navigation Bar */}
        <div className="dashboard-topbar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰ Menu
          </button>
          <div className="topbar-user">
            <span className="user-name">
              {session.firstName} {session.lastName}
            </span>
            <button className="user-avatar" onClick={handleLogout}>
              {session.firstName[0]}
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="dashboard-content">
          {/* Welcome Section */}
          <section className="dashboard-section welcome-section">
            <h1>Welcome, {session.firstName}!</h1>
            <p>Here's an overview of your account and available services</p>
          </section>

          {/* User Info Card */}
          <section className="dashboard-section">
            <div className="section-header">
              <h2>Your Profile</h2>
            </div>
            <div className="user-profile-card">
              <div className="profile-avatar">{session.firstName[0]}{session.lastName[0]}</div>
              <div className="profile-info">
                <h3>{session.firstName} {session.lastName}</h3>
                <p className="profile-role">{session.role}</p>
                <p className="profile-email">{session.email}</p>
              </div>
              <div className="profile-status">
                <span className="status-badge active">Verified Resident</span>
              </div>
            </div>
          </section>

          {/* Account Information */}
          <section className="dashboard-section">
            <div className="section-header">
              <h2>Account Information</h2>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label>Email Address</label>
                <p>{session.email}</p>
              </div>
              <div className="info-item">
                <label>User Role</label>
                <p>{session.role === "admin" ? "Administrator" : "Resident"}</p>
              </div>
              <div className="info-item">
                <label>Login Time</label>
                <p>{new Date(session.loginTime).toLocaleString()}</p>
              </div>
              <div className="info-item">
                <label>Account Status</label>
                <p><span className="status-badge active">Active</span></p>
              </div>
            </div>
          </section>

          {/* Footer Info */}
          <section className="dashboard-section footer-section">
            <p>For support or inquiries, please visit Barangay Labangon Hall or contact us at the official barangay office.</p>
          </section>
        </div>
      </main>

      {/* Overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}