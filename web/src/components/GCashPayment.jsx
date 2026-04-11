import { useState, useEffect } from 'react'
import { paymentAPI } from '../lib/api'
import '../styles/GCashPayment.css'

export default function GCashPayment({ requestId, onPaymentComplete, onCancel }) {
  const [paymentState, setPaymentState] = useState('loading') // loading, qr, verification, success, error
  const [payment, setPayment] = useState(null)
  const [referenceNumber, setReferenceNumber] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    initializeGCashPayment()
  }, [])

  const initializeGCashPayment = async () => {
    try {
      setPaymentState('loading')
      const response = await paymentAPI.initiate(requestId, 500, 'GCASH')
      setPayment(response.data)
      setPaymentState('qr')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize GCash payment')
      setPaymentState('error')
    }
  }

  const handleReferenceSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!referenceNumber.trim()) {
        throw new Error('Please enter the reference number')
      }

      await paymentAPI.verify(payment.paymentId, referenceNumber)
      setPaymentState('success')
      setTimeout(() => {
        if (onPaymentComplete) {
          onPaymentComplete(payment.paymentId)
        }
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid reference number. Please try again.')
      setPaymentState('verification')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="gcash-payment-container">
      <div className="payment-card">
        {paymentState === 'loading' && (
          <div className="payment-state">
            <div className="loader"></div>
            <p>Loading GCash payment interface...</p>
          </div>
        )}

        {paymentState === 'error' && (
          <div className="payment-state">
            <div className="alert alert-error">{error}</div>
            <div className="payment-actions">
              <button className="btn btn-secondary" onClick={() => initializeGCashPayment()}>
                Try Again
              </button>
              <button className="btn btn-secondary" onClick={onCancel}>
                Back
              </button>
            </div>
          </div>
        )}

        {paymentState === 'qr' && payment && (
          <div className="payment-state">
            <h2>GCash Payment Instructions</h2>
            <div className="gcash-instructions">
              <div className="instruction-step">
                <h3>Step 1: Scan QR Code</h3>
                <p>Use your GCash app to scan the QR code below:</p>
                <div className="qr-code-placeholder">
                  {/* Placeholder for QR code - in real app, show actual QR */}
                  <div className="qr-placeholder">📱 QR Code Here</div>
                </div>
              </div>

              <div className="instruction-step">
                <h3>Step 2: Complete Payment</h3>
                <p>Complete the payment in your GCash app</p>
                <div className="payment-amount">
                  <span className="amount-label">Amount to Pay:</span>
                  <span className="amount-value">₱{payment.amount}</span>
                </div>
              </div>

              <div className="instruction-step">
                <h3>Step 3: Enter Reference Number</h3>
                <p>After successful payment, GCash will provide a reference number. Enter it below:</p>

                {error && (
                  <div className="alert alert-error" style={{ marginBottom: '15px' }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleReferenceSubmit}>
                  <input
                    type="text"
                    placeholder="Enter GCash Reference Number"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="reference-input"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Verifying...' : 'Verify Payment'}
                  </button>
                </form>
              </div>
            </div>

            <div className="payment-actions">
              <button className="btn btn-secondary" onClick={onCancel}>
                Cancel Payment
              </button>
            </div>
          </div>
        )}

        {paymentState === 'verification' && payment && (
          <div className="payment-state">
            <h2>Verify Payment</h2>
            <p>Enter the reference number you received from GCash:</p>

            {error && (
              <div className="alert alert-error">{error}</div>
            )}

            <form onSubmit={handleReferenceSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Enter GCash Reference Number"
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
                  {loading ? 'Verifying...' : 'Verify Payment'}
                </button>
              </div>
            </form>
          </div>
        )}

        {paymentState === 'success' && (
          <div className="payment-state success">
            <div className="success-icon">✓</div>
            <h2>Payment Successful!</h2>
            <p>Your reference number: {referenceNumber}</p>
            <p>Your certificate request has been marked as paid.</p>
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
