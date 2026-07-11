import { useState } from 'react'
import { reportAPI } from '../../lib/api'
import Icon from '../../components/ui/Icons'
import './FileReportForm.css'

export default function FileReportForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    incidentType: 'Noise Complaint',
    incidentDate: '',
    incidentTime: '',
    location: '',
    description: '',
    personsInvolved: '',
    additionalNotes: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.incidentDate || !formData.incidentTime || !formData.location || !formData.description.trim()) {
      setError('Please fill in all required fields marked with *')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await reportAPI.create(formData)
      onSuccess(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const incidentTypes = [
    'Noise Complaint',
    'Theft',
    'Public Disturbance',
    'Vandalism',
    'Harassment',
    'Accident',
    'Suspicious Activity',
    'Other'
  ]

  return (
    <div className="file-report-container">

      <div className="report-notice">
        <Icon name="info" size={16} noBg={true} className="report-notice-icon" />
        <p>
          <strong>Note:</strong> Please provide as much detail as possible. False reports may be subject to legal action. Your report will be reviewed within 24–48 hours.
        </p>
      </div>

      <div className="report-form-card">

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="report-section-title">
            <Icon name="report" size={20} noBg={true} style={{ marginRight: '8px', display: 'inline-flex', verticalAlign: 'middle' }} />
            <span>Incident Details</span>
          </div>

          <div className="report-grid">
            <div className="report-form-group">
              <label>Incident Type *</label>
              <select
                name="incidentType"
                value={formData.incidentType}
                onChange={handleChange}
              >
                {incidentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="report-form-group">
              <label>Date of Incident *</label>
              <input
                type="date"
                name="incidentDate"
                value={formData.incidentDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="report-form-group">
              <label>Time of Incident *</label>
              <input
                type="time"
                name="incidentTime"
                value={formData.incidentTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="report-form-group">
              <label>Location / Place *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Purok 4, Near Labangon Market"
                required
              />
            </div>

            <div className="report-form-group full-width">
              <label>Description of Incident *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Please describe what happened in detail..."
                rows="5"
                required
              ></textarea>
            </div>

            <div className="report-form-group full-width">
              <label>Persons Involved (if known)</label>
              <input
                type="text"
                name="personsInvolved"
                value={formData.personsInvolved}
                onChange={handleChange}
                placeholder="Names or descriptions of persons involved"
              />
            </div>

            <div className="report-form-group full-width">
              <label>Additional Notes</label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                placeholder="Any other relevant information..."
                rows="3"
              ></textarea>
            </div>
          </div>

          <div className="report-form-actions">
            <button
              type="submit"
              className="btn-submit-report"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-content-loading">
                  <span className="btn-loading-spinner"></span>
                  Submitting...
                </span>
              ) : (
                'SUBMIT REPORT'
              )}
            </button>
            <button
              type="button"
              className="btn-cancel-report"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
