import { useState, useEffect } from 'react'
import { adminAPI } from '../../lib/api'
import AdminLayout from './AdminLayout'
import './AdminDashboard.css'

export default function AdminReports() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState(null)

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true)
      try {
        const res = await adminAPI.getAllComplaints()
        setComplaints(res.data)
      } catch (error) {
        console.error('Failed to fetch reports:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchComplaints()
  }, [])

  const handleUpdateComplaintStatus = async (id, status) => {
    try {
      await adminAPI.updateComplaintStatus(id, status)
      const res = await adminAPI.getAllComplaints()
      setComplaints(res.data)
    } catch (error) {
      console.error('Failed to update complaint status:', error)
      alert('Failed to update status')
    }
  }

  return (
    <AdminLayout activeSection="reports" title="Incident Reports" subtitle="Review report details and manage resident incident cases.">
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
                  <th>Resident</th>
                  <th>Contact Info</th>
                  <th>Incident</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.length > 0 ? complaints.map(report => (
                  <tr key={report.id}>
                    <td>
                      <div className="user-info">
                        <span className="user-name">{report.user?.firstName} {report.user?.lastName}</span>
                        <span className="user-id">ID: #{report.user?.id}</span>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <span className="info-email">{report.user?.email || 'N/A'}</span>
                        <span className="info-phone">{report.user?.phoneNumber || 'N/A'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="cert-type-info">
                        <span className="cert-type">{report.incidentType}</span>
                        <span className="cert-date">{new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge status-${report.status.toLowerCase()}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="action-buttons">
                      <div className="action-group">
                        <button className="btn-action btn-view" onClick={() => setSelectedReport(report)}>
                          View Details
                        </button>
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
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="empty-state">No incident reports available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedReport && (
        <div className="request-details-modal" onClick={() => setSelectedReport(null)}>
          <div className="request-modal-content" onClick={e => e.stopPropagation()}>
            <div className="request-modal-header">
              <h2>Report Details</h2>
              <button className="btn-close-modal" onClick={() => setSelectedReport(null)}>✕</button>
            </div>
            <div className="request-detail-grid">
              <div className="request-detail-section">
                <h3>Reporter</h3>
                <div className="request-detail-row">
                  <span className="request-label">Name</span>
                  <span className="request-value">{selectedReport.user?.firstName} {selectedReport.user?.lastName}</span>
                </div>
                <div className="request-detail-row">
                  <span className="request-label">Email</span>
                  <span className="request-value">{selectedReport.user?.email || 'N/A'}</span>
                </div>
                <div className="request-detail-row">
                  <span className="request-label">Phone</span>
                  <span className="request-value">{selectedReport.user?.phoneNumber || 'N/A'}</span>
                </div>
              </div>

              <div className="request-detail-section">
                <h3>Incident</h3>
                <div className="request-detail-row">
                  <span className="request-label">Type</span>
                  <span className="request-value">{selectedReport.incidentType}</span>
                </div>
                <div className="request-detail-row">
                  <span className="request-label">Date</span>
                  <span className="request-value">{selectedReport.incidentDate}</span>
                </div>
                <div className="request-detail-row">
                  <span className="request-label">Time</span>
                  <span className="request-value">{selectedReport.incidentTime}</span>
                </div>
                <div className="request-detail-row full-width">
                  <span className="request-label">Location</span>
                  <span className="request-purpose-box">{selectedReport.location}</span>
                </div>
              </div>

              <div className="request-detail-section full-width">
                <h3>Details</h3>
                <div className="request-detail-row full-width">
                  <span className="request-label">Description</span>
                  <span className="request-purpose-box">{selectedReport.description}</span>
                </div>
                <div className="request-detail-row full-width">
                  <span className="request-label">Persons Involved</span>
                  <span className="request-purpose-box">{selectedReport.personsInvolved || 'Not specified'}</span>
                </div>
                <div className="request-detail-row full-width">
                  <span className="request-label">Additional Notes</span>
                  <span className="request-purpose-box">{selectedReport.additionalNotes || 'None'}</span>
                </div>
              </div>

              <div className="request-detail-section full-width">
                <h3>Administrative</h3>
                <div className="request-detail-row">
                  <span className="request-label">Status</span>
                  <span className={`status-badge status-${selectedReport.status?.toLowerCase()}`}>
                    {selectedReport.status}
                  </span>
                </div>
                <div className="request-detail-row">
                  <span className="request-label">Submitted</span>
                  <span className="request-value">{new Date(selectedReport.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
