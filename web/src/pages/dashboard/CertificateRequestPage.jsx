import { useState, useEffect } from 'react'
import CertificateRequestForm from '../../components/CertificateRequestForm'
import PaymentMethodSelection from '../../components/PaymentMethodSelection'
import GCashPayment from '../../components/GCashPayment'
import OTCPayment from '../../components/OTCPayment'
import RequestHistory from '../../components/RequestHistory'
import '../../styles/CertificateRequestPage.css'

export default function CertificateRequestPage() {
  const [currentStep, setCurrentStep] = useState('view') // view, request-form, payment-method, gcash-payment, otc-payment
  const [selectedRequestId, setSelectedRequestId] = useState(null)
  const [historyRefresh, setHistoryRefresh] = useState(0)
  const [session, setSession] = useState(null)

  useEffect(() => {
    const sessionData = sessionStorage.getItem("labangonline_session");
    if (sessionData) {
      setSession(JSON.parse(sessionData));
    }
  }, []);

  const handleRequestSubmitted = (newRequest) => {
    setSelectedRequestId(newRequest.id)
    setCurrentStep('view')
    setHistoryRefresh(prev => prev + 1)
  }

  const handleSelectPaymentMethod = (requestId) => {
    setSelectedRequestId(requestId)
    setCurrentStep('payment-method')
  }

  const handleMethodSelected = (method) => {
    if (method === 'GCASH') {
      setCurrentStep('gcash-payment')
    } else if (method === 'OVER_THE_COUNTER') {
      setCurrentStep('otc-payment')
    }
  }

  const handlePaymentComplete = () => {
    setCurrentStep('view')
    setSelectedRequestId(null)
    setHistoryRefresh(prev => prev + 1)
  }

  const handleCancel = () => {
    setCurrentStep('view')
    setSelectedRequestId(null)
  }

  // Header section with profile and button
  const renderHeader = () => (
    <div className="document-header">
      <div className="header-profile">
        <div className="profile-avatar">{session?.firstName?.[0]}{session?.lastName?.[0]}</div>
        <div className="profile-details">
          <h1>{session?.firstName} {session?.lastName}</h1>
          <span className="resident-badge">RESIDENT</span>
        </div>
      </div>
      <button 
        className="btn-new-request"
        onClick={() => setCurrentStep('request-form')}
      >
        NEW REQUEST
      </button>
    </div>
  )

  if (!session) {
    return <div className="loading">Loading...</div>
  }

  if (currentStep === 'request-form') {
    return (
      <div className="document-request-page">
        {renderHeader()}
        <div className="modal-overlay-full">
          <div className="modal-full">
            <button className="close-btn" onClick={() => setCurrentStep('view')}>✕</button>
            <CertificateRequestForm onSuccess={handleRequestSubmitted} />
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 'payment-method' && selectedRequestId) {
    return (
      <div className="document-request-page">
        {renderHeader()}
        <div className="modal-overlay-full">
          <PaymentMethodSelection
            requestId={selectedRequestId}
            onMethodSelected={handleMethodSelected}
            onCancel={handleCancel}
          />
        </div>
      </div>
    )
  }

  if (currentStep === 'gcash-payment' && selectedRequestId) {
    return (
      <div className="document-request-page">
        {renderHeader()}
        <div className="modal-overlay-full">
          <GCashPayment
            requestId={selectedRequestId}
            onPaymentComplete={handlePaymentComplete}
            onCancel={handleCancel}
          />
        </div>
      </div>
    )
  }

  if (currentStep === 'otc-payment' && selectedRequestId) {
    return (
      <div className="document-request-page">
        {renderHeader()}
        <div className="modal-overlay-full">
          <OTCPayment
            requestId={selectedRequestId}
            onPaymentComplete={handlePaymentComplete}
            onCancel={handleCancel}
          />
        </div>
      </div>
    )
  }

  // Main view with request history
  return (
    <div className="document-request-page">
      {renderHeader()}
      <div className="document-content">
        <RequestHistory 
          refreshTrigger={historyRefresh}
          onSelectRequest={handleSelectPaymentMethod}
        />
      </div>
    </div>
  )
}
