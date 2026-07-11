import "./Layout.css";
import logo from "../assets/logo.png";
import { CircuitBackground } from "@/components/ui/circuit-background";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Layout({ children }) {
  const goToHome = () => {
    if (window.location.pathname !== "/") {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new Event('pushstate'));
    }
  };

  return (
    <CircuitBackground className="layout-wrapper" opacity={0.08} animated={true}>
      <header className="landing-nav">
        <div className="nav-logo" onClick={goToHome} style={{ cursor: "pointer" }}>
          <img src={logo} alt="ServiLine" className="nav-logo-icon" />
          <span className="nav-logo-text">ServiLine</span>
        </div>

        <div className="nav-links-pill">
          <a href="/#services">Services</a>
          <a href="/#why-us">Why Us</a>
          <a href="/#how-it-works">How It Works</a>
          <a href="/#contact">Contact</a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ThemeToggle />
        </div>
      </header>

      <main className="landing-main layout-main">
        {children}
      </main>

      <footer className="layout-footer">
        <div className="footer-bottom">
          <span>© 2026 Barangay · ServiLine</span>
          <span>Built for the residents</span>
        </div>
      </footer>
    </CircuitBackground>
  );
}
