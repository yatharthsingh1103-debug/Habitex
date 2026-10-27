import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUI } from "../../context/UIContext";
import logoSvg from "../../assets/icons/logo.svg";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const { showToast } = useUI();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      showToast("Please enter a valid email address.", "error");
      return;
    }
    showToast("Subscribed to Habitex Market Intelligence briefings.", "success");
    setEmail("");
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <Link to="/" className="footer-brand" aria-label="Habitex Home">
              <div className="brand-symbol">
                <img src={logoSvg} alt="Habitex Logo" width="38" height="38" />
              </div>
              <span className="footer-brand-title">HABITEX</span>
            </Link>
            <p className="footer-brand-desc">
              A distinguished architectural marketplace connecting discerning buyers, institutional investors, and premier sellers across India's prime metropolitan enclaves. Discover where you belong.
            </p>
            <div className="footer-contact-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>+91 (0124) 492-8000</span>
            </div>
            <div className="footer-contact-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>enquiries@habitex.in</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-col-title">Properties</h4>
            <ul className="footer-links">
              <li><Link to="/properties?propertyType=Apartment" className="footer-link">Apartments</Link></li>
              <li><Link to="/properties?propertyType=Villa" className="footer-link">Private Villas</Link></li>
              <li><Link to="/properties?propertyType=Penthouse" className="footer-link">Penthouses</Link></li>
              <li><Link to="/properties?propertyType=Plot" className="footer-link">Residential Plots</Link></li>
              <li><Link to="/properties?propertyType=Commercial" className="footer-link">Commercial Space</Link></li>
              <li><Link to="/properties?listingType=Rent" className="footer-link">Executive Rentals</Link></li>
            </ul>
          </div>

          {/* Nav / Services */}
          <div>
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Marketplace Home</Link></li>
              <li><Link to="/add-property" className="footer-link">List Your Holding</Link></li>
              <li><Link to="/saved-properties" className="footer-link">Saved Portfolio</Link></li>
              <li><Link to="/enquiry" className="footer-link">Schedule Site Visit</Link></li>
              <li><Link to="/dashboard" className="footer-link">Advisory Dashboard</Link></li>
              <li><Link to="/performance" className="footer-link">Form Benchmarking Lab</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="footer-col-title">Market Intelligence</h4>
            <p style={{ color: "var(--color-surface-muted)", fontSize: "0.88rem", marginBottom: "var(--space-3)" }}>
              Receive our bi-weekly confidential brief on off-market penthouses and land parcel acquisitions.
            </p>
            <form onSubmit={handleSubscribe} className="footer-newsletter-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="advisor@familyoffice.com"
                className="footer-newsletter-input"
                aria-label="Email address for market intelligence"
              />
              <button type="submit" className="btn btn-accent btn-sm">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} Habitex Real Estate Advisors LLP. All rights reserved. RERA Registered Advisory.
          </div>
          <div style={{ display: "flex", gap: "var(--space-4)" }}>
            <span style={{ cursor: "pointer" }} onClick={() => showToast("Privacy safeguards active.", "info")}>Privacy</span>
            <span>•</span>
            <span style={{ cursor: "pointer" }} onClick={() => showToast("Cadastral and RERA compliant terms.", "info")}>Terms</span>
            <span>•</span>
            <span style={{ cursor: "pointer" }} onClick={() => showToast("Direct advisory hotline active.", "info")}>Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
