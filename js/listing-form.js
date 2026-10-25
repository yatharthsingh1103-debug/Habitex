/**
 * LISTING WIZARD & 40+ FIELD FORM CONTROLLER
 * Multi-section progressive stepper, conditional field visibility,
 * validation hooks, draft auto-persistence, image upload integration,
 * and property publication.
 */

const ListingFormWizard = {
  currentStep: 1,
  totalSteps: 8,
  imageManager: null,

  init() {
    this.imageManager = new window.ImageUploadManager({
      dropzoneId: "image-dropzone",
      fileInputId: "property-images-input",
      previewContainerId: "image-previews-container",
      statusId: "image-upload-status"
    });

    this.bindStepper();
    this.bindConditionalFields();
    this.bindQuantitySteppers();
    this.bindDraftHandlers();
    this.bindFormSubmission();

    // Attach live validation
    const form = document.getElementById("add-property-form");
    if (form && window.FormValidator) {
      window.FormValidator.attachLiveValidation(form);
    }

    // Initialize Draft Autosave
    if (window.DraftStorage) {
      window.DraftStorage.initAutoSave("add-property-form", "property_listing");
    }

    // Trigger initial conditional state
    this.evaluateConditionalVisibility();

    // Auto-fill authorized representative credentials with active user (Yatharth)
    const activeUser = window.AuthManager ? window.AuthManager.getUser() : null;
    if (activeUser) {
      const ownerName = document.getElementById("owner-name");
      const ownerPhone = document.getElementById("owner-phone");
      const ownerEmail = document.getElementById("owner-email");
      if (ownerName && !ownerName.value) ownerName.value = activeUser.name || "Yatharth";
      if (ownerPhone && !ownerPhone.value) ownerPhone.value = activeUser.phone || "9810123456";
      if (ownerEmail && !ownerEmail.value) ownerEmail.value = activeUser.email || "yatharth@habitex.in";
    }
  },

  bindStepper() {
    // Step indicators header click
    document.querySelectorAll(".step-indicator-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetStep = parseInt(btn.dataset.step, 10);
        // Only allow clicking to steps already visited or if current is valid
        if (targetStep < this.currentStep || this.validateCurrentStep()) {
          this.goToStep(targetStep);
        }
      });
    });

    // Next / Previous buttons
    const nextBtn = document.getElementById("wizard-next-btn");
    const prevBtn = document.getElementById("wizard-prev-btn");

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (this.validateCurrentStep()) {
          if (this.currentStep < this.totalSteps) {
            this.goToStep(this.currentStep + 1);
          }
        } else {
          window.showToast("Please fill all required fields correctly before proceeding.", "error");
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (this.currentStep > 1) {
          this.goToStep(this.currentStep - 1);
        }
      });
    }
  },

  goToStep(stepNumber) {
    // Hide current pane
    const currentPane = document.getElementById(`step-pane-${this.currentStep}`);
    if (currentPane) currentPane.classList.remove("active");

    // Update step buttons in header
    document.querySelectorAll(".step-indicator-item").forEach(btn => {
      const step = parseInt(btn.dataset.step, 10);
      btn.classList.toggle("active", step === stepNumber);
      if (step < stepNumber) {
        btn.classList.add("completed");
      }
    });

    // Show target pane
    this.currentStep = stepNumber;
    const nextPane = document.getElementById(`step-pane-${this.currentStep}`);
    if (nextPane) nextPane.classList.add("active");

    // Update wizard footer buttons
    const prevBtn = document.getElementById("wizard-prev-btn");
    const nextBtn = document.getElementById("wizard-next-btn");
    const submitBtn = document.getElementById("wizard-submit-btn");

    if (prevBtn) {
      prevBtn.style.visibility = this.currentStep === 1 ? "hidden" : "visible";
    }

    if (this.currentStep === this.totalSteps) {
      if (nextBtn) nextBtn.style.display = "none";
      if (submitBtn) submitBtn.style.display = "inline-flex";
    } else {
      if (nextBtn) nextBtn.style.display = "inline-flex";
      if (submitBtn) submitBtn.style.display = "none";
    }

    // Scroll to top of wizard
    const wizardCard = document.querySelector(".form-wizard-card");
    if (wizardCard) {
      wizardCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  },

  validateCurrentStep() {
    const currentPane = document.getElementById(`step-pane-${this.currentStep}`);
    if (!currentPane || !window.FormValidator) return true;
    return window.FormValidator.validateContainer(currentPane);
  },

  bindConditionalFields() {
    // Property Type Radio changes
    const propTypeRadios = document.querySelectorAll("input[name='propertyType']");
    propTypeRadios.forEach(radio => {
      radio.addEventListener("change", () => this.evaluateConditionalVisibility());
    });

    // Listing Type Radio changes (Sale vs Rent)
    const listingTypeRadios = document.querySelectorAll("input[name='listingType']");
    listingTypeRadios.forEach(radio => {
      radio.addEventListener("change", () => this.evaluateConditionalVisibility());
    });

    // Furnishing Status Radio changes
    const furnishingRadios = document.querySelectorAll("input[name='furnishing']");
    furnishingRadios.forEach(radio => {
      radio.addEventListener("change", () => this.evaluateConditionalVisibility());
    });
  },

  evaluateConditionalVisibility() {
    const form = document.getElementById("add-property-form");
    if (!form) return;

    const selectedPropType = form.querySelector("input[name='propertyType']:checked")?.value || "Apartment";
    const selectedListingType = form.querySelector("input[name='listingType']:checked")?.value || "Sale";
    const selectedFurnishing = form.querySelector("input[name='furnishing']:checked")?.value || "Semi-Furnished";

    // 1. Conditional: Apartment vs Plot vs Villa
    const apartmentOnlyFields = document.querySelectorAll(".cond-apartment-only");
    const plotOnlyFields = document.querySelectorAll(".cond-plot-only");
    const structureFields = document.querySelectorAll(".cond-structure-only"); // bedrooms, bathrooms, floors
    const villaOnlyFields = document.querySelectorAll(".cond-villa-only");

    if (selectedPropType === "Plot") {
      // Hide apartment & residential structure fields
      apartmentOnlyFields.forEach(el => el.classList.add("is-hidden"));
      structureFields.forEach(el => el.classList.add("is-hidden"));
      villaOnlyFields.forEach(el => el.classList.add("is-hidden"));
      // Show plot fields
      plotOnlyFields.forEach(el => el.classList.remove("is-hidden"));
    } else if (selectedPropType === "Villa" || selectedPropType === "House") {
      apartmentOnlyFields.forEach(el => el.classList.add("is-hidden"));
      plotOnlyFields.forEach(el => el.classList.add("is-hidden"));
      structureFields.forEach(el => el.classList.remove("is-hidden"));
      villaOnlyFields.forEach(el => el.classList.remove("is-hidden"));
    } else {
      // Apartment / Penthouse
      plotOnlyFields.forEach(el => el.classList.add("is-hidden"));
      villaOnlyFields.forEach(el => el.classList.add("is-hidden"));
      apartmentOnlyFields.forEach(el => el.classList.remove("is-hidden"));
      structureFields.forEach(el => el.classList.remove("is-hidden"));
    }

    // 2. Conditional: Sale vs Rent
    const rentOnlyFields = document.querySelectorAll(".cond-rent-only");
    const saleOnlyFields = document.querySelectorAll(".cond-sale-only");
    const priceLabel = document.getElementById("price-field-label");

    if (selectedListingType === "Rent") {
      rentOnlyFields.forEach(el => el.classList.remove("is-hidden"));
      saleOnlyFields.forEach(el => el.classList.add("is-hidden"));
      if (priceLabel) priceLabel.innerHTML = `Monthly Rent (₹) <span class="required-mark">*</span>`;
    } else {
      rentOnlyFields.forEach(el => el.classList.add("is-hidden"));
      saleOnlyFields.forEach(el => el.classList.remove("is-hidden"));
      if (priceLabel) priceLabel.innerHTML = `Expected Selling Price (₹) <span class="required-mark">*</span>`;
    }

    // 3. Conditional: Furnishing Items
    const furnishingItemsBlock = document.getElementById("cond-furnishing-items-block");
    if (furnishingItemsBlock) {
      if (selectedFurnishing === "Unfurnished" || selectedPropType === "Plot") {
        furnishingItemsBlock.classList.add("is-hidden");
      } else {
        furnishingItemsBlock.classList.remove("is-hidden");
      }
    }
  },

  bindQuantitySteppers() {
    document.querySelectorAll(".quantity-stepper-wrap").forEach(wrap => {
      const input = wrap.querySelector(".qty-input");
      const minusBtn = wrap.querySelector(".qty-minus");
      const plusBtn = wrap.querySelector(".qty-plus");

      if (!input || !minusBtn || !plusBtn) return;

      minusBtn.addEventListener("click", () => {
        let val = parseInt(input.value, 10) || 0;
        if (val > 0) {
          input.value = val - 1;
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }
      });

      plusBtn.addEventListener("click", () => {
        let val = parseInt(input.value, 10) || 0;
        if (val < 20) {
          input.value = val + 1;
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }
      });
    });
  },

  bindDraftHandlers() {
    const restoreBtn = document.getElementById("btn-restore-draft");
    const discardBtn = document.getElementById("btn-discard-draft");
    const manualSaveBtn = document.getElementById("btn-manual-save-draft");
    const banner = document.getElementById("draft-restore-banner");
    const form = document.getElementById("add-property-form");

    if (restoreBtn && form) {
      restoreBtn.addEventListener("click", () => {
        const draft = window.DraftStorage.getDraft("property_listing");
        if (draft && draft.data) {
          window.DraftStorage.populateForm(form, draft.data);
          this.evaluateConditionalVisibility();
          window.showToast("Saved draft restored successfully.", "success");
        }
        if (banner) banner.style.display = "none";
      });
    }

    if (discardBtn) {
      discardBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to discard your saved draft?")) {
          window.DraftStorage.clearDraft("property_listing");
          if (banner) banner.style.display = "none";
          window.showToast("Draft cleared.", "info");
        }
      });
    }

    if (manualSaveBtn && form) {
      manualSaveBtn.addEventListener("click", () => {
        const data = window.DraftStorage.serializeForm(form);
        window.DraftStorage.saveDraft("property_listing", data);
        window.showToast("Draft saved successfully.", "success");
      });
    }
  },

  bindFormSubmission() {
    const form = document.getElementById("add-property-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Validate all sections
      const isAllValid = window.FormValidator.validateContainer(form);
      if (!isAllValid) {
        window.showToast("Validation failed. Please correct the highlighted errors.", "error", 4000);
        return;
      }

      // Check image upload count
      const uploadedImages = this.imageManager ? this.imageManager.getUploadedFiles() : [];
      const coverPhoto = uploadedImages.length > 0
        ? uploadedImages[0].url
        : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

      const galleryUrls = uploadedImages.length > 0
        ? uploadedImages.map(img => img.url)
        : [coverPhoto, "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"];

      // Collect amenities
      const selectedAmenities = [];
      form.querySelectorAll("input[name='amenities']:checked").forEach(chk => {
        selectedAmenities.push(chk.value);
      });

      // Price calculation
      const rawPrice = Number(form.querySelector("[name='price']").value) || 0;
      const listingType = form.querySelector("input[name='listingType']:checked")?.value || "Sale";
      let formattedPrice = "";

      if (listingType === "Sale") {
        if (rawPrice >= 10000000) {
          formattedPrice = `₹${(rawPrice / 10000000).toFixed(2)} Cr`;
        } else {
          formattedPrice = `₹${(rawPrice / 100000).toFixed(2)} Lakh`;
        }
      } else {
        formattedPrice = `₹${rawPrice.toLocaleString('en-IN')} / mo`;
      }

      const area = Number(form.querySelector("[name='carpetArea']")?.value || form.querySelector("[name='plotArea']")?.value || 1000);
      const pricePerSqFt = rawPrice > 0 && area > 0 ? `₹${Math.round(rawPrice / area).toLocaleString('en-IN')} / sq.ft` : "";

      // Construct complete property record
      const newProperty = {
        id: "prop-" + Date.now().toString(36),
        title: form.querySelector("[name='title']").value.trim(),
        listingType: listingType,
        propertyType: form.querySelector("input[name='propertyType']:checked")?.value || "Apartment",
        purpose: form.querySelector("[name='purpose']")?.value || "Self-Occupancy",
        status: form.querySelector("[name='status']")?.value || "Ready to Move",
        description: form.querySelector("[name='description']").value.trim(),

        address: form.querySelector("[name='address']")?.value.trim() || "",
        unitNo: form.querySelector("[name='unitNo']")?.value.trim() || "",
        locality: form.querySelector("[name='locality']").value.trim(),
        city: form.querySelector("[name='city']").value.trim(),
        state: form.querySelector("[name='state']")?.value.trim() || "",
        pincode: form.querySelector("[name='pincode']").value.trim(),
        landmark: form.querySelector("[name='landmark']")?.value.trim() || "",

        bedrooms: Number(form.querySelector("[name='bedrooms']:checked")?.value || form.querySelector("[name='bedrooms']")?.value || 0),
        bathrooms: Number(form.querySelector("[name='bathrooms']")?.value || 0),
        balconies: Number(form.querySelector("[name='balconies']")?.value || 0),
        floorNo: Number(form.querySelector("[name='floorNo']")?.value || 0),
        totalFloors: Number(form.querySelector("[name='totalFloors']")?.value || 0),
        carpetArea: area,
        superBuiltUpArea: Number(form.querySelector("[name='superBuiltUpArea']")?.value || Math.round(area * 1.25)),
        plotArea: Number(form.querySelector("[name='plotArea']")?.value || 0),
        plotDimensions: form.querySelector("[name='plotDimensions']")?.value || "",
        roadWidth: form.querySelector("[name='roadWidth']")?.value || "",
        landType: form.querySelector("[name='landType']")?.value || "",
        propertyAge: form.querySelector("[name='propertyAge']")?.value || "New",
        facing: form.querySelector("[name='facing']")?.value || "North",

        price: rawPrice,
        formattedPrice: formattedPrice,
        pricePerSqFt: pricePerSqFt,
        priceNegotiable: form.querySelector("input[name='priceNegotiable']:checked")?.value === "Yes",
        maintenance: form.querySelector("[name='maintenance']")?.value || "Included",
        securityDeposit: form.querySelector("[name='securityDeposit']")?.value || "",

        amenities: selectedAmenities,
        furnishing: form.querySelector("input[name='furnishing']:checked")?.value || "Semi-Furnished",

        isVerified: true,
        isFeatured: false,
        imageUrl: coverPhoto,
        gallery: galleryUrls,

        owner: {
          name: form.querySelector("[name='ownerName']").value.trim(),
          phone: form.querySelector("[name='ownerPhone']").value.trim(),
          email: form.querySelector("[name='ownerEmail']").value.trim(),
          contactMethod: form.querySelector("input[name='ownerContactMethod']:checked")?.value || "Phone Call",
          role: "Listing Owner / Representative",
          rera: "RERA-VERIFIED-2026",
          photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
        },
        createdAt: new Date().toISOString()
      };

      // Store property
      window.PropertyStorage.add(newProperty);

      // Add to user's listings list
      const myListings = JSON.parse(localStorage.getItem("estatecraft_my_listings") || "[]");
      myListings.unshift(newProperty.id);
      localStorage.setItem("estatecraft_my_listings", JSON.stringify(myListings));

      // Clear draft
      window.DraftStorage.clearDraft("property_listing");

      window.showToast("Property listing published successfully!", "success", 4000);

      setTimeout(() => {
        window.location.href = `property-details.html?id=${newProperty.id}`;
      }, 800);
    });
  }
};

window.ListingFormWizard = ListingFormWizard;
