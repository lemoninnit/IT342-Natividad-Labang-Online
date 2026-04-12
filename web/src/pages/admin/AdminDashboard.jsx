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

  const renderCertificates = () => (
    <div className="mgmt-container">
      <div className="data-card">
        <div className="card-header">
          <h2 className="card-title">Certificate Requests</h2>
          <div className="card-actions">
            <span className="count-badge">{certificates.length} Total Requests</span>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Resident</th>
                <th>Request Details</th>
                <th>Purpose</th>
                <th>Payment Info</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map(cert => (
                <tr key={cert.id}>
                  <td>
                    <div className="user-info">
                      <span className="user-name">{cert.user?.firstName} {cert.user?.lastName}</span>
                      <span className="user-id">User ID: {cert.user?.id}</span>
                    </div>
                  </td>
                  <td>
                    <div className="cert-type-info">
                      <span className="cert-type">{cert.certificateType.replace(/_/g, ' ')}</span>
                      <span className="cert-date">{new Date(cert.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="purpose-cell">
                    <div className="purpose-text" title={cert.purpose}>{cert.purpose}</div>
                  </td>
                  <td>
                    {cert.payment ? (
                      <div className="payment-info-stack">
                        <div className="method-pill">
                          {cert.payment.paymentMethod?.replace(/_/g, ' ')}
                        </div>
                        {cert.payment.paymentMethod === 'GCASH' && cert.payment.proofImage && (
                          <button 
                            className="btn-text-link"
                            onClick={() => setSelectedImage(getImageUrl(cert.payment.proofImage))}
                          >
                            View Receipt
                          </button>
                        )}
                        <span className="ref-text">Ref: {cert.payment.referenceNumber || 'N/A'}</span>
                      </div>
                    ) : (
                      <span className="no-data">Unpaid</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge status-${cert.status.toLowerCase()}`}>
                      {cert.status}
                    </span>
                  </td>
                  <td className="action-buttons">
                    {cert.status === 'PAID' && (
                      <button className="btn-action btn-verify" onClick={() => handleUpdateCertStatus(cert.id, 'DONE')}>
                        Complete Request
                      </button>
                    )}
                    {cert.status === 'PENDING' && cert.payment && cert.payment.status === 'PROCESSING' && (
                      <div className="approval-group">
                        <button 
                          className="btn-action btn-verify" 
                          onClick={() => handleApprovePayment(cert.payment.id)}
                        >
                          Approve
                        </button>
                        <button 
                          className="btn-action btn-reject" 
                          onClick={() => handleRejectPayment(cert.payment.id)}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {cert.status === 'PENDING' && (!cert.payment || cert.payment.status !== 'PROCESSING') && (
                      <button className="btn-action btn-reject" onClick={() => handleUpdateCertStatus(cert.id, 'REJECTED')}>
                        Cancel Request
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
          <button className="close-id-modal">✕</button>
          <div className="id-modal-content" onClick={e => e.stopPropagation()}>
            <img src={selectedImage} alt="Resident ID Full" />
          </div>
        </div>
      )}
    </div>
  )
}
