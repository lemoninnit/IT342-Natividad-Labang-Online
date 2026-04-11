import { useState } from "react";
import Layout from "../../components/Layout";
import "./Register.css";

// 3.4 Validation
function validateForm(form) {
  const errors = {};
  if (!form.firstName.trim()) errors.firstName = "First name is required.";
  if (!form.lastName.trim()) errors.lastName = "Last name is required.";
  if (!form.dob) {
    errors.dob = "Date of birth is required.";
  } else {
    const dobDate = new Date(form.dob);
    const today = new Date();
    if (dobDate > today) {
      errors.dob = "Date of birth cannot be in the future.";
    } else {
      const age = today.getFullYear() - dobDate.getFullYear();
      const monthDiff = today.getMonth() - dobDate.getMonth();
      const dayDiff = today.getDate() - dobDate.getDate();
      const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
      if (actualAge < 1 || actualAge > 120) errors.dob = "Please enter a valid date of birth.";
    }
  }
  
  // Address validation - no special symbols except spaces, hyphens, dots, and commas
  const addressRegex = /^[a-zA-Z0-9\s\-.,/]*$/;
  if (!form.street.trim()) errors.street = "Street/house number is required.";
  else if (!addressRegex.test(form.street)) errors.street = "Address contains invalid symbols.";
  
  if (!form.purok.trim()) errors.purok = "Purok is required.";
  else if (!addressRegex.test(form.purok)) errors.purok = "Purok contains invalid symbols.";
  
  // 3.2 Barangay Labangon verification
  if (form.barangay.toLowerCase() !== "labangon")
    errors.barangay = "Only residents of Barangay Labangon may register.";
  
  if (!form.city.trim()) errors.city = "City is required.";
  if (!form.province.trim()) errors.province = "Province is required.";
  
  const phoneRegex = /^(09|\+639)\d{9}$/;
  if (!form.phone.trim()) errors.phone = "Contact number is required.";
  else if (!phoneRegex.test(form.phone.replace(/\s/g, "")))
    errors.phone = "Enter a valid Philippine mobile number (e.g. 09XXXXXXXXX).";
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email.trim()) errors.email = "Email address is required.";
  else if (!emailRegex.test(form.email)) errors.email = "Enter a valid email address.";
  
  if (!form.password) {
    if (form.confirmPassword) errors.password = "Password is required.";
  } else if (form.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (!/[A-Z]/.test(form.password)) {
    errors.password = "Include at least one uppercase letter.";
  } else if (!/[0-9]/.test(form.password)) {
    errors.password = "Include at least one number.";
  }

  if (form.confirmPassword || form.password) {
    if (!form.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
  }

  if (!form.agreeTerms) errors.agreeTerms = "You must agree to the terms and conditions.";
  return errors;
}

function getPasswordStrength(password) {
  if (!password) return { label: "", score: 0 };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const labels = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  return { label: labels[score] || "Very Weak", score };
}

export default function Register() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const [form, setForm] = useState({
    firstName: "", middleName: "", lastName: "",
    dob: "", gender: "",
    street: "", purok: "", barangay: "Labangon", city: "Cebu City", province: "Cebu",
    phone: "", email: "",
    password: "", confirmPassword: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const passwordStrength = getPasswordStrength(form.password);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setServerError("");
    if (touched[name]) {
      const newErrors = validateForm({ ...form, [name]: type === "checkbox" ? checked : value });
      setErrors(prev => ({ ...prev, [name]: newErrors[name] }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const newErrors = validateForm(form);
    setErrors(prev => ({ ...prev, [name]: newErrors[name] }));
  }

  const stepFields = {
    1: ["firstName", "lastName", "dob", "gender"],
    2: ["street", "purok", "barangay", "city", "province", "phone", "email"],
    3: ["password", "confirmPassword", "agreeTerms"],
  };

  function handleNext() {
    const allErrors = validateForm(form);
    const stepErrors = {};
    const stepTouched = {};
    stepFields[step].forEach(f => {
      if (allErrors[f]) stepErrors[f] = allErrors[f];
      stepTouched[f] = true;
    });
    setTouched(prev => ({ ...prev, ...stepTouched }));
    setErrors(prev => ({ ...prev, ...stepErrors }));
    if (Object.keys(stepErrors).length === 0) {
      setErrors(prev => {
        const nextErrors = { ...prev };
        const nextStep = step + 1;
        if (stepFields[nextStep]) {
          stepFields[nextStep].forEach(field => delete nextErrors[field]);
        }
        return nextErrors;
      });
      setStep(s => s + 1);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const allErrors = validateForm(form);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      const allTouched = {};
      Object.keys(form).forEach(k => (allTouched[k] = true));
      setTouched(allTouched);
      return;
    }

    setLoading(true);
    setServerError("");

    try {
      const payload = {
        firstName: form.firstName.trim(),
        middleName: form.middleName.trim() || null,
        lastName: form.lastName.trim(),
        dob: form.dob,
        gender: form.gender || null,
        street: form.street.trim(),
        purok: form.purok.trim(),
        barangay: form.barangay.trim(),
        city: form.city.trim(),
        province: form.province.trim(),
        phone: form.phone.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      };

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 409) {
        const body = await response.json().catch(() => null);
        if (body?.status === "EMAIL_EXISTS") {
          setErrors(prev => ({ ...prev, email: "An account with this email already exists." }));
          setTouched(prev => ({ ...prev, email: true }));
        } else if (body?.status === "PHONE_EXISTS") {
          setErrors(prev => ({ ...prev, phone: "An account with this phone number already exists." }));
          setTouched(prev => ({ ...prev, phone: true }));
        } else {
          setServerError("An account with this email or phone already exists.");
        }
        return;
      }

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const fallbackMessage = body?.status
          ? body.status.replace(/_/g, " ").toLowerCase()
          : "Registration failed. Please try again.";
        const errorMessage = body?.message || fallbackMessage;
        setServerError(errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1));
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setServerError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // 3.5 Welcome message
  if (submitted) {
    return (
      <div className="register-page">
        <div className="register-card welcome-card">
          <div className="welcome-icon">🎉</div>
          <h1 className="welcome-title">Welcome to LabangOnline!</h1>
          <p className="welcome-subtitle">
            Hi <strong>{form.firstName}</strong>, your account has been successfully created.
          </p>
          <p className="welcome-desc">
            You are now registered as a resident of <strong>Barangay Labangon</strong>.
            You can now access online barangay services.
          </p>
          <a href="/login" className="btn-primary welcome-btn">Proceed to Login →</a>
        </div>
      </div>
    );
  }

  return (
    <Layout>
    <div className="register-page">
      <div className="register-card">
        <div className="card-header">
          <h1 className="card-title">Create Your Account</h1>
          <p className="card-subtitle">Register as a Barangay Labangon resident</p>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator">
          {["Personal Info", "Address & Contact", "Security"].map((label, i) => (
            <div key={i} className={`step ${step === i + 1 ? "active" : step > i + 1 ? "done" : ""}`}>
              <div className="step-circle">{step > i + 1 ? "✓" : i + 1}</div>
              <span className="step-label">{label}</span>
            </div>
          ))}
          <div className="step-line" style={{ "--progress": `${((step - 1) / 2) * 100}%` }} />
        </div>

        {serverError && (
          <div className="alert-error">
            <span>⚠️</span> {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* STEP 1 */}
          {step === 1 && (
            <div className="form-step">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name <span className="req">*</span></label>
                  <input name="firstName" value={form.firstName} onChange={handleChange}
                    onBlur={handleBlur} placeholder="e.g. Juan"
                    className={errors.firstName && touched.firstName ? "error" : ""} />
                  {errors.firstName && touched.firstName && <span className="err-msg">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label>Middle Name</label>
                  <input name="middleName" value={form.middleName} onChange={handleChange} placeholder="Optional" />
                </div>
              </div>
              <div className="form-group">
                <label>Last Name <span className="req">*</span></label>
                <input name="lastName" value={form.lastName} onChange={handleChange}
                  onBlur={handleBlur} placeholder="e.g. Dela Cruz"
                  className={errors.lastName && touched.lastName ? "error" : ""} />
                {errors.lastName && touched.lastName && <span className="err-msg">{errors.lastName}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date of Birth <span className="req">*</span></label>
                  <input type="date" name="dob" value={form.dob} onChange={handleChange}
                    onBlur={handleBlur} className={errors.dob && touched.dob ? "error" : ""} />
                  {errors.dob && touched.dob && <span className="err-msg">{errors.dob}</span>}
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange}>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="prefer_not">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="form-step">
              <div className="info-banner">
                <span className="banner-icon">📍</span>
                <span>Registration is exclusively for <strong>Barangay Labangon</strong> residents.</span>
              </div>
              <div className="form-group">
                <label>House No. / Street <span className="req">*</span></label>
                <input name="street" value={form.street} onChange={handleChange}
                  onBlur={handleBlur} placeholder="e.g. 123 Mabini St."
                  className={errors.street && touched.street ? "error" : ""} />
                {errors.street && touched.street && <span className="err-msg">{errors.street}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Purok <span className="req">*</span></label>
                  <input name="purok" value={form.purok} onChange={handleChange}
                    onBlur={handleBlur} placeholder="e.g. Purok 3"
                    className={errors.purok && touched.purok ? "error" : ""} />
                  {errors.purok && touched.purok && <span className="err-msg">{errors.purok}</span>}
                </div>
                <div className="form-group">
                  <label>Barangay <span className="req">*</span></label>
                  <input name="barangay" value={form.barangay} onChange={handleChange}
                    onBlur={handleBlur} className={errors.barangay && touched.barangay ? "error" : ""} />
                  {errors.barangay && touched.barangay && <span className="err-msg">{errors.barangay}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input name="city" value={form.city} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Province</label>
                  <input name="province" value={form.province} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Mobile Number <span className="req">*</span></label>
                <input name="phone" value={form.phone} onChange={handleChange}
                  onBlur={handleBlur} placeholder="09XXXXXXXXX"
                  className={errors.phone && touched.phone ? "error" : ""} />
                {errors.phone && touched.phone && <span className="err-msg">{errors.phone}</span>}
              </div>
              <div className="form-group">
                <label>Email Address <span className="req">*</span></label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  onBlur={handleBlur} placeholder="yourname@email.com"
                  className={errors.email && touched.email ? "error" : ""} />
                {errors.email && touched.email && <span className="err-msg">{errors.email}</span>}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="form-step">
              <div className="info-banner">
                <span className="banner-icon">🔒</span>
                <span>Your password is encrypted using <strong>BCrypt</strong> before saving.</span>
              </div>
              <div className="form-group">
                <label>Password <span className="req">*</span></label>
                <div className="input-with-icon">
                  <input type={showPassword ? "text" : "password"} name="password"
                    value={form.password} onChange={handleChange} onBlur={handleBlur}
                    placeholder="Min. 8 characters"
                    className={errors.password && touched.password ? "error" : ""} />
                  <button type="button" className="eye-btn" onClick={() => setShowPassword(v => !v)}>
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {form.password && (
                  <div className="strength-bar-wrap">
                    <div className="strength-bar">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`strength-seg ${i <= passwordStrength.score ? `strength-${passwordStrength.score}` : ""}`} />
                      ))}
                    </div>
                    <span className={`strength-label strength-label-${passwordStrength.score}`}>{passwordStrength.label}</span>
                  </div>
                )}
                {errors.password && touched.password && <span className="err-msg">{errors.password}</span>}
                <ul className="pw-hints">
                  <li className={form.password.length >= 8 ? "met" : ""}>At least 8 characters</li>
                  <li className={/[A-Z]/.test(form.password) ? "met" : ""}>One uppercase letter</li>
                  <li className={/[0-9]/.test(form.password) ? "met" : ""}>One number</li>
                </ul>
              </div>
              <div className="form-group">
                <label>Confirm Password <span className="req">*</span></label>
                <div className="input-with-icon">
                  <input type={showConfirm ? "text" : "password"} name="confirmPassword"
                    value={form.confirmPassword} onChange={handleChange} onBlur={handleBlur}
                    placeholder="Re-enter password"
                    className={errors.confirmPassword && touched.confirmPassword ? "error" : ""} />
                  <button type="button" className="eye-btn" onClick={() => setShowConfirm(v => !v)}>
                    {showConfirm ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.confirmPassword && touched.confirmPassword && <span className="err-msg">{errors.confirmPassword}</span>}
              </div>
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" name="agreeTerms" checked={form.agreeTerms}
                    onChange={handleChange} onBlur={handleBlur} />
                  <span>I agree to the <a href="/terms" target="_blank">Terms and Conditions</a> and <a href="/privacy" target="_blank">Privacy Policy</a>.</span>
                </label>
                {errors.agreeTerms && touched.agreeTerms && <span className="err-msg">{errors.agreeTerms}</span>}
              </div>
            </div>
          )}

          <div className="form-nav">
            {step > 1 && (
              <button type="button" className="btn-secondary" onClick={() => setStep(s => s - 1)}>← Back</button>
            )}
            {step < 3 ? (
              <button type="button" className="btn-primary" onClick={handleNext}>Continue →</button>
            ) : (
              <button type="submit" className="btn-primary btn-submit" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account ✓"}
              </button>
            )}
          </div>
        </form>

        <p className="login-link">
          Already have an account? <a href="/login">Sign in here</a>
        </p>
      </div>
    </div>
    </Layout>
  );
}
