import { useState, useEffect } from "react";
import "./Dashboard.css";
import CertificateRequestPage from "./CertificateRequestPage";
import FileReportPage from "./FileReportPage";
import EditProfile from "./EditProfile";
import Announcements from "../announcement/Announcements";
import { authAPI, announcementAPI, prefetchUserData } from "../../lib/api";
import logoImg from "../../assets/logo.png";
import pfpImg from "../../assets/pfp.png";
import residentImg from "../../assets/resident.png";

// Dashboard Component
export default function Dashboard() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("personal-info");
  const [showEditModal, setShowEditModal] = useState(false);
  const [announcementCount, setAnnouncementCount] = useState(0);

  const fetchUserData = () => {
    const sessionData = sessionStorage.getItem("serviline_session");
    if (!sessionData) {
      window.location.href = "/login";
      return;
    }
    const sessionUser = JSON.parse(sessionData);
    
    authAPI.getProfile(sessionUser.userId)
      .then(res => {
        setSession(res.data);
        localStorage.setItem('userId', res.data.id);
        setLoading(false);
        // Prefetch requests, reports, announcements in background
        prefetchUserData(res.data.id, res.data.role === 'ADMIN');
      })
      .catch(err => {
        console.error("Failed to fetch user data:", err);
        setSession(sessionUser);
        setLoading(false);
      });
  };

  const fetchAnnouncementCount = async () => {
    try {
      const res = await announcementAPI.getAll();
      setAnnouncementCount(res.data.length);
    } catch (err) {
      console.error("Failed to fetch announcement count:", err);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchAnnouncementCount();
  }, []);

  const handleProfileUpdate = () => {
    fetchUserData();
    setShowEditModal(false);
  };

  const getImageUrl = (byteArray) => {
    if (!byteArray) return null;
    return `data:image/jpeg;base64,${byteArray}`;
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loader-themed"></div>
        <div className="loading-text">Loading Dashboard...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  function handleLogout() {
    window.location.href = "/logout";
  }

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src={logoImg} alt="Logo" className="logo-img" />
            <span>ServiLine</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeSection === "announcements" ? "active" : ""}`}
            onClick={() => {
              setActiveSection("announcements");
              setSidebarOpen(false);
            }}
          >
            <span className="nav-icon">📢</span>
            <span className="nav-text">Announcements</span>
            {announcementCount > 0 && (
              <span className="announcement-badge">{announcementCount}</span>
            )}
          </button>
          <button 
            className={`nav-item ${activeSection === "personal-info" ? "active" : ""}`}
            onClick={() => {
              setActiveSection("personal-info");
              setSidebarOpen(false);
            }}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-text">Personal Info</span>
          </button>

          {session.role === 'ADMIN' && (
            <button 
              className="nav-item admin-nav-item"
              onClick={() => window.location.href = "/admin"}
            >
              <span className="nav-icon">🛡️</span>
              <span className="nav-text">Admin Panel</span>
            </button>
          )}
          <button 
            className={`nav-item ${activeSection === "certificate-request" ? "active" : ""}`}
            onClick={() => {
              setActiveSection("certificate-request");
              setSidebarOpen(false);
            }}
          >
            <span className="nav-icon">📄</span>
            <span className="nav-text">Document Request</span>
          </button>
          <button 
            className={`nav-item ${activeSection === "file-report" ? "active" : ""}`}
            onClick={() => {
              setActiveSection("file-report");
              setSidebarOpen(false);
            }}
          >
            <span className="nav-icon">📋</span>
            <span className="nav-text">File Report</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Navigation Bar */}
        <div className="dashboard-topbar">
          <div className="topbar-left">
          </div>
          <div className="topbar-right">
            <div className="topbar-user">
              <div className="user-avatar-circle">
                <img src={getImageUrl(session.profilePicture) || pfpImg} alt="User Profile" className="avatar-img" />
              </div>
              <span className="user-full-name">
                {session.firstName} {session.lastName}
              </span>
            </div>
            <button className="btn-logout-red" onClick={handleLogout}>LOGOUT</button>
          </div>
        </div>

        {/* Page Content */}
        <div className="dashboard-content">
          {activeSection === "personal-info" && (
            <div className="personal-info-container">
              {/* Header Section */}
              <div className="info-header-card">
                <div className="info-header-left">
                  <div className="info-avatar-large">
                    <img src={getImageUrl(session.profilePicture) || pfpImg} alt="User Profile" className="avatar-img-large" />
                  </div>
                  <div className="info-header-text">
                    <h2>{session.firstName} {session.lastName}</h2>
                    <span className="badge-resident">RESIDENT</span>
                  </div>
                </div>
                <button className="btn-edit-info" onClick={() => setShowEditModal(true)}>EDIT INFORMATION</button>
              </div>

              {/* Edit Modal */}
              {showEditModal && (
                <div className="modal-overlay-edit">
                  <div className="modal-content-edit">
                    <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>✕</button>
                    <EditProfile 
                      user={session} 
                      onUpdate={handleProfileUpdate} 
                      onCancel={() => setShowEditModal(false)} 
                    />
                  </div>
                </div>
              )}

              {/* Information Grid */}
              <div className="info-details-grid">
                <section className="info-section">
                  <h3 className="section-title">USER INFORMATION</h3>
                  <div className="info-table">
                    <div className="info-row">
                      <span className="label">Full Name:</span>
                      <span className="value">{session.firstName} {session.lastName}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Username:</span>
                      <span className="value">{session.username || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Email:</span>
                      <span className="value">{session.email}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Date of Birth:</span>
                      <span className="value">
                        {session.dob 
                          ? new Date(session.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                          : 'Not provided'}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="label">Civil Status:</span>
                      <span className="value">{session.civilStatus || 'Single'}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Address:</span>
                      <span className="value">
                        {session.street}, {session.purok}, {session.barangay}, {session.city}, {session.province}, {session.postalCode}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="label">Resident Confirmed:</span>
                      <span className={`value ${session.residentConfirmed ? 'confirmed-yes' : 'confirmed-no'}`}>
                        {session.residentConfirmed ? '✓ Yes' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </section>

                <section className="info-section">
                  <h3 className="section-title">CONTACT INFORMATION</h3>
                  <div className="info-table">
                    <div className="info-row">
                      <span className="label">Mobile:</span>
                      <span className="value">{session.phoneNumber}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Email:</span>
                      <span className="value">{session.email}</span>
                    </div>
                  </div>
                </section>

                <section className="info-section">
                  <h3 className="section-title">RESIDENT ID</h3>
                  <div className="resident-id-card">
                    {session.residentIdImage ? (
                      <img src={getImageUrl(session.residentIdImage)} alt="Resident ID" className="id-image-preview" />
                    ) : (
                      <div className="id-placeholder">
                        <img src={residentImg} alt="Default Resident ID" className="id-img-default" />
                        <p>No Resident ID uploaded yet</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          )}

          {activeSection === "certificate-request" && (
            <CertificateRequestPage />
          )}

          {activeSection === "file-report" && (
            <FileReportPage />
          )}

          {activeSection === "announcements" && (
            <Announcements />
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