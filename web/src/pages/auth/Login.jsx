import { useState } from "react";
import "./Login.css";

// 4.1 Login Form
export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate(data) {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) errs.email = "Email is required.";
    else if (!emailRegex.test(data.email)) errs.email = "Enter a valid email address.";
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
      setTouched({ email: true, password: true });
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
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      if (response.status === 401) {
        setLoginError("Incorrect email or password. Please try again.");
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
        setLoginError("Your account is not active. Please contact Barangay Labangon.");
        setLoading(false);
        return;
      }

      // Store session
      const sessionData = {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        loginTime: new Date().toISOString(),
      };
      sessionStorage.setItem("labangonline_session", JSON.stringify(sessionData));

      // Redirect based on role
      if (user.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/dashboard";
      }

    } catch (err) {
      setLoginError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">

      <header className="login-header">
        <div className="logo-mark">
          <span className="logo-icon">🏠</span>
          <span className="logo-text">LabangOnline</span>
        </div>
        <p className="header-sub">Barangay Labangon · Cebu City</p>
      </header>

      <div className="login-card">
        <div className="card-header">
          <h1 className="card-title">Welcome Back</h1>
          <p className="card-subtitle">Sign in to your Barangay Labangon account</p>
        </div>

        {/* 4.5 Error banner */}
        {loginError && (
          <div className="alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{loginError}</span>
          </div>
        )}

        {/* 4.1 Login Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Email Address <span className="req">*</span></label>
            <input type="email" name="email" value={form.email}
              onChange={handleChange} onBlur={handleBlur}
              placeholder="yourname@email.com"
              className={errors.email && touched.email ? "error" : ""}
              autoComplete="email" />
            {errors.email && touched.email && <span className="err-msg">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password <span className="req">*</span></label>
            <div className="input-with-icon">
              <input type={showPassword ? "text" : "password"} name="password"
                value={form.password} onChange={handleChange} onBlur={handleBlur}
                placeholder="Enter your password"
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
              <span className="loading-row"><span className="spinner" /> Signing in...</span>
            ) : "Sign In"}
          </button>
        </form>

        <div className="divider"><span>or</span></div>

        <p className="register-link">
          Don't have an account? <a href="/">Register here</a>
        </p>
      </div>

      <footer className="login-footer">
        <p>© 2025 Barangay Labangon, Cebu City · All rights reserved</p>
      </footer>
    </div>
  );
}