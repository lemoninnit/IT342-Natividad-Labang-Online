import { useState, useEffect } from 'react'
import { paymentAPI } from '../lib/api'
import '../styles/OTCPayment.css'

export default function OTCPayment({ requestId, onPaymentComplete, onCancel }) {
  const [paymentState, setPaymentState] = useState('loading') // loading, pending, verification, success, error
  const [payment, setPayment] = useState(null)
  const [referenceNumber, setReferenceNumber] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    initializeOTCPayment()
  }, [])

  const initializeOTCPayment = async () => {
    try {
      setPaymentState('loading')
      const response = await paymentAPI.initiate(requestId, 500, 'OVER_THE_COUNTER')
      setPayment(response.data)
      setPaymentState('pending')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize OTC payment')
      setPaymentState('error')
    }
  }

  const handleVerifyPayment = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!referenceNumber.trim()) {
        throw new Error('Please enter your reference number or transaction ID')
      }

      await paymentAPI.verify(payment.paymentId, referenceNumber)
      setPaymentState('success')
      setTimeout(() => {
        if (onPaymentComplete) {
          onPaymentComplete(payment.paymentId)
        }
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Payment verification failed. Please check your reference number.')
      setPaymentState('verification')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="otc-payment-container">
      <div className="payment-card">
        {paymentState === 'loading' && (
          <div className="payment-state">
            <div className="loader"></div>
            <p>Preparing pay-on-the-counter payment...</p>
          </div>
        )}

        {paymentState === 'error' && (
          <div className="payment-state">
            <div className="alert alert-error">{error}</div>
            <div className="payment-actions">
              <button className="btn btn-secondary" onClick={() => initializeOTCPayment()}>
                Try Again
              </button>
              <button className="btn btn-secondary" onClick={onCancel}>
                Back
              </button>
            </div>
          </div>
        )}

        {paymentState === 'pending' && payment && (
          <div className="payment-state">
            <h2>Pay-on-the-Counter Payment</h2>

            <div className="otc-instructions">
              <div className="instruction-section">
                <h3>Payment Instructions</h3>
                <div className="instruction-box">
                  <p>Please visit the Barangay Office to complete your payment at your convenience.</p>

                  <div className="payment-details">
                    <div className="detail-row">
                      <span className="detail-label">Payment Reference:</span>
                      <span className="detail-value">{payment.referenceNumber}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Amount to Pay:</span>
                      <span className="detail-value">₱{payment.amount}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Service Type:</span>
                      <span className="detail-value">Certificate Request</span>
                    </div>
                  </div>

                  <div className="payment-steps">
                    <h4>Steps to Complete Payment:</h4>
                    <ol>
                      <li>Proceed to Barangay Labangon Office</li>
                      <li>Provide your reference number: <strong>{payment.referenceNumber}</strong></li>
                      <li>Pay the amount of <strong>₱{payment.amount}</strong> to the barangay staff</li>
                      <li>You will receive a payment receipt with confirmation details</li>
                      <li>Return to this page and enter your reference number for verification</li>
                    </ol>
                  </div>

                  <div className="note-box">
                    <p><strong>Note:</strong> Keep your reference number safe. You will need it to verify your payment.</p>
                  </div>
                </div>
              </div>

              <div className="verification-section">
                <h3>After Payment</h3>
                <p>Once you have completed the payment, enter your reference number below:</p>

                {error && (
                  <div className="alert alert-error">{error}</div>
                )}

                <form onSubmit={handleVerifyPayment}>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Enter Reference Number or Transaction ID"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      className="reference-input"
                      disabled={loading}
                    />
                  </div>
                  <div className="payment-actions">
                    <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Verifying...' : 'Confirm Payment'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {paymentState === 'verification' && (
          <div className="payment-state">
            <h2>Verify Payment</h2>

            {error && (
              <div className="alert alert-error">{error}</div>
            )}

            <form onSubmit={handleVerifyPayment}>
              <div className="form-group">
                <label>Reference Number or Transaction ID:</label>
                <input
                  type="text"
                  placeholder="Enter Reference Number or Transaction ID"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="reference-input"
                  disabled={loading}
                />
              </div>
              <div className="payment-actions">
                <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Confirm Payment'}
                </button>
              </div>
            </form>
          </div>
        )}

        {paymentState === 'success' && (
          <div className="payment-state success">
            <div className="success-icon">✓</div>
            <h2>Payment Confirmed!</h2>
            <p>Reference Number: {referenceNumber}</p>
            <p>Your payment has been verified and recorded.</p>
            <p className="success-message">Your certificate request is now in the processing queue.</p>
            <div className="payment-actions">
              <button className="btn btn-primary" onClick={onCancel}>
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
