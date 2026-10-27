import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addProperty } from "../features/properties/propertiesSlice";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { StorageService } from "../services/storageService";
import { INITIAL_FORM_VALUES } from "./formConstants";
import { validateField, validateStep, validateFullForm } from "./formValidation";
import { formatPrice } from "../data/properties";
import {
  SectionBasicInfo,
  SectionLocation,
  SectionPropertyDetails,
  SectionPrice,
  SectionAmenities,
  SectionFurnishing,
  SectionContact,
  SectionPhotos
} from "./PropertyFormSections";

const TOTAL_STEPS = 8;
const STEP_NAMES = [
  "Basic Info",
  "Location",
  "Details",
  "Price",
  "Amenities",
  "Furnishing",
  "Contact",
  "Photos"
];

export const PropertyForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { showToast } = useUI();

  // Controlled Form State
  const [formData, setFormData] = useState(() => {
    // Check if there is an existing draft to restore
    const draft = StorageService.getDraft();
    if (draft && draft.data) {
      return { ...INITIAL_FORM_VALUES, ...draft.data };
    }
    return {
      ...INITIAL_FORM_VALUES,
      ownerName: user?.name || "Yatharth",
      ownerEmail: user?.email || "yatharth@habitex.in",
      ownerPhone: user?.phone || "9810123456"
    };
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [completedSteps, setCompletedSteps] = useState([]);
  const [lastSaved, setLastSaved] = useState(null);
  const [uploadError, setUploadError] = useState("");

  // Section Refs for accessible autofocus
  const titleRef = useRef(null);
  const addressRef = useRef(null);
  const carpetRef = useRef(null);
  const priceRef = useRef(null);
  const nameRef = useRef(null);

  // Sync active user credentials into contact section
  useEffect(() => {
    if (user && !formData.ownerName) {
      setFormData((prev) => ({
        ...prev,
        ownerName: user.name || prev.ownerName,
        ownerEmail: user.email || prev.ownerEmail,
        ownerPhone: user.phone || prev.ownerPhone
      }));
    }
  }, [user]);

  // Draft Autosave Effect (Debounced 1.5 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      StorageService.saveDraft(formData);
      setLastSaved(new Date().toLocaleTimeString());
    }, 1500);

    return () => clearTimeout(timer);
  }, [formData]);

  // General Input Handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val
    }));

    // Clear validation error on change if fixed
    if (errors[name]) {
      const err = validateField(name, val, { ...formData, [name]: val });
      setErrors((prev) => ({
        ...prev,
        [name]: err
      }));
    }
  };

  // OnBlur Validation Handler
  const handleInputBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    const err = validateField(name, val, formData);
    if (err) {
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  // Amenities Toggle Handler
  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      const updated = exists
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: updated };
    });
  };

  // Quantity Stepper Handler
  const handleQuantityChange = (field, delta) => {
    setFormData((prev) => {
      const current = prev[field] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [field]: next };
    });
  };

  // Image Upload Handler with File Size, Type & Dimension Checks
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadError("");
    const validFiles = [];

    for (const file of files) {
      // 1. File Type Check
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setUploadError("Only JPG, PNG, and WEBP image files are supported.");
        return;
      }
      // 2. File Size Check (< 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError(`File "${file.name}" exceeds maximum allowed size of 5MB.`);
        return;
      }
      validFiles.push(file);
    }

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const dataUrl = uploadEvent.target.result;
        // 3. Basic Dimension Verification via new Image()
        const img = new Image();
        img.onload = () => {
          if (img.width < 400 || img.height < 300) {
            setUploadError(`Image "${file.name}" resolution is too low. Recommended min 800×500 px.`);
          }
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, dataUrl]
          }));
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });
  };

  // Image Remove Handler
  const handleImageRemove = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Stepper Navigation
  const handleNextStep = () => {
    const stepValidation = validateStep(currentStep, formData);
    if (!stepValidation.isValid) {
      setErrors((prev) => ({ ...prev, ...stepValidation.errors }));
      showToast("Please complete the required fields before proceeding.", "error");

      // Focus first error
      if (currentStep === 1 && titleRef.current) titleRef.current.focus();
      if (currentStep === 2 && addressRef.current) addressRef.current.focus();
      if (currentStep === 3 && carpetRef.current) carpetRef.current.focus();
      if (currentStep === 4 && priceRef.current) priceRef.current.focus();
      if (currentStep === 7 && nameRef.current) nameRef.current.focus();
      return;
    }

    // Mark step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleStepClick = (step) => {
    // Can jump if already completed or validated
    if (step < currentStep || validateStep(currentStep, formData).isValid) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      showToast("Please complete the required fields in the current section.", "error");
    }
  };

  // Clear Draft
  const handleClearDraft = () => {
    StorageService.clearDraft();
    setFormData({
      ...INITIAL_FORM_VALUES,
      ownerName: user?.name || "Yatharth",
      ownerEmail: user?.email || "yatharth@habitex.in",
      ownerPhone: user?.phone || "9810123456"
    });
    setErrors({});
    setCurrentStep(1);
    setCompletedSteps([]);
    setLastSaved(null);
    showToast("Form draft cleared.", "info");
  };

  // Restore Draft
  const handleRestoreDraft = () => {
    const draft = StorageService.getDraft();
    if (draft && draft.data) {
      setFormData(draft.data);
      showToast("Draft restored successfully.", "success");
    } else {
      showToast("No saved draft found in local storage.", "info");
    }
  };

  // Final Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const fullValidation = validateFullForm(formData);
    if (!fullValidation.isValid) {
      setErrors(fullValidation.errors);
      showToast("Please resolve all validation errors across sections before submitting.", "error");

      // Find first invalid section and navigate there
      for (let s = 1; s <= TOTAL_STEPS; s++) {
        const stepRes = validateStep(s, formData);
        if (!stepRes.isValid) {
          setCurrentStep(s);
          break;
        }
      }
      return;
    }

    // Prepare published property object
    const newId = `prop-${Date.now().toString().slice(-4)}`;
    const priceNum = Number(formData.expectedPrice) || 0;
    const carpetNum = Number(formData.carpetArea) || Number(formData.plotArea) || 1;
    const pricePerSqFt = priceNum > 0 && carpetNum > 0
      ? `₹${Math.round(priceNum / carpetNum).toLocaleString("en-IN")} / sq.ft`
      : "Market Rate";

    const defaultImage =
      formData.images.length > 0
        ? formData.images[0]
        : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80";

    const publishedProperty = {
      id: newId,
      title: formData.title,
      listingType: formData.listingType,
      propertyType: formData.propertyType,
      price: priceNum,
      formattedPrice: formatPrice(priceNum, formData.listingType),
      pricePerSqFt,
      city: formData.city,
      locality: formData.locality,
      address: formData.address,
      pincode: formData.pincode,
      bedrooms: Number(formData.bedrooms) || 0,
      bathrooms: Number(formData.bathrooms) || 0,
      balconies: Number(formData.balconies) || 0,
      floorNo: formData.floorNo || "Ground",
      totalFloors: formData.totalFloors || "3",
      carpetArea: Number(formData.carpetArea) || Number(formData.plotArea) || 0,
      superBuiltUpArea: Number(formData.superBuiltUpArea) || 0,
      furnishing: formData.furnishingStatus,
      propertyAge: formData.propertyAge,
      facing: formData.facing,
      isVerified: true,
      isFeatured: false,
      maintenance: formData.maintenanceCharges ? `₹${Number(formData.maintenanceCharges).toLocaleString("en-IN")} / mo` : "Nil",
      imageUrl: defaultImage,
      gallery: formData.images.length > 0 ? formData.images : [defaultImage],
      description: formData.description,
      amenities: formData.amenities,
      owner: {
        name: formData.ownerName,
        role: "Property Owner / Direct Seller",
        rera: "VERIFIED-ADVISOR-DIRECT",
        phone: formData.ownerPhone,
        email: formData.ownerEmail,
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
      }
    };

    // 1. Dispatch to Redux store
    dispatch(addProperty(publishedProperty));

    // 2. Clear stored draft
    StorageService.clearDraft();

    // 3. Trigger global toast notification via UIContext
    showToast(`Listing "${publishedProperty.title}" successfully published!`, "success", 4000);

    // 4. Programmatic navigation to property details page
    navigate(`/properties/${newId}`);
  };

  return (
    <div className="container container-form form-page-layout">
      {/* Page Header */}
      <div className="form-page-header">
        <h1 className="form-page-title">List a Prime Property</h1>
        <p className="form-page-subtitle">
          Comprehensive 40+ field architectural listing dossier. Automatically persisted to draft as you type.
        </p>
      </div>

      {/* Draft Autosave Status Bar */}
      <div className="draft-status-bar">
        <div className="draft-indicator">
          <span className="draft-dot" />
          <span>
            {lastSaved
              ? `Draft auto-persisted at ${lastSaved}`
              : "Draft autosave active in local storage"}
          </span>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <button
            type="button"
            onClick={handleRestoreDraft}
            className="btn btn-secondary btn-sm"
          >
            Restore Draft
          </button>
          <button
            type="button"
            onClick={handleClearDraft}
            className="btn btn-outline btn-sm"
            style={{ color: "var(--color-error)", borderColor: "var(--color-error)" }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <nav className="form-stepper" aria-label="Listing Wizard Stages">
        {STEP_NAMES.map((stepName, idx) => {
          const stepNum = idx + 1;
          const isActive = currentStep === stepNum;
          const isDone = completedSteps.includes(stepNum);

          return (
            <button
              key={stepNum}
              type="button"
              className={`step-indicator-item ${isActive ? "active" : ""} ${isDone ? "completed" : ""}`}
              onClick={() => handleStepClick(stepNum)}
              aria-current={isActive ? "step" : undefined}
            >
              <span className="step-badge-num">
                {isDone ? "✓" : stepNum}
              </span>
              <span>{stepName}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Wizard Form Card */}
      <div className="form-wizard-card">
        <form onSubmit={handleSubmit} noValidate>
          {/* Section 1: Basic Info */}
          {currentStep === 1 && (
            <SectionBasicInfo
              formData={formData}
              errors={errors}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              titleRef={titleRef}
            />
          )}

          {/* Section 2: Location */}
          {currentStep === 2 && (
            <SectionLocation
              formData={formData}
              errors={errors}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              addressRef={addressRef}
            />
          )}

          {/* Section 3: Property Details */}
          {currentStep === 3 && (
            <SectionPropertyDetails
              formData={formData}
              errors={errors}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              carpetRef={carpetRef}
            />
          )}

          {/* Section 4: Valuation & Price */}
          {currentStep === 4 && (
            <SectionPrice
              formData={formData}
              errors={errors}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              priceRef={priceRef}
            />
          )}

          {/* Section 5: Amenities */}
          {currentStep === 5 && (
            <SectionAmenities
              formData={formData}
              onAmenityToggle={handleAmenityToggle}
            />
          )}

          {/* Section 6: Furnishing & Inventory */}
          {currentStep === 6 && (
            <SectionFurnishing
              formData={formData}
              onChange={handleInputChange}
              onQuantityChange={handleQuantityChange}
            />
          )}

          {/* Section 7: Contact Info */}
          {currentStep === 7 && (
            <SectionContact
              formData={formData}
              errors={errors}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              nameRef={nameRef}
            />
          )}

          {/* Section 8: Photographs */}
          {currentStep === 8 && (
            <SectionPhotos
              images={formData.images}
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
              uploadError={uploadError}
            />
          )}

          {/* Wizard Navigation Controls */}
          <div className="wizard-nav-controls">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="btn btn-secondary"
                >
                  ← Previous Section
                </button>
              )}
            </div>

            <div style={{ display: "flex", gap: "var(--space-3)" }}>
              {currentStep < TOTAL_STEPS ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="btn btn-primary"
                >
                  Continue to {STEP_NAMES[currentStep]} →
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-accent btn-lg"
                >
                  Publish Property Listing ✓
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;
