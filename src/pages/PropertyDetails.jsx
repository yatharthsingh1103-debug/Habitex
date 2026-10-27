import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectPropertyById } from "../features/properties/propertiesSelectors";
import { toggleFavorite, selectIsFavorite } from "../features/favorites/favoritesSlice";
import { useUI } from "../../src/context/UIContext";
import EmptyState from "../components/common/EmptyState";

export const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast, openModal } = useUI();

  const property = useSelector((state) => selectPropertyById(state, id));
  const isFav = useSelector((state) => selectIsFavorite(state, id));

  // Gallery Active Photo & Lightbox Modal
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!property) {
    return (
      <div className="container" style={{ padding: "var(--space-16) 0" }}>
        <EmptyState
          title="Holding Not Found"
          description={`The property dossier with reference "${id}" does not exist in the marketplace catalog.`}
          actionText="Browse Available Properties"
          actionLink="/properties"
        />
      </div>
    );
  }

  const gallery = property.gallery && property.gallery.length > 0
    ? property.gallery
    : [property.imageUrl];

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(property.id));
    if (!isFav) {
      showToast(`Added "${property.title}" to saved portfolio.`, "success");
    } else {
      showToast("Removed from saved portfolio.", "info");
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Property link copied to clipboard.", "success");
    } else {
      showToast("URL: " + window.location.href, "info");
    }
  };

  const handleOpenEnquiryModal = () => {
    openModal({
      title: `Schedule Viewing — ${property.title}`,
      content: (
        <div>
          <p style={{ marginBottom: "var(--space-4)", fontSize: "0.92rem", color: "var(--color-text-secondary)" }}>
            Request an accompanied private inspection directly with <strong>{property.owner?.name}</strong>.
          </p>
          <div style={{ background: "var(--color-surface-subtle)", padding: "var(--space-4)", borderRadius: "var(--radius-md)", marginBottom: "var(--space-4)" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>RERA License: {property.owner?.rera}</div>
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>Direct Mobile: {property.owner?.phone}</div>
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>Advisory: {property.owner?.email}</div>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
            Click confirm to navigate to the formal Cadastral Inspection dossier booking page.
          </p>
        </div>
      ),
      confirmText: "Proceed to Inspection Form",
      onConfirm: () => {
        navigate(`/enquiry?propertyId=${property.id}`);
      }
    });
  };

  return (
    <div className="container" style={{ padding: "var(--space-6) var(--space-6) var(--space-16)" }}>
      {/* Breadcrumb Navigation */}
      <nav style={{ display: "flex", gap: "var(--space-2)", fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "var(--space-4)" }} aria-label="Breadcrumb">
        <Link to="/" style={{ color: "var(--color-primary-brand)" }}>Home</Link>
        <span>/</span>
        <Link to="/properties" style={{ color: "var(--color-primary-brand)" }}>Properties</Link>
        <span>/</span>
        <span style={{ color: "var(--color-text)", fontWeight: 600 }}>{property.locality}</span>
      </nav>

      {/* Title & Action Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
        <div>
          <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-2)", alignItems: "center" }}>
            <span className={`badge ${property.listingType === "Rent" ? "badge-rent" : "badge-sale"}`}>
              {property.listingType === "Rent" ? "For Rent" : "For Sale"}
            </span>
            <span className="badge badge-featured">{property.propertyType}</span>
            {property.isVerified && <span className="badge badge-verified">RERA Certified Title</span>}
          </div>

          <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.3rem)", color: "var(--color-primary)", marginBottom: "var(--space-2)" }}>
            {property.title}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", color: "var(--color-text-secondary)", fontSize: "0.95rem" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{property.address || property.locality}, {property.city} — {property.pincode}</span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-primary-brand)", letterSpacing: "-0.02em" }}>
            {property.formattedPrice}
          </div>
          <div style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", marginBottom: "var(--space-3)" }}>
            {property.pricePerSqFt}
          </div>
          <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={handleToggleFavorite}
              className={`btn btn-sm ${isFav ? "btn-accent" : "btn-secondary"}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>{isFav ? "Saved" : "Save Property"}</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="btn btn-secondary btn-sm"
              title="Share Link"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Photo Mosaic Gallery */}
      <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr", gap: "var(--space-4)", marginBottom: "var(--space-10)" }}>
        {/* Main Photo Display */}
        <div
          style={{
            position: "relative",
            aspectRatio: "16 / 10",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            cursor: "pointer",
            boxShadow: "var(--shadow-md)"
          }}
          onClick={() => setLightboxOpen(true)}
          title="Click for fullscreen photo viewer"
        >
          <img
            src={gallery[activePhotoIndex] || property.imageUrl}
            alt={property.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "var(--space-4)",
              right: "var(--space-4)",
              background: "rgba(11, 31, 51, 0.8)",
              color: "#FFFFFF",
              padding: "0.35rem 0.75rem",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.8rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "var(--space-1)"
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
            <span>View Fullscreen Gallery ({gallery.length})</span>
          </div>
        </div>

        {/* Thumbnails Sidebar */}
        <div style={{ display: "grid", gridTemplateRows: `repeat(${Math.min(gallery.length, 3)}, 1fr)`, gap: "var(--space-3)" }}>
          {gallery.slice(0, 3).map((thumb, idx) => (
            <div
              key={idx}
              onClick={() => setActivePhotoIndex(idx)}
              style={{
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                cursor: "pointer",
                border: activePhotoIndex === idx ? "3px solid var(--color-primary-brand)" : "1px solid var(--color-border)",
                boxShadow: "var(--shadow-xs)"
              }}
            >
              <img
                src={thumb}
                alt={`View ${idx + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Layout: Dossier vs Advisor Sidebar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "var(--space-10)", alignItems: "start" }}>
        {/* Left Column: Specifications, Amenities & Description */}
        <div>
          {/* Spatial Key Specifications */}
          <section style={{ background: "var(--color-surface)", padding: "var(--space-6)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", marginBottom: "var(--space-8)" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "var(--space-4)", color: "var(--color-primary)" }}>
              Key Spatial Specifications
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--space-4)" }}>
              {property.bedrooms > 0 && (
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Configuration</div>
                  <div style={{ fontSize: "1.05rem", fontWeight: 700 }}>{property.bedrooms} BHK Suites</div>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Bathrooms</div>
                  <div style={{ fontSize: "1.05rem", fontWeight: 700 }}>{property.bathrooms} Bathrooms</div>
                </div>
              )}
              {property.carpetArea > 0 && (
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Carpet Area</div>
                  <div style={{ fontSize: "1.05rem", fontWeight: 700 }}>{property.carpetArea.toLocaleString("en-IN")} sq.ft</div>
                </div>
              )}
              {property.superBuiltUpArea > 0 && (
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Super Built-Up</div>
                  <div style={{ fontSize: "1.05rem", fontWeight: 700 }}>{property.superBuiltUpArea.toLocaleString("en-IN")} sq.ft</div>
                </div>
              )}
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Floor Elevation</div>
                <div style={{ fontSize: "1.05rem", fontWeight: 700 }}>Floor {property.floorNo} of {property.totalFloors}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Facing / Orientation</div>
                <div style={{ fontSize: "1.05rem", fontWeight: 700 }}>{property.facing}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Furnishing Status</div>
                <div style={{ fontSize: "1.05rem", fontWeight: 700 }}>{property.furnishing}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Maintenance Charges</div>
                <div style={{ fontSize: "1.05rem", fontWeight: 700 }}>{property.maintenance}</div>
              </div>
            </div>
          </section>

          {/* Architectural Description */}
          <section style={{ background: "var(--color-surface)", padding: "var(--space-6)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", marginBottom: "var(--space-8)" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "var(--space-4)", color: "var(--color-primary)" }}>
              Architectural Overview & Layout
            </h2>
            <p style={{ color: "var(--color-text-secondary)", lineHeight: 1.8, fontSize: "1rem" }}>
              {property.description}
            </p>
          </section>

          {/* Curated Amenities Checklist */}
          {property.amenities && property.amenities.length > 0 && (
            <section style={{ background: "var(--color-surface)", padding: "var(--space-6)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", marginBottom: "var(--space-8)" }}>
              <h2 style={{ fontSize: "1.25rem", marginBottom: "var(--space-4)", color: "var(--color-primary)" }}>
                Curated Amenities & Facilities
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "var(--space-3)" }}>
                {property.amenities.map((amenity) => (
                  <div key={amenity} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "0.9rem", color: "var(--color-text)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Legal Safeguard Certificate */}
          <div
            style={{
              background: "var(--color-surface-subtle)",
              borderLeft: "4px solid var(--color-accent)",
              padding: "var(--space-5)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "flex-start",
              gap: "var(--space-3)"
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" style={{ flexShrink: 0 }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div>
              <strong style={{ color: "var(--color-primary)" }}>Habitex Legal Safeguard:</strong> This listing possesses certified cadastral survey documents, encumbrance certificates, and verified RERA approvals.
            </div>
          </div>
        </div>

        {/* Right Sticky Sidebar: Certified Advisor Card */}
        <aside
          style={{
            position: "sticky",
            top: "calc(var(--header-height) + var(--space-4))",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-6)",
            boxShadow: "var(--shadow-md)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-4)", paddingBottom: "var(--space-4)", borderBottom: "1px solid var(--color-border-subtle)" }}>
            <img
              src={property.owner?.photo}
              alt={property.owner?.name}
              style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover" }}
            />
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-primary)" }}>
                {property.owner?.name}
              </h3>
              <div style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>
                {property.owner?.role}
              </div>
              <div style={{ fontSize: "0.725rem", color: "var(--color-accent)", fontWeight: 600 }}>
                {property.owner?.rera}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "var(--space-6)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "0.88rem", marginBottom: "var(--space-2)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>{property.owner?.phone}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "0.88rem" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>{property.owner?.email}</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <button
              type="button"
              onClick={handleOpenEnquiryModal}
              className="btn btn-primary w-100"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Schedule Site Inspection</span>
            </button>

            <Link
              to={`/enquiry?propertyId=${property.id}`}
              className="btn btn-outline w-100"
            >
              Send Detailed Message
            </Link>
          </div>
        </aside>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setLightboxOpen(false)}
          style={{ background: "rgba(11, 31, 51, 0.95)" }}
        >
          <div style={{ maxWidth: "90vw", maxHeight: "85vh", position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <img
              src={gallery[activePhotoIndex]}
              alt={`Fullscreen ${activePhotoIndex + 1}`}
              style={{ maxWidth: "100%", maxHeight: "85vh", borderRadius: "var(--radius-md)", objectFit: "contain" }}
            />
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              style={{
                position: "absolute",
                top: "-40px",
                right: 0,
                color: "#FFFFFF",
                fontSize: "1.5rem",
                cursor: "pointer"
              }}
              aria-label="Close fullscreen gallery"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
