import { useState } from 'react'
import Icon from '../../components/ui/Icons'
import './PaymentSelection.css'

export default function PaymentMethodSelection({ requestId, onMethodSelected, onCancel, initialMethod }) {
  const [selectedMethod, setSelectedMethod] = useState(initialMethod || null)
  const [error, setError] = useState('')

  const paymentMethods = [
    {
      id: 'GCASH',
      name: 'GCash',
      description: 'Fast and secure payment via GCash mobile wallet',
      icon: 'gcash'
    },
    {
      id: 'OVER_THE_COUNTER',
      name: 'Pay-on-the-Counter',
      description: 'Pay at the barangay office at your convenience',
      icon: 'counter'
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
    <div className="selection-card">
      <h2>Select Payment Mode</h2>
      <p className="selection-description">Choose how you would like to pay for your certificate request</p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="payment-methods-grid">
        {paymentMethods.map(method => (
          <div
            key={method.id}
            className={`payment-method-card ${selectedMethod === method.id ? 'selected' : ''}`}
            onClick={() => handleMethodSelect(method.id)}
          >
            <div className="method-main-content">
              <div className="method-icon-box">
                <Icon name={method.icon} size={22} noBg={true} />
              </div>
              <div className="method-text">
                <h3>{method.name}</h3>
                <p>{method.description}</p>
              </div>
            </div>

            <div className="method-selection-indicator">
              <div className={`radio-circle ${selectedMethod === method.id ? 'checked' : ''}`}></div>
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
  )
}
