import { useState, useEffect } from 'react'
import { paymentAPI, certificateAPI } from '../../lib/api'
import Icon from '../../components/ui/Icons'
import './OTCPayment.css'

export default function OTCPayment({ requestId, price, priceVal, onPaymentComplete, onCancel }) {
  const [paymentState, setPaymentState] = useState('pending') // loading, pending, verification, success, error
  const [payment, setPayment] = useState(null)
  const [referenceNumber, setReferenceNumber] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Payment initialization is now deferred until submission
  // to avoid creating orphaned payment records if the user cancels.

  const handleVerifyPayment = async (e) => {
    if (e) e.preventDefault()
    setError('')

    // Validate 13-digit reference number
    const refRegex = /^[0-9]{13}$/
    if (!referenceNumber || !refRegex.test(referenceNumber)) {
      setError('Please enter a valid 13-digit reference number from your receipt.')
      return
    }

    setLoading(true)

    try {
      // 1. Initiate payment FIRST to create the record only when user submits
      const initResponse = await paymentAPI.initiate(requestId, priceVal || 500, 'OVER_THE_COUNTER')
      const paymentData = initResponse.data
      setPayment(paymentData)

      // 2. Call verification API with the 13-digit reference number provided
      await paymentAPI.verify(paymentData.paymentId, referenceNumber)

      // Verification succeeded, backend updated status to PROCESSING
      setPaymentState('success')
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Payment submission failed. Please check your reference number.')
    } finally {
      setLoading(false)
    }
  }

  const handlePrintReceipt = () => {
    const printWindow = window.open('', '_blank');
    const content = `
      <html>
        <head>
          <title>Payment Receipt - ServiLine</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .receipt-card { border: 2px solid #333; padding: 30px; max-width: 600px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #00a86b; }
            .title { font-size: 18px; margin-top: 10px; text-transform: uppercase; letter-spacing: 1px; }
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 16px; }
            .label { font-weight: bold; }
            .footer { margin-top: 30px; text-align: center; font-size: 14px; color: #666; border-top: 1px dashed #ccc; padding-top: 20px; }
            .qr-placeholder { margin: 20px 0; text-align: center; border: 1px solid #ddd; padding: 20px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="receipt-card">
            <div class="header">
              <div class="logo">LABANGONLINE</div>
              <div class="title">Official Payment Request Receipt</div>
            </div>
            
            <div class="detail-row">
              <span class="label">Reference Number:</span>
              <span>${payment?.referenceNumber || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="label">Amount to Pay:</span>
              <span>${price || '₱30.00'}</span>
            </div>
            <div class="detail-row">
              <span class="label">Service Type:</span>
              <span>Certificate Request</span>
            </div>
            <div class="detail-row">
              <span class="label">Date Generated:</span>
              <span>${new Date().toLocaleString()}</span>
            </div>

            <div class="footer">
              <p>Please present this receipt at the Barangay Office to complete your payment.</p>
              <p>Thank you for using ServiLine!</p>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); window.onafterprint = function() { window.close(); }; }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
  }

  return (
    <div className="otc-payment-container">
      <div className="payment-card-redesign">
        {paymentState === 'pending' && (
          <div className="payment-layout-split-otc">
            <div className="payment-left-instructions">
              <h2 className="payment-title-themed">Payment Instructions</h2>
              <div className="instruction-box-themed">
                <p className="instruction-main-text">Please visit the Barangay Office to complete your payment at your convenience.</p>

                <div className="payment-details-themed">
                  <div className="detail-row-themed">
                    <span className="detail-label-themed">Payment Reference:</span>
                    <span className="detail-value-themed">{payment?.referenceNumber || 'N/A (Generate upon submit)'}</span>
                  </div>
                  <div className="detail-row-themed">
                    <span className="detail-label-themed">Amount to Pay:</span>
                    <span className="detail-value-themed">{price || '₱500.00'}</span>
                  </div>
                  <div className="detail-row-themed">
                    <span className="detail-label-themed">Service Type:</span>
                    <span className="detail-value-themed">Certificate Request</span>
                  </div>
                </div>

                <div className="payment-actions-otc">
                  <button
                    className="btn-print-receipt"
                    onClick={handlePrintReceipt}
                    disabled={!payment}
                  >
                    {payment ? 'Print Receipt' : 'Complete submission to enable print'}
                  </button>
                </div>

                <div className="payment-steps-themed">
                  <h4>Steps to Complete Payment:</h4>
                  <ul>
                    <li>Proceed to Barangay Office</li>
                    <li>Provide your reference number</li>
                    <li>Pay the amount of <strong>{price || '₱500.00'}</strong> to the staff</li>
                    <li>Receive your payment receipt</li>
                    <li>Enter the transaction ID below to verify</li>
                  </ul>
                </div>

                <div className="note-box-themed">
                  <Icon name="info" size={16} noBg={true} className="note-icon" />
                  <p>Keep your reference number safe. You will need it to verify your payment.</p>
                </div>
              </div>
            </div>

            <div className="payment-right-verify">
              <h2 className="payment-title-themed">After Payment</h2>
              <p className="payment-subtitle-themed">Once you have completed the payment, enter your reference number below:</p>

              {error && <div className="alert-error-themed">{error}</div>}

              <div className="input-group-themed">
                <label>Reference Number / Transaction ID</label>
                <input
                  type="text"
                  placeholder="Enter Transaction ID from receipt"
                  value={referenceNumber}
                  onChange={(e) => {
                    setReferenceNumber(e.target.value)
                    setError('')
                  }}
                  className={error ? 'input-error' : ''}
                  disabled={loading}
                />
              </div>

              <div className="payment-actions-themed">
                <button className="btn btn-secondary btn-cancel-themed" onClick={onCancel} disabled={loading}>Back</button>
                <button 
                  className="btn btn-primary btn-verify-otc" 
                  onClick={handleVerifyPayment}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="btn-content-loading">
                      <span className="btn-loading-spinner"></span>
                      Verifying...
                    </span>
                  ) : 'Submit Payment'}
                </button>
              </div>
            </div>
          </div>
        )}

        {paymentState === 'success' && (
          <div className="payment-state success-state">
            <div className="success-icon-themed" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '50%', padding: '16px', color: '#10b981', marginBottom: '20px' }}>
              <Icon name="success" size={32} noBg={true} />
            </div>
            <h2>Payment Submitted</h2>
            <p>Your payment information has been submitted for verification. Please wait for the admin to approve your request after you have paid at the counter.</p>
            <button className="btn-done-themed" onClick={onPaymentComplete}>
              View Request Records
            </button>
          </div>
        )}

        {paymentState === 'error' && (
          <div className="payment-state error-state-themed">
            <div className="error-icon-themed" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '50%', padding: '16px', color: '#ef4444', marginBottom: '20px' }}>
              <Icon name="error" size={32} noBg={true} />
            </div>
            <h2>Payment Error</h2>
            <p>{error || 'Something went wrong while processing your payment.'}</p>
            <button className="btn-retry-otc" onClick={() => setPaymentState('pending')}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
