import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectFeaturedProperties } from "../features/properties/propertiesSelectors";
import PropertyCard from "../components/common/PropertyCard";
import { CITIES, PROPERTY_TYPES } from "../data/properties";

export const Home = () => {
  const navigate = useNavigate();
  const featuredProperties = useSelector(selectFeaturedProperties);

  // Hero Search State
  const [listingType, setListingType] = useState("Sale");
  const [city, setCity] = useState("All Cities");
  const [propertyType, setPropertyType] = useState("All Types");
  const [maxBudget, setMaxBudget] = useState("");

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (listingType && listingType !== "All") params.set("listingType", listingType);
    if (city && city !== "All Cities") params.set("city", city);
    if (propertyType && propertyType !== "All Types") params.set("propertyType", propertyType);
    if (maxBudget) params.set("maxPrice", maxBudget);

    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          padding: "var(--space-16) 0",
          background: "linear-gradient(135deg, #0B1F33 0%, #155E8A 100%)",
          color: "#FFFFFF",
          overflow: "hidden"
        }}
        aria-label="Search Prime Properties"
      >
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: "780px", marginBottom: "var(--space-8)" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "0.3rem 0.8rem",
                borderRadius: "var(--radius-pill)",
                background: "rgba(255, 255, 255, 0.12)",
                backdropFilter: "blur(4px)",
                fontSize: "0.825rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "var(--space-4)",
                color: "var(--color-surface-muted)"
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Prime Metropolitan Enclaves</span>
            </div>

            <h1 style={{ color: "#FFFFFF", fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: "var(--space-4)" }}>
              Discover <span style={{ color: "var(--color-accent)" }}>where you belong</span>.
            </h1>

            <p style={{ color: "var(--color-surface-muted)", fontSize: "1.15rem", lineHeight: 1.6, maxWidth: "620px" }}>
              Curated architectural residences, signature penthouses, and bespoke residential plots across India's most coveted pin codes.
            </p>
          </div>

          {/* Hero Search Console */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "var(--radius-xl)",
              padding: "var(--space-6)",
              boxShadow: "var(--shadow-xl)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)"
            }}
          >
            {/* Transaction Mode Tabs */}
            <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-4)", borderBottom: "1px solid var(--color-border-subtle)", paddingBottom: "var(--space-3)" }}>
              <button
                type="button"
                onClick={() => setListingType("Sale")}
                className={`btn btn-sm ${listingType === "Sale" ? "btn-primary" : "btn-secondary"}`}
              >
                Buy Properties
              </button>
              <button
                type="button"
                onClick={() => setListingType("Rent")}
                className={`btn btn-sm ${listingType === "Rent" ? "btn-primary" : "btn-secondary"}`}
              >
                Rent / Lease
              </button>
              <Link to="/add-property" className="btn btn-sm btn-outline" style={{ marginLeft: "auto" }}>
                + List Your Property
              </Link>
            </div>

            {/* Search Input Controls */}
            <form onSubmit={handleHeroSearch} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)", alignItems: "flex-end" }}>
              <div className="form-field">
                <label htmlFor="hero-city" className="form-label">City / Enclave</label>
                <select
                  id="hero-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="form-select"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="hero-type" className="form-label">Property Typology</label>
                <select
                  id="hero-type"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="form-select"
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="hero-budget" className="form-label">Budget Limit (INR)</label>
                <input
                  id="hero-budget"
                  type="number"
                  placeholder="e.g. 150000000 (15 Cr)"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <button type="submit" className="btn btn-primary btn-lg w-100" style={{ height: "46px" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <span>Search Holdings</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="section" style={{ padding: "var(--space-10) 0 var(--space-6)" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-6)" }}>
            <div>
              <div className="section-eyebrow">Architectural Typologies</div>
              <h2 style={{ fontSize: "1.6rem" }}>Explore by Property Category</h2>
            </div>
            <Link to="/properties" className="btn btn-outline btn-sm">
              View All ({featuredProperties.length}+)
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--space-4)" }}>
            {[
              { type: "Apartment", label: "Luxury Apartments", count: "34 Available", icon: "🏢" },
              { type: "Villa", label: "Private Villas", count: "18 Available", icon: "🏡" },
              { type: "Penthouse", label: "Signature Penthouses", count: "12 Available", icon: "✨" },
              { type: "Plot", label: "Residential Plots", count: "15 Available", icon: "📐" },
              { type: "Commercial", label: "Corporate HQ Space", count: "8 Available", icon: "🏛️" }
            ].map((cat) => (
              <Link
                key={cat.type}
                to={`/properties?propertyType=${cat.type}`}
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-5)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-2)",
                  transition: "all var(--transition-fast)"
                }}
                className="category-card"
              >
                <div style={{ fontSize: "2rem" }}>{cat.icon}</div>
                <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--color-text)" }}>{cat.label}</div>
                <div style={{ fontSize: "0.825rem", color: "var(--color-text-muted)" }}>{cat.count}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Curated Portfolio</div>
            <h2 className="section-title">Featured Prime Holdings</h2>
            <p className="section-subtitle">
              Hand-selected residential towers, seafront penthouses, and private estates verified with title deed certificates.
            </p>
          </div>

          <div className="properties-grid">
            {featuredProperties.slice(0, 6).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "var(--space-10)" }}>
            <Link to="/properties" className="btn btn-primary btn-lg">
              Explore Full Property Catalog →
            </Link>
          </div>
        </div>
      </section>

      {/* Signature Development Editorial Banner */}
      <section style={{ background: "var(--color-surface-subtle)", padding: "var(--space-12) 0", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-10)", alignItems: "center" }}>
            <div>
              <span className="badge badge-featured" style={{ marginBottom: "var(--space-3)" }}>Signature Corridor</span>
              <h2 style={{ fontSize: "2rem", marginBottom: "var(--space-3)", color: "var(--color-primary)" }}>
                DLF Camellias & Mumbai Coastal Residences
              </h2>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: "var(--space-6)" }}>
                We advise institutional investors and high-net-worth families on acquiring rare off-market inventory, golf-course view penthouses, and heritage coastal properties. All listings carry certified RERA compliance and cadastral boundary surveys.
              </p>
              <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                <Link to="/properties?city=Gurugram" className="btn btn-primary btn-sm">
                  Explore Golf Course Road
                </Link>
                <Link to="/enquiry" className="btn btn-outline btn-sm">
                  Request Private Prospectus
                </Link>
              </div>
            </div>

            <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-lg)" }}>
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
                alt="Signature Architectural Villa"
                style={{ width: "100%", height: "340px", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Habitex Workflow */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto var(--space-10)" }}>
            <div className="section-eyebrow">Seamless Transaction Journey</div>
            <h2 className="section-title">The Habitex Workflow</h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>
              A rigorous, transparent process engineered to protect capital and eliminate intermediaries.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-6)" }}>
            {[
              {
                step: "01",
                title: "Curated Discovery",
                desc: "Filter properties by carpet area ratio, clear freehold titles, and Vastu orientations without noise."
              },
              {
                step: "02",
                title: "Accompanied Inspection",
                desc: "Schedule private viewings coordinated directly with certified RERA associates and legal dockets."
              },
              {
                step: "03",
                title: "Direct Advisory",
                desc: "Close transactions securely with title deed verification, transparent escrow terms, and family office privacy."
              }
            ].map((st) => (
              <div
                key={st.step}
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-8)",
                  boxShadow: "var(--shadow-xs)"
                }}
              >
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-accent)", marginBottom: "var(--space-2)" }}>
                  {st.step}
                </div>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "var(--space-2)", color: "var(--color-primary)" }}>
                  {st.title}
                </h3>
                <p style={{ fontSize: "0.92rem", color: "var(--color-text-secondary)" }}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Counters */}
      <section style={{ background: "var(--color-primary)", color: "#FFFFFF", padding: "var(--space-12) 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-8)", textAlign: "center" }}>
            <div>
              <div style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--color-accent)" }}>₹4,850+ Cr</div>
              <div style={{ color: "var(--color-surface-muted)", fontSize: "0.9rem", marginTop: "var(--space-1)" }}>Total Portfolio Listed</div>
            </div>
            <div>
              <div style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--color-accent)" }}>1,200+</div>
              <div style={{ color: "var(--color-surface-muted)", fontSize: "0.9rem", marginTop: "var(--space-1)" }}>Verified RERA Title Deeds</div>
            </div>
            <div>
              <div style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--color-accent)" }}>7</div>
              <div style={{ color: "var(--color-surface-muted)", fontSize: "0.9rem", marginTop: "var(--space-1)" }}>Metropolitan Hubs</div>
            </div>
            <div>
              <div style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--color-accent)" }}>99.4%</div>
              <div style={{ color: "var(--color-surface-muted)", fontSize: "0.9rem", marginTop: "var(--space-1)" }}>Inspection Satisfaction</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
