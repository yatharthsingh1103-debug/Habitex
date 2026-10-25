/**
 * ENQUIRY & SITE VISIT BOOKING CONTROLLER
 * Handles standalone enquiry page, visit scheduling, field validation,
 * pre-filling property reference, and enquiry persistence in localStorage.
 */

const EnquiryController = {
  init() {
    this.populatePropertyDropdown();
    this.prefillFromQuery();
    this.setMinVisitDate();
    this.bindForm();
  },

  populatePropertyDropdown() {
    const select = document.getElementById("enquiry-property-select");
    if (!select) return;

    const properties = window.PropertyStorage ? window.PropertyStorage.getAll() : [];
    properties.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = `${p.title} (${p.locality}, ${p.city}) — ${p.formattedPrice}`;
      select.appendChild(opt);
    });
  },

  prefillFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const propId = params.get("propId") || params.get("id");
    const select = document.getElementById("enquiry-property-select");

    if (propId && select) {
      select.value = propId;
    }

    // Pre-fill user details if logged in
    const user = window.AuthManager ? window.AuthManager.getUser() : null;
    if (user) {
      const nameInput = document.getElementById("enquiry-name");
      const emailInput = document.getElementById("enquiry-email");
      const phoneInput = document.getElementById("enquiry-phone");

      if (nameInput && !nameInput.value) nameInput.value = user.name;
      if (emailInput && !emailInput.value) emailInput.value = user.email;
      if (phoneInput && !phoneInput.value && user.phone) phoneInput.value = user.phone;
    }
  },

  setMinVisitDate() {
    const dateInput = document.getElementById("enquiry-visit-date");
    if (dateInput) {
      const today = new Date().toISOString().split("T")[0];
      dateInput.setAttribute("min", today);
    }
  },

  bindForm() {
    const form = document.getElementById("enquiry-main-form");
    if (!form) return;

    window.FormValidator.attachLiveValidation(form);

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const isValid = window.FormValidator.validateContainer(form);
      if (!isValid) {
        window.showToast("Please address highlighted validation errors.", "error");
        return;
      }

      // Collect data
      const propSelect = document.getElementById("enquiry-property-select");
      const selectedPropText = propSelect?.options[propSelect.selectedIndex]?.text || "General Portfolio Inquiry";
      const propId = propSelect?.value || "";

      const enquiryData = {
        id: "enq_" + Date.now().toString(36),
        propertyId: propId,
        propertyTitle: selectedPropText,
        buyerName: document.getElementById("enquiry-name").value.trim(),
        email: document.getElementById("enquiry-email").value.trim(),
        phone: document.getElementById("enquiry-phone").value.trim(),
        contactMethod: form.querySelector("input[name='contactMethod']:checked")?.value || "Phone Call",
        enquiryType: document.getElementById("enquiry-type").value,
        visitDate: document.getElementById("enquiry-visit-date")?.value || "",
        visitTime: document.getElementById("enquiry-visit-time")?.value || "",
        message: document.getElementById("enquiry-message").value.trim(),
        status: "New",
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      const list = JSON.parse(localStorage.getItem("estatecraft_enquiries") || "[]");
      list.unshift(enquiryData);
      localStorage.setItem("estatecraft_enquiries", JSON.stringify(list));

      // Display Success State
      const container = document.getElementById("enquiry-form-card");
      if (container) {
        container.innerHTML = `
          <div class="empty-state" style="padding: 3rem 1.5rem;">
            <div class="empty-state-icon" style="background-color: var(--color-success-bg); color: var(--color-success);">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h2 class="empty-state-title" style="font-size: 1.6rem;">Enquiry Registered Successfully</h2>
            <p class="empty-state-desc" style="max-width: 480px; margin: 0 auto 1.5rem;">
              Your consultation request for <strong>${enquiryData.propertyTitle}</strong> has been assigned to a Senior Private Advisor. You will be contacted via ${enquiryData.contactMethod} shortly.
            </p>
            <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
              <a href="properties.html" class="btn btn-primary btn-sm">Explore More Properties</a>
              <a href="dashboard.html" class="btn btn-secondary btn-sm">View in Dashboard</a>
            </div>
          </div>
        `;
      }

      window.showToast("Enquiry submitted successfully.", "success", 4000);
    });
  }
};

window.EnquiryController = EnquiryController;
