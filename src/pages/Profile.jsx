import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";

export const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "Yatharth",
    email: user?.email || "yatharth@habitex.in",
    phone: user?.phone || "9810123456",
    role: user?.role || "Seller",
    company: user?.company || "Yatharth Capital Real Estate LLP"
  });

  const [notifications, setNotifications] = useState({
    smsAlerts: true,
    marketBriefing: true,
    compsNotice: true
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleToggleNotice = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    showToast("Profile credentials & preferences saved.", "success");
  };

  const handleLogout = () => {
    logout();
    showToast("Signed out successfully.", "info");
    navigate("/login");
  };

  return (
    <div className="container container-form form-page-layout">
      <div className="form-page-header">
        <h1 className="form-page-title">Profile Settings & Credentials</h1>
        <p className="form-page-subtitle">
          Manage your verified member identity, communication preferences, and security credentials.
        </p>
      </div>

      <div className="form-wizard-card">
        <form onSubmit={handleSubmit}>
          <div className="section-pane-header">
            <h2 className="section-pane-title">Personal & Professional Identity</h2>
            <p className="section-pane-desc">This information is displayed on your published listings and enquiry responses.</p>
          </div>

          <div className="form-grid-2">
            <div className="form-field">
              <label htmlFor="prof-name" className="form-label">Full Name</label>
              <input
                id="prof-name"
                name="name"
                type="text"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="prof-email" className="form-label">Email Address</label>
              <input
                id="prof-email"
                name="email"
                type="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-grid-2" style={{ marginTop: "var(--space-4)" }}>
            <div className="form-field">
              <label htmlFor="prof-phone" className="form-label">Contact Mobile</label>
              <input
                id="prof-phone"
                name="phone"
                type="tel"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="prof-role" className="form-label">Account Category</label>
              <select
                id="prof-role"
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Seller">Property Owner / Seller</option>
                <option value="Buyer">Buyer / Private Investor</option>
                <option value="Agent">Certified RERA Advisor</option>
              </select>
            </div>
          </div>

          <div className="form-field" style={{ marginTop: "var(--space-4)" }}>
            <label htmlFor="prof-company" className="form-label">Affiliated Firm / Family Office</label>
            <input
              id="prof-company"
              name="company"
              type="text"
              className="form-input"
              value={formData.company}
              onChange={handleChange}
            />
          </div>

          {/* Preferences */}
          <div style={{ marginTop: "var(--space-6)", paddingTop: "var(--space-5)", borderTop: "1px solid var(--color-border-subtle)" }}>
            <h3 style={{ fontSize: "1.05rem", marginBottom: "var(--space-3)", color: "var(--color-text)" }}>
              Advisory Communication Preferences
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "0.88rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={notifications.smsAlerts}
                  onChange={() => handleToggleNotice("smsAlerts")}
                />
                <span>Receive instant SMS & WhatsApp notifications when a buyer registers an enquiry</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "0.88rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={notifications.marketBriefing}
                  onChange={() => handleToggleNotice("marketBriefing")}
                />
                <span>Subscribe to the fortnightly Habitex Prime Market Intelligence briefing</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "0.88rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={notifications.compsNotice}
                  onChange={() => handleToggleNotice("compsNotice")}
                />
                <span>Notify me when comparable properties in my neighborhood are listed</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ marginTop: "var(--space-8)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleLogout}
              style={{ color: "var(--color-error)", borderColor: "var(--color-error)" }}
            >
              Sign Out
            </button>
            <button type="submit" className="btn btn-primary">
              Save Profile Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
