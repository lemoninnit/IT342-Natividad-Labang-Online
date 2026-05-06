import { useState, useEffect } from 'react'
import { adminAPI, paymentAPI } from '../../lib/api'
import Announcements from '../../components/Announcements'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('residents')
  const [residents, setResidents] = useState([])
  const [certificates, setCertificates] = useState([])
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    // Check if user is admin
    const sessionData = sessionStorage.getItem("labangonline_session")
    if (!sessionData) {
      window.location.href = "/admin/login"
      return
    }
    try {
      const session = JSON.parse(sessionData)
      if (!session || !session.role || session.role.toUpperCase() !== 'ADMIN') {
        window.location.href = "/dashboard"
        return
      }
    } catch (e) {
      console.error("Session parse error:", e)
      window.location.href = "/admin/login"
      return
    }

    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'residents') {
        const res = await adminAPI.getAllUsers()
        setResidents(res.data)
      } else if (activeTab === 'certificates') {
        const res = await adminAPI.getAllCertificates()
        setCertificates(res.data)
      } else if (activeTab === 'reports') {
        const res = await adminAPI.getAllComplaints()
        setComplaints(res.data)
      }
    } catch (err) {
      console.error("Failed to fetch admin data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyResident = async (id) => {
    try {
      await adminAPI.confirmUser(id)
      fetchData()
    } catch (err) {
      alert("Failed to verify resident")
    }
  }

  const handleUpdateCertStatus = async (id, status) => {
    try {
      await adminAPI.updateCertificateStatus(id, status)
      fetchData()
    } catch (err) {
      alert("Failed to update status")
    }
  }

  const handleUpdateComplaintStatus = async (id, status) => {
    try {
      await adminAPI.updateComplaintStatus(id, status)
      fetchData()
    } catch (err) {
      alert("Failed to update status")
    }
  }

  const handleApprovePayment = async (paymentId) => {
    try {
      await paymentAPI.approve(paymentId)
      fetchData()
    } catch (err) {
      alert("Failed to approve payment")
    }
  }

  const handleRejectPayment = async (paymentId) => {
    try {
      await paymentAPI.reject(paymentId)
      fetchData()
    } catch (err) {
      alert("Failed to reject payment")
    }
  }

  const getImageUrl = (byteArray) => {
    if (!byteArray) return null
    return `data:image/jpeg;base64,${byteArray}`
  }

  const renderResidents = () => (
    <div className="mgmt-container">
      <div className="data-card">
        <div className="card-header">
          <h2 className="card-title">Resident Management</h2>
          <div className="card-actions">
            <span className="count-badge">{residents.filter(r => r.role !== 'ADMIN').length} Residents</span>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Resident Name</th>
                <th>Contact Details</th>
                <th>Verification ID</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {residents.filter(r => r.role !== 'ADMIN').map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <span className="user-name">{user.firstName} {user.lastName}</span>
                      <span className="user-id">#{user.id}</span>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <span className="info-email">{user.email}</span>
                      <span className="info-phone">{user.phoneNumber || 'No phone'}</span>
                    </div>
                  </td>
                  <td>
                    {user.residentIdImage ? (
                      <button className="btn-action btn-view" onClick={() => setSelectedImage(getImageUrl(user.residentIdImage))}>
                        View Document
                      </button>
                    ) : (
                      <span className="no-data">Not Uploaded</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${user.residentConfirmed ? 'status-paid' : 'status-pending'}`}>
                      {user.residentConfirmed ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    {!user.residentConfirmed && (
                      <button className="btn-action btn-verify" onClick={() => handleVerifyResident(user.id)}>
                        Approve Resident
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderCertificates = () => {
    const filteredCerts = statusFilter === 'ALL' 
      ? certificates 
      : certificates.filter(cert => cert.status === statusFilter)

    return (
      <div className="mgmt-container">
        <div className="data-card">
          <div className="card-header">
            <h2 className="card-title">Certificate Requests</h2>
            <div className="card-actions">
              <span className="count-badge">{filteredCerts.length} Requests</span>
            </div>
          </div>

          {/* Status Filter */}
          <div className="filter-bar">
            <div className="filter-label">Filter by Status:</div>
            <div className="filter-buttons">
              {['ALL', 'PENDING', 'PAID', 'DONE', 'REJECTED'].map(status => (
                <button
                  key={status}
                  className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Resident Name</th>
                  <th>Contact Info</th>
                  <th>Certificate Type</th>
                  <th>Purpose</th>
                  <th>Payment Method</th>
                  <th>Reference</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCerts.length > 0 ? (
                  filteredCerts.map(cert => (
                    <tr key={cert.id}>
                      <td>
                        <div className="user-info">
                          <span className="user-name">{cert.user?.firstName} {cert.user?.lastName}</span>
                          <span className="user-id">ID: #{cert.user?.id}</span>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          <span className="info-email">{cert.user?.email}</span>
                          <span className="info-phone">{cert.user?.phoneNumber || 'N/A'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="cert-type-info">
                          <span className="cert-type">{cert.certificateType?.replace(/_/g, ' ')}</span>
                          <span className="cert-date">{new Date(cert.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="purpose-cell">
                        <div className="purpose-text" title={cert.purpose}>{cert.purpose}</div>
                      </td>
                      <td>
                        {cert.payment ? (
                          <div className="payment-method">
                            <span className="method-pill">{cert.payment.paymentMethod?.replace(/_/g, ' ')}</span>
                          </div>
                        ) : (
                          <span className="no-data">Unpaid</span>
                        )}
                      </td>
                      <td>
                        {cert.payment?.referenceNumber ? (
                          <div className="ref-display">
                            <span className="ref-text">{cert.payment.referenceNumber}</span>
                            {cert.payment.proofImage && (
                              <button
                                className="btn-text-link"
                                onClick={() => setSelectedImage(getImageUrl(cert.payment.proofImage))}
                                title="Click to view payment proof"
                              >
                                📷 View
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="no-data">N/A</span>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge status-${cert.status?.toLowerCase()}`}>
                          {cert.status}
                        </span>
                      </td>
                      <td className="action-buttons">
                        <div className="action-group">
                          <button
                            className="btn-action btn-info"
                            onClick={() => setSelectedUser(cert.user)}
                            title="View full user details"
                          >
                            👤 Details
                          </button>
                          <select
                            className="status-select"
                            value={cert.status}
                            onChange={(e) => handleUpdateCertStatus(cert.id, e.target.value)}
                            title="Update request status"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PAID">PAID</option>
                            <option value="DONE">DONE</option>
                            <option value="REJECTED">REJECTED</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="empty-state">
                      No certificate requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const renderReports = () => (
    <div className="mgmt-container">
      <div className="data-card">
        <div className="card-header">
          <h2 className="card-title">Incident Reports</h2>
          <div className="card-actions">
            <span className="count-badge">{complaints.length} Total Reports</span>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Location</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map(report => (
                <tr key={report.id}>
                  <td>
                    <div className="incident-type-tag">
                      {report.incidentType}
                    </div>
                  </td>
                  <td>
                    <div className="location-info">
                      <span>📍 {report.location}</span>
                      <span className="date-sub">{new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="description-cell">
                    <div className="description-text">{report.description}</div>
                  </td>
                  <td>
                    <span className={`status-badge status-${report.status.toLowerCase()}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="action-buttons">
                    {report.status === 'PENDING' && (
                      <div className="approval-group">
                        <button className="btn-action btn-verify" onClick={() => handleUpdateComplaintStatus(report.id, 'REVIEWED')}>
                          Approve
                        </button>
                        <button className="btn-action btn-reject" onClick={() => handleUpdateComplaintStatus(report.id, 'REJECTED')}>
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  return (
    <div className="admin-dashboard-wrapper">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            LabangOnline <span className="admin-tag">Admin</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'residents' ? 'active' : ''}`} onClick={() => setActiveTab('residents')}>
            👥 Residents
          </button>
          <button className={`nav-item ${activeTab === 'certificates' ? 'active' : ''}`} onClick={() => setActiveTab('certificates')}>
            📄 Certificates
          </button>
          <button className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
            🚨 Reports
          </button>
          <button className={`nav-item ${activeTab === 'announcements' ? 'active' : ''}`} onClick={() => setActiveTab('announcements')}>
            📢 Announcements
          </button>
          <div style={{ marginTop: 'auto', padding: '16px' }}>
            <button className="nav-item" onClick={() => window.location.href = "/logout"}>
              🚪 Logout
            </button>
          </div>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage Barangay Labangon services and resident requests</p>
        </header>

        <div className="mgmt-container">
          {loading && activeTab !== 'announcements' ? (
            <div className="loading-state">Loading data...</div>
          ) : (
            <>
              {activeTab === 'residents' && renderResidents()}
              {activeTab === 'certificates' && renderCertificates()}
              {activeTab === 'reports' && renderReports()}
              {activeTab === 'announcements' && <Announcements />}
            </>
          )}
        </div>
      </main>

      {selectedImage && (
        <div className="id-preview-modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <button className="btn-close-modal" onClick={() => setSelectedImage(null)}>✕</button>
            <img src={selectedImage} alt="Document Preview" className="preview-image" />
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="user-details-modal" onClick={() => setSelectedUser(null)}>
          <div className="user-modal-content" onClick={e => e.stopPropagation()}>
            <div className="user-modal-header">
              <h2>User Details</h2>
              <button className="btn-close-modal" onClick={() => setSelectedUser(null)}>✕</button>
            </div>
            <div className="user-details-grid">
              <div className="detail-section">
                <h3>Personal Information</h3>
                <div className="detail-row">
                  <span className="detail-label">Full Name:</span>
                  <span className="detail-value">{selectedUser.firstName} {selectedUser.lastName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">User ID:</span>
                  <span className="detail-value">#{selectedUser.id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedUser.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone Number:</span>
                  <span className="detail-value">{selectedUser.phoneNumber || 'Not provided'}</span>
                </div>
              </div>
              <div className="detail-section">
                <h3>Address Information</h3>
                <div className="detail-row">
                  <span className="detail-label">Street:</span>
                  <span className="detail-value">{selectedUser.street || 'Not provided'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Barangay:</span>
                  <span className="detail-value">{selectedUser.barangay || 'Not provided'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">City/Municipality:</span>
                  <span className="detail-value">{selectedUser.city || 'Not provided'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Zip Code:</span>
                  <span className="detail-value">{selectedUser.zipCode || 'Not provided'}</span>
                </div>
              </div>
              <div className="detail-section">
                <h3>Status</h3>
                <div className="detail-row">
                  <span className="detail-label">Verification Status:</span>
                  <span className={`status-badge ${selectedUser.residentConfirmed ? 'status-done' : 'status-pending'}`}>
                    {selectedUser.residentConfirmed ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Member Since:</span>
                  <span className="detail-value">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
