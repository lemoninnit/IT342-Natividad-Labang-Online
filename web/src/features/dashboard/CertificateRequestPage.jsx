import { useState, useEffect } from 'react'
import { certificateAPI } from '../../lib/api'
import CertificateRequestForm from '../certificate/CertificateRequestForm'
import PaymentMethodSelection from '../payment/PaymentMethodSelection'
import GCashPayment from '../payment/GCashPayment'
import OTCPayment from '../payment/OTCPayment'
import RequestHistory from '../history/RequestHistory'
import Icon from '../../components/ui/Icons'
import '../certificate/CertificateRequestForm.css'
import './CertificateRequestPage.css'

const certificateOptions = [
  {
    id: 'BARANGAY_CLEARANCE',
    title: 'Barangay Clearance',
    description: 'Required for employment, business permits, and other legal purposes within the barangay.',
    price: '₱50.00',
    priceVal: 50,
    icon: 'clearance'
  },
  {
    id: 'RESIDENCY_CERTIFICATE',
    title: 'Certificate of Residency',
    description: 'Proof of residence in Barangay for government transactions and applications.',
    price: '₱30.00',
    priceVal: 30,
    icon: 'residency'
  },
  {
    id: 'INDIGENCY_CERTIFICATE',
    title: 'Certificate of Indigency',
    description: 'For residents requiring financial assistance or applying for free medical services.',
    price: '₱20.00',
    priceVal: 20,
    icon: 'indigency'
  },
  {
    id: 'GOOD_MORAL_CHARACTER',
    title: 'Good Moral Character',
    description: 'Required for school applications, employment, and character reference purposes.',
    price: '₱40.00',
    priceVal: 40,
    icon: 'moral'
  },
  {
    id: 'BUSINESS_PERMIT',
    title: 'Business Clearance',
    description: 'Required for starting or renewing a business within Barangay.',
    price: '₱100.00',
    priceVal: 100,
    icon: 'business'
  }
]

export default function CertificateRequestPage() {
  const [currentStep, setCurrentStep] = useState('selection') // selection, view, request-form, payment-method, gcash-payment, otc-payment
  const [selectedRequestId, setSelectedRequestId] = useState(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
  const [historyRefresh, setHistoryRefresh] = useState(0)
  const [session, setSession] = useState(() => {
    const sessionData = sessionStorage.getItem("serviline_session");
    return sessionData ? JSON.parse(sessionData) : null;
  });

  const [selectedCert, setSelectedCert] = useState(null)

  const handleCertSelect = (cert) => {
    setSelectedCert(cert)
    setCurrentStep('request-form')
  }

  const handleRequestSubmitted = (newRequest) => {
    setSelectedRequestId(newRequest.id)
    setCurrentStep('view')
    setHistoryRefresh(prev => prev + 1)
  }

  const handleSelectPaymentMethod = (request) => {
    const certOption = certificateOptions.find(c => c.id === request.certificateType)
    if (certOption) {
      setSelectedCert(certOption)
    }

    setSelectedRequestId(request.id)
    setCurrentStep('payment-method')
  }

  const handleMethodSelected = (method) => {
    setSelectedPaymentMethod(method)
    if (method === 'GCASH') {
      setCurrentStep('gcash-payment')
    } else if (method === 'OVER_THE_COUNTER') {
      setCurrentStep('otc-payment')
    }
  }

  const handlePaymentComplete = () => {
    setCurrentStep('view')
    setSelectedRequestId(null)
    setSelectedPaymentMethod(null)
    setHistoryRefresh(prev => prev + 1)
  }

  const handleCancel = () => {
    setCurrentStep('view')
    setSelectedRequestId(null)
    setSelectedPaymentMethod(null)
  }

  const handleBackToPaymentMethod = () => {
    setCurrentStep('payment-method')
  }

  // Header section with profile and button
  const renderHeader = () => (
    <div className="document-header">
      <div className="header-title-section">
        <h1>Request Certificate</h1>
        <p>Select the type of certificate you need and we'll guide you through the process</p>
      </div>
      <button
        className="btn-view-records"
        onClick={() => setCurrentStep(currentStep === 'view' ? 'selection' : 'view')}
      >
        {currentStep === 'view' ? (
          <span className="btn-content-loading">
            <Icon name="document" size={16} noBg={true} className="mr-2" />
            Request a Certificate
          </span>
        ) : (
          <span className="btn-content-loading">
            <Icon name="folder" size={16} noBg={true} className="mr-2" />
            View Request Records
          </span>
        )}
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
          <CertificateRequestForm
            onSuccess={handleRequestSubmitted}
            onCancel={() => {
              setCurrentStep('selection')
              setSelectedCert(null)
            }}
            initialCert={selectedCert}
          />
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
            initialMethod={selectedPaymentMethod}
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
            price={selectedCert?.price || '₱50.00'}
            priceVal={selectedCert?.priceVal || 50}
            onPaymentComplete={handlePaymentComplete}
            onCancel={handleBackToPaymentMethod}
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
            price={selectedCert?.price || '₱50.00'}
            priceVal={selectedCert?.priceVal || 50}
            onPaymentComplete={handlePaymentComplete}
            onCancel={handleBackToPaymentMethod}
          />
        </div>
      </div>
    )
  }

  // Main view with request history
  if (currentStep === 'view') {
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

  return (
    <div className="document-request-page">
      {renderHeader()}

      <div className="document-content">
        <div className="important-notice">
          <Icon name="info" size={16} noBg={true} className="info-icon" />
          <p><strong>Note:</strong> Make sure your profile information is complete and accurate before requesting certificates. Processing time is typically 3-5 business days.</p>
        </div>

        <div className="certificate-grid">
          {certificateOptions.map(cert => (
            <div key={cert.id} className="cert-card" onClick={() => handleCertSelect(cert)}>
              <div className="cert-icon-wrapper">
                <Icon name={cert.icon} size={22} noBg={true} />
              </div>
              <h3 className="cert-title">{cert.title}</h3>
              <p className="cert-desc">{cert.description}</p>
              <div className="cert-footer">
                <span className="cert-price">{cert.price}</span>
                <span className="cert-arrow">→</span>
              </div>
            </div>
          ))}
        </div>

        <div className="requirements-section">
          <h3 className="req-title">General Requirements</h3>
          <ul className="req-list">
            <li><span className="check">✓</span> Valid government-issued ID</li>
            <li><span className="check">✓</span> Proof of residency in Barangay</li>
            <li><span className="check">✓</span> Completed and verified user profile</li>
            <li><span className="check">✓</span> Payment for processing fees (if applicable)</li>
            <li><span className="check">✓</span> Additional documents may be required depending on certificate type</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
