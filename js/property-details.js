/**
 * PROPERTY DETAILS PAGE CONTROLLER
 * Reads URL param `id`, renders editorial photo mosaic, specifications ribbon,
 * amenities list, agent contact card, lightbox gallery, and enquiry modal.
 */

const PropertyDetailsController = {
  currentProperty: null,
  currentGalleryIndex: 0,

  init() {
    const params = new URLSearchParams(window.location.search);
    const propId = params.get("id") || "prop-101";

    this.currentProperty = window.PropertyStorage ? window.PropertyStorage.getById(propId) : null;

    if (!this.currentProperty) {
      // If not found, use first item
      const all = window.PropertyStorage.getAll();
      this.currentProperty = all[0];
    }

    if (!this.currentProperty) return;

    this.renderDetails();
    this.bindEvents();
  },

  renderDetails() {
    const p = this.currentProperty;

    // Document Title
    document.title = `${p.title} — Habitex`;

    // Breadcrumb
    const bcTitle = document.getElementById("details-bc-title");
    if (bcTitle) bcTitle.textContent = p.title;

    // Headline elements
    const titleEl = document.getElementById("details-title");
    if (titleEl) titleEl.textContent = p.title;

    const locEl = document.getElementById("details-location");
    if (locEl) locEl.textContent = `${p.locality}, ${p.city} — ${p.pincode || ''}`;

    const priceEl = document.getElementById("details-price");
    if (priceEl) priceEl.textContent = p.formattedPrice;

    const rateEl = document.getElementById("details-rate");
    if (rateEl) rateEl.textContent = p.pricePerSqFt || (p.maintenance ? `Maint: ${p.maintenance}` : "");

    // Badges
    const badgeType = document.getElementById("details-badge-type");
    if (badgeType) {
      badgeType.textContent = p.listingType === "Sale" ? "For Sale" : "For Rent";
      badgeType.className = `badge ${p.listingType === 'Sale' ? 'badge-sale' : 'badge-rent'}`;
    }

    const badgeCategory = document.getElementById("details-badge-category");
    if (badgeCategory) badgeCategory.textContent = p.propertyType;

    // Favorite Button state
    const favBtn = document.getElementById("details-fav-btn");
    if (favBtn) {
      const isSaved = window.isPropertySaved(p.id);
      favBtn.classList.toggle("active", isSaved);
    }

    // Gallery Mosaic
    const mosaicWrap = document.getElementById("gallery-mosaic");
    if (mosaicWrap && p.gallery && p.gallery.length > 0) {
      const mainImg = p.gallery[0];
      const sideImgs = p.gallery.slice(1, 5);

      mosaicWrap.innerHTML = `
        <div class="gallery-mosaic-main" onclick="window.PropertyDetailsController.openLightbox(0)">
          <img src="${mainImg}" alt="${p.title}">
        </div>
        ${sideImgs.map((imgUrl, idx) => `
          <div class="gallery-mosaic-item" onclick="window.PropertyDetailsController.openLightbox(${idx + 1})">
            <img src="${imgUrl}" alt="${p.title} photo ${idx + 2}">
          </div>
        `).join("")}
        <button type="button" class="gallery-view-all-btn" onclick="window.PropertyDetailsController.openLightbox(0)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <span>View All ${p.gallery.length} Photos</span>
        </button>
      `;
    }

    // Specs Ribbon
    const ribbon = document.getElementById("specs-ribbon");
    if (ribbon) {
      ribbon.innerHTML = `
        <div class="spec-block">
          <span class="spec-block-label">Bedrooms</span>
          <span class="spec-block-value">${p.bedrooms > 0 ? `${p.bedrooms} BHK` : 'Studio/Plot'}</span>
        </div>
        <div class="spec-block">
          <span class="spec-block-label">Bathrooms</span>
          <span class="spec-block-value">${p.bathrooms || '—'}</span>
        </div>
        <div class="spec-block">
          <span class="spec-block-label">Carpet Area</span>
          <span class="spec-block-value">${p.carpetArea ? `${p.carpetArea} sq.ft` : (p.plotArea ? `${p.plotArea} sq.ft` : '—')}</span>
        </div>
        <div class="spec-block">
          <span class="spec-block-label">Furnishing</span>
          <span class="spec-block-value">${p.furnishing || 'Unfurnished'}</span>
        </div>
        <div class="spec-block">
          <span class="spec-block-label">Facing</span>
          <span class="spec-block-value">${p.facing || 'East'}</span>
        </div>
        <div class="spec-block">
          <span class="spec-block-label">Possession</span>
          <span class="spec-block-value">${p.propertyAge || 'Ready to Move'}</span>
        </div>
      `;
    }

    // Description
    const descEl = document.getElementById("details-description");
    if (descEl) descEl.textContent = p.description;

    // Specs Table
    const specsTable = document.getElementById("details-specs-table");
    if (specsTable) {
      specsTable.innerHTML = `
        <div class="specs-table-row">
          <dt>Property Type</dt>
          <dd>${p.propertyType}</dd>
        </div>
        <div class="specs-table-row">
          <dt>Listing Purpose</dt>
          <dd>${p.listingType === 'Sale' ? 'Purchase / Freehold' : 'Lease / Rental'}</dd>
        </div>
        <div class="specs-table-row">
          <dt>Floor Position</dt>
          <dd>${p.floorNo !== undefined ? `${p.floorNo} of ${p.totalFloors} floors` : 'Ground level'}</dd>
        </div>
        <div class="specs-table-row">
          <dt>Balconies</dt>
          <dd>${p.balconies !== undefined ? p.balconies : '—'}</dd>
        </div>
        <div class="specs-table-row">
          <dt>Super Built-Up Area</dt>
          <dd>${p.superBuiltUpArea ? `${p.superBuiltUpArea} sq.ft` : '—'}</dd>
        </div>
        <div class="specs-table-row">
          <dt>Maintenance Charges</dt>
          <dd>${p.maintenance || 'Included in base'}</dd>
        </div>
        <div class="specs-table-row">
          <dt>RERA Registration</dt>
          <dd><strong style="color:var(--color-primary);">${p.owner?.rera || 'Verified GGM-2024'}</strong></dd>
        </div>
        <div class="specs-table-row">
          <dt>Security Deposit</dt>
          <dd>${p.securityDeposit || 'N/A (Outright Sale)'}</dd>
        </div>
      `;
    }

    // Amenities Grid
    const amenitiesWrap = document.getElementById("details-amenities-grid");
    if (amenitiesWrap && p.amenities) {
      amenitiesWrap.innerHTML = p.amenities.map(a => `
        <div class="amenity-chip">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>${a}</span>
        </div>
      `).join("");
    }

    // Agent Information
    if (p.owner) {
      const agentPhoto = document.getElementById("agent-photo");
      if (agentPhoto) agentPhoto.src = p.owner.photo;

      const agentName = document.getElementById("agent-name");
      if (agentName) agentName.textContent = p.owner.name;

      const agentRole = document.getElementById("agent-role");
      if (agentRole) agentRole.textContent = p.owner.role;

      const agentRera = document.getElementById("agent-rera");
      if (agentRera) agentRera.textContent = `RERA: ${p.owner.rera}`;

      const agentPhone = document.getElementById("agent-phone-link");
      if (agentPhone) {
        agentPhone.href = `tel:${p.owner.phone}`;
        agentPhone.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          <span>Call ${p.owner.phone}</span>
        `;
      }
    }

    // Pre-fill enquiry modal property reference
    const propRefInput = document.getElementById("enquiry-prop-id");
    if (propRefInput) propRefInput.value = p.id;

    const propRefTitle = document.getElementById("enquiry-prop-title");
    if (propRefTitle) propRefTitle.value = p.title;

    // Auto-fill client details from active user (Yatharth)
    const activeUser = window.AuthManager ? window.AuthManager.getUser() : null;
    if (activeUser) {
      const qName = document.getElementById("quick-name");
      const qPhone = document.getElementById("quick-phone");
      const qEmail = document.getElementById("quick-email");
      if (qName && !qName.value) qName.value = activeUser.name;
      if (qPhone && !qPhone.value && activeUser.phone) qPhone.value = activeUser.phone;
      if (qEmail && !qEmail.value && activeUser.email) qEmail.value = activeUser.email;
    }
  },

  bindEvents() {
    // Favorite Button
    const favBtn = document.getElementById("details-fav-btn");
    if (favBtn && this.currentProperty) {
      favBtn.addEventListener("click", () => {
        window.toggleSaveProperty(this.currentProperty.id, favBtn);
      });
    }

    // Share Button
    const shareBtn = document.getElementById("details-share-btn");
    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href);
          window.showToast("Listing link copied to clipboard.", "success");
        } else {
          window.showToast("URL: " + window.location.href, "info");
        }
      });
    }

    // Lightbox Controls
    const lightbox = document.getElementById("lightbox-modal");
    const closeBtn = document.getElementById("lightbox-close");
    const prevBtn = document.getElementById("lightbox-prev");
    const nextBtn = document.getElementById("lightbox-next");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closeLightbox());
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", () => this.changeLightboxPhoto(-1));
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => this.changeLightboxPhoto(1));
    }

    document.addEventListener("keydown", (e) => {
      if (lightbox && lightbox.classList.contains("active")) {
        if (e.key === "Escape") this.closeLightbox();
        if (e.key === "ArrowLeft") this.changeLightboxPhoto(-1);
        if (e.key === "ArrowRight") this.changeLightboxPhoto(1);
      }
    });

    // Quick Agent Form Submission
    const quickForm = document.getElementById("agent-quick-enquiry-form");
    if (quickForm) {
      window.FormValidator.attachLiveValidation(quickForm);

      quickForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const isValid = window.FormValidator.validateContainer(quickForm);
        if (!isValid) return;

        const name = document.getElementById("quick-name").value.trim();
        const phone = document.getElementById("quick-phone").value.trim();
        const email = document.getElementById("quick-email").value.trim();
        const msg = document.getElementById("quick-message").value.trim();

        const enquiry = {
          id: "enq_" + Date.now().toString(36),
          propertyId: this.currentProperty.id,
          propertyTitle: this.currentProperty.title,
          buyerName: name,
          phone: phone,
          email: email,
          message: msg,
          status: "New",
          createdAt: new Date().toISOString()
        };

        const enquiries = JSON.parse(localStorage.getItem("estatecraft_enquiries") || "[]");
        enquiries.unshift(enquiry);
        localStorage.setItem("estatecraft_enquiries", JSON.stringify(enquiries));

        window.showToast("Your enquiry has been dispatched directly to the advisor.", "success", 4000);
        quickForm.reset();
      });
    }
  },

  openLightbox(index = 0) {
    const lightbox = document.getElementById("lightbox-modal");
    const imgEl = document.getElementById("lightbox-img");
    const counterEl = document.getElementById("lightbox-counter");
    if (!lightbox || !this.currentProperty?.gallery) return;

    this.currentGalleryIndex = index;
    imgEl.src = this.currentProperty.gallery[index];
    if (counterEl) {
      counterEl.textContent = `${index + 1} of ${this.currentProperty.gallery.length}`;
    }

    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  },

  closeLightbox() {
    const lightbox = document.getElementById("lightbox-modal");
    if (lightbox) {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
    }
  },

  changeLightboxPhoto(direction) {
    if (!this.currentProperty?.gallery) return;
    const total = this.currentProperty.gallery.length;
    this.currentGalleryIndex = (this.currentGalleryIndex + direction + total) % total;
    this.openLightbox(this.currentGalleryIndex);
  }
};

window.PropertyDetailsController = PropertyDetailsController;
