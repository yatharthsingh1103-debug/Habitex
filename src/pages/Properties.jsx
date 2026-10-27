import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllProperties } from "../features/properties/propertiesSelectors";
import PropertyCard from "../components/common/PropertyCard";
import EmptyState from "../components/common/EmptyState";
import { CITIES, PROPERTY_TYPES, BEDROOM_OPTIONS } from "../data/properties";
import { AMENITIES_LIST } from "../forms/formConstants";

export const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const allProperties = useSelector(selectAllProperties);

  // Filters State
  const [keyword, setKeyword] = useState(searchParams.get("search") || "");
  const [listingType, setListingType] = useState(searchParams.get("listingType") || "All");
  const [propertyType, setPropertyType] = useState(searchParams.get("propertyType") || "All Types");
  const [city, setCity] = useState(searchParams.get("city") || "All Cities");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "Any");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [furnishing, setFurnishing] = useState("All");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'

  // Sync state if URL query changes
  useEffect(() => {
    if (searchParams.get("listingType")) setListingType(searchParams.get("listingType"));
    if (searchParams.get("propertyType")) setPropertyType(searchParams.get("propertyType"));
    if (searchParams.get("city")) setCity(searchParams.get("city"));
  }, [searchParams]);

  // Handle Amenity Filter Toggle
  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  // Reset Filters
  const handleResetFilters = () => {
    setKeyword("");
    setListingType("All");
    setPropertyType("All Types");
    setCity("All Cities");
    setBedrooms("Any");
    setMinPrice("");
    setMaxPrice("");
    setFurnishing("All");
    setVerifiedOnly(false);
    setSelectedAmenities([]);
    setSortBy("default");
    setSearchParams({});
  };

  // Filtered & Sorted Properties (Memoized)
  const filteredProperties = useMemo(() => {
    let result = [...allProperties];

    // Keyword Search
    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.locality.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Listing Mode
    if (listingType !== "All") {
      result = result.filter((p) => p.listingType === listingType);
    }

    // Property Type
    if (propertyType !== "All Types") {
      result = result.filter((p) => p.propertyType === propertyType);
    }

    // City
    if (city !== "All Cities") {
      result = result.filter((p) => p.city === city);
    }

    // Bedrooms
    if (bedrooms !== "Any") {
      if (bedrooms === "5+") {
        result = result.filter((p) => p.bedrooms >= 5);
      } else {
        result = result.filter((p) => p.bedrooms === parseInt(bedrooms, 10));
      }
    }

    // Price Bounds
    if (minPrice) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    // Furnishing
    if (furnishing !== "All") {
      result = result.filter((p) => p.furnishing === furnishing);
    }

    // Verified Only
    if (verifiedOnly) {
      result = result.filter((p) => p.isVerified);
    }

    // Amenities
    if (selectedAmenities.length > 0) {
      result = result.filter((p) =>
        selectedAmenities.every((a) => p.amenities && p.amenities.includes(a))
      );
    }

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "area-desc") {
      result.sort((a, b) => (b.carpetArea || 0) - (a.carpetArea || 0));
    }

    return result;
  }, [
    allProperties,
    keyword,
    listingType,
    propertyType,
    city,
    bedrooms,
    minPrice,
    maxPrice,
    furnishing,
    verifiedOnly,
    selectedAmenities,
    sortBy
  ]);

  return (
    <div className="container" style={{ padding: "var(--space-8) var(--space-6) var(--space-16)" }}>
      {/* Page Title & Search Bar */}
      <div style={{ marginBottom: "var(--space-8)" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "var(--space-2)", color: "var(--color-primary)" }}>
          Prime Real Estate Directory
        </h1>
        <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-6)" }}>
          Browse verified residential towers, luxury penthouses, private villas, and investment plots.
        </p>

        {/* Search Input Bar */}
        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "260px", position: "relative" }}>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by building name, locality (e.g. Camellias, Bandra, Indiranagar)..."
              className="form-input"
              style={{ paddingLeft: "var(--space-10)" }}
            />
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ position: "absolute", left: "14px", top: "14px", color: "var(--color-text-muted)" }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <button
              type="button"
              onClick={() => setListingType("All")}
              className={`btn btn-sm ${listingType === "All" ? "btn-primary" : "btn-secondary"}`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setListingType("Sale")}
              className={`btn btn-sm ${listingType === "Sale" ? "btn-primary" : "btn-secondary"}`}
            >
              For Sale
            </button>
            <button
              type="button"
              onClick={() => setListingType("Rent")}
              className={`btn btn-sm ${listingType === "Rent" ? "btn-primary" : "btn-secondary"}`}
            >
              For Rent
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Catalog */}
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "var(--space-8)", alignItems: "start" }}>
        {/* Filters Sidebar */}
        <aside
          style={{
            background: "var(--color-surface)",
            padding: "var(--space-6)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-xs)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)", paddingBottom: "var(--space-3)", borderBottom: "1px solid var(--color-border)" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Filters</h3>
            <button
              type="button"
              onClick={handleResetFilters}
              style={{ fontSize: "0.8rem", color: "var(--color-primary-brand)", fontWeight: 600, cursor: "pointer" }}
            >
              Reset All
            </button>
          </div>

          {/* City */}
          <div className="form-field" style={{ marginBottom: "var(--space-4)" }}>
            <label className="form-label">City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="form-select"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Typology */}
          <div className="form-field" style={{ marginBottom: "var(--space-4)" }}>
            <label className="form-label">Property Type</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="form-select"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Bedrooms */}
          <div className="form-field" style={{ marginBottom: "var(--space-4)" }}>
            <label className="form-label">Bedrooms (BHK)</label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="form-select"
            >
              {BEDROOM_OPTIONS.map((b) => (
                <option key={b} value={b}>{b === "Any" ? "Any BHK" : `${b} BHK`}</option>
              ))}
            </select>
          </div>

          {/* Furnishing */}
          <div className="form-field" style={{ marginBottom: "var(--space-4)" }}>
            <label className="form-label">Furnishing</label>
            <select
              value={furnishing}
              onChange={(e) => setFurnishing(e.target.value)}
              className="form-select"
            >
              <option value="All">All Furnishing</option>
              <option value="Fully Furnished">Fully Furnished</option>
              <option value="Semi-Furnished">Semi-Furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </select>
          </div>

          {/* Budget Range */}
          <div className="form-field" style={{ marginBottom: "var(--space-4)" }}>
            <label className="form-label">Price Range (₹)</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-2)" }}>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="form-input"
                style={{ fontSize: "0.85rem" }}
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="form-input"
                style={{ fontSize: "0.85rem" }}
              />
            </div>
          </div>

          {/* RERA Verified */}
          <div style={{ marginBottom: "var(--space-4)" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
              />
              <span>RERA Verified Only</span>
            </label>
          </div>

          {/* Amenities Mini List */}
          <div style={{ marginTop: "var(--space-5)", paddingTop: "var(--space-4)", borderTop: "1px solid var(--color-border-subtle)" }}>
            <label className="form-label" style={{ marginBottom: "var(--space-2)", display: "block" }}>Key Amenities</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              {["Swimming pool", "Gym", "Power backup", "Lift", "Security", "Clubhouse"].map((amenity) => (
                <label key={amenity} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "0.825rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Listings Catalog */}
        <section>
          {/* Catalog Top Controls Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "var(--space-6)",
              flexWrap: "wrap",
              gap: "var(--space-3)"
            }}
          >
            <div>
              <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                {filteredProperties.length}
              </span>{" "}
              <span style={{ color: "var(--color-text-secondary)" }}>
                {filteredProperties.length === 1 ? "Property Available" : "Properties Available"}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
                style={{ width: "auto", fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}
                aria-label="Sort properties"
              >
                <option value="default">Sort: Default Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="area-desc">Carpet Area: Largest First</option>
              </select>

              {/* View Mode Toggle */}
              <div style={{ display: "flex", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  style={{
                    padding: "0.4rem 0.6rem",
                    background: viewMode === "grid" ? "var(--color-primary-brand)" : "var(--color-surface)",
                    color: viewMode === "grid" ? "#FFFFFF" : "var(--color-text)"
                  }}
                  title="Grid View"
                  aria-label="Grid View"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  style={{
                    padding: "0.4rem 0.6rem",
                    background: viewMode === "list" ? "var(--color-primary-brand)" : "var(--color-surface)",
                    color: viewMode === "list" ? "#FFFFFF" : "var(--color-text)"
                  }}
                  title="List View"
                  aria-label="List View"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Results Grid / List */}
          {filteredProperties.length > 0 ? (
            <div className={viewMode === "grid" ? "properties-grid" : "properties-list"}>
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No matching holdings located"
              description="No properties match your current filter parameters. Try loosening budget or city criteria."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default Properties;
