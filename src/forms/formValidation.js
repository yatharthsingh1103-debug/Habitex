/**
 * FORM VALIDATION LOGIC
 * Reusable validation functions, patterns, and per-step verification.
 */

export const PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  indianPhone: /^[6-9]\d{9}$/,
  pincode: /^[1-9][0-9]{5}$/,
  positiveNumber: /^\d+(\.\d+)?$/
};

export function validateField(name, value, allValues = {}) {
  const val = typeof value === "string" ? value.trim() : value;

  // 1. Basic Info
  if (name === "title") {
    if (!val) return "Listing title is required.";
    if (val.length < 10) return "Title must be at least 10 characters for clarity.";
    if (val.length > 120) return "Title must not exceed 120 characters.";
  }

  if (name === "description") {
    if (!val) return "Description is required.";
    if (val.length < 30) return "Please provide at least 30 characters describing the property.";
  }

  // 2. Location
  if (name === "address") {
    if (!val) return "Street address is required.";
  }
  if (name === "locality") {
    if (!val) return "Locality or sector is required.";
  }
  if (name === "city") {
    if (!val) return "City is required.";
  }
  if (name === "pincode") {
    if (!val) return "Pincode is required.";
    if (!PATTERNS.pincode.test(val)) return "Please enter a valid 6-digit Indian pincode.";
  }

  // 3. Property Details (Conditional by propertyType)
  const isPlot = allValues.propertyType === "Plot";

  if (!isPlot) {
    if (name === "carpetArea") {
      if (!val) return "Carpet area is required.";
      if (isNaN(val) || Number(val) <= 0) return "Carpet area must be a positive number.";
    }
    if (name === "superBuiltUpArea") {
      if (val && (isNaN(val) || Number(val) <= 0)) {
        return "Super built-up area must be a positive number.";
      }
      if (val && allValues.carpetArea && Number(val) < Number(allValues.carpetArea)) {
        return "Super built-up area cannot be less than carpet area.";
      }
    }
  } else {
    // If Plot
    if (name === "plotArea") {
      if (!val) return "Plot area is required.";
      if (isNaN(val) || Number(val) <= 0) return "Plot area must be a positive number.";
    }
  }

  // 4. Pricing (Conditional by listingType)
  if (name === "expectedPrice") {
    if (!val) {
      return allValues.listingType === "Rent"
        ? "Monthly rent is required."
        : "Expected price is required.";
    }
    if (isNaN(val) || Number(val) <= 0) return "Price must be a valid positive amount.";
  }

  if (name === "securityDeposit" && allValues.listingType === "Rent") {
    if (val && (isNaN(val) || Number(val) < 0)) return "Security deposit must be a valid number.";
  }

  // 7. Contact Info
  if (name === "ownerName") {
    if (!val) return "Contact name is required.";
  }
  if (name === "ownerPhone") {
    if (!val) return "Contact phone number is required.";
    const clean = String(val).replace(/\D/g, "");
    if (!PATTERNS.indianPhone.test(clean)) {
      return "Please enter a valid 10-digit Indian mobile number (starts with 6-9).";
    }
  }
  if (name === "ownerEmail") {
    if (!val) return "Email address is required.";
    if (!PATTERNS.email.test(val)) return "Please enter a valid email address.";
  }

  return "";
}

/**
 * Validates all fields within a specific wizard step.
 * Returns { isValid: boolean, errors: Object, firstErrorField: string }
 */
export function validateStep(step, formData) {
  const errors = {};
  const isPlot = formData.propertyType === "Plot";

  const fieldsByStep = {
    1: ["title", "description"],
    2: ["address", "locality", "city", "pincode"],
    3: isPlot ? ["plotArea"] : ["carpetArea"],
    4: ["expectedPrice"],
    5: [], // Amenities are optional
    6: [], // Furnishing inventory counts are optional
    7: ["ownerName", "ownerPhone", "ownerEmail"],
    8: []  // Images can be published or added later
  };

  const fieldsToCheck = fieldsByStep[step] || [];
  for (const field of fieldsToCheck) {
    const errorMsg = validateField(field, formData[field], formData);
    if (errorMsg) {
      errors[field] = errorMsg;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    firstErrorField: Object.keys(errors)[0] || null
  };
}

/**
 * Full validation of entire form before final submission.
 */
export function validateFullForm(formData) {
  const errors = {};
  for (let s = 1; s <= 8; s++) {
    const res = validateStep(s, formData);
    Object.assign(errors, res.errors);
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    firstErrorField: Object.keys(errors)[0] || null
  };
}
