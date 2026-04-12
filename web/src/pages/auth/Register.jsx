import { useState } from "react";
import Layout from "../../components/Layout";
import "./Register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "+63",
    dateOfBirth: "",
    addressLine: "",
    barangay: "Labangon",
    city: "Cebu City",
    province: "Cebu",
    postalCode: "6000",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [showPw, setShowPw]   = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  /* ── validation rules ── */
  const validate = (name, value) => {
    switch (name) {
      case "fullName":
        return !value.trim() ? "Full name is required" : "";
      case "username":
        if (!value.trim()) return "Username is required";
        if (value.length < 3) return "Username must be at least 3 characters";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email address";
        return "";
      case "phone":
        if (!value.trim() || value === "+63") return "Phone number is required";
        if (!/^(\+63)[0-9]{10}$/.test(value.replace(/\s/g, "")))
          return "Invalid Philippine mobile number (13 digits including +63)";
        return "";
      case "dateOfBirth":
        return !value ? "Date of birth is required" : "";
      case "addressLine":
        return !value.trim() ? "Address line is required" : "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Must be at least 8 characters";
        return "";
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (touched[name]) {
      setErrors((p) => ({ ...p, [name]: validate(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fields = ["fullName","username","email","phone","dateOfBirth","addressLine","password","confirmPassword"];
    const newTouched = {};
    const newErrors  = {};
    fields.forEach((f) => {
      newTouched[f] = true;
      newErrors[f]  = validate(f, formData[f]);
    });
    setTouched(newTouched);
    setErrors(newErrors);
    if (Object.values(newErrors).every((e) => !e)) {
      alert("Registration successful!");
    }
  };

  /* show error only if touched AND has error */
  const hasError = (f) => touched[f] && errors[f];
  const inputCls = (f) => `reg-input${hasError(f) ? " input-error" : ""}`;

  return (
    <Layout>
      <div className="reg-page">
      <div className="reg-card">

        {/* ── Header ── */}
        <div className="reg-header">
          <h1 className="reg-title">Create your account</h1>
          <p className="reg-subtitle">Register as a resident of Barangay Labangon</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* ── Row 1: Full Name + Username ── */}
          <div className="reg-row">
            <div className="reg-group">
              <label className="reg-label">Full name</label>
              <input
                name="fullName"
                type="text"
                placeholder="Juan Dela Cruz"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputCls("fullName")}
              />
              {hasError("fullName") && <span className="reg-error">{errors.fullName}</span>}
            </div>

            <div className="reg-group">
              <label className="reg-label">Username</label>
              <input
                name="username"
                type="text"
                placeholder="juandelacruz"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputCls("username")}
              />
              {hasError("username") && <span className="reg-error">{errors.username}</span>}
            </div>
          </div>

          {/* ── Row 2: Email + Phone ── */}
          <div className="reg-row">
            <div className="reg-group">
              <label className="reg-label">Email</label>
              <input
                name="email"
                type="email"
                placeholder="juan.delacruz@email.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputCls("email")}
              />
              {hasError("email")
                ? <span className="reg-error">{errors.email}</span>
                : <span className="reg-hint">We will send a 6-digit code</span>
              }
            </div>

            <div className="reg-group">
              <label className="reg-label">Phone</label>
              <input
                name="phone"
                type="tel"
                placeholder="+63"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputCls("phone")}
              />
              {hasError("phone")
                ? <span className="reg-error">{errors.phone}</span>
                : <span className="reg-hint">Philippine mobile number (13 digits including +63)</span>
              }
            </div>
          </div>

          {/* ── Row 3: Date of Birth + Address Line ── */}
          <div className="reg-row">
            <div className="reg-group">
              <label className="reg-label">Date of birth</label>
              <input
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputCls("dateOfBirth")}
              />
              {hasError("dateOfBirth") && <span className="reg-error">{errors.dateOfBirth}</span>}
            </div>

            <div className="reg-group">
              <label className="reg-label">Address line</label>
              <input
                name="addressLine"
                type="text"
                placeholder="123 Mabuhay Street, Purok 5"
                value={formData.addressLine}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputCls("addressLine")}
              />
              {hasError("addressLine")
                ? <span className="reg-error">{errors.addressLine}</span>
                : <span className="reg-hint">Street, house number, etc.</span>
              }
            </div>
          </div>

          {/* ── Row 4: Barangay (prefilled) + City (prefilled) ── */}
          <div className="reg-row">
            <div className="reg-group">
              <label className="reg-label">Barangay</label>
              <input
                name="barangay"
                type="text"
                value={formData.barangay}
                readOnly
                className="reg-input reg-input-prefilled"
              />
            </div>

            <div className="reg-group">
              <label className="reg-label">City</label>
              <input
                name="city"
                type="text"
                value={formData.city}
                readOnly
                className="reg-input reg-input-prefilled"
              />
            </div>
          </div>

          {/* ── Row 5: Province (prefilled) + Postal Code (prefilled) ── */}
          <div className="reg-row">
            <div className="reg-group">
              <label className="reg-label">Province</label>
              <input
                name="province"
                type="text"
                value={formData.province}
                readOnly
                className="reg-input reg-input-prefilled"
              />
            </div>

            <div className="reg-group">
              <label className="reg-label">Postal code</label>
              <input
                name="postalCode"
                type="text"
                value={formData.postalCode}
                readOnly
                className="reg-input reg-input-prefilled"
              />
            </div>
          </div>

          {/* ── Row 6: Password + Confirm Password ── */}
          <div className="reg-row">
            <div className="reg-group">
              <label className="reg-label">Password</label>
              <div className="pw-wrap">
                <input
                  name="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Enter at least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputCls("password")}
                />
                <button
                  type="button"
                  className="pw-eye"
                  onClick={() => setShowPw((p) => !p)}
                  tabIndex={-1}
                >
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
              {hasError("password")
                ? <span className="reg-error">{errors.password}</span>
                : <span className="reg-hint">Minimum 8 characters</span>
              }
            </div>

            <div className="reg-group">
              <label className="reg-label">Confirm password</label>
              <div className="pw-wrap">
                <input
                  name="confirmPassword"
                  type={showCpw ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputCls("confirmPassword")}
                />
                <button
                  type="button"
                  className="pw-eye"
                  onClick={() => setShowCpw((p) => !p)}
                  tabIndex={-1}
                >
                  {showCpw ? "🙈" : "👁️"}
                </button>
              </div>
              {hasError("confirmPassword") && <span className="reg-error">{errors.confirmPassword}</span>}
            </div>
          </div>

          {/* ── Verification Notice ── */}
          <div className="reg-notice">
            <span className="reg-notice-icon">📋</span>
            <div>
              <p className="reg-notice-title">
                <strong>Account Verification Required</strong>
              </p>
              <p><strong>Important:</strong> Your account will be created with a <em>pending</em> status upon registration.</p>
              <p style={{ marginTop: "8px" }}>
                To activate your account and gain access to the system, you must complete the following verification process:
              </p>
              <ol className="reg-notice-list">
                <li>Visit the <strong>Barangay Hall of Labangon</strong> during office hours</li>
                <li>
                  Present any of the following valid documents:
                  <ul className="reg-notice-sublist">
                    <li>Government-issued ID (e.g., Philippine National ID, Driver's License, Passport)</li>
                    <li>NSO/PSA Birth Certificate</li>
                  </ul>
                </li>
                <li>Our staff will verify your identity and activate your account</li>
              </ol>
              <p style={{ marginTop: "8px" }}>
                <strong>Note:</strong> You will not be able to log in until your account has been verified and approved by barangay staff.
              </p>
            </div>
          </div>

          {/* ── Submit ── */}
          <div className="reg-footer-row">
            <button type="submit" className="reg-btn-submit">
              Create account
            </button>
            <span className="reg-signin-text">
              <a href="/login" className="reg-signin-link">Already have an account?→</a>
            </span>
          </div>

        </form>
      </div>
    </div>
    </Layout>
  );
}