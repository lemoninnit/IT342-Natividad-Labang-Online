import { useState } from "react";
import Layout from "../../components/Layout";
import "./Landing.css";

export default function Landing() {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <Layout>
      <div className="landing-page">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <div className="hero-badge">Welcome to LabangOnline</div>
            <h1 className="hero-title">Fast, Simple Barangay Services</h1>
            <p className="hero-subtitle">
              Request certificates, file reports, and stay connected to Barangay Labangon—24/7, without the lines.
            </p>
            <div className="hero-actions">
              <a href="/register" className="btn btn-primary">
                <span className="btn-icon">→</span> Get Started
              </a>
              <a href="/login" className="btn btn-secondary">
                Sign In
              </a>
            </div>
          </div>
          <div className="hero-decoration">
            <div className="decoration-circle circle-1"></div>
            <div className="decoration-circle circle-2"></div>
          </div>
        </section>

        {/* Stats/Features Section */}
        <section className="features">
          <div className="features-container">
            <div className="feature-card">
              <div className="feature-emoji">⚡</div>
              <div className="feature-label">5–10 mins</div>
              <p className="feature-text">Average processing time</p>
            </div>
            <div className="feature-card">
              <div className="feature-emoji">🔒</div>
              <div className="feature-label">Secure</div>
              <p className="feature-text">Encrypted & verified</p>
            </div>
            <div className="feature-card">
              <div className="feature-emoji">📱</div>
              <div className="feature-label">Mobile Ready</div>
              <p className="feature-text">Works on all devices</p>
            </div>
            <div className="feature-card">
              <div className="feature-emoji">🏘️</div>
              <div className="feature-label">Local First</div>
              <p className="feature-text">Barangay Labangon</p>
            </div>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="quick-actions">
          <div className="quick-actions-header">
            <h2>Quick Actions</h2>
            <p>Everything you need in one place</p>
          </div>
          <div className="actions-grid">
            <div
              className="action-card"
              onMouseEnter={() => setHoveredCard(0)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="action-icon">📄</div>
              <h3>Request a Certificate</h3>
              <p className="action-description">Fast-track certificate requests for your barangay needs.</p>
              <ul className="action-items">
                <li>Barangay Clearance</li>
                <li>Residency Certificate</li>
                <li>Indigency Certificate</li>
                <li>Good Moral Character</li>
                <li>Business Clearance</li>
              </ul>
              <a href="/login" className="action-btn">Get Started</a>
            </div>

            <div
              className="action-card"
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="action-icon">📋</div>
              <h3>File a Report</h3>
              <p className="action-description">Report concerns and incidents securely to the barangay.</p>
              <ul className="action-items">
                <li>Incident Reports</li>
                <li>Public Safety Issues</li>
                <li>Environmental Concerns</li>
                <li>Community Problems</li>
              </ul>
              <p className="action-note">✓ Reviewed within 24 hours</p>
              <a href="/login" className="action-btn">Submit Report</a>
            </div>

            <div
              className="action-card"
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="action-icon">📢</div>
              <h3>View Announcements</h3>
              <p className="action-description">Stay connected with barangay news and updates.</p>
              <ul className="action-items">
                <li>Official Announcements</li>
                <li>Community Events</li>
                <li>Health & Safety Alerts</li>
                <li>Emergency Notices</li>
              </ul>
              <p className="action-note">✓ Real-time notifications</p>
              <a href="/login" className="action-btn">View Updates</a>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="about">
          <h2>Why LabangOnline?</h2>
          <div className="about-grid">
            <div className="about-item">
              <div className="about-number">1</div>
              <h4>Fast & Easy</h4>
              <p>Submit requests online and receive updates in real-time.</p>
            </div>
            <div className="about-item">
              <div className="about-number">2</div>
              <h4>Secure & Safe</h4>
              <p>Your data is encrypted and protected with the latest security standards.</p>
            </div>
            <div className="about-item">
              <div className="about-number">3</div>
              <h4>Always Available</h4>
              <p>Access services 24/7 from the comfort of your home or office.</p>
            </div>
          </div>
          <p className="about-description">
            LabangOnline is the official digitized service portal of Barangay Labangon, transforming how residents access barangay services.
          </p>
        </section>
      </div>
    </Layout>
  );
}