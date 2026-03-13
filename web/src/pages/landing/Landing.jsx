import { useState } from "react";
import Layout from "../../components/Layout";
import "./Landing.css";

export default function Landing() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Layout>
      <div className="landing-page">

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">LabangOnline – Fast, Simple Barangay Services</h1>
          <p className="hero-subtitle">
            Book certificates, file reports, and track progress without the lines.
          </p>
          <div className="hero-buttons">
            <a href="/register" className="btn btn-primary">
              Create Account
            </a>
            <a href="/login" className="btn btn-secondary">
              Sign In
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-label">5–10 mins</div>
            <p className="feature-text">Average online request time</p>
          </div>
          <div className="feature-card">
            <div className="feature-label">24/7</div>
            <p className="feature-text">Available anytime</p>
          </div>
          <div className="feature-card">
            <div className="feature-label">Secure</div>
            <p className="feature-text">Verified payments</p>
          </div>
          <div className="feature-card">
            <div className="feature-label">Local</div>
            <p className="feature-text">Barangay Labangon</p>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <div className="action-card">
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
            <button className="action-btn">Get Started</button>
          </div>
          <div className="action-card">
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
            <button className="action-btn">Submit Report</button>
          </div>
          <div className="action-card">
            <div className="action-icon">📢</div>
            <h3>Community Announcements</h3>
            <p className="action-description">Stay updated with barangay news and events.</p>
            <ul className="action-items">
              <li>Official Announcements</li>
              <li>Community Events</li>
              <li>Health & Safety Advisories</li>
              <li>Emergency Alerts</li>
            </ul>
            <p className="action-note">✓ Real-time notifications</p>
            <button className="action-btn">View Updates</button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>About LabangOnline</h2>
        <p>
          LabangOnline is the official digitized service portal of Barangay Labangon, Cebu City. It streamlines certificate requests,
          payment verification, and record management, reducing in-person queues and speeding up processes.
        </p>
      </section>

      </div>
    </Layout>
  );
}
