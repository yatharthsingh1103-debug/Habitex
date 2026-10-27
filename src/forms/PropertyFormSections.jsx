import React from "react";
import FormField from "../components/common/FormField";
import {
  AMENITIES_LIST,
  PROPERTY_TYPES_OPTIONS,
  CITIES_LIST,
  FACING_OPTIONS
} from "./formConstants";

// =========================================================================
// SECTION 1: BASIC INFORMATION
// =========================================================================
export const SectionBasicInfo = ({ formData, errors, onChange, onBlur, titleRef }) => {
  return (
    <div>
      <div className="section-pane-header">
        <h2 className="section-pane-title">Section 1: Basic Information</h2>
        <p className="section-pane-desc">Core typology, headline title, and market transaction intent.</p>
      </div>

      <div className="form-grid-1">
        <FormField
          ref={titleRef}
          id="prop-title"
          name="title"
          label="Listing Headline Title"
          required
          value={formData.title}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.title}
          placeholder="e.g. 4 BHK Sea-Facing Penthouse with Private Plunge Pool"
          hint="Provide a descriptive headline (10–120 characters)."
        />
      </div>

      <div className="form-grid-2" style={{ marginTop: "var(--space-5)" }}>
        {/* Listing Mode */}
        <div className="form-field">
          <label className="form-label">Transaction Mode <span className="required-mark">*</span></label>
          <div className="selectable-pills-row">
            {["Sale", "Rent"].map((mode) => (
              <label key={mode} className="pill-option-label">
                <input
                  type="radio"
                  name="listingType"
                  value={mode}
                  checked={formData.listingType === mode}
                  onChange={onChange}
                />
                <span className="pill-option-chip">
                  {mode === "Sale" ? "Sell / Outright" : "Rent / Lease"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Property Typology */}
        <div className="form-field">
          <label className="form-label">Property Typology <span className="required-mark">*</span></label>
          <div className="selectable-pills-row">
            {PROPERTY_TYPES_OPTIONS.map((type) => (
              <label key={type.value} className="pill-option-label">
                <input
                  type="radio"
                  name="propertyType"
                  value={type.value}
                  checked={formData.propertyType === type.value}
                  onChange={onChange}
                />
                <span className="pill-option-chip">{type.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="form-grid-2" style={{ marginTop: "var(--space-5)" }}>
        <FormField
          id="prop-purpose"
          name="purpose"
          type="select"
          label="Primary Purpose"
          required
          value={formData.purpose}
          onChange={onChange}
          onBlur={onBlur}
          options={[
            "Self-Occupancy",
            "Investment / High-Yield Asset",
            "Vacation Retreat / Second Home",
            "Corporate Office / Commercial HQ"
          ]}
        />

        <FormField
          id="prop-status"
          name="status"
          type="select"
          label="Construction Status"
          required
          value={formData.status}
          onChange={onChange}
          onBlur={onBlur}
          options={[
            "Ready to Move",
            "Under Construction",
            "New Launch",
            "Resale Heritage"
          ]}
        />
      </div>

      <div className="form-grid-1" style={{ marginTop: "var(--space-5)" }}>
        <FormField
          id="prop-description"
          name="description"
          type="textarea"
          label="Detailed Architectural Description"
          required
          rows={4}
          value={formData.description}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.description}
          placeholder="Describe ceiling heights, imported marble/teak finishes, natural light orientations, view corridors, and private amenities..."
          hint="Minimum 30 characters describing spatial layout."
        />
      </div>
    </div>
  );
};

// =========================================================================
// SECTION 2: LOCATION
// =========================================================================
export const SectionLocation = ({ formData, errors, onChange, onBlur, addressRef }) => {
  return (
    <div>
      <div className="section-pane-header">
        <h2 className="section-pane-title">Section 2: Location & Cadastral Address</h2>
        <p className="section-pane-desc">Geographic enclave, street coordinates, and postal details.</p>
      </div>

      <div className="form-grid-2">
        <FormField
          ref={addressRef}
          id="loc-address"
          name="address"
          label="Street Address / Building Name"
          required
          value={formData.address}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.address}
          placeholder="e.g. Tower 2B, The Camellias, Golf Course Road"
        />

        <FormField
          id="loc-unit"
          name="unitNo"
          label="Apartment / Villa / Unit Number"
          value={formData.unitNo}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="e.g. Penthouse 2801 or Villa 14"
          hint="Optional for discreet private listings."
        />
      </div>

      <div className="form-grid-3" style={{ marginTop: "var(--space-5)" }}>
        <FormField
          id="loc-locality"
          name="locality"
          label="Locality / Sector"
          required
          value={formData.locality}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.locality}
          placeholder="e.g. DLF Phase 5"
        />

        <FormField
          id="loc-city"
          name="city"
          type="select"
          label="City"
          required
          value={formData.city}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.city}
          options={CITIES_LIST}
        />

        <FormField
          id="loc-state"
          name="state"
          label="State / Union Territory"
          value={formData.state}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="e.g. Haryana"
        />
      </div>

      <div className="form-grid-3" style={{ marginTop: "var(--space-5)" }}>
        <FormField
          id="loc-pincode"
          name="pincode"
          label="Pincode (Postal Code)"
          required
          value={formData.pincode}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.pincode}
          placeholder="e.g. 122002"
          hint="6-digit postal code."
        />

        <FormField
          id="loc-landmark"
          name="landmark"
          label="Prominent Landmark"
          value={formData.landmark}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="e.g. Near One Horizon Centre"
        />

        <FormField
          id="loc-country"
          name="country"
          label="Country"
          disabled
          value={formData.country}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

// =========================================================================
// SECTION 3: PROPERTY DETAILS (With Conditional Fields)
// =========================================================================
export const SectionPropertyDetails = ({ formData, errors, onChange, onBlur, carpetRef }) => {
  const isPlot = formData.propertyType === "Plot";
  const isVillaOrHouse = formData.propertyType === "Villa";

  return (
    <div>
      <div className="section-pane-header">
        <h2 className="section-pane-title">Section 3: Structural & Spatial Specifications</h2>
        <p className="section-pane-desc">Dimensions, floor level, and spatial configuration.</p>
      </div>

      {/* Conditional: If Plot */}
      {isPlot ? (
        <div className="form-grid-2">
          <FormField
            ref={carpetRef}
            id="spec-plot-area"
            name="plotArea"
            type="number"
            label="Plot Area (in Sq. Yards / Sq.Ft)"
            required
            value={formData.plotArea}
            onChange={onChange}
            onBlur={onBlur}
            error={errors.plotArea}
            placeholder="e.g. 500"
            hint="Measured according to municipal survey record."
          />

          <FormField
            id="spec-road-width"
            name="roadWidth"
            label="Front Road Width (in Feet)"
            value={formData.roadWidth}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="e.g. 60 ft wide avenue"
          />

          <div className="form-field" style={{ gridColumn: "span 2" }}>
            <label className="pill-option-label" style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <input
                type="checkbox"
                name="boundaryWall"
                checked={formData.boundaryWall}
                onChange={onChange}
              />
              <span className="form-label" style={{ marginBottom: 0 }}>Gated Compound / Boundary Wall Constructed</span>
            </label>
          </div>
        </div>
      ) : (
        /* Non-Plot Residences (Apartment, Villa, Penthouse, Commercial) */
        <>
          <div className="form-grid-3">
            <FormField
              id="spec-bedrooms"
              name="bedrooms"
              type="select"
              label="Bedrooms (BHK)"
              value={formData.bedrooms}
              onChange={onChange}
              onBlur={onBlur}
              options={["0 (Studio/Commercial)", "1", "2", "3", "4", "5", "6+"]}
            />

            <FormField
              id="spec-bathrooms"
              name="bathrooms"
              type="select"
              label="Bathrooms"
              value={formData.bathrooms}
              onChange={onChange}
              onBlur={onBlur}
              options={["1", "2", "3", "4", "5", "6+"]}
            />

            <FormField
              id="spec-balconies"
              name="balconies"
              type="select"
              label="Balconies"
              value={formData.balconies}
              onChange={onChange}
              onBlur={onBlur}
              options={["0", "1", "2", "3", "4+"]}
            />
          </div>

          <div className="form-grid-2" style={{ marginTop: "var(--space-5)" }}>
            <FormField
              id="spec-floor-no"
              name="floorNo"
              label={isVillaOrHouse ? "Total Villa Storeys" : "Property Floor Level"}
              value={formData.floorNo}
              onChange={onChange}
              onBlur={onBlur}
              placeholder={isVillaOrHouse ? "e.g. G + 2" : "e.g. 28"}
            />

            <FormField
              id="spec-total-floors"
              name="totalFloors"
              label="Building Total Floors"
              value={formData.totalFloors}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="e.g. 32"
            />
          </div>

          <div className="form-grid-2" style={{ marginTop: "var(--space-5)" }}>
            <FormField
              ref={carpetRef}
              id="spec-carpet-area"
              name="carpetArea"
              type="number"
              label="Carpet Area (in Sq.Ft)"
              required
              value={formData.carpetArea}
              onChange={onChange}
              onBlur={onBlur}
              error={errors.carpetArea}
              placeholder="e.g. 8500"
              hint="Net usable interior floor space."
            />

            <FormField
              id="spec-super-area"
              name="superBuiltUpArea"
              type="number"
              label="Super Built-Up Area (in Sq.Ft)"
              value={formData.superBuiltUpArea}
              onChange={onChange}
              onBlur={onBlur}
              error={errors.superBuiltUpArea}
              placeholder="e.g. 10200"
              hint="Includes common areas and loading factor."
            />
          </div>
        </>
      )}

      <div className="form-grid-2" style={{ marginTop: "var(--space-5)" }}>
        <FormField
          id="spec-facing"
          name="facing"
          type="select"
          label="Vastu / Orientation Facing"
          value={formData.facing}
          onChange={onChange}
          onBlur={onBlur}
          options={FACING_OPTIONS}
        />

        <FormField
          id="spec-age"
          name="propertyAge"
          type="select"
          label="Property Age"
          value={formData.propertyAge}
          onChange={onChange}
          onBlur={onBlur}
          options={["Under Construction", "New (0-1 year)", "2-4 years", "5-9 years", "10+ years"]}
        />
      </div>
    </div>
  );
};

// =========================================================================
// SECTION 4: VALUATION & PRICE (With Conditional Fields)
// =========================================================================
export const SectionPrice = ({ formData, errors, onChange, onBlur, priceRef }) => {
  const isRent = formData.listingType === "Rent";

  return (
    <div>
      <div className="section-pane-header">
        <h2 className="section-pane-title">Section 4: Valuation & Financial Terms</h2>
        <p className="section-pane-desc">Pricing model, maintenance, and transaction terms.</p>
      </div>

      <div className="form-grid-2">
        <FormField
          ref={priceRef}
          id="val-expected-price"
          name="expectedPrice"
          type="number"
          label={isRent ? "Monthly Rental Rate (₹)" : "Expected Outright Selling Price (₹)"}
          required
          value={formData.expectedPrice}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.expectedPrice}
          placeholder={isRent ? "e.g. 350000" : "e.g. 385000000"}
          hint={isRent ? "Monthly rent in INR" : "Total capital value in INR"}
        />

        <div className="form-field" style={{ justifyContent: "center" }}>
          <label className="form-label" style={{ marginBottom: "var(--space-2)" }}>Price Flexibility</label>
          <label className="pill-option-label" style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <input
              type="checkbox"
              name="isNegotiable"
              checked={formData.isNegotiable}
              onChange={onChange}
            />
            <span className="form-label" style={{ marginBottom: 0 }}>Price is open to serious investor negotiation</span>
          </label>
        </div>
      </div>

      {/* Conditional: Rent vs Sale Fields */}
      {isRent ? (
        <div className="form-grid-2" style={{ marginTop: "var(--space-5)" }}>
          <FormField
            id="val-security-deposit"
            name="securityDeposit"
            type="number"
            label="Interest-Free Security Deposit (₹)"
            value={formData.securityDeposit}
            onChange={onChange}
            onBlur={onBlur}
            error={errors.securityDeposit}
            placeholder="e.g. 1000000 (Typically 2-3 months)"
          />

          <FormField
            id="val-lease-duration"
            name="leaseDuration"
            type="select"
            label="Minimum Lease Duration"
            value={formData.leaseDuration}
            onChange={onChange}
            onBlur={onBlur}
            options={["11 Months", "24 Months", "36 Months", "5 Years (Long-Term Corporate)"]}
          />
        </div>
      ) : (
        <div className="form-grid-1" style={{ marginTop: "var(--space-5)" }}>
          <FormField
            id="val-booking-amount"
            name="bookingAmount"
            type="number"
            label="Token / Booking Deposit (₹)"
            value={formData.bookingAmount}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="e.g. 2500000"
            hint="Advance earnest deposit required upon signing expression of interest."
          />
        </div>
      )}

      <div className="form-grid-2" style={{ marginTop: "var(--space-5)" }}>
        <FormField
          id="val-maintenance"
          name="maintenanceCharges"
          type="number"
          label="Recurring Maintenance (₹)"
          value={formData.maintenanceCharges}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="e.g. 75000"
        />

        <FormField
          id="val-maint-freq"
          name="maintenanceFrequency"
          type="select"
          label="Maintenance Frequency"
          value={formData.maintenanceFrequency}
          onChange={onChange}
          onBlur={onBlur}
          options={["Monthly", "Quarterly", "Annually", "Included in Rent"]}
        />
      </div>
    </div>
  );
};

// =========================================================================
// SECTION 5: AMENITIES
// =========================================================================
export const SectionAmenities = ({ formData, onAmenityToggle }) => {
  return (
    <div>
      <div className="section-pane-header">
        <h2 className="section-pane-title">Section 5: Curated Amenities & Facilities</h2>
        <p className="section-pane-desc">Select all architectural lifestyle features available on the property.</p>
      </div>

      <div className="amenities-selector-grid">
        {AMENITIES_LIST.map((amenity) => {
          const isSelected = formData.amenities.includes(amenity);
          return (
            <div
              key={amenity}
              className={`amenity-checkbox-card ${isSelected ? "selected" : ""}`}
              onClick={() => onAmenityToggle(amenity)}
              role="checkbox"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  onAmenityToggle(amenity);
                }
              }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {}} // Handled by card click
                tabIndex={-1}
              />
              <span>{amenity}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// SECTION 6: FURNISHING & INVENTORY (With Conditional Visibility)
// =========================================================================
export const SectionFurnishing = ({ formData, onChange, onQuantityChange }) => {
  const isUnfurnished = formData.furnishingStatus === "Unfurnished";

  return (
    <div>
      <div className="section-pane-header">
        <h2 className="section-pane-title">Section 6: Furnishing & Interior Inventory</h2>
        <p className="section-pane-desc">Furnishing grade and individual fixture inventory counts.</p>
      </div>

      <div className="form-field">
        <label className="form-label">Furnishing Status <span className="required-mark">*</span></label>
        <div className="selectable-pills-row">
          {["Unfurnished", "Semi-Furnished", "Fully Furnished"].map((status) => (
            <label key={status} className="pill-option-label">
              <input
                type="radio"
                name="furnishingStatus"
                value={status}
                checked={formData.furnishingStatus === status}
                onChange={onChange}
              />
              <span className="pill-option-chip">{status}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Conditional: If not unfurnished, display item counts */}
      {!isUnfurnished ? (
        <div style={{ marginTop: "var(--space-6)" }}>
          <h3 style={{ fontSize: "1.05rem", marginBottom: "var(--space-4)" }}>Fixture & Appliance Counters</h3>
          <div className="form-grid-3">
            <div className="form-field">
              <label className="form-label">Designer Beds</label>
              <div className="qty-stepper">
                <button type="button" className="qty-btn" onClick={() => onQuantityChange("bedsCount", -1)}>-</button>
                <span className="qty-display">{formData.bedsCount}</span>
                <button type="button" className="qty-btn" onClick={() => onQuantityChange("bedsCount", 1)}>+</button>
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Built-in Wardrobes</label>
              <div className="qty-stepper">
                <button type="button" className="qty-btn" onClick={() => onQuantityChange("wardrobesCount", -1)}>-</button>
                <span className="qty-display">{formData.wardrobesCount}</span>
                <button type="button" className="qty-btn" onClick={() => onQuantityChange("wardrobesCount", 1)}>+</button>
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Air Conditioners</label>
              <div className="qty-stepper">
                <button type="button" className="qty-btn" onClick={() => onQuantityChange("acCount", -1)}>-</button>
                <span className="qty-display">{formData.acCount}</span>
                <button type="button" className="qty-btn" onClick={() => onQuantityChange("acCount", 1)}>+</button>
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Ceiling Fans</label>
              <div className="qty-stepper">
                <button type="button" className="qty-btn" onClick={() => onQuantityChange("fansCount", -1)}>-</button>
                <span className="qty-display">{formData.fansCount}</span>
                <button type="button" className="qty-btn" onClick={() => onQuantityChange("fansCount", 1)}>+</button>
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Lighting Fixtures</label>
              <div className="qty-stepper">
                <button type="button" className="qty-btn" onClick={() => onQuantityChange("lightsCount", -2)}>-</button>
                <span className="qty-display">{formData.lightsCount}</span>
                <button type="button" className="qty-btn" onClick={() => onQuantityChange("lightsCount", 2)}>+</button>
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Water Geysers</label>
              <div className="qty-stepper">
                <button type="button" className="qty-btn" onClick={() => onQuantityChange("geyserCount", -1)}>-</button>
                <span className="qty-display">{formData.geyserCount}</span>
                <button type="button" className="qty-btn" onClick={() => onQuantityChange("geyserCount", 1)}>+</button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "var(--space-5)" }}>
            <label className="pill-option-label" style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <input
                type="checkbox"
                name="modularKitchen"
                checked={formData.modularKitchen}
                onChange={onChange}
              />
              <span className="form-label" style={{ marginBottom: 0 }}>Fully Fitted Modular Kitchen with Chimney & Hob</span>
            </label>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: "var(--space-4)", padding: "var(--space-4)", background: "var(--color-surface-subtle)", borderRadius: "var(--radius-md)", fontSize: "0.88rem", color: "var(--color-text-secondary)" }}>
          Property is designated as <strong>Unfurnished</strong> (bare-shell structure ready for bespoke architectural fit-out).
        </div>
      )}
    </div>
  );
};

// =========================================================================
// SECTION 7: OWNER / AGENT CONTACT
// =========================================================================
export const SectionContact = ({ formData, errors, onChange, onBlur, nameRef }) => {
  return (
    <div>
      <div className="section-pane-header">
        <h2 className="section-pane-title">Section 7: Authorized Representative Contact</h2>
        <p className="section-pane-desc">Primary point of contact for private inspections and formal inquiries.</p>
      </div>

      <div className="form-grid-2">
        <FormField
          ref={nameRef}
          id="rep-name"
          name="ownerName"
          label="Authorized Representative / Owner Name"
          required
          value={formData.ownerName}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.ownerName}
          placeholder="e.g. Yatharth"
        />

        <FormField
          id="rep-phone"
          name="ownerPhone"
          type="tel"
          label="Contact Mobile (10-Digit Indian Mobile)"
          required
          value={formData.ownerPhone}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.ownerPhone}
          placeholder="e.g. 9810123456"
        />
      </div>

      <div className="form-grid-2" style={{ marginTop: "var(--space-5)" }}>
        <FormField
          id="rep-email"
          name="ownerEmail"
          type="email"
          label="Direct Advisory Email Address"
          required
          value={formData.ownerEmail}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.ownerEmail}
          placeholder="e.g. yatharth@habitex.in"
        />

        <FormField
          id="rep-contact-method"
          name="contactMethod"
          type="select"
          label="Preferred Communication Channel"
          value={formData.contactMethod}
          onChange={onChange}
          onBlur={onBlur}
          options={["Phone & WhatsApp", "WhatsApp Only", "Email Only", "Accompanied Inspection Only"]}
        />
      </div>
    </div>
  );
};

// =========================================================================
// SECTION 8: PHOTOGRAPHS & ELEVATIONS
// =========================================================================
export const SectionPhotos = ({ images, onImageUpload, onImageRemove, uploadError }) => {
  return (
    <div>
      <div className="section-pane-header">
        <h2 className="section-pane-title">Section 8: Architectural Photography & Elevation</h2>
        <p className="section-pane-desc">Upload high-resolution photography, elevation vistas, and floor layouts.</p>
      </div>

      <label
        htmlFor="property-images-file-input"
        className="image-dropzone"
        tabIndex={0}
      >
        <svg className="dropzone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-primary-brand)", marginBottom: "var(--space-1)" }}>
          Click or Drag & Drop Property Images Here
        </div>
        <p style={{ fontSize: "0.825rem", color: "var(--color-text-muted)" }}>
          Supports JPG, PNG, WEBP (Max 5MB per file • Recommended min 800×500 px)
        </p>
        <input
          id="property-images-file-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={onImageUpload}
          style={{ display: "none" }}
        />
      </label>

      {uploadError && (
        <div style={{ marginTop: "var(--space-3)", color: "var(--color-error)", fontSize: "0.85rem", fontWeight: 600 }}>
          {uploadError}
        </div>
      )}

      {images.length > 0 && (
        <div style={{ marginTop: "var(--space-6)" }}>
          <h4 style={{ fontSize: "0.95rem", marginBottom: "var(--space-3)" }}>
            Uploaded Gallery ({images.length} {images.length === 1 ? "Image" : "Images"})
          </h4>
          <div className="image-previews-grid">
            {images.map((imgUrl, index) => (
              <div key={index} className="image-preview-item">
                <img src={imgUrl} alt={`Upload ${index + 1}`} className="image-preview-thumb" />
                {index === 0 && <span className="cover-badge">Cover Photo</span>}
                <button
                  type="button"
                  onClick={() => onImageRemove(index)}
                  className="image-remove-btn"
                  title="Remove image"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
