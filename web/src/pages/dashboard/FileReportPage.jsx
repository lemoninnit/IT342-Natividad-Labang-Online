import { useState, useEffect } from 'react'
import { reportAPI } from '../../lib/api'
import FileReportForm from '../../components/FileReportForm'
import ReportHistory from '../../components/ReportHistory'
import '../../styles/FileReportPage.css'

export default function FileReportPage() {
  const [currentView, setCurrentView] = useState('form') // 'form', 'history'
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [session, setSession] = useState(null)

  const loadReports = async () => {
    setLoading(true)
    try {
      const response = await reportAPI.getUserReports()
      setReports(response.data)
    } catch (err) {
      console.error('Failed to load reports:', err)
      setError('Failed to load your reports history.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const sessionData = sessionStorage.getItem("labangonline_session");
    if (sessionData) {
      setSession(JSON.parse(sessionData));
    }
    
    loadReports()
  }, []);

  const handleReportSubmitted = (newReport) => {
    const updatedReports = [newReport, ...reports]
    setReports(updatedReports)
    localStorage.setItem('user_reports', JSON.stringify(updatedReports))
    setCurrentView('history')
  }

  const handleCancel = () => {
    setCurrentView('history')
  }

  const renderHeader = () => (
    <div className="report-header-section">
      <div className="report-header-title">
        <h1>File a Report</h1>
        <p>Notify the Barangay about incidents or complaints in your area</p>
      </div>
      <button 
        className="btn-toggle-view"
        onClick={() => setCurrentView(currentView === 'history' ? 'form' : 'history')}
      >
        {currentView === 'history' ? '🚨 File a New Report' : '📂 View My Reports'}
      </button>
    </div>
  )

  if (!session) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="file-report-page">
      {renderHeader()}
      
      {error && <div className="alert alert-error">{error}</div>}
      
      {currentView === 'form' ? (
        <div className="report-content">
          <FileReportForm 
            onSuccess={handleReportSubmitted} 
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <div className="report-content">
          {loading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Loading your reports...</p>
            </div>
          ) : (
            <ReportHistory reports={reports} onRefresh={loadReports} />
          )}
        </div>
      )}
    </div>
  )
}
