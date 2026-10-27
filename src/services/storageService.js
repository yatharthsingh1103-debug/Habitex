/**
 * STORAGE SERVICE — LocalStorage Persistence Layer
 * Centralizes read/write operations for properties, favorites, enquiries, and drafts.
 * Implements fallback migration for previously saved data.
 */

import { INITIAL_PROPERTIES } from "../data/properties";

const KEYS = {
  PROPERTIES: "habitex_properties",
  LEGACY_PROPERTIES: "estatecraft_properties",
  FAVORITES: "habitex_favorites",
  LEGACY_FAVORITES: "estatecraft_saved_properties",
  ENQUIRIES: "habitex_enquiries",
  LEGACY_ENQUIRIES: "estatecraft_enquiries",
  DRAFT: "habitex_property_draft",
  USER: "habitex_user",
  LEGACY_USER: "estatecraft_current_user",
  MY_LISTINGS: "habitex_my_listings",
  LEGACY_MY_LISTINGS: "estatecraft_my_listings"
};

export const StorageService = {
  // Properties
  getProperties() {
    try {
      const data = localStorage.getItem(KEYS.PROPERTIES) || localStorage.getItem(KEYS.LEGACY_PROPERTIES);
      if (!data) {
        this.saveProperties(INITIAL_PROPERTIES);
        return INITIAL_PROPERTIES;
      }
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PROPERTIES;
    } catch (e) {
      console.warn("StorageService: Error parsing properties, resetting to initial", e);
      return INITIAL_PROPERTIES;
    }
  },

  saveProperties(properties) {
    try {
      localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(properties));
    } catch (e) {
      console.error("StorageService: Failed to save properties", e);
    }
  },

  // Favorites
  getFavorites() {
    try {
      const data = localStorage.getItem(KEYS.FAVORITES) || localStorage.getItem(KEYS.LEGACY_FAVORITES);
      if (!data) return ["prop-101", "prop-102"]; // Seed with sample bookmarks for instant demo
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn("StorageService: Error parsing favorites", e);
      return [];
    }
  },

  saveFavorites(favoriteIds) {
    try {
      localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favoriteIds));
    } catch (e) {
      console.error("StorageService: Failed to save favorites", e);
    }
  },

  // Enquiries
  getEnquiries() {
    try {
      const data = localStorage.getItem(KEYS.ENQUIRIES) || localStorage.getItem(KEYS.LEGACY_ENQUIRIES);
      if (!data) {
        const seedEnquiries = [
          {
            id: "enq-901",
            propertyId: "prop-101",
            propertyTitle: "The Camellias Ultra-Luxury Penthouse",
            clientName: "Sunil Munjal",
            email: "s.munjal@herocorp.com",
            phone: "9811099201",
            contactMethod: "WhatsApp",
            enquiryType: "Accompanied Site Inspection",
            preferredDate: "2026-11-05",
            preferredTime: "11:00 AM",
            message: "Interested in private viewing for family office portfolio.",
            status: "Scheduled",
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
          },
          {
            id: "enq-902",
            propertyId: "prop-103",
            propertyTitle: "Indiranagar Courtyard Garden Villa",
            clientName: "Ananya Deshmukh",
            email: "ananya.d@investor.in",
            phone: "9820011234",
            contactMethod: "Phone Call",
            enquiryType: "Cadastral Survey & Title Verification",
            preferredDate: "2026-11-08",
            preferredTime: "03:30 PM",
            message: "Requesting certified encumbrance certificate and RERA survey dossier.",
            status: "Pending",
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ];
        this.saveEnquiries(seedEnquiries);
        return seedEnquiries;
      }
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn("StorageService: Error parsing enquiries", e);
      return [];
    }
  },

  saveEnquiries(enquiries) {
    try {
      localStorage.setItem(KEYS.ENQUIRIES, JSON.stringify(enquiries));
    } catch (e) {
      console.error("StorageService: Failed to save enquiries", e);
    }
  },

  // Form Draft
  getDraft() {
    try {
      const data = localStorage.getItem(KEYS.DRAFT);
      if (!data) return null;
      return JSON.parse(data);
    } catch (e) {
      console.warn("StorageService: Error reading draft", e);
      return null;
    }
  },

  saveDraft(draftData) {
    try {
      localStorage.setItem(KEYS.DRAFT, JSON.stringify({
        data: draftData,
        savedAt: new Date().toISOString()
      }));
    } catch (e) {
      console.error("StorageService: Failed to save draft", e);
    }
  },

  clearDraft() {
    try {
      localStorage.removeItem(KEYS.DRAFT);
    } catch (e) {
      console.error("StorageService: Failed to clear draft", e);
    }
  },

  // Auth User
  getUser() {
    try {
      const data = localStorage.getItem(KEYS.USER) || localStorage.getItem(KEYS.LEGACY_USER);
      if (!data) return null;
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  },

  saveUser(user) {
    try {
      localStorage.setItem(KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error("StorageService: Failed to save user", e);
    }
  },

  clearUser() {
    try {
      localStorage.removeItem(KEYS.USER);
      localStorage.removeItem(KEYS.LEGACY_USER);
    } catch (e) {
      console.error("StorageService: Failed to clear user", e);
    }
  },

  // My Listings
  getMyListings() {
    try {
      const data = localStorage.getItem(KEYS.MY_LISTINGS) || localStorage.getItem(KEYS.LEGACY_MY_LISTINGS);
      if (!data) return ["prop-101", "prop-103"];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  },

  saveMyListings(ids) {
    try {
      localStorage.setItem(KEYS.MY_LISTINGS, JSON.stringify(ids));
    } catch (e) {
      console.error("StorageService: Failed to save my listings", e);
    }
  }
};
