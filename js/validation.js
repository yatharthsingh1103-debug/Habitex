/**
 * FORM VALIDATION ENGINE
 * Supports: required, email, phone (10-digit Indian), pincode (6-digit), numbers,
 * min/max ranges, password rules, file checks, and dimension validation.
 * Features accessible ARIA error associations and timing (onBlur, onChange, onSubmit).
 */

const FormValidator = {
  // Regex patterns
  PATTERNS: {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    indianPhone: /^[6-9]\d{9}$/,
    pincode: /^[1-9][0-9]{5}$/,
    number: /^\d+$/,
    decimal: /^\d+(\.\d+)?$/
  },

  /**
   * Validate a single input element
   * @param {HTMLElement} input - Input, select or textarea element
   * @returns {Object} { isValid: boolean, message: string }
   */
  validateField(input) {
    if (!input || input.disabled) return { isValid: true, message: "" };

    const value = (input.value || "").trim();
    const isRequired = input.hasAttribute("required") || input.dataset.validate?.includes("required");
    const fieldType = input.dataset.type || input.type;
    const minLength = input.getAttribute("minlength");
    const maxLength = input.getAttribute("maxlength");
    const minVal = input.getAttribute("min");
    const maxVal = input.getAttribute("max");

    // 1. Required Check
    if (isRequired && !value) {
      const label = this.getFieldLabel(input);
      return { isValid: false, message: `${label} is required.` };
    }

    // If not required and empty, skip further format checks
    if (!value && !isRequired) {
      return { isValid: true, message: "" };
    }

    // 2. Email Check
    if (fieldType === "email" || input.dataset.validate?.includes("email")) {
      if (!this.PATTERNS.email.test(value)) {
        return { isValid: false, message: "Please enter a valid email address (e.g. name@example.com)." };
      }
    }

    // 3. Indian Phone Check
    if (fieldType === "tel" || input.dataset.validate?.includes("phone")) {
      const cleanPhone = value.replace(/\D/g, "");
      if (!this.PATTERNS.indianPhone.test(cleanPhone)) {
        return { isValid: false, message: "Please enter a valid 10-digit Indian mobile number starting with 6-9." };
      }
    }

    // 4. Indian Pincode Check
    if (input.dataset.validate?.includes("pincode") || input.name === "pincode") {
      if (!this.PATTERNS.pincode.test(value)) {
        return { isValid: false, message: "Please enter a valid 6-digit postal pincode." };
      }
    }

    // 5. Numeric / Positive Value Check
    if (fieldType === "number" || input.dataset.validate?.includes("numeric")) {
      const num = Number(value);
      if (isNaN(num)) {
        return { isValid: false, message: "Please enter a valid numeric value." };
      }
      if (minVal !== null && num < Number(minVal)) {
        return { isValid: false, message: `Minimum acceptable value is ${minVal}.` };
      }
      if (maxVal !== null && num > Number(maxVal)) {
        return { isValid: false, message: `Maximum acceptable value is ${maxVal}.` };
      }
    }

    // 6. Minlength / Maxlength
    if (minLength && value.length < Number(minLength)) {
      return { isValid: false, message: `Must be at least ${minLength} characters long.` };
    }
    if (maxLength && value.length > Number(maxLength)) {
      return { isValid: false, message: `Cannot exceed ${maxLength} characters.` };
    }

    // 7. Password validation
    if (fieldType === "password" && input.dataset.validate?.includes("password-rules")) {
      if (value.length < 8) {
        return { isValid: false, message: "Password must be at least 8 characters long." };
      }
      if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
        return { isValid: false, message: "Password must contain both letters and at least one number." };
      }
    }

    // 8. Password confirmation
    if (input.dataset.matches) {
      const targetInput = document.getElementById(input.dataset.matches);
      if (targetInput && value !== targetInput.value) {
        return { isValid: false, message: "Passwords do not match." };
      }
    }

    return { isValid: true, message: "" };
  },

  /**
   * Apply or clear error state on a field element with ARIA support
   */
  applyFieldError(input, errorResult) {
    const parentField = input.closest(".form-field") || input.parentElement;
    if (!parentField) return;

    let errorEl = parentField.querySelector(".field-error");
    if (!errorEl) {
      errorEl = document.createElement("div");
      errorEl.className = "field-error";
      errorEl.id = `error-${input.id || input.name || Math.random().toString(36).substr(2, 5)}`;
      errorEl.setAttribute("role", "alert");
      parentField.appendChild(errorEl);
    }

    if (!errorResult.isValid) {
      parentField.classList.add("has-error");
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", errorEl.id);
      errorEl.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>${errorResult.message}</span>
      `;
    } else {
      parentField.classList.remove("has-error");
      input.removeAttribute("aria-invalid");
      errorEl.innerHTML = "";
    }
  },

  /**
   * Validate entire form or a specific container
   */
  validateContainer(container) {
    const inputs = container.querySelectorAll("input, select, textarea");
    let isAllValid = true;
    let firstErrorField = null;

    inputs.forEach(input => {
      // Ignore hidden conditional fields
      if (input.closest(".conditional-field-block.is-hidden")) return;
      if (input.type === "hidden" || input.type === "submit") return;

      const result = this.validateField(input);
      this.applyFieldError(input, result);

      if (!result.isValid) {
        isAllValid = false;
        if (!firstErrorField) {
          firstErrorField = input;
        }
      }
    });

    if (firstErrorField) {
      firstErrorField.focus();
      firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return isAllValid;
  },

  /**
   * Attach live validation listeners (onBlur & onChange) to all form fields
   */
  attachLiveValidation(formElement) {
    if (!formElement) return;

    formElement.addEventListener("blur", (e) => {
      if (e.target.matches("input, select, textarea")) {
        const result = this.validateField(e.target);
        this.applyFieldError(e.target, result);
      }
    }, true);

    formElement.addEventListener("input", (e) => {
      // If field currently has an error, re-evaluate as user fixes it
      const parent = e.target.closest(".form-field");
      if (parent && parent.classList.contains("has-error")) {
        const result = this.validateField(e.target);
        this.applyFieldError(e.target, result);
      }
    });
  },

  /**
   * Validate an image file for type, size and dimensions
   * @param {File} file
   * @param {Object} options { maxSizeMB, minWidth, minHeight }
   * @returns {Promise<Object>} { isValid, message, dimensions }
   */
  validateImageFile(file, options = { maxSizeMB: 5, minWidth: 800, minHeight: 500 }) {
    return new Promise((resolve) => {
      // Check MIME type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type.toLowerCase())) {
        return resolve({
          isValid: false,
          message: `Invalid format (${file.name}). Only JPG, PNG, and WebP images are permitted.`
        });
      }

      // Check file size
      const maxBytes = options.maxSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        return resolve({
          isValid: false,
          message: `File size too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed is ${options.maxSizeMB}MB.`
        });
      }

      // Check dimensions
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const { width, height } = img;
        if (width < options.minWidth || height < options.minHeight) {
          return resolve({
            isValid: false,
            message: `Resolution too low (${width}x${height}px). Minimum recommended is ${options.minWidth}x${options.minHeight}px for commercial listings.`,
            dimensions: { width, height }
          });
        }
        resolve({
          isValid: true,
          message: "",
          dimensions: { width, height }
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve({
          isValid: false,
          message: `Corrupted or unreadable image file (${file.name}).`
        });
      };

      img.src = objectUrl;
    });
  },

  getFieldLabel(input) {
    const parent = input.closest(".form-field");
    if (parent) {
      const label = parent.querySelector(".form-label");
      if (label) {
        // Return label text without required asterisk
        return label.childNodes[0]?.textContent?.trim() || "This field";
      }
    }
    return input.getAttribute("placeholder") || input.name || "Field";
  }
};

window.FormValidator = FormValidator;
