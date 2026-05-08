import { useState, useEffect } from 'react'
import { adminAPI } from '../../lib/api'
import AdminLayout from './AdminLayout'
import './AdminDashboard.css'

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true)
      try {
        const res = await adminAPI.getAllCertificates()
        setCertificates(res.data)
      } catch (error) {
        console.error('Failed to fetch certificates:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCertificates()
  }, [])

  const handleUpdateCertStatus = async (id, status) => {
    try {
      await adminAPI.updateCertificateStatus(id, status)
      const res = await adminAPI.getAllCertificates()
      setCertificates(res.data)
    } catch (error) {
      console.error('Failed to update certificate status:', error)
      alert('Failed to update status')
    }
  }

  const getImageUrl = (data) => {
    if (!data) return null
    if (typeof data === 'string') {
      const base64 = data.startsWith('data:') ? data.split(',')[1] : data
      return `data:image/jpeg;base64,${base64}`
    }
    return `data:image/jpeg;base64,${data}`
  }

  const filteredCerts = statusFilter === 'ALL'
    ? certificates
    : certificates.filter(cert => cert.status === statusFilter)

  return (
    <AdminLayout activeSection="certificates" title="Certificate Requests" subtitle="Review and manage all resident certificate requests.">
      <div className="mgmt-container">
        <div className="data-card">
          <div className="card-header">
            <h2 className="card-title">Certificate Requests</h2>
            <div className="card-actions">
              <span className="count-badge">{filteredCerts.length} Requests</span>
            </div>
          </div>

          <div className="filter-bar">
            <div className="filter-label">Filter by Status:</div>
            <div className="filter-buttons">
              {['ALL', 'PENDING', 'UNPAID', 'PAID', 'DONE', 'REJECTED'].map(status => (
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
                      <td>
                        <span className={`status-badge status-${cert.status?.toLowerCase()}`}>
                          {cert.status}
                        </span>
                      </td>
                      <td className="action-buttons">
                        <div className="action-group">
                          <button
                            className="btn-action btn-info"
                            onClick={() => setSelectedRequest(cert)}
                          >
                            View
                          </button>
                          <select
                            className="status-select"
                            value={cert.status}
                            onChange={(e) => handleUpdateCertStatus(cert.id, e.target.value)}
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
                    <td colSpan="5" className="empty-state">
                      No certificate requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedImage && (
        <div className="id-preview-modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <button className="btn-close-modal" onClick={() => setSelectedImage(null)}>✕</button>
            <img src={selectedImage} alt="Proof Preview" className="preview-image" />
          </div>
        </div>
      )}

      {selectedRequest && (
        <div className="request-details-modal" onClick={() => setSelectedRequest(null)}>
          <div className="request-modal-content" onClick={e => e.stopPropagation()}>
            <div className="request-modal-header">
              <h2>Certificate Request Details</h2>
              <button className="btn-close-modal" onClick={() => setSelectedRequest(null)}>✕</button>
            </div>
            <div className="request-detail-grid">
              <div className="request-detail-section">
                <h3>Resident</h3>
                <div className="request-detail-row">
                  <span className="request-label">Name</span>
                  <span className="request-value">{selectedRequest.user?.firstName} {selectedRequest.user?.lastName}</span>
                </div>
                <div className="request-detail-row">
                  <span className="request-label">User ID</span>
                  <span className="request-value">#{selectedRequest.user?.id}</span>
                </div>
                <div className="request-detail-row">
                  <span className="request-label">Email</span>
                  <span className="request-value">{selectedRequest.user?.email || 'N/A'}</span>
                </div>
                <div className="request-detail-row">
                  <span className="request-label">Phone</span>
                  <span className="request-value">{selectedRequest.user?.phoneNumber || 'N/A'}</span>
                </div>
              </div>

              <div className="request-detail-section">
                <h3>Request</h3>
                <div className="request-detail-row">
                  <span className="request-label">Certificate Type</span>
                  <span className="request-value">{selectedRequest.certificateType?.replace(/_/g, ' ')}</span>
                </div>
                <div className="request-detail-row">
                  <span className="request-label">Status</span>
                  <span className={`status-badge ${selectedRequest.status?.toLowerCase() === 'pending' ? 'status-pending' : selectedRequest.status?.toLowerCase() === 'rejected' ? 'status-rejected' : selectedRequest.status?.toLowerCase() === 'failed' ? 'status-failed' : 'status-done'}`}>
                    {selectedRequest.status}
                  </span>
                </div>
                <div className="request-detail-row">
                  <span className="request-label">Submitted</span>
                  <span className="request-value">{new Date(selectedRequest.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="request-detail-row full-width">
                  <span className="request-label">Purpose</span>
                  <span className="request-purpose-box">{selectedRequest.purpose || 'No purpose provided'}</span>
                </div>
              </div>

              <div className="request-detail-section full-width">
                <h3>Payment Details</h3>
                <div className="request-detail-row">
                  <span className="request-label">Payment Method</span>
                  <span className="request-value">{selectedRequest.payment?.paymentMethod?.replace(/_/g, ' ') || 'N/A'}</span>
                </div>
                <div className="request-detail-row">
                  <span className="request-label">Reference Number</span>
                  <span className="request-value">{selectedRequest.payment?.referenceNumber || 'N/A'}</span>
                </div>
                <div className="request-detail-row">
                  <span className="request-label">Payment Status</span>
                  <span className="request-value">{selectedRequest.payment?.status || 'N/A'}</span>
                </div>
                <div className="request-detail-row">
                  <span className="request-label">Proof Image</span>
                  {selectedRequest.payment?.proofImage ? (
                    <button
                      className="btn-action btn-view"
                      onClick={() => setSelectedImage(getImageUrl(selectedRequest.payment.proofImage))}
                    >
                      View Proof Image
                    </button>
                  ) : (
                    <span className="request-value">No proof uploaded</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
