import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import bcrypt from "bcryptjs";
import "./Login.css";

// 4.4 Forgot Password Modal
function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) { setError("Email is required."); return; }
    if (!emailRegex.test(email)) { setError("Enter a valid email address."); return; }
    setError("");
    setLoading(true);

    try {
      // Check if email exists in users table
      const { data: user } = await supabase
        .from("users")
        .select("id, first_name")
        .eq("email", email.toLowerCase())
        .single();

      if (!user) {
        setError("No account found with this email address.");
        setLoading(false);
        return;
      }

      // Generate reset token
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

      await supabase.from("password_reset_tokens").insert({
        user_id: user.id,
        token,
        expires_at: expiresAt,
      });

      // In production: send email via your backend
      // For now we just show success
      console.log("Reset token generated:", token);
      setSent(true);

    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        {!sent ? (
          <>
            <div className="modal-icon">🔑</div>
            <h2 className="modal-title">Reset Password</h2>
            <p className="modal-desc">
              Enter your registered email and we'll send you a password reset link.
            </p>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label>Email Address <span className="req">*</span></label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="yourname@email.com" className={error ? "error" : ""} />
                {error && <span className="err-msg">{error}</span>}
              </div>
              <button type="submit" className="btn-primary btn-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="modal-icon">📧</div>
            <h2 className="modal-title">Check Your Email</h2>
            <p className="modal-desc">
              A password reset link has been sent to <strong>{email}</strong>.
            </p>
            <button className="btn-primary btn-full" onClick={onClose}>Back to Login</button>
          </>
        )}
      </div>
    </div>
  );
}

// 4.1 Login Form
export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [attempts, setAttempts] = useState(0);

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

  // 4.2 Authenticate against Supabase users table
  // 4.3 Store session in memory
  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setTouched({ email: true, password: true });
      return;
    }

    // 4.5 Lock after 5 attempts
    if (attempts >= 5) {
      setLoginError("Too many failed attempts. Please reset your password.");
      return;
    }

    setLoading(true);
    setLoginError("");

    try {
      // Fetch user by email
      const { data: user, error: fetchError } = await supabase
        .from("users")
        .select("id, first_name, last_name, email, password_hash, role, is_active")
        .eq("email", form.email.trim().toLowerCase())
        .single();

      // 4.5 User not found
      if (fetchError || !user) {
        setAttempts(a => a + 1);
        setLoginError("Incorrect email or password. Please try again.");
        setLoading(false);
        return;
      }

      // 4.5 Account inactive
      if (!user.is_active) {
        setLoginError("Your account is not active. Please contact Barangay Labangon.");
        setLoading(false);
        return;
      }

      // 4.2 Verify bcrypt password
      const passwordMatch = await bcrypt.compare(form.password, user.password_hash);

      if (!passwordMatch) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        // 4.5 Specific error messages
        if (newAttempts >= 5) {
          setLoginError("Too many failed attempts. Please reset your password.");
        } else {
          setLoginError(`Incorrect email or password. ${5 - newAttempts} attempt(s) remaining.`);
        }
        setLoading(false);
        return;
      }

      // 4.3 Session — store user info in memory (sessionStorage for tab persistence)
      const sessionData = {
        userId: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
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
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}

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
            <div className="label-row">
              <label>Password <span className="req">*</span></label>
              <button type="button" className="forgot-link" onClick={() => setShowForgot(true)}>
                Forgot password?
              </button>
            </div>
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