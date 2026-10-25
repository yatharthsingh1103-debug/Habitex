/**
 * DRAFT PERSISTENCE & AUTOSAVE ENGINE
 * Manages form state in localStorage, debounced autosave,
 * live "Draft saved X seconds ago" indicator, and draft restoration.
 */

const DraftStorage = {
  STORAGE_PREFIX: "estatecraft_draft_",
  saveTimer: null,
  tickerTimer: null,

  /**
   * Save form data to localStorage
   */
  saveDraft(formKey, formData) {
    const payload = {
      timestamp: Date.now(),
      data: formData
    };
    try {
      localStorage.setItem(this.STORAGE_PREFIX + formKey, JSON.stringify(payload));
      this.updateIndicator(formKey);
      return true;
    } catch (e) {
      console.warn("Storage quota exceeded or unavailable", e);
      return false;
    }
  },

  /**
   * Retrieve saved draft
   */
  getDraft(formKey) {
    const raw = localStorage.getItem(this.STORAGE_PREFIX + formKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("Malformed draft data in localStorage", e);
      return null;
    }
  },

  /**
   * Clear draft from storage
   */
  clearDraft(formKey) {
    localStorage.removeItem(this.STORAGE_PREFIX + formKey);
    const indicator = document.getElementById("draft-status-indicator");
    if (indicator) {
      indicator.textContent = "No saved draft";
    }
    const dot = document.querySelector(".draft-indicator-dot");
    if (dot) {
      dot.style.backgroundColor = "var(--color-text-muted)";
    }
  },

  /**
   * Collect all inputs into a clean object
   */
  serializeForm(form) {
    const data = {};
    const elements = form.querySelectorAll("input, select, textarea");

    elements.forEach(el => {
      if (!el.name) return;

      if (el.type === "radio") {
        if (el.checked) {
          data[el.name] = el.value;
        }
      } else if (el.type === "checkbox") {
        if (!data[el.name]) data[el.name] = [];
        if (el.checked) {
          data[el.name].push(el.value);
        }
      } else if (el.type !== "file" && el.type !== "submit" && el.type !== "button") {
        data[el.name] = el.value;
      }
    });

    return data;
  },

  /**
   * Restore values from draft into form elements
   */
  populateForm(form, draftData) {
    if (!form || !draftData) return;

    Object.keys(draftData).forEach(key => {
      const val = draftData[key];
      const elements = form.querySelectorAll(`[name="${key}"]`);

      if (elements.length === 0) return;

      if (elements[0].type === "radio") {
        elements.forEach(radio => {
          radio.checked = (radio.value === val);
          radio.dispatchEvent(new Event("change", { bubbles: true }));
        });
      } else if (elements[0].type === "checkbox") {
        const checkVals = Array.isArray(val) ? val : [val];
        elements.forEach(chk => {
          chk.checked = checkVals.includes(chk.value);
          chk.dispatchEvent(new Event("change", { bubbles: true }));
        });
      } else {
        elements[0].value = val;
        elements[0].dispatchEvent(new Event("input", { bubbles: true }));
        elements[0].dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
  },

  /**
   * Calculate human readable elapsed time
   */
  getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 5) return "just now";
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes === 1) return "1 minute ago";
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return "1 hour ago";
    return `${hours} hours ago`;
  },

  /**
   * Update the UI banner text
   */
  updateIndicator(formKey) {
    const draft = this.getDraft(formKey);
    const textEl = document.getElementById("draft-status-indicator");
    const dot = document.querySelector(".draft-indicator-dot");

    if (!textEl) return;

    if (draft && draft.timestamp) {
      textEl.textContent = `Draft saved ${this.getTimeAgo(draft.timestamp)}`;
      if (dot) dot.style.backgroundColor = "var(--color-success)";
    } else {
      textEl.textContent = "No saved draft";
      if (dot) dot.style.backgroundColor = "var(--color-text-muted)";
    }
  },

  /**
   * Initialize automatic background draft saving
   */
  initAutoSave(formId, formKey, debounceDelay = 1000) {
    const form = document.getElementById(formId);
    if (!form) return;

    // Check if draft exists on load
    const existingDraft = this.getDraft(formKey);
    if (existingDraft && existingDraft.data && Object.keys(existingDraft.data).length > 0) {
      const banner = document.getElementById("draft-restore-banner");
      if (banner) {
        banner.style.display = "flex";
      }
    }

    this.updateIndicator(formKey);

    // Live tick updater for the "Draft saved X seconds ago" label
    if (this.tickerTimer) clearInterval(this.tickerTimer);
    this.tickerTimer = setInterval(() => {
      this.updateIndicator(formKey);
    }, 5000);

    // Debounced listener on form input
    form.addEventListener("input", () => {
      clearTimeout(this.saveTimer);
      const dot = document.querySelector(".draft-indicator-dot");
      if (dot) dot.style.backgroundColor = "var(--color-warning)";

      this.saveTimer = setTimeout(() => {
        const currentData = this.serializeForm(form);
        this.saveDraft(formKey, currentData);
      }, debounceDelay);
    });

    // Also trigger on change for selects/radios
    form.addEventListener("change", () => {
      clearTimeout(this.saveTimer);
      this.saveTimer = setTimeout(() => {
        const currentData = this.serializeForm(form);
        this.saveDraft(formKey, currentData);
      }, debounceDelay);
    });
  }
};

window.DraftStorage = DraftStorage;
