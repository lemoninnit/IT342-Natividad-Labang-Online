import { useState } from 'react'
import '../styles/PaymentSelection.css'

export default function PaymentMethodSelection({ requestId, onMethodSelected, onCancel }) {
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [error, setError] = useState('')

  const paymentMethods = [
    {
      id: 'GCASH',
      name: 'GCash',
      description: 'Fast and secure payment via GCash mobile wallet',
      icon: '📱'
    },
    {
      id: 'OVER_THE_COUNTER',
      name: 'Pay-on-the-Counter',
      description: 'Pay at the barangay office at your convenience',
      icon: '🏪'
    }
  ]

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId)
    setError('')
  }

  const handleProceed = () => {
    if (!selectedMethod) {
      setError('Please select a payment method')
      return
    }
    onMethodSelected(selectedMethod)
  }

  return (
    <div className="payment-selection-container">
      <div className="selection-card">
        <h2>Select Payment Mode</h2>
        <p className="selection-description">Choose how you would like to pay for your certificate request</p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="payment-methods">
          {paymentMethods.map(method => (
            <div
              key={method.id}
              className={`payment-method ${selectedMethod === method.id ? 'selected' : ''}`}
              onClick={() => handleMethodSelect(method.id)}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={() => handleMethodSelect(method.id)}
              />
              <div className="method-content">
                <span className="method-icon">{method.icon}</span>
                <div className="method-info">
                  <h3>{method.name}</h3>
                  <p>{method.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="selection-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleProceed}
            disabled={!selectedMethod}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  )
}
