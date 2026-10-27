import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite, selectIsFavorite } from "../../features/favorites/favoritesSlice";
import { useUI } from "../../context/UIContext";

export const PropertyCard = ({ property }) => {
  const dispatch = useDispatch();
  const { showToast } = useUI();
  const isFav = useSelector((state) => selectIsFavorite(state, property.id));

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(property.id));
    if (!isFav) {
      showToast(`Saved "${property.title}" to portfolio`, "success");
    } else {
      showToast(`Removed from saved portfolio`, "info");
    }
  };

  return (
    <article className="property-card" aria-label={property.title}>
      <div className="property-card-image-wrap">
        <img
          src={property.imageUrl}
          alt={property.title}
          className="property-card-img"
          loading="lazy"
        />

        <div className="property-card-badges">
          <span className={`badge ${property.listingType === "Rent" ? "badge-rent" : "badge-sale"}`}>
            {property.listingType === "Rent" ? "For Rent" : "For Sale"}
          </span>
          {property.isFeatured && (
            <span className="badge badge-featured">Featured</span>
          )}
          {property.isVerified && (
            <span className="badge badge-verified">RERA Verified</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleToggleFavorite}
          className={`property-fav-btn ${isFav ? "active" : ""}`}
          aria-label={isFav ? "Remove from saved properties" : "Save property"}
          title={isFav ? "Remove from saved" : "Save property"}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={isFav ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <div className="property-card-body">
        <div className="property-card-price-row">
          <div className="property-card-price">{property.formattedPrice}</div>
          <div className="property-card-sqft">{property.pricePerSqFt}</div>
        </div>

        <h3 className="property-card-title">
          <Link to={`/properties/${property.id}`} title={property.title}>
            {property.title}
          </Link>
        </h3>

        <div className="property-card-location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{property.locality}, {property.city}</span>
        </div>

        <div className="property-card-specs">
          {property.bedrooms > 0 && (
            <div className="spec-item" title="Bedrooms">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" />
              </svg>
              <span>{property.bedrooms} BHK</span>
            </div>
          )}

          {property.bathrooms > 0 && (
            <div className="spec-item" title="Bathrooms">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z" />
                <path d="M6 12V5a2 2 0 0 1 2-2h3v9" />
              </svg>
              <span>{property.bathrooms} Baths</span>
            </div>
          )}

          {property.carpetArea > 0 && (
            <div className="spec-item" title="Carpet Area">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              <span>{property.carpetArea.toLocaleString("en-IN")} sq.ft</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;
