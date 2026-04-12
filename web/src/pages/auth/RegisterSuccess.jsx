import Layout from "../../components/Layout";
import "./RegisterSuccess.css";

export default function RegisterSuccess() {
  return (
    <Layout>
      <div className="success-page">
        <div className="success-card">
          <div className="success-icon-container">
            <div className="success-icon-circle">
              <span className="success-check">✓</span>
            </div>
          </div>
          
          <h1 className="success-title">Account Created Successfully!</h1>
          <p className="success-message">
            Your registration as a resident of Barangay Labangon has been received.
          </p>

          <div className="next-steps-container">
            <h2 className="next-steps-title">What happens next?</h2>
            <div className="step-item">
              <span className="step-number">1</span>
              <p>Your account is currently <strong>pending verification</strong> by the Barangay Hall.</p>
            </div>
            <div className="step-item">
              <span className="step-number">2</span>
              <p>Visit the <strong>Barangay Labangon Hall</strong> with a valid government-issued ID to activate your account.</p>
            </div>
            <div className="step-item">
              <span className="step-number">3</span>
              <p>Once verified, you will be able to log in and access all community services online.</p>
            </div>
          </div>

          <div className="success-actions">
            <a href="/login" className="btn-primary-success">
              Login Now
            </a>
            <a href="/" className="btn-secondary-success">
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
