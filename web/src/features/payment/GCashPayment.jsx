import { useState, useEffect } from 'react'
import { paymentAPI, certificateAPI } from '../../lib/api'
import './GCashPayment.css'

export default function GCashPayment({ requestId, price, priceVal, onPaymentComplete, onCancel }) {
  const [paymentState, setPaymentState] = useState('loading') // loading, qr, verification, success, error
  const [payment, setPayment] = useState(null)
  const [referenceNumber, setReferenceNumber] = useState('')
  const [proofImage, setProofImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    initializeGCashPayment()
  }, [])

  const initializeGCashPayment = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await paymentAPI.initiate(requestId, priceVal || 500, 'GCASH')
      setPayment(response.data)
      setPaymentState('qr')
    } catch (err) {
      setError('Failed to initialize GCash payment')
      setPaymentState('error')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size must be less than 5MB')
        return
      }
      setProofImage(file)
      setImagePreview(URL.createObjectURL(file))
      setError('')
    }
  }

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const handleVerifyPayment = async () => {
    // Validation for GCash reference number (usually 13 digits)
    const refRegex = /^[0-9]{13}$/
    if (!referenceNumber || !refRegex.test(referenceNumber)) {
      setError('Please enter a valid 13-digit GCash reference number.')
      return
    }

    if (!proofImage) {
      setError('Please upload an image of your GCash receipt.')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      // 1. Convert image to base64
      const base64Image = await toBase64(proofImage)
      
      // 2. Call verification API with reference number and base64 image
      await paymentAPI.verify(payment.paymentId, referenceNumber, base64Image)
      
      // If verification succeeds, it means the backend updated the status to PROCESSING
      setPaymentState('success')
    } catch (err) {
      console.error('GCash Payment Submission Error:', err)
      setError(err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to submit payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="gcash-payment-container">
      <div className="payment-card-redesign">
        {paymentState === 'loading' && (
          <div className="payment-state">
            <div className="loader"></div>
            <p>Initializing GCash Payment...</p>
          </div>
        )}

        {paymentState === 'qr' && (
          <div className="payment-layout-split">
            <div className="payment-left-qr">
              <div className="qr-wrapper">
                <img src="/src/assets/gcash_qr.jpg" alt="GCash QR Code" className="qr-image-branded" />
              </div>
              <p className="qr-instruction">Scan this QR using your GCash App</p>
            </div>

            <div className="payment-right-details">
              <h2 className="payment-title-themed">Verify Payment</h2>
              <p className="payment-subtitle-themed">Enter the 13-digit reference number and upload receipt image</p>

              {error && <div className="alert-error-themed">{error}</div>}

              <div className="payment-info-box-themed">
                <div className="info-row-themed">
                  <span className="label-text-payment">Amount to Pay:</span>
                  <span className="amount-themed">{price || '₱500.00'}</span>
                </div>
              </div>

              <div className="input-group-themed">
                <label>Reference Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. 9012345678901" 
                  value={referenceNumber}
                  onChange={(e) => {
                    setReferenceNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 13))
                    setError('')
                  }}
                  className={error && !referenceNumber ? 'input-error' : ''}
                />
              </div>

              <div className="input-group-themed">
                <label>Receipt Image</label>
                <div className="file-upload-wrapper">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className={error && !proofImage ? 'input-error' : ''}
                    id="receipt-upload"
                  />
                  <label htmlFor="receipt-upload" className="file-upload-label">
                    {proofImage ? proofImage.name : 'Choose receipt image...'}
                  </label>
                </div>
                {imagePreview && (
                  <div className="image-preview-container">
                    <img src={imagePreview} alt="Receipt Preview" className="receipt-preview" />
                  </div>
                )}
              </div>

              <div className="payment-actions-themed">
                <button 
                  className="btn-cancel-themed"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  className="btn-verify-themed" 
                  onClick={handleVerifyPayment}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Payment'}
                </button>
              </div>
            </div>
          </div>
        )}

        {paymentState === 'success' && (
          <div className="payment-state success-state">
            <div className="success-icon-themed">✓</div>
            <h2>Payment Submitted</h2>
            <p>Your payment has been submitted for verification. Please wait for the admin to approve your request.</p>
            <button className="btn-done-themed" onClick={onPaymentComplete}>
              View Request Records
            </button>
          </div>
        )}

        {paymentState === 'error' && (
          <div className="payment-state error-state">
            <div className="error-icon-themed">✕</div>
            <h2>Something went wrong</h2>
            <p>{error || 'An error occurred during payment initialization.'}</p>
            <button className="btn-retry-themed" onClick={initializeGCashPayment}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
