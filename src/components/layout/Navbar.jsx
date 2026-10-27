import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectFavoriteCount } from "../../features/favorites/favoritesSlice";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import logoSvg from "../../assets/icons/logo.svg";

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const savedCount = useSelector(selectFavoriteCount);
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileOpen(false);
    showToast("Signed out successfully.", "info");
    navigate("/login");
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className="site-header" id="main-site-header">
        <div className="container navbar-inner">
          {/* Brand Logo */}
          <Link to="/" className="brand" aria-label="Habitex Home">
            <div className="brand-symbol">
              <img src={logoSvg} alt="Habitex Logo" width="38" height="38" />
            </div>
            <div className="brand-text">
              <span className="brand-name">HABITEX</span>
              <span className="brand-tagline">discover where you belong</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-desktop" aria-label="Main Navigation">
            <ul className="nav-menu">
              <li className="nav-item">
                <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/properties?listingType=Sale" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  Buy
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/properties?listingType=Rent" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  Rent
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/add-property" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  Sell
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/enquiry" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  Enquiries
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/saved-properties" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  Saved
                  <span className="nav-badge-count">{savedCount}</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  Dashboard
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Nav Actions */}
          <div className="nav-actions">
            <Link to="/add-property" className="btn btn-primary btn-sm">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>List Property</span>
            </Link>

            {/* Auth Dropdown */}
            {isAuthenticated ? (
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="user-profile-badge"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  aria-expanded={userMenuOpen}
                  aria-label="User account menu"
                >
                  <div className="user-avatar-circle">{user?.avatar || "Y"}</div>
                  <span className="user-display-name">{user?.name || "Yatharth"}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      boxShadow: "var(--shadow-lg)",
                      padding: "var(--space-2)",
                      minWidth: "180px",
                      zIndex: 100
                    }}
                  >
                    <div style={{ padding: "var(--space-2) var(--space-3)", borderBottom: "1px solid var(--color-border-subtle)" }}>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>{user?.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{user?.role}</div>
                    </div>
                    <Link
                      to="/profile"
                      className="nav-link"
                      style={{ width: "100%", padding: "0.5rem 0.75rem", fontSize: "0.85rem" }}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <Link
                      to="/my-listings"
                      className="nav-link"
                      style={{ width: "100%", padding: "0.5rem 0.75rem", fontSize: "0.85rem" }}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Listings
                    </Link>
                    <Link
                      to="/performance"
                      className="nav-link"
                      style={{ width: "100%", padding: "0.5rem 0.75rem", fontSize: "0.85rem" }}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Benchmarking Lab
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "0.5rem 0.75rem",
                        fontSize: "0.85rem",
                        color: "var(--color-error)",
                        fontWeight: 600,
                        cursor: "pointer",
                        borderRadius: "var(--radius-sm)"
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="nav-auth-wrap">
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-outline btn-sm">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              type="button"
              className="mobile-toggle-btn"
              onClick={() => setMobileOpen(true)}
              aria-label="Open mobile navigation menu"
              aria-expanded={mobileOpen}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`mobile-nav-backdrop ${mobileOpen ? "open" : ""}`}
        onClick={closeMobile}
      />
      <div className={`mobile-nav-drawer ${mobileOpen ? "open" : ""}`}>
        <div className="mobile-drawer-header">
          <Link to="/" className="brand" onClick={closeMobile}>
            <div className="brand-symbol">
              <img src={logoSvg} alt="Habitex Logo" width="32" height="32" />
            </div>
            <span className="brand-name">HABITEX</span>
          </Link>
          <button type="button" onClick={closeMobile} aria-label="Close mobile menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="mobile-nav-list">
          <NavLink to="/" end className="mobile-nav-link" onClick={closeMobile}>
            Home
          </NavLink>
          <NavLink to="/properties?listingType=Sale" className="mobile-nav-link" onClick={closeMobile}>
            Buy Properties
          </NavLink>
          <NavLink to="/properties?listingType=Rent" className="mobile-nav-link" onClick={closeMobile}>
            Rent Properties
          </NavLink>
          <NavLink to="/add-property" className="mobile-nav-link" onClick={closeMobile}>
            List Property
          </NavLink>
          <NavLink to="/enquiry" className="mobile-nav-link" onClick={closeMobile}>
            Enquiries
          </NavLink>
          <NavLink to="/saved-properties" className="mobile-nav-link" onClick={closeMobile}>
            <span>Saved Portfolio</span>
            <span className="nav-badge-count">{savedCount}</span>
          </NavLink>
          <NavLink to="/dashboard" className="mobile-nav-link" onClick={closeMobile}>
            Dashboard
          </NavLink>
          <NavLink to="/performance" className="mobile-nav-link" onClick={closeMobile}>
            Performance Lab
          </NavLink>

          <div style={{ marginTop: "auto", paddingTop: "var(--space-4)", borderTop: "1px solid var(--color-border)" }}>
            {isAuthenticated ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                <div style={{ fontSize: "0.9rem", fontWeight: 700 }}>{user?.name}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{user?.email}</div>
                <Link to="/profile" className="btn btn-secondary btn-sm" onClick={closeMobile} style={{ marginTop: "var(--space-2)" }}>
                  Profile Settings
                </Link>
                <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout} style={{ color: "var(--color-error)", borderColor: "var(--color-error)" }}>
                  Sign Out
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                <Link to="/login" className="btn btn-primary btn-sm" onClick={closeMobile}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-secondary btn-sm" onClick={closeMobile}>
                  Register Account
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
