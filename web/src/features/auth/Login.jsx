import { useState } from "react";
import Layout from "../../shared/Layout";
import "./Login.css";
import { prefetchUserData } from "../../lib/api";
import BorderGlow from "@/components/ui/border-glow";

// 4.1 Login Form
export default function Login() {
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
        setLoginError("Incorrect username/password or account is not yet confirmed by the Barangay.");
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
        setLoginError("Your account is not active. Please contact Barangay.");
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
      sessionStorage.setItem("serviline_session", JSON.stringify(sessionData));

      // Trigger background pre-fetching for user/admin data asynchronously
      prefetchUserData(user.id, user.role.toUpperCase() === "ADMIN").catch(err => {
        console.warn("Background prefetch failed:", err);
      });

      // Redirect based on role
      if (user.role.toUpperCase() === "ADMIN") {
        window.location.href = "/admin";
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
    <Layout>
      <div className="login-page">
        <BorderGlow className="login-card" borderRadius={16}>
          <div className="card-header">
            <h1 className="card-title">Sign In</h1>
            <p className="card-subtitle">Welcome back to ServiLine</p>
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
              <label>Username <span className="req">*</span></label>
              <input type="text" name="username" value={form.username}
                onChange={handleChange} onBlur={handleBlur}
                placeholder="Enter your username"
                className={errors.username && touched.username ? "error" : ""}
                autoComplete="username" />
              {errors.username && touched.username && <span className="err-msg">{errors.username}</span>}
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
            Don't have an account? <a href="/register">Register here</a>
          </p>
        </BorderGlow>
      </div>
    </Layout>
  );
}