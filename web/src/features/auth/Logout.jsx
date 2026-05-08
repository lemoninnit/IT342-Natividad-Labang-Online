import { useEffect } from "react";
import "./Logout.css";

export default function Logout() {
  const redirectToLogin = () => {
    sessionStorage.removeItem("labangonline_session");
    window.location.href = "/login";
  };

  const redirectToDashboard = () => {
    window.location.href = "/dashboard";
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
        <div className="logout-icon">🚪</div>
        <h2>Are you sure you want to logout?</h2>
        <p>You will be signed out of your LabangOnline account. Your data is safe and secure.</p>

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
