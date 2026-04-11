import { useState, useEffect } from "react";
import "./Dashboard.css";
import CertificateRequestPage from "./CertificateRequestPage";

// Dashboard Component
export default function Dashboard() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("personal-info");

  useEffect(() => {
    const sessionData = sessionStorage.getItem("labangonline_session");
    if (!sessionData) {
      window.location.href = "/login";
      return;
    }
    const user = JSON.parse(sessionData);
    setSession(user);
    // Store userId in localStorage for API calls
    localStorage.setItem('userId', user.id);
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
          <button 
            className={`nav-item ${activeSection === "personal-info" ? "active" : ""}`}
            onClick={() => {
              setActiveSection("personal-info");
              setSidebarOpen(false);
            }}
          >
            <span className="nav-icon">👤</span>
            <span>Personal Information</span>
          </button>
          <button 
            className={`nav-item ${activeSection === "certificate-request" ? "active" : ""}`}
            onClick={() => {
              setActiveSection("certificate-request");
              setSidebarOpen(false);
            }}
          >
            <span className="nav-icon">📄</span>
            <span>Document Request</span>
          </button>
          <button 
            className={`nav-item ${activeSection === "file-report" ? "active" : ""}`}
            onClick={() => {
              setActiveSection("file-report");
              setSidebarOpen(false);
            }}
          >
            <span className="nav-icon">📋</span>
            <span>File a Report</span>
          </button>
          <button 
            className={`nav-item ${activeSection === "announcements" ? "active" : ""}`}
            onClick={() => {
              setActiveSection("announcements");
              setSidebarOpen(false);
            }}
          >
            <span className="nav-icon">📢</span>
            <span>Announcements</span>
          </button>
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
          {activeSection === "personal-info" && (
            <>
              {/* User Information Section */}
              <section className="dashboard-section info-section">
                <h3 className="info-section-title">👤 PERSONAL INFORMATION</h3>
                <div className="info-section-content">
                  <div className="info-row">
                    <span className="info-label">First Name:</span>
                    <span className="info-value">{session.firstName || 'Not provided'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Middle Name:</span>
                    <span className="info-value">{session.middleName || 'Not provided'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Last Name:</span>
                    <span className="info-value">{session.lastName || 'Not provided'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Date of Birth:</span>
                    <span className="info-value">
                      {session.dob 
                        ? new Date(session.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                        : 'Not provided'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Gender:</span>
                    <span className="info-value">{session.gender ? session.gender.charAt(0).toUpperCase() + session.gender.slice(1) : 'Not provided'}</span>
                  </div>
                </div>
              </section>

              {/* Address Information Section */}
              <section className="dashboard-section info-section">
                <h3 className="info-section-title">📍 ADDRESS DETAILS</h3>
                <div className="info-section-content">
                  <div className="info-row">
                    <span className="info-label">Street Address:</span>
                    <span className="info-value">{session.street || 'Not provided'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Purok:</span>
                    <span className="info-value">{session.purok || 'Not provided'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Barangay:</span>
                    <span className="info-value">{session.barangay || 'Not provided'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">City/Municipality:</span>
                    <span className="info-value">{session.city || 'Not provided'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Province:</span>
                    <span className="info-value">{session.province || 'Not provided'}</span>
                  </div>
                </div>
              </section>

              {/* Contact Information Section */}
              <section className="dashboard-section info-section">
                <h3 className="info-section-title">📞 CONTACT INFORMATION</h3>
                <div className="info-section-content">
                  <div className="info-row">
                    <span className="info-label">Mobile Number:</span>
                    <span className="info-value">{session.phoneNumber || 'Not provided'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Email Address:</span>
                    <span className="info-value">{session.email || 'Not provided'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Account Role:</span>
                    <span className="info-value">{session.role || 'RESIDENT'}</span>
                  </div>
                </div>
              </section>

              {/* Resident ID Section */}
              <section className="dashboard-section info-section">
                <h3 className="info-section-title">RESIDENT ID</h3>
                <div className="resident-id-container">
                  <div className="resident-id-placeholder">
                    <div className="id-icon">🆔</div>
                    <p>No Resident ID uploaded yet</p>
                  </div>
                </div>
              </section>

              {/* Footer Info */}
              <section className="dashboard-section footer-section">
                <p>For support or inquiries, please visit Barangay Labangon Hall or contact us at the official barangay office.</p>
              </section>
            </>
          )}

          {activeSection === "certificate-request" && (
            <CertificateRequestPage />
          )}

          {activeSection === "file-report" && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>File a Report</h2>
              </div>
              <div className="placeholder-section">
                <p>Coming soon! File reports feature will be available here.</p>
              </div>
            </section>
          )}

          {activeSection === "announcements" && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>Announcements</h2>
              </div>
              <div className="placeholder-section">
                <p>Coming soon! View latest announcements and updates from the barangay.</p>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}