import { useEffect } from "react";
import Layout from "../../shared/Layout";
import Icon from "../../components/ui/Icons";
import "./Logout.css";

export default function Logout() {
  const redirectToLogin = () => {
    sessionStorage.removeItem("serviline_session");
    window.history.pushState(null, '', '/login');
    window.dispatchEvent(new Event('pushstate'));
  };

  const redirectToDashboard = () => {
    const preLogoutPath = sessionStorage.getItem("pre_logout_path") || "/dashboard";
    window.history.pushState(null, '', preLogoutPath);
    window.dispatchEvent(new Event('pushstate'));
  };

  useEffect(() => {
    // Set up ESC key to cancel
    const handleKeyPress = (e) => {
      if (e.key === "Escape") {
        redirectToDashboard();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="logout-container">
      <div className="logout-overlay" onClick={redirectToDashboard}></div>
      <div className="logout-modal">
        <div className="logout-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <Icon name="logout" size={24} />
        </div>
        <h2>Are you sure you want to logout?</h2>
        <p>You will be signed out of your ServiLine account. Your data is safe and secure.</p>

        <div className="logout-actions">
          <button className="btn-cancel" onClick={redirectToDashboard}>
            Cancel
          </button>
          <button className="btn-confirm-logout" onClick={redirectToLogin}>
            Yes, Logout
          </button>
        </div>

        <p className="logout-hint">Press <kbd>ESC</kbd> to cancel</p>
      </div>
    </div>
  );
}
