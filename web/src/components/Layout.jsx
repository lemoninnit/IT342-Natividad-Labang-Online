import "./Layout.css";
import logo from "../assets/logo.png";

export default function Layout({ children }) {
  const goToHome = () => {
    window.location.pathname !== "/" && (window.location.href = "/");
  };

  return (
    <div className="layout-wrapper">
      <header className="layout-header">
        <div className="header-content">
          <div className="logo-section" onClick={goToHome}>
            <img src={logo} alt="LabangOnline Logo" className="logo-icon" />
            <span className="logo-text">LabangOnline</span>
          </div>
        </div>
      </header>

      <main className="layout-main">
        {children}
      </main>

      <footer className="layout-footer">
        <p>© 2025 Barangay Labangon · LabangOnline</p>
      </footer>
    </div>
  );
}
