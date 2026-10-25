/**
 * DASHBOARD & LISTING MANAGEMENT CONTROLLER
 * Metric counters, user listings table with delete/view actions,
 * enquiries list, bookmarked properties, and draft resumption.
 */

const DashboardController = {
  init() {
    this.renderUserGreeting();
    this.updateMetrics();
    this.renderMyListingsTable();
    this.renderEnquiriesList();
    this.renderSavedGrid();
    this.renderDraftStatus();
    this.bindTabNavigation();
  },

  renderUserGreeting() {
    const user = window.AuthManager ? window.AuthManager.getUser() : null;
    const nameEl = document.getElementById("dash-user-name");
    const roleEl = document.getElementById("dash-user-role");
    const avatarEl = document.getElementById("dash-avatar");

    if (user) {
      if (nameEl) nameEl.textContent = `Welcome back, ${user.name}`;
      if (roleEl) roleEl.textContent = `${user.role} Account`;
      if (avatarEl) {
        avatarEl.textContent = user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
      }
    } else {
      if (nameEl) nameEl.textContent = "Welcome back, Investor";
      if (roleEl) roleEl.textContent = "Guest Session";
      if (avatarEl) avatarEl.textContent = "EC";
    }
  },

  updateMetrics() {
    const allProps = window.PropertyStorage ? window.PropertyStorage.getAll() : [];
    const myListingsIds = JSON.parse(localStorage.getItem("estatecraft_my_listings") || "[]");
    const enquiries = JSON.parse(localStorage.getItem("estatecraft_enquiries") || "[]");
    const saved = JSON.parse(localStorage.getItem("estatecraft_saved_properties") || "[]");
    const draft = window.DraftStorage ? window.DraftStorage.getDraft("property_listing") : null;

    // Filter user's listings or default to a reasonable sample if none added yet
    const myCount = myListingsIds.length > 0
      ? myListingsIds.length
      : Math.min(3, allProps.length);

    document.getElementById("metric-listings-count").textContent = myCount;
    document.getElementById("metric-enquiries-count").textContent = enquiries.length;
    document.getElementById("metric-saved-count").textContent = saved.length;
    document.getElementById("metric-drafts-count").textContent = (draft && draft.data) ? "1" : "0";

    // Tab counts
    const tabListingsCount = document.getElementById("tab-count-listings");
    const tabEnquiriesCount = document.getElementById("tab-count-enquiries");
    const tabSavedCount = document.getElementById("tab-count-saved");

    if (tabListingsCount) tabListingsCount.textContent = myCount;
    if (tabEnquiriesCount) tabEnquiriesCount.textContent = enquiries.length;
    if (tabSavedCount) tabSavedCount.textContent = saved.length;
  },

  renderMyListingsTable() {
    const tableBody = document.getElementById("my-listings-tbody");
    if (!tableBody) return;

    const allProps = window.PropertyStorage ? window.PropertyStorage.getAll() : [];
    const myListingsIds = JSON.parse(localStorage.getItem("estatecraft_my_listings") || "[]");

    let userProps = [];
    if (myListingsIds.length > 0) {
      userProps = allProps.filter(p => myListingsIds.includes(p.id));
    }
    // If user hasn't listed yet, show the first 3 properties as manageable demonstration listings
    if (userProps.length === 0) {
      userProps = allProps.slice(0, 3);
    }

    if (userProps.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 2rem;">
            No active property listings. <a href="add-property.html" style="font-weight: 600;">List your first property now.</a>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = userProps.map(p => `
      <tr data-id="${p.id}">
        <td>
          <div class="table-prop-cell">
            <img src="${p.imageUrl}" alt="${p.title}" class="table-prop-thumb">
            <div>
              <div class="table-prop-title"><a href="property-details.html?id=${p.id}">${p.title}</a></div>
              <div class="table-prop-location">${p.locality}, ${p.city}</div>
            </div>
          </div>
        </td>
        <td><span class="badge ${p.listingType === 'Sale' ? 'badge-sale' : 'badge-rent'}">${p.listingType}</span></td>
        <td><strong>${p.formattedPrice}</strong></td>
        <td>${p.propertyType}</td>
        <td><span class="badge badge-success">Published</span></td>
        <td>
          <div class="table-actions-cell">
            <a href="property-details.html?id=${p.id}" class="btn btn-secondary btn-sm" title="View Listing">View</a>
            <button type="button" class="btn btn-outline btn-sm" onclick="window.DashboardController.deleteListing('${p.id}')" title="Delete Listing" style="color:var(--color-error); border-color:var(--color-error);">Delete</button>
          </div>
        </td>
      </tr>
    `).join("");
  },

  deleteListing(propId) {
    if (!confirm("Are you sure you want to remove this property listing?")) return;

    if (window.PropertyStorage) {
      window.PropertyStorage.remove(propId);
    }

    let myListings = JSON.parse(localStorage.getItem("estatecraft_my_listings") || "[]");
    myListings = myListings.filter(id => id !== propId);
    localStorage.setItem("estatecraft_my_listings", JSON.stringify(myListings));

    window.showToast("Property listing deleted.", "info");
    this.updateMetrics();
    this.renderMyListingsTable();
  },

  renderEnquiriesList() {
    const listContainer = document.getElementById("dashboard-enquiries-list");
    if (!listContainer) return;

    const enquiries = JSON.parse(localStorage.getItem("estatecraft_enquiries") || "[]");

    if (enquiries.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path></svg>
          </div>
          <h3 class="empty-state-title">No Enquiries Received Yet</h3>
          <p class="empty-state-desc">Buyer inquiries and site visit reservations for your listings will be cataloged here in real-time.</p>
          <a href="properties.html" class="btn btn-outline btn-sm">Explore Marketplace</a>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = enquiries.map(enq => `
      <div class="enquiry-item-card" data-id="${enq.id}">
        <div class="enquiry-buyer-info">
          <div class="buyer-name">${enq.buyerName}</div>
          <div class="buyer-contact-line">
            <span>📞 ${enq.phone}</span>
            <span>✉️ ${enq.email}</span>
          </div>
          ${enq.visitDate ? `<div style="font-size:0.75rem; color:var(--color-primary); font-weight:600; margin-top:2px;">Requested Site Visit: ${enq.visitDate} (${enq.visitTime || 'Anytime'})</div>` : ''}
        </div>
        <div class="enquiry-prop-ref">
          <div class="prop-ref-label">Regarding:</div>
          <div class="prop-ref-title">${enq.propertyTitle}</div>
        </div>
        <div>
          <div class="enquiry-message-snippet">"${enq.message || 'No additional comment'}"</div>
        </div>
        <div>
          <span class="badge badge-verified">New Enquiry</span>
        </div>
      </div>
    `).join("");
  },

  renderSavedGrid() {
    const grid = document.getElementById("dashboard-saved-grid");
    if (!grid) return;

    const savedIds = JSON.parse(localStorage.getItem("estatecraft_saved_properties") || "[]");
    const allProps = window.PropertyStorage ? window.PropertyStorage.getAll() : [];
    const savedProps = allProps.filter(p => savedIds.includes(p.id));

    if (savedProps.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </div>
          <h3 class="empty-state-title">Your Saved Portfolio is Empty</h3>
          <p class="empty-state-desc">Click the bookmark icon on any property to save it to your private portfolio for rapid comparison.</p>
          <a href="properties.html" class="btn btn-primary btn-sm">Browse Properties</a>
        </div>
      `;
      return;
    }

    grid.innerHTML = savedProps.map(p => window.renderPropertyCard(p)).join("");
  },

  renderDraftStatus() {
    const draftCard = document.getElementById("dashboard-draft-card");
    if (!draftCard) return;

    const draft = window.DraftStorage ? window.DraftStorage.getDraft("property_listing") : null;

    if (draft && draft.data && Object.keys(draft.data).length > 0) {
      const timeAgo = window.DraftStorage.getTimeAgo(draft.timestamp);
      draftCard.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-weight: 600; font-size: 1rem; color: var(--color-text);">Partially Completed Property Listing</div>
            <div style="font-size: 0.8125rem; color: var(--color-text-secondary);">Last updated ${timeAgo} • ${Object.keys(draft.data).length} fields captured</div>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <a href="add-property.html" class="btn btn-primary btn-sm">Resume Listing</a>
            <button type="button" class="btn btn-outline btn-sm" onclick="window.DashboardController.discardDraft()">Discard Draft</button>
          </div>
        </div>
      `;
    } else {
      draftCard.innerHTML = `
        <div style="color: var(--color-text-muted); font-size: 0.875rem;">No active draft found. You can start creating a new property listing anytime.</div>
      `;
    }
  },

  discardDraft() {
    if (confirm("Are you sure you want to discard your saved draft?")) {
      window.DraftStorage.clearDraft("property_listing");
      this.updateMetrics();
      this.renderDraftStatus();
      window.showToast("Draft deleted.", "info");
    }
  },

  bindTabNavigation() {
    const tabs = document.querySelectorAll(".dash-tab-btn");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        const targetPanel = tab.dataset.panel;
        document.querySelectorAll(".dash-panel").forEach(p => p.style.display = "none");
        const activePanel = document.getElementById(`panel-${targetPanel}`);
        if (activePanel) activePanel.style.display = "block";
      });
    });
  }
};

window.DashboardController = DashboardController;
