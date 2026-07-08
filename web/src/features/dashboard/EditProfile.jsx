import { useState, useCallback } from "react";
import { authAPI } from "../../lib/api";
import pfpImg from "../../assets/pfp.png";
import residentImg from "../../assets/resident.png";
import "./EditProfile.css";

export default function EditProfile({ user, onUpdate, onCancel }) {
  const [formData, setFormData] = useState({ ...user });
  const [previews, setPreviews] = useState({
    pfp: null,
    idImage: null
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert("Please upload JPG or PNG files only.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = Array.from(new Uint8Array(byteNumbers));

      if (type === 'pfp') {
        setFormData(prev => ({ ...prev, profilePicture: byteArray }));
        setPreviews(prev => ({ ...prev, pfp: reader.result }));
      } else {
        setFormData(prev => ({ ...prev, residentIdImage: byteArray }));
        setPreviews(prev => ({ ...prev, idImage: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await authAPI.updateProfile(formData.id, formData);
      setFormData(res.data);
      setMessage("Profile updated successfully!");
      setTimeout(() => {
        onUpdate();
      }, 1500);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setMessage("Error updating profile. Please try again.");
      setSaving(false);
    }
  };

  const getImageUrl = (type) => {
    if (type === 'pfp') {
      if (previews.pfp) return previews.pfp;
      if (formData.profilePicture) return `data:image/jpeg;base64,${formData.profilePicture}`;
      return pfpImg;
    } else {
      if (previews.idImage) return previews.idImage;
      if (formData.residentIdImage) return `data:image/jpeg;base64,${formData.residentIdImage}`;
      return residentImg;
    }
  };

  return (
    <div className="edit-modal-body">
      <header className="edit-header-modal">
        <h1>Edit Personal Information</h1>
        <p>Update your profile details and documents</p>
      </header>

      {message && <div className={`form-message ${message.includes("Error") ? "error" : "success"}`}>{message}</div>}

      <form className="edit-form-modal" onSubmit={handleSubmit}>
        <div className="form-grid-modal">
          {/* Profile Picture Section */}
          <div className="edit-section-modal full-width">
            <h3 className="section-label">PROFILE PICTURE</h3>
            <div className="pfp-edit-row">
              <div className="pfp-preview-large">
                <img src={getImageUrl('pfp')} alt="Profile" />
              </div>
              <div className="pfp-actions">
                <p className="pfp-hint">Upload a JPG or PNG (max 5MB)</p>
                <label className="btn-upload-label">
                  <input type="file" accept="image/jpeg,image/png" onChange={(e) => handleFileUpload(e, 'pfp')} hidden />
                  Change Photo
                </label>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="edit-section-modal">
            <h3 className="section-label">BASIC INFORMATION</h3>
            <div className="input-group-modal">
              <label>First Name</label>
              <input name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="input-group-modal">
              <label>Last Name</label>
              <input name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
            <div className="input-group-modal">
              <label>Username</label>
              <input name="username" value={formData.username} onChange={handleChange} required />
            </div>
          </div>

          <div className="edit-section-modal">
            <h3 className="section-label">CONTACT INFO</h3>
            <div className="input-group-modal">
              <label>Email Address</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="input-group-modal">
              <label>Phone Number</label>
              <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
            </div>
            <div className="input-group-modal">
              <label>Civil Status</label>
              <select name="civilStatus" value={formData.civilStatus} onChange={handleChange}>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Separated">Separated</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="edit-section-modal full-width">
            <h3 className="section-label">ADDRESS DETAILS</h3>
            <div className="address-grid-modal">
              <div className="input-group-modal">
                <label>Street Address</label>
                <input name="street" value={formData.street} onChange={handleChange} required />
              </div>
              <div className="input-group-modal">
                <label>Purok</label>
                <input name="purok" value={formData.purok} onChange={handleChange} required />
              </div>
            </div>
          </div>

          {/* Resident ID Section */}
          <div className="edit-section-modal full-width">
            <h3 className="section-label">RESIDENT ID</h3>
            <div className="id-edit-row">
              <div className="id-preview-box-modal">
                <img src={getImageUrl('id')} alt="Resident ID" />
              </div>
              <div className="id-actions">
                <p className="pfp-hint">Upload a clear copy of your government ID (JPG/PNG, max 5MB)</p>
                <label className="btn-upload-label">
                  <input type="file" accept="image/jpeg,image/png" onChange={(e) => handleFileUpload(e, 'id')} hidden />
                  Update Resident ID
                </label>
              </div>
            </div>
          </div>
        </div>

        <footer className="form-footer-modal">
          <button type="button" className="btn-cancel-modal" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn-save-modal" disabled={saving}>
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </footer>
      </form>
    </div>
  );
}
