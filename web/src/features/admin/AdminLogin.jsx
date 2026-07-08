import { useState } from "react";
import Layout from "../../shared/Layout";
import "../auth/Login.css";
import { prefetchUserData } from "../../lib/api";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate(data) {
    const errs = {};
    if (!data.username.trim()) errs.username = "Username is required.";
    if (!data.password) errs.password = "Password is required.";
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setLoginError("");
    if (touched[name]) {
      const errs = validate({ ...form, [name]: value });
      setErrors(prev => ({ ...prev, [name]: errs[name] }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const errs = validate(form);
    setErrors(prev => ({ ...prev, [name]: errs[name] }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setTouched({ username: true, password: true });
      return;
    }

    setLoading(true);
    setLoginError("");

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username.trim(),
          password: form.password,
        }),
      });

      if (response.status === 401) {
        setLoginError("Invalid admin credentials or account not authorized.");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        setLoginError("Login failed. Please try again.");
        setLoading(false);
        return;
      }

      const body = await response.json();
      const user = body.user;

      if (!user || !user.active) {
        setLoginError("Your account is not active.");
        setLoading(false);
        return;
      }

      // STRICT ADMIN CHECK
      if (user.role.toUpperCase() !== 'ADMIN') {
        setLoginError("Access Denied: You do not have administrator privileges.");
        setLoading(false);
        return;
      }

      // Store session
      const sessionData = {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role.toUpperCase(),
        loginTime: new Date().toISOString(),
      };
      sessionStorage.setItem("serviline_session", JSON.stringify(sessionData));

      // Trigger background pre-fetching for admin data
      try {
        await prefetchUserData(user.id, true);
      } catch (err) {
        console.warn("Background prefetch failed:", err);
      }

      // Redirect to admin dashboard
      window.location.href = "/admin";

    } catch (err) {
      setLoginError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="login-page">
        <div className="login-card admin-login-card" style={{ borderTop: '4px solid #10b981' }}>
          <div className="card-header">
            <h1 className="card-title">Admin Login</h1>
            <p className="card-subtitle">Barangay Labangon Management System</p>
          </div>

          {loginError && (
            <div className="alert-error">
              <span className="alert-icon">⚠️</span>
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label>Admin Username <span className="req">*</span></label>
              <input type="text" name="username" value={form.username}
                onChange={handleChange} onBlur={handleBlur}
                placeholder="Enter admin username"
                className={errors.username && touched.username ? "error" : ""}
                autoComplete="username" />
              {errors.username && touched.username && <span className="err-msg">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label>Password <span className="req">*</span></label>
              <div className="input-with-icon">
                <input type={showPassword ? "text" : "password"} name="password"
                  value={form.password} onChange={handleChange} onBlur={handleBlur}
                  placeholder="Enter password"
                  className={errors.password && touched.password ? "error" : ""}
                  autoComplete="current-password" />
                <button type="button" className="eye-btn" onClick={() => setShowPassword(v => !v)}>
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && touched.password && <span className="err-msg">{errors.password}</span>}
            </div>

            <button type="submit" className="btn-primary btn-full btn-login" disabled={loading}>
              {loading ? (
                <span className="loading-row"><span className="spinner" /> Authenticating...</span>
              ) : "Sign In as Admin"}
            </button>
          </form>

          <p className="register-link" style={{ marginTop: '24px' }}>
            <a href="/login" style={{ color: '#94a3b8' }}>← Back to Resident Login</a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
