import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import logoSvg from "../assets/icons/logo.svg";

export const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useUI();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Buyer",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please complete all required fields.");
      showToast("Please fill in all mandatory fields.", "error");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      showToast("Passwords do not match.", "error");
      return;
    }

    const res = login(formData.email, formData.password, formData.role, formData.name);
    if (res.success) {
      showToast(`Welcome to Habitex, ${formData.name}! Your account has been registered.`, "success");
      navigate("/dashboard");
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - var(--header-height) - 100px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-8) var(--space-4)" }}>
      <div
        style={{
          maxWidth: "540px",
          width: "100%",
          background: "var(--color-surface)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-xl)",
          padding: "var(--space-10) var(--space-8)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
            <div className="brand-symbol">
              <img src={logoSvg} alt="Habitex Logo" width="34" height="34" />
            </div>
            <span className="brand-name">HABITEX</span>
          </div>
          <h1 style={{ fontSize: "1.8rem", color: "var(--color-primary)", marginBottom: "var(--space-1)" }}>
            Create Your Account
          </h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.92rem" }}>
            Join India's premier verified architectural property network.
          </p>
        </div>

        {error && (
          <div style={{ padding: "var(--space-3)", background: "#FEF2F2", border: "1px solid #F87171", borderRadius: "var(--radius-md)", color: "#B91C1C", fontSize: "0.85rem", marginBottom: "var(--space-4)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-field" style={{ marginBottom: "var(--space-4)" }}>
            <label htmlFor="reg-name" className="form-label">Full Legal Name <span className="required-mark">*</span></label>
            <input
              id="reg-name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. Yatharth Singh"
            />
          </div>

          <div className="form-grid-2" style={{ marginBottom: "var(--space-4)" }}>
            <div className="form-field">
              <label htmlFor="reg-email" className="form-label">Email Address <span className="required-mark">*</span></label>
              <input
                id="reg-email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="name@domain.com"
              />
            </div>

            <div className="form-field">
              <label htmlFor="reg-phone" className="form-label">Mobile Number</label>
              <input
                id="reg-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                placeholder="9810123456"
              />
            </div>
          </div>

          <div className="form-field" style={{ marginBottom: "var(--space-4)" }}>
            <label htmlFor="reg-role" className="form-label">Account Category <span className="required-mark">*</span></label>
            <select
              id="reg-role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Buyer">Buyer / Private Family Office</option>
              <option value="Seller">Property Owner / Institutional Seller</option>
              <option value="Agent">Certified RERA Real Estate Advisor</option>
            </select>
          </div>

          <div className="form-grid-2" style={{ marginBottom: "var(--space-6)" }}>
            <div className="form-field">
              <label htmlFor="reg-pass" className="form-label">Password <span className="required-mark">*</span></label>
              <input
                id="reg-pass"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Min 6 characters"
              />
            </div>

            <div className="form-field">
              <label htmlFor="reg-conf" className="form-label">Confirm Password <span className="required-mark">*</span></label>
              <input
                id="reg-conf"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="Re-enter password"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-100">
            Complete Registration & Access Dashboard
          </button>
        </form>

        <div style={{ marginTop: "var(--space-6)", textAlign: "center", fontSize: "0.88rem", color: "var(--color-text-secondary)" }}>
          Already a registered member?{" "}
          <Link to="/login" style={{ color: "var(--color-primary-brand)", fontWeight: 700 }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
