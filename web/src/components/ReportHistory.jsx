import { useState } from 'react'
import '../styles/ReportHistory.css'

export default function ReportHistory({ reports = [], onRefresh }) {
  const [expandedId, setExpandedId] = useState(null)

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'PENDING': 'status-pending',
      'REVIEWED': 'status-reviewed',
      'REJECTED': 'status-rejected'
    }
    const className = statusMap[status] || 'status-pending'
    return <span className={`report-status-badge ${className}`}>{status}</span>
  }

  const formatDateTime = (date, time) => {
    if (!date) return 'N/A'
    const d = new Date(date)
    return `${d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} at ${time || 'N/A'}`
  }

  return (
    <div className="report-history-container">
      <div className="report-history-header">
        <h2 className="report-history-title">MY FILED REPORTS</h2>
        <button className="btn-refresh-reports" onClick={onRefresh || (() => window.location.reload())}>
          Refresh
        </button>
      </div>

      <div className="reports-list">
        {reports.length === 0 ? (
          <div className="empty-reports">
            <p>You have not filed any reports yet.</p>
            <p style={{ fontSize: '13px' }}>If you witness or experience an incident, please file a report to notify the barangay.</p>
          </div>
        ) : (
          reports.map(report => (
            <div key={report.id} className="report-item">
              <div className="report-item-header" onClick={() => toggleExpand(report.id)}>
                <div className="report-item-info">
                  <h3>{report.incidentType}</h3>
                  {getStatusBadge(report.status || 'PENDING')}
                </div>
                <div className="report-item-date">
                  {new Date(report.id).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <span className={`expand-icon ${expandedId === report.id ? 'expanded' : ''}`}>▼</span>
              </div>

              {expandedId === report.id && (
                <div className="report-item-details">
                  <div className="report-detail-section">
                    <label>Incident Details</label>
                    <div className="report-detail-grid">
                      <div className="report-detail-item">
                        <span className="report-detail-label">Incident Date & Time:</span>
                        <span className="report-detail-value">{formatDateTime(report.incidentDate, report.incidentTime)}</span>
                      </div>
                      <div className="report-detail-item">
                        <span className="report-detail-label">Location:</span>
                        <span className="report-detail-value">{report.location}</span>
                      </div>
                      <div className="report-detail-item">
                        <span className="report-detail-label">Persons Involved:</span>
                        <span className="report-detail-value">{report.personsInvolved || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="report-detail-section">
                    <label>Description of Incident</label>
                    <div className="report-detail-text">
                      {report.description}
                    </div>
                  </div>

                  {report.additionalNotes && (
                    <div className="report-detail-section">
                      <label>Additional Notes</label>
                      <div className="report-detail-text">
                        {report.additionalNotes}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="report-summary-cards">
        <div className="summary-card">
          <span className="summary-label">TOTAL REPORTS:</span>
          <span className="summary-value">{reports.length}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">PENDING:</span>
          <span className="summary-value">{reports.filter(r => (r.status || 'PENDING') === 'PENDING').length}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">REVIEWED:</span>
          <span className="summary-value">{reports.filter(r => r.status === 'REVIEWED').length}</span>
        </div>
      </div>
    </div>
  )
}
