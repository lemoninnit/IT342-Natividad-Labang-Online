import { useState, useEffect } from 'react'
import { certificateAPI } from '../../lib/api'
import './CertificateRequestForm.css'

export default function CertificateRequestForm({ onSuccess, onCancel, initialCert }) {
  const [formData, setFormData] = useState({
    certificateType: initialCert?.id || '',
    purpose: ''
  })

  useEffect(() => {
    if (initialCert) {
      setFormData(prev => ({ ...prev, certificateType: initialCert.id }));
    }
  }, [initialCert]);

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.certificateType || !formData.purpose.trim()) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await certificateAPI.create(formData)
      onSuccess(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="certificate-form-container">
      <div className="certificate-request-card">
        <h2>Request Certificate</h2>
        <p className="form-description">Select your desired certificate type and provide the purpose</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Certificate Type</label>
            <div className="read-only-type-display">
              {initialCert?.title || 'No type selected'}
            </div>
          </div>

          <div className="form-group">
            <label>Purpose of Request *</label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Please provide a clear reason for your request"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-content-loading">
                  <span className="btn-loading-spinner"></span>
                  Submitting...
                </span>
              ) : (
                'Submit Request'
              )}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="guidelines-section">
          <h3>Certificate Guidelines</h3>
          <ul>
            <li>Provide accurate information in your request</li>
            <li>Clearly state the purpose of the certificate</li>
            <li>Ensure all required attachments are uploaded</li>
            <li>Process time: 1-3 business days</li>
            <li>Fee: {initialCert?.price || 'Standard fee applies'}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
