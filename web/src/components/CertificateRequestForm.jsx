import { useState } from 'react'
import { certificateAPI } from '../lib/api'
import '../styles/CertificateRequestForm.css'

export default function CertificateRequestForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    certificateType: '',
    purpose: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const certificateTypes = [
    { value: 'BARANGAY_CLEARANCE', label: 'Barangay Clearance' },
    { value: 'RESIDENCY_CERTIFICATE', label: 'Residency Certificate' },
    { value: 'INDIGENCY_CERTIFICATE', label: 'Indigency Certificate' },
    { value: 'BUSINESS_PERMIT', label: 'Business Permit' },
    { value: 'GOOD_MORAL_CHARACTER', label: 'Good Moral Character' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.certificateType) {
        throw new Error('Please select a certificate type')
      }
      if (!formData.purpose || formData.purpose.trim() === '') {
        throw new Error('Please enter the purpose of the certificate')
      }

      const response = await certificateAPI.submit(formData)
      setSuccess('Certificate request submitted successfully!')
      setFormData({ certificateType: '', purpose: '' })
      
      // Call parent callback with new request
      if (onSuccess) {
        onSuccess(response.data)
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit certificate request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="certificate-form-container">
      <div className="form-card">
        <h2>Request Certificate</h2>
        <p className="form-description">Select your desired certificate type and provide the purpose</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="certificateType">Certificate Type *</label>
            <select
              id="certificateType"
              name="certificateType"
              value={formData.certificateType}
              onChange={handleChange}
              required
              className={error && !formData.certificateType ? 'input-error' : ''}
            >
              <option value="">-- Select Certificate Type --</option>
              {certificateTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {error && !formData.certificateType && (
              <span className="input-error-msg">Certificate type is required</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="purpose">Purpose *</label>
            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Enter the purpose of requesting this certificate"
              required
              rows="5"
              className={error && !formData.purpose ? 'input-error' : ''}
            />
            {error && !formData.purpose && (
              <span className="input-error-msg">Purpose is required</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>

        <div className="guidelines-section">
          <h3>Certificate Guidelines</h3>
          <ul>
            <li>Provide accurate information in your request</li>
            <li>Clearly state the purpose of the certificate</li>
            <li>Ensure all required attachments are uploaded</li>
            <li>Process time: 1-3 business days</li>
            <li>Standard fee: ₱500</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
