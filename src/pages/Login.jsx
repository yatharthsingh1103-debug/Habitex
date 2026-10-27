import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import logoSvg from "../assets/icons/logo.svg";

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, defaultUsers } = useAuth();
  const { showToast } = useUI();

  const [email, setEmail] = useState("yatharth@habitex.in");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("Seller");
  const [rememberMe, setRememberMe] = useState(true);

  const from = location.state?.from?.pathname || "/dashboard";

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please enter both email and password.", "error");
      return;
    }

    const res = login(email, password, role);
    if (res.success) {
      showToast(`Welcome back, ${res.user.name}!`, "success");
      navigate(from, { replace: true });
    }
  };

  const handleQuickDemoLogin = (user) => {
    setEmail(user.email);
    setPassword("password123");
    setRole(user.role);
    login(user.email, "password123", user.role, user.name);
    showToast(`Signed in as ${user.name} (${user.role})`, "success");
    navigate(from, { replace: true });
  };

  return (
    <div style={{ minHeight: "calc(100vh - var(--header-height) - 100px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-8) var(--space-4)" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          maxWidth: "920px",
          width: "100%",
          background: "var(--color-surface)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-xl)",
          overflow: "hidden"
        }}
      >
        {/* Left Visual Column */}
        <div
          style={{
            background: "linear-gradient(135deg, #0B1F33 0%, #155E8A 100%)",
            color: "#FFFFFF",
            padding: "var(--space-10) var(--space-8)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-8)" }}>
              <div className="brand-symbol">
                <img src={logoSvg} alt="Habitex Logo" width="38" height="38" />
              </div>
              <div>
                <div className="brand-name" style={{ color: "#FFFFFF" }}>HABITEX</div>
                <div className="brand-tagline" style={{ color: "var(--color-accent)" }}>discover where you belong</div>
              </div>
            </div>

            <blockquote style={{ fontSize: "1.15rem", fontStyle: "italic", lineHeight: 1.6, marginBottom: "var(--space-3)", color: "var(--color-surface-subtle)" }}>
              “Architecture is the learned game, correct and magnificent, of forms assembled in the light.”
            </blockquote>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-accent)" }}>— Le Corbusier</div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-surface-muted)" }}>Master Urban Planner & Architectural Pioneer</div>
          </div>

          <div style={{ marginTop: "var(--space-8)", paddingTop: "var(--space-4)", borderTop: "1px solid rgba(255, 255, 255, 0.12)", fontSize: "0.8rem", color: "var(--color-surface-muted)" }}>
            RERA Certified Advisory Network • Cadastral Verification
          </div>
        </div>

        {/* Right Form Column */}
        <div style={{ padding: "var(--space-10) var(--space-8)" }}>
          <div style={{ marginBottom: "var(--space-6)" }}>
            <h2 style={{ fontSize: "1.8rem", color: "var(--color-primary)", marginBottom: "var(--space-1)" }}>
              Member Sign In
            </h2>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.92rem" }}>
              Access your saved portfolio dockets and active property listings.
            </p>
          </div>

          {/* Quick Demo Logins Bar */}
          <div style={{ marginBottom: "var(--space-6)", padding: "var(--space-3)", background: "var(--color-surface-subtle)", borderRadius: "var(--radius-md)" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", marginBottom: "var(--space-2)" }}>
              1-Click Demo Credentials
            </div>
            <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
              {defaultUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickDemoLogin(u)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: "0.78rem", padding: "0.3rem 0.6rem" }}
                >
                  {u.name} ({u.role})
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit}>
            <div className="form-field" style={{ marginBottom: "var(--space-4)" }}>
              <label htmlFor="login-email" className="form-label">Email Address</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
                placeholder="yatharth@habitex.in"
              />
            </div>

            <div className="form-field" style={{ marginBottom: "var(--space-4)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label htmlFor="login-password" className="form-label">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  style={{ fontSize: "0.775rem", color: "var(--color-primary-brand)", fontWeight: 600, cursor: "pointer" }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
                placeholder="••••••••"
              />
            </div>

            <div className="form-field" style={{ marginBottom: "var(--space-5)" }}>
              <label htmlFor="login-role" className="form-label">Access Role</label>
              <select
                id="login-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-select"
              >
                <option value="Seller">Property Owner / Seller</option>
                <option value="Buyer">Buyer / Private Investor</option>
                <option value="Agent">Certified RERA Advisor</option>
              </select>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)", fontSize: "0.85rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember this device</span>
              </label>
              <span
                style={{ color: "var(--color-primary-brand)", cursor: "pointer", fontWeight: 600 }}
                onClick={() => showToast("Password reset link sent to registered email.", "info")}
              >
                Forgot Password?
              </span>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-100">
              Sign In to Habitex
            </button>
          </form>

          <div style={{ marginTop: "var(--space-6)", textAlign: "center", fontSize: "0.88rem", color: "var(--color-text-secondary)" }}>
            Don't have an authenticated account?{" "}
            <Link to="/register" style={{ color: "var(--color-primary-brand)", fontWeight: 700 }}>
              Register Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
