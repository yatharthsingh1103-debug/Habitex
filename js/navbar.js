/**
 * NAVBAR CONTROLLER
 * Handles mobile drawer toggle, active route highlighting,
 * live saved counter badge, and user session dropdown hydration.
 */

const NavbarController = {
  initialized: false,

  init() {
    this.bindEvents();
    this.updateActiveLink();
    this.updateSavedCount();
    this.renderAuthState();

    if (!this.initialized) {
      this.initialized = true;
      // Listen for bookmarks and auth changes across the app
      window.addEventListener("estatecraft-bookmarks-updated", () => this.updateSavedCount());
      window.addEventListener("estatecraft-auth-changed", () => this.renderAuthState());
      window.addEventListener("scroll", () => this.handleScroll(), { passive: true });
    }
  },

  bindEvents() {
    const mobileToggle = document.getElementById("mobile-menu-toggle");
    const mobileClose = document.getElementById("mobile-menu-close");
    const backdrop = document.getElementById("mobile-nav-backdrop");

    if (mobileToggle) {
      mobileToggle.addEventListener("click", () => this.openMobileMenu());
    }

    if (mobileClose) {
      mobileClose.addEventListener("click", () => this.closeMobileMenu());
    }

    if (backdrop) {
      backdrop.addEventListener("click", () => this.closeMobileMenu());
    }

    // Escape key closes mobile menu & dropdowns
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeMobileMenu();
        this.closeProfileDropdown();
      }
    });

    // Close profile dropdown when clicking outside
    document.addEventListener("click", (e) => {
      const menu = document.getElementById("user-profile-menu");
      if (menu && !menu.contains(e.target)) {
        this.closeProfileDropdown();
      }
    });
  },

  openMobileMenu() {
    const drawer = document.getElementById("mobile-nav-drawer");
    const backdrop = document.getElementById("mobile-nav-backdrop");
    const toggle = document.getElementById("mobile-menu-toggle");

    if (drawer && backdrop) {
      drawer.classList.add("open");
      backdrop.classList.add("open");
      if (toggle) toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
  },

  closeMobileMenu() {
    const drawer = document.getElementById("mobile-nav-drawer");
    const backdrop = document.getElementById("mobile-nav-backdrop");
    const toggle = document.getElementById("mobile-menu-toggle");

    if (drawer && backdrop) {
      drawer.classList.remove("open");
      backdrop.classList.remove("open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  },

  toggleProfileDropdown() {
    const dropdown = document.getElementById("profile-dropdown-menu");
    if (dropdown) {
      dropdown.classList.toggle("open");
    }
  },

  closeProfileDropdown() {
    const dropdown = document.getElementById("profile-dropdown-menu");
    if (dropdown) {
      dropdown.classList.remove("open");
    }
  },

  updateActiveLink() {
    const currentPath = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
      const href = link.getAttribute("href") || "";
      const pageKey = link.dataset.page;

      link.classList.remove("active");

      if (
        (currentPath.endsWith(href) && href !== "home.html") ||
        (currentPath.endsWith("/") && href === "home.html") ||
        (currentPath.includes("home.html") && pageKey === "home") ||
        (currentPath.includes("properties.html") && (pageKey === "buy" || pageKey === "rent")) ||
        (currentPath.includes("add-property.html") && pageKey === "add-property") ||
        (currentPath.includes("enquiry.html") && pageKey === "enquiry") ||
        (currentPath.includes("saved-properties.html") && pageKey === "saved") ||
        (currentPath.includes("dashboard.html") && pageKey === "dashboard")
      ) {
        link.classList.add("active");
      }
    });
  },

  updateSavedCount() {
    const saved = JSON.parse(localStorage.getItem("estatecraft_saved_properties") || "[]");
    const count = saved.length;

    const navBadge = document.getElementById("nav-saved-count");
    if (navBadge) {
      navBadge.textContent = count;
      navBadge.style.display = count > 0 ? "inline-flex" : "none";
    }

    const mobileBadges = document.querySelectorAll(".mobile-saved-count");
    mobileBadges.forEach(el => el.textContent = count);
  },

  renderAuthState() {
    const authContainer = document.getElementById("nav-auth-container");
    const mobileFooter = document.getElementById("mobile-auth-footer");
    const user = window.AuthManager ? window.AuthManager.getUser() : null;

    if (!authContainer) return;

    if (user) {
      const initials = user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

      authContainer.innerHTML = `
        <div class="user-profile-menu" id="user-profile-menu">
          <button type="button" class="user-profile-btn" id="user-dropdown-trigger" aria-label="Open user profile menu">
            <div class="user-avatar">${initials}</div>
            <span class="user-name-short">${user.name.split(" ")[0]}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div class="profile-dropdown" id="profile-dropdown-menu">
            <div class="dropdown-user-header">
              <div class="dropdown-user-name">${user.name}</div>
              <div class="dropdown-user-role">${user.role} Member</div>
            </div>
            <a href="dashboard.html" class="dropdown-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              <span>Dashboard</span>
            </a>
            <a href="my-listings.html" class="dropdown-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
              <span>My Listings</span>
            </a>
            <a href="saved-properties.html" class="dropdown-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              <span>Saved Properties</span>
            </a>
            <a href="performance.html" class="dropdown-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              <span>Performance Lab</span>
            </a>
            <a href="profile.html" class="dropdown-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              <span>Profile Settings</span>
            </a>
            <div class="dropdown-divider"></div>
            <button type="button" class="dropdown-logout-btn" id="nav-logout-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      `;

      const trigger = document.getElementById("user-dropdown-trigger");
      if (trigger) {
        trigger.addEventListener("click", (e) => {
          e.stopPropagation();
          this.toggleProfileDropdown();
        });
      }

      const logoutBtn = document.getElementById("nav-logout-btn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => window.AuthManager.logout());
      }

      // Sync mobile drawer footer
      if (mobileFooter) {
        mobileFooter.innerHTML = `
          <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.5rem;">
            <div class="user-avatar">${initials}</div>
            <div>
              <div style="font-weight:600; font-size:0.9rem;">${user.name}</div>
              <div style="font-size:0.75rem; color:var(--color-accent);">${user.role} Member</div>
            </div>
          </div>
          <button type="button" class="btn btn-danger btn-sm w-100" id="mobile-logout-btn">Sign Out</button>
        `;
        document.getElementById("mobile-logout-btn")?.addEventListener("click", () => window.AuthManager.logout());
      }
    } else {
      authContainer.innerHTML = `
        <a href="login.html" class="btn btn-secondary btn-sm" id="nav-login-btn">Log In</a>
        <a href="register.html" class="btn btn-outline btn-sm" id="nav-register-btn">Register</a>
      `;

      if (mobileFooter) {
        mobileFooter.innerHTML = `
          <a href="login.html" class="btn btn-secondary w-100" style="margin-bottom: 0.5rem;">Log In</a>
          <a href="register.html" class="btn btn-primary w-100">Create Account</a>
        `;
      }
    }
  },

  handleScroll() {
    const header = document.getElementById("main-site-header");
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
  }
};

window.NavbarController = NavbarController;
