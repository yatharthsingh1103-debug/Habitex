/**
 * PROPERTIES CATALOG CONTROLLER
 * Real-time multi-criteria filtering, multi-sort, active filter chips,
 * grid/list view toggle, URL search params sync, and pagination.
 */

const PropertiesCatalog = {
  state: {
    properties: [],
    filtered: [],
    searchQuery: "",
    listingType: "All",
    propertyType: "All",
    city: "All",
    bedrooms: "Any",
    minPrice: 0,
    maxPrice: 500000000,
    furnishing: "All",
    verifiedOnly: false,
    selectedAmenities: [],
    sortBy: "recommended",
    viewMode: "grid", // 'grid' | 'list'
    currentPage: 1,
    pageSize: 9
  },

  init() {
    // Load dataset
    this.state.properties = window.PropertyStorage ? window.PropertyStorage.getAll() : [];
    this.parseURLParams();
    this.bindDOMEvents();
    this.applyFilters();
  },

  parseURLParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("listingType")) {
      this.state.listingType = params.get("listingType");
    }
    if (params.has("propertyType")) {
      this.state.propertyType = params.get("propertyType");
    }
    if (params.has("city")) {
      this.state.city = params.get("city");
    }
    if (params.has("search")) {
      this.state.searchQuery = params.get("search");
      const searchInput = document.getElementById("catalog-search-input");
      if (searchInput) searchInput.value = this.state.searchQuery;
    }

    // Sync UI elements to initial URL state
    this.syncUIToState();
  },

  syncUIToState() {
    // Listing type pills
    document.querySelectorAll(".filter-pill[data-filter='listingType']").forEach(pill => {
      pill.classList.toggle("active", pill.dataset.val === this.state.listingType);
    });

    // Property type pills
    document.querySelectorAll(".filter-pill[data-filter='propertyType']").forEach(pill => {
      pill.classList.toggle("active", pill.dataset.val === this.state.propertyType);
    });

    // City select
    const citySelect = document.getElementById("filter-city-select");
    if (citySelect && this.state.city !== "All") {
      citySelect.value = this.state.city;
    }

    // Bedrooms pills
    document.querySelectorAll(".filter-pill[data-filter='bedrooms']").forEach(pill => {
      pill.classList.toggle("active", pill.dataset.val === this.state.bedrooms);
    });
  },

  bindDOMEvents() {
    // Search input
    const searchInput = document.getElementById("catalog-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.state.searchQuery = e.target.value.trim().toLowerCase();
        this.state.currentPage = 1;
        this.applyFilters();
      });
    }

    // Filter pills (listingType, propertyType, bedrooms)
    document.querySelectorAll(".filter-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        const filterKey = pill.dataset.filter;
        const filterVal = pill.dataset.val;

        // Toggle active style in parent group
        pill.parentElement.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");

        this.state[filterKey] = filterVal;
        this.state.currentPage = 1;
        this.applyFilters();
      });
    });

    // City select
    const citySelect = document.getElementById("filter-city-select");
    if (citySelect) {
      citySelect.addEventListener("change", (e) => {
        this.state.city = e.target.value;
        this.state.currentPage = 1;
        this.applyFilters();
      });
    }

    // Price inputs
    const minPriceInput = document.getElementById("filter-min-price");
    const maxPriceInput = document.getElementById("filter-max-price");

    if (minPriceInput) {
      minPriceInput.addEventListener("change", (e) => {
        this.state.minPrice = Number(e.target.value) || 0;
        this.state.currentPage = 1;
        this.applyFilters();
      });
    }
    if (maxPriceInput) {
      maxPriceInput.addEventListener("change", (e) => {
        this.state.maxPrice = Number(e.target.value) || 500000000;
        this.state.currentPage = 1;
        this.applyFilters();
      });
    }

    // Furnishing radio inputs
    document.querySelectorAll("input[name='filter-furnishing']").forEach(radio => {
      radio.addEventListener("change", (e) => {
        this.state.furnishing = e.target.value;
        this.state.currentPage = 1;
        this.applyFilters();
      });
    });

    // Verified only checkbox
    const verifiedChk = document.getElementById("filter-verified-only");
    if (verifiedChk) {
      verifiedChk.addEventListener("change", (e) => {
        this.state.verifiedOnly = e.target.checked;
        this.state.currentPage = 1;
        this.applyFilters();
      });
    }

    // Amenities checkboxes
    document.querySelectorAll(".amenity-filter-chk").forEach(chk => {
      chk.addEventListener("change", () => {
        const selected = [];
        document.querySelectorAll(".amenity-filter-chk:checked").forEach(c => selected.push(c.value));
        this.state.selectedAmenities = selected;
        this.state.currentPage = 1;
        this.applyFilters();
      });
    });

    // Reset filters button
    const resetBtn = document.getElementById("filters-reset-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => this.resetFilters());
    }

    // Sort select
    const sortSelect = document.getElementById("catalog-sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.state.sortBy = e.target.value;
        this.applySort();
        this.renderCatalog();
      });
    }

    // View toggle buttons (Grid / List)
    const gridBtn = document.getElementById("view-btn-grid");
    const listBtn = document.getElementById("view-btn-list");
    const container = document.getElementById("catalog-properties-grid");

    if (gridBtn && listBtn && container) {
      gridBtn.addEventListener("click", () => {
        this.state.viewMode = "grid";
        gridBtn.classList.add("active");
        listBtn.classList.remove("active");
        container.classList.remove("list-view");
      });

      listBtn.addEventListener("click", () => {
        this.state.viewMode = "list";
        listBtn.classList.add("active");
        gridBtn.classList.remove("active");
        container.classList.add("list-view");
      });
    }

    // Mobile filter drawer toggles
    const mobileFilterBtn = document.getElementById("btn-open-filters-mobile");
    const sidebar = document.getElementById("filters-sidebar");
    const closeFilterBtn = document.getElementById("btn-close-filters-mobile");

    if (mobileFilterBtn && sidebar) {
      mobileFilterBtn.addEventListener("click", () => {
        sidebar.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    }
    if (closeFilterBtn && sidebar) {
      closeFilterBtn.addEventListener("click", () => {
        sidebar.classList.remove("open");
        document.body.style.overflow = "";
      });
    }
  },

  applyFilters() {
    let result = [...this.state.properties];

    // 1. Search Query
    if (this.state.searchQuery) {
      const q = this.state.searchQuery;
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.locality.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        (p.address && p.address.toLowerCase().includes(q))
      );
    }

    // 2. Listing Type (Sale / Rent)
    if (this.state.listingType && this.state.listingType !== "All") {
      result = result.filter(p => p.listingType.toLowerCase() === this.state.listingType.toLowerCase());
    }

    // 3. Property Type (Apartment, Villa, Plot, etc.)
    if (this.state.propertyType && this.state.propertyType !== "All") {
      result = result.filter(p => p.propertyType.toLowerCase() === this.state.propertyType.toLowerCase());
    }

    // 4. City
    if (this.state.city && this.state.city !== "All") {
      result = result.filter(p => p.city.toLowerCase() === this.state.city.toLowerCase());
    }

    // 5. Bedrooms
    if (this.state.bedrooms && this.state.bedrooms !== "Any") {
      const targetBhk = parseInt(this.state.bedrooms, 10);
      if (this.state.bedrooms === "5+") {
        result = result.filter(p => p.bedrooms >= 5);
      } else {
        result = result.filter(p => p.bedrooms === targetBhk);
      }
    }

    // 6. Price Range
    if (this.state.minPrice > 0) {
      result = result.filter(p => p.price >= this.state.minPrice);
    }
    if (this.state.maxPrice < 500000000) {
      result = result.filter(p => p.price <= this.state.maxPrice);
    }

    // 7. Furnishing
    if (this.state.furnishing && this.state.furnishing !== "All") {
      result = result.filter(p => p.furnishing && p.furnishing.toLowerCase().includes(this.state.furnishing.toLowerCase()));
    }

    // 8. Verified Only
    if (this.state.verifiedOnly) {
      result = result.filter(p => p.isVerified);
    }

    // 9. Amenities
    if (this.state.selectedAmenities.length > 0) {
      result = result.filter(p => {
        if (!p.amenities) return false;
        return this.state.selectedAmenities.every(a => p.amenities.includes(a));
      });
    }

    this.state.filtered = result;
    this.applySort();
    this.renderActiveFilterChips();
    this.renderCatalog();
  },

  applySort() {
    const sortBy = this.state.sortBy;
    if (sortBy === "price-asc") {
      this.state.filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      this.state.filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "area-desc") {
      this.state.filtered.sort((a, b) => (b.carpetArea || 0) - (a.carpetArea || 0));
    } else {
      // Recommended / Default
      this.state.filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
  },

  renderActiveFilterChips() {
    const bar = document.getElementById("active-filters-bar");
    if (!bar) return;

    const chips = [];

    if (this.state.searchQuery) {
      chips.push({ label: `Search: "${this.state.searchQuery}"`, key: "searchQuery", val: "" });
    }
    if (this.state.listingType !== "All") {
      chips.push({ label: `Type: ${this.state.listingType}`, key: "listingType", val: "All" });
    }
    if (this.state.propertyType !== "All") {
      chips.push({ label: `Category: ${this.state.propertyType}`, key: "propertyType", val: "All" });
    }
    if (this.state.city !== "All") {
      chips.push({ label: `City: ${this.state.city}`, key: "city", val: "All" });
    }
    if (this.state.bedrooms !== "Any") {
      chips.push({ label: `Bedrooms: ${this.state.bedrooms} BHK`, key: "bedrooms", val: "Any" });
    }
    if (this.state.verifiedOnly) {
      chips.push({ label: "Verified Only", key: "verifiedOnly", val: false });
    }
    if (this.state.furnishing !== "All") {
      chips.push({ label: `Furnishing: ${this.state.furnishing}`, key: "furnishing", val: "All" });
    }
    this.state.selectedAmenities.forEach(amenity => {
      chips.push({ label: amenity, key: "amenity", val: amenity });
    });

    if (chips.length === 0) {
      bar.innerHTML = "";
      bar.style.display = "none";
      return;
    }

    bar.style.display = "flex";
    bar.innerHTML = chips.map(chip => `
      <div class="filter-chip">
        <span>${chip.label}</span>
        <button type="button" class="filter-chip-remove" data-key="${chip.key}" data-val="${chip.val}" aria-label="Remove filter">
          &times;
        </button>
      </div>
    `).join("");

    bar.querySelectorAll(".filter-chip-remove").forEach(btn => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.key;
        const val = btn.dataset.val;

        if (key === "amenity") {
          this.state.selectedAmenities = this.state.selectedAmenities.filter(a => a !== val);
          const chk = document.querySelector(`.amenity-filter-chk[value="${val}"]`);
          if (chk) chk.checked = false;
        } else if (key === "verifiedOnly") {
          this.state.verifiedOnly = false;
          const chk = document.getElementById("filter-verified-only");
          if (chk) chk.checked = false;
        } else if (key === "searchQuery") {
          this.state.searchQuery = "";
          const searchInput = document.getElementById("catalog-search-input");
          if (searchInput) searchInput.value = "";
        } else {
          this.state[key] = val;
          this.syncUIToState();
        }

        this.applyFilters();
      });
    });
  },

  renderCatalog() {
    const grid = document.getElementById("catalog-properties-grid");
    const countEl = document.getElementById("catalog-results-count");
    if (!grid) return;

    const count = this.state.filtered.length;
    if (countEl) {
      countEl.innerHTML = `Showing <strong>${count}</strong> ${count === 1 ? 'property' : 'properties'} in India`;
    }

    if (count === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <h3 class="empty-state-title">No Matching Properties Found</h3>
          <p class="empty-state-desc">We couldn't find any listings matching your active filters. Try broadening your criteria or reset your search parameters.</p>
          <button type="button" class="btn btn-primary btn-sm" onclick="window.PropertiesCatalog.resetFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = this.state.filtered.map(p => window.renderPropertyCard(p)).join("");
  },

  resetFilters() {
    this.state.searchQuery = "";
    this.state.listingType = "All";
    this.state.propertyType = "All";
    this.state.city = "All";
    this.state.bedrooms = "Any";
    this.state.minPrice = 0;
    this.state.maxPrice = 500000000;
    this.state.furnishing = "All";
    this.state.verifiedOnly = false;
    this.state.selectedAmenities = [];

    // Reset inputs
    const searchInput = document.getElementById("catalog-search-input");
    if (searchInput) searchInput.value = "";

    const citySelect = document.getElementById("filter-city-select");
    if (citySelect) citySelect.value = "All";

    const verifiedChk = document.getElementById("filter-verified-only");
    if (verifiedChk) verifiedChk.checked = false;

    document.querySelectorAll(".amenity-filter-chk").forEach(c => c.checked = false);

    const furnishingAll = document.querySelector("input[name='filter-furnishing'][value='All']");
    if (furnishingAll) furnishingAll.checked = true;

    this.syncUIToState();
    this.applyFilters();
  }
};

window.PropertiesCatalog = PropertiesCatalog;
