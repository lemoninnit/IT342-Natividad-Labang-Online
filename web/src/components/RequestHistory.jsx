import { useState, useEffect } from 'react'
import { certificateAPI } from '../lib/api'
import '../styles/RequestHistory.css'

export default function RequestHistory({ refreshTrigger, onSelectRequest }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    loadRequests()
  }, [refreshTrigger])

  const loadRequests = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await certificateAPI.getUserRequests()
      setRequests(response.data)
    } catch (err) {
      setError('Failed to load certificate requests')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'PENDING': { class: 'badge-pending', text: 'Pending' },
      'APPROVED': { class: 'badge-approved', text: 'Approved' },
      'REJECTED': { class: 'badge-rejected', text: 'Rejected' },
      'PAID': { class: 'badge-paid', text: 'Paid' },
      'COMPLETED': { class: 'badge-completed', text: 'Completed' },
      'FAILED_PAYMENT_VERIFICATION': { class: 'badge-failed', text: 'Payment Failed' }
    }
    const info = statusMap[status] || { class: 'badge-pending', text: status }
    return <span className={`status-badge ${info.class}`}>{info.text}</span>
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCertificateTypeLabel = (type) => {
    const labels = {
      'BARANGAY_CLEARANCE': 'Barangay Clearance',
      'RESIDENCY_CERTIFICATE': 'Residency Certificate',
      'INDIGENCY_CERTIFICATE': 'Indigency Certificate',
      'BUSINESS_PERMIT': 'Business Permit',
      'GOOD_MORAL_CHARACTER': 'Good Moral Character'
    }
    return labels[type] || type
  }

  return (
    <div className="request-history-container">
      <div className="history-header">
        <h2>Certificate Request Records</h2>
        <button className="btn btn-secondary btn-sm" onClick={loadRequests}>
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <div className="loader"></div>
          <p>Loading your requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <p>You have not submitted any certificate requests yet.</p>
          <p>Submit your first request to get started!</p>
        </div>
      ) : (
        <div className="requests-list">
          {requests.map(request => (
            <div key={request.id} className="request-item">
              <div className="request-header" onClick={() => setExpandedId(expandedId === request.id ? null : request.id)}>
                <div className="request-title">
                  <h3>{getCertificateTypeLabel(request.certificateType)}</h3>
                  {getStatusBadge(request.status)}
                </div>
                <div className="request-date">
                  {formatDate(request.createdAt)}
                </div>
                <span className={`expand-icon ${expandedId === request.id ? 'expanded' : ''}`}>▼</span>
              </div>

              {expandedId === request.id && (
                <div className="request-details">
                  <div className="detail-section">
                    <h4>Request Details</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Request ID:</span>
                        <span className="detail-value">{request.id}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Status:</span>
                        <span className="detail-value">{getStatusBadge(request.status)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Submitted:</span>
                        <span className="detail-value">{formatDate(request.createdAt)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Last Updated:</span>
                        <span className="detail-value">{formatDate(request.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Purpose</h4>
                    <p className="purpose-text">{request.purpose}</p>
                  </div>

                  {request.payment && (
                    <div className="detail-section payment-info">
                      <h4>Payment Information</h4>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <span className="detail-label">Method:</span>
                          <span className="detail-value">
                            {request.payment.paymentMethod === 'GCASH' ? 'GCash' : 'Pay-on-the-Counter'}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Amount:</span>
                          <span className="detail-value">₱{request.payment.amount}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Reference:</span>
                          <span className="detail-value">{request.payment.referenceNumber}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Payment Status:</span>
                          <span className="detail-value">{getStatusBadge(request.payment.status)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="request-actions">
                    {(request.status === 'PENDING' || request.status === 'FAILED_PAYMENT_VERIFICATION') && !request.payment && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onSelectRequest(request.id)}
                      >
                        Proceed to Payment
                      </button>
                    )}
                    {request.status === 'PENDING' && request.payment && request.payment.status === 'PENDING' && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onSelectRequest(request.id)}
                      >
                        Complete Payment
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="history-summary">
        <div className="summary-item">
          <span className="summary-label">Total Requests:</span>
          <span className="summary-value">{requests.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Pending:</span>
          <span className="summary-value">{requests.filter(r => r.status === 'PENDING').length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Completed:</span>
          <span className="summary-value">{requests.filter(r => r.status === 'COMPLETED').length}</span>
        </div>
      </div>
    </div>
  )
}
