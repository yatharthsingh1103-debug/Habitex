/**
 * MAIN APPLICATION ENTRYPOINT & GLOBAL UTILITIES
 * - Asynchronous component loader (navbar/footer) with resilient file:// fallback
 * - Toast notification system
 * - Global favorites/bookmarks management
 * - Consistent property card HTML generator
 */

// Toast notification function
window.showToast = function(message, type = "info", duration = 3500) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", "status");

  const icons = {
    success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
    warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
  };

  const titles = {
    success: "Success",
    error: "Attention Required",
    warning: "Notice",
    info: "Habitex Update"
  };

  toast.innerHTML = `
    <div style="color: var(--color-${type === 'error' ? 'error' : (type === 'success' ? 'success' : (type === 'warning' ? 'warning' : 'primary'))}); flex-shrink: 0; margin-top: 1px;">
      ${icons[type] || icons.info}
    </div>
    <div class="toast-content">
      <div class="toast-title">${titles[type] || "Notice"}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button type="button" class="toast-close" aria-label="Close notification">&times;</button>
  `;

  toast.querySelector(".toast-close").addEventListener("click", () => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 200);
  });

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      setTimeout(() => toast.remove(), 200);
    }
  }, duration);
};

// Global Favorites / Bookmarks Manager
window.isPropertySaved = function(propId) {
  const saved = JSON.parse(localStorage.getItem("estatecraft_saved_properties") || "[]");
  return saved.includes(propId);
};

window.toggleSaveProperty = function(propId, btnElement = null) {
  let saved = JSON.parse(localStorage.getItem("estatecraft_saved_properties") || "[]");
  const isCurrentlySaved = saved.includes(propId);

  if (isCurrentlySaved) {
    saved = saved.filter(id => id !== propId);
    localStorage.setItem("estatecraft_saved_properties", JSON.stringify(saved));
    if (btnElement) {
      btnElement.classList.remove("active");
    }
    window.showToast("Property removed from saved portfolio.", "info");
  } else {
    saved.push(propId);
    localStorage.setItem("estatecraft_saved_properties", JSON.stringify(saved));
    if (btnElement) {
      btnElement.classList.add("active");
    }
    window.showToast("Property bookmarked to your portfolio.", "success");
  }

  // Update all matching heart buttons on the page
  document.querySelectorAll(`.card-favorite-btn[data-id="${propId}"]`).forEach(btn => {
    if (isCurrentlySaved) {
      btn.classList.remove("active");
    } else {
      btn.classList.add("active");
    }
  });

  window.dispatchEvent(new CustomEvent("estatecraft-bookmarks-updated", { detail: { saved } }));
};

// Unified Property Card Generator
window.renderPropertyCard = function(prop) {
  const isSaved = window.isPropertySaved(prop.id);
  const badgeClass = prop.listingType === "Sale" ? "badge-sale" : "badge-rent";

  return `
    <article class="property-card" data-id="${prop.id}">
      <div class="card-image-wrap">
        <div class="card-badges">
          ${prop.isVerified ? `<span class="badge badge-verified">Verified</span>` : ""}
          <span class="badge ${badgeClass}">${prop.listingType === 'Sale' ? 'For Sale' : 'For Rent'}</span>
        </div>
        <button type="button" class="card-favorite-btn ${isSaved ? 'active' : ''}" data-id="${prop.id}" aria-label="Save to bookmarks" onclick="window.toggleSaveProperty('${prop.id}', this)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <a href="property-details.html?id=${prop.id}">
          <img src="${prop.imageUrl}" alt="${prop.title}" loading="lazy">
        </a>
      </div>
      <div class="card-body">
        <div class="card-price-row">
          <div class="card-price">${prop.formattedPrice}</div>
          <div class="card-price-sub">${prop.pricePerSqFt || ''}</div>
        </div>
        <h3 class="card-title">
          <a href="property-details.html?id=${prop.id}">${prop.title}</a>
        </h3>
        <div class="card-location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span>${prop.locality}, ${prop.city}</span>
        </div>
        <div class="card-specs">
          ${prop.bedrooms > 0 ? `
            <div class="spec-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7"/><path d="M2 11h20"/></svg>
              <span>${prop.bedrooms} BHK</span>
            </div>` : ''}
          ${prop.bathrooms > 0 ? `
            <div class="spec-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
              <span>${prop.bathrooms} Baths</span>
            </div>` : ''}
          <div class="spec-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
            <span>${prop.carpetArea || prop.superBuiltUpArea || 0} sq.ft</span>
          </div>
        </div>
        <div class="card-footer">
          <span class="badge badge-featured">${prop.propertyType}</span>
          <a href="property-details.html?id=${prop.id}" class="btn btn-outline btn-sm">View Details</a>
        </div>
      </div>
    </article>
  `;
};

// Fallback navbar HTML string if fetch fails (e.g. file:// protocol restriction)
const NAVBAR_FALLBACK_HTML = `
<div class="site-header" id="main-site-header">
  <div class="container navbar-inner">
    <a href="home.html" class="brand" aria-label="Habitex Home">
      <div class="brand-symbol">
        <img src="assets/icons/logo.svg" alt="Habitex Logo" width="38" height="38">
      </div>
      <div class="brand-text">
        <span class="brand-name">HABITEX</span>
        <span class="brand-tagline">discover where you belong</span>
      </div>
    </a>
    <nav class="nav-desktop" aria-label="Main Navigation">
      <ul class="nav-menu">
        <li class="nav-item"><a href="home.html" class="nav-link" data-page="home">Home</a></li>
        <li class="nav-item"><a href="properties.html?listingType=Sale" class="nav-link" data-page="buy">Buy</a></li>
        <li class="nav-item"><a href="properties.html?listingType=Rent" class="nav-link" data-page="rent">Rent</a></li>
        <li class="nav-item"><a href="add-property.html" class="nav-link" data-page="add-property">Sell</a></li>
        <li class="nav-item"><a href="enquiry.html" class="nav-link" data-page="enquiry">Enquiries</a></li>
        <li class="nav-item">
          <a href="saved-properties.html" class="nav-link" data-page="saved">
            Saved
            <span class="nav-badge-count" id="nav-saved-count">0</span>
          </a>
        </li>
        <li class="nav-item"><a href="dashboard.html" class="nav-link" data-page="dashboard">Dashboard</a></li>
      </ul>
    </nav>
    <div class="nav-actions">
      <a href="add-property.html" class="btn btn-primary btn-sm btn-list-property">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        <span>List Property</span>
      </a>
      <div class="nav-auth-wrap" id="nav-auth-container">
        <a href="login.html" class="btn btn-secondary btn-sm" id="nav-login-btn">Log In</a>
        <a href="register.html" class="btn btn-outline btn-sm" id="nav-register-btn">Register</a>
      </div>
      <button class="mobile-toggle-btn" id="mobile-menu-toggle" aria-label="Toggle mobile menu" aria-expanded="false">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
    </div>
  </div>
</div>
<div class="mobile-nav-backdrop" id="mobile-nav-backdrop"></div>
<div class="mobile-nav-drawer" id="mobile-nav-drawer" aria-label="Mobile Navigation" role="dialog" aria-modal="true">
  <div class="mobile-drawer-header">
    <a href="home.html" class="brand">
      <div class="brand-symbol">
        <img src="assets/icons/logo.svg" alt="Habitex Logo" width="38" height="38">
      </div>
      <div class="brand-text">
        <span class="brand-name">HABITEX</span>
        <span class="brand-tagline">discover where you belong</span>
      </div>
    </a>
    <button class="btn-icon-only btn-ghost" id="mobile-menu-close" aria-label="Close menu">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
  </div>
  <div class="mobile-drawer-body">
    <ul class="mobile-nav-list">
      <li><a href="home.html" class="nav-link" data-page="home">Home</a></li>
      <li><a href="properties.html?listingType=Sale" class="nav-link" data-page="buy">Buy Properties</a></li>
      <li><a href="properties.html?listingType=Rent" class="nav-link" data-page="rent">Rent Properties</a></li>
      <li><a href="add-property.html" class="nav-link" data-page="add-property">List a Property</a></li>
      <li><a href="enquiry.html" class="nav-link" data-page="enquiry">Enquiries</a></li>
      <li><a href="saved-properties.html" class="nav-link" data-page="saved">Saved Properties (<span class="mobile-saved-count">0</span>)</a></li>
      <li><a href="dashboard.html" class="nav-link" data-page="dashboard">My Dashboard</a></li>
      <li><a href="my-listings.html" class="nav-link" data-page="my-listings">My Listings</a></li>
      <li><a href="performance.html" class="nav-link" data-page="performance">Performance Lab</a></li>
      <li><a href="profile.html" class="nav-link" data-page="profile">Profile Settings</a></li>
    </ul>
  </div>
  <div class="mobile-drawer-footer" id="mobile-auth-footer">
    <a href="login.html" class="btn btn-secondary w-100">Log In</a>
    <a href="register.html" class="btn btn-primary w-100">Create Account</a>
  </div>
</div>
`;

// Fallback footer HTML string
const FOOTER_FALLBACK_HTML = `
<footer class="site-footer">
  <div class="container footer-top">
    <div class="footer-grid">
      <div class="footer-brand-wrap">
        <a href="home.html" class="footer-brand" aria-label="Habitex Home">
          <div class="footer-brand-symbol">
            <img src="assets/icons/logo.svg" alt="Habitex Logo" width="40" height="40">
          </div>
          <span class="footer-brand-title">HABITEX</span>
        </a>
        <p class="footer-brand-desc">
          A distinguished architectural marketplace connecting discerning buyers, institutional investors, and premier sellers across India's prime metropolitan enclaves. Discover where you belong.
        </p>
        <div class="footer-contact-items">
          <div class="footer-contact-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <span>+91 (0124) 492-8000</span>
          </div>
          <div class="footer-contact-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <span>enquiries@habitex.in</span>
          </div>
          <div class="footer-contact-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>DLF Horizon, Golf Course Road, Gurugram</span>
          </div>
        </div>
      </div>
      <div>
        <h4 class="footer-col-title">Properties</h4>
        <ul class="footer-links">
          <li><a href="properties.html?propertyType=Apartment" class="footer-link">Luxury Apartments</a></li>
          <li><a href="properties.html?propertyType=Villa" class="footer-link">Private Villas</a></li>
          <li><a href="properties.html?propertyType=Penthouse" class="footer-link">Penthouses</a></li>
          <li><a href="properties.html?propertyType=Plot" class="footer-link">Residential Plots</a></li>
          <li><a href="properties.html?propertyType=Commercial" class="footer-link">Commercial Real Estate</a></li>
          <li><a href="properties.html?listingType=Rent" class="footer-link">Executive Rentals</a></li>
        </ul>
      </div>
      <div>
        <h4 class="footer-col-title">Client Services</h4>
        <ul class="footer-links">
          <li><a href="add-property.html" class="footer-link">List Your Property</a></li>
          <li><a href="enquiry.html" class="footer-link">Schedule a Site Tour</a></li>
          <li><a href="saved-properties.html" class="footer-link">Saved Portfolios</a></li>
          <li><a href="performance.html" class="footer-link">Form Performance Lab</a></li>
          <li><a href="login.html" class="footer-link">Member Sign In</a></li>
          <li><a href="logout.html" class="footer-link">Session Sign Out</a></li>
        </ul>
      </div>
      <div>
        <h4 class="footer-col-title">Company</h4>
        <ul class="footer-links">
          <li><a href="home.html#about" class="footer-link">About Habitex</a></li>
          <li><a href="home.html#how-it-works" class="footer-link">Advisory Process</a></li>
          <li><a href="home.html#trust" class="footer-link">RERA Compliance</a></li>
          <li><a href="home.html#careers" class="footer-link">Career Opportunities</a></li>
          <li><a href="404.html" class="footer-link">Market Insights</a></li>
          <li><a href="profile.html" class="footer-link">Account Preferences</a></li>
        </ul>
      </div>
      <div class="footer-newsletter-wrap">
        <h4 class="footer-col-title">Market Intelligence</h4>
        <p class="newsletter-desc">
          Subscribe to our fortnightly dispatch covering prime market transactions and exclusive off-market listings.
        </p>
        <form class="newsletter-form" id="footer-newsletter-form" onsubmit="event.preventDefault(); window.handleNewsletter(event);">
          <input type="email" class="newsletter-input" placeholder="Your corporate email" required aria-label="Newsletter email">
          <button type="submit" class="newsletter-btn">Join</button>
        </form>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="container footer-bottom-inner">
      <p>© 2026 Habitex Real Estate Advisors LLP. All rights reserved. RERA ID: HRERA-GGM-2024-912.</p>
      <ul class="footer-legal-links">
        <li><a href="javascript:void(0)" class="footer-legal-link">Privacy Policy</a></li>
        <li><a href="javascript:void(0)" class="footer-legal-link">Terms of Service</a></li>
        <li><a href="javascript:void(0)" class="footer-legal-link">Fair Housing Notice</a></li>
        <li><a href="javascript:void(0)" class="footer-legal-link">Sitemap</a></li>
      </ul>
    </div>
  </div>
</footer>
`;

// Component Loader Engine
async function loadComponent(targetId, filePath, fallbackHtml) {
  const mountEl = document.getElementById(targetId);
  if (!mountEl) return;

  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const html = await response.text();
    mountEl.innerHTML = html;
  } catch (err) {
    // Graceful fallback for local file:// access or network errors
    mountEl.innerHTML = fallbackHtml;
  }
}

// Global App Initialization
document.addEventListener("DOMContentLoaded", async () => {
  // 1. Load Navbar
  await loadComponent("navbar-mount", "components/navbar.html", NAVBAR_FALLBACK_HTML);
  if (window.NavbarController) {
    window.NavbarController.init();
  }

  // 2. Load Footer
  await loadComponent("footer-mount", "components/footer.html", FOOTER_FALLBACK_HTML);
});
