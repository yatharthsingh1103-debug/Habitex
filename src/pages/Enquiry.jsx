import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAllProperties } from "../features/properties/propertiesSelectors";
import { addEnquiry } from "../features/enquiries/enquiriesSlice";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import FormField from "../components/common/FormField";
import { PATTERNS } from "../forms/formValidation";

export const Enquiry = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { showToast } = useUI();
  const properties = useSelector(selectAllProperties);

  const initialPropId = searchParams.get("propertyId") || (properties[0]?.id || "");

  const [formData, setFormData] = useState({
    propertyId: initialPropId,
    clientName: user?.name || "Yatharth",
    email: user?.email || "yatharth@habitex.in",
    phone: user?.phone || "9810123456",
    contactMethod: "WhatsApp",
    enquiryType: "Accompanied Site Inspection",
    preferredDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
    preferredTime: "11:00 AM",
    message: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const qPropId = searchParams.get("propertyId");
    if (qPropId && qPropId !== formData.propertyId) {
      setFormData((prev) => ({ ...prev, propertyId: qPropId }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const selectedProperty = properties.find((p) => p.id === formData.propertyId);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.clientName.trim()) newErrors.clientName = "Name is required.";
    if (!formData.email.trim() || !PATTERNS.email.test(formData.email)) {
      newErrors.email = "Valid email address is required.";
    }
    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!cleanPhone || !PATTERNS.indianPhone.test(cleanPhone)) {
      newErrors.phone = "Valid 10-digit Indian mobile number starting with 6-9 is required.";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Please provide brief requirements or questions.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast("Please correct the form errors before submitting.", "error");
      return;
    }

    // Dispatch to Redux enquiries slice
    dispatch(
      addEnquiry({
        propertyId: formData.propertyId,
        propertyTitle: selectedProperty?.title || "Direct Portfolio Query",
        clientName: formData.clientName,
        email: formData.email,
        phone: formData.phone,
        contactMethod: formData.contactMethod,
        enquiryType: formData.enquiryType,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        message: formData.message
      })
    );

    showToast("Enquiry submitted! Certified advisor will contact you within 2 hours.", "success", 4000);
    navigate("/dashboard");
  };

  return (
    <div className="container container-form form-page-layout">
      <div className="form-page-header">
        <h1 className="form-page-title">Schedule Accompanied Inspection</h1>
        <p className="form-page-subtitle">
          Connect directly with certified property advisors for discreet viewings, cadastral reviews, and title deed verifications.
        </p>
      </div>

      <div className="form-wizard-card">
        {/* Selected Property Banner if applicable */}
        {selectedProperty && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-4)",
              padding: "var(--space-4)",
              background: "var(--color-surface-subtle)",
              borderRadius: "var(--radius-md)",
              marginBottom: "var(--space-6)",
              border: "1px solid var(--color-border)"
            }}
          >
            <img
              src={selectedProperty.imageUrl}
              alt={selectedProperty.title}
              style={{ width: "70px", height: "55px", objectFit: "cover", borderRadius: "var(--radius-sm)" }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--color-primary-brand)" }}>
                Selected Holding
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-primary)" }}>
                {selectedProperty.title}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                {selectedProperty.formattedPrice} • {selectedProperty.locality}, {selectedProperty.city}
              </div>
            </div>
            <Link to={`/properties/${selectedProperty.id}`} className="btn btn-outline btn-sm">
              View Dossier
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Target Property Dropdown */}
          <div className="form-field" style={{ marginBottom: "var(--space-5)" }}>
            <label htmlFor="enq-prop-select" className="form-label">
              Select Holding of Interest <span className="required-mark">*</span>
            </label>
            <select
              id="enq-prop-select"
              name="propertyId"
              value={formData.propertyId}
              onChange={handleChange}
              className="form-select"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.formattedPrice} — {p.city})
                </option>
              ))}
            </select>
          </div>

          <div className="form-grid-2">
            <FormField
              id="enq-name"
              name="clientName"
              label="Full Name"
              required
              value={formData.clientName}
              onChange={handleChange}
              error={errors.clientName}
              placeholder="e.g. Yatharth"
            />

            <FormField
              id="enq-phone"
              name="phone"
              type="tel"
              label="Contact Mobile"
              required
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="9810123456"
            />
          </div>

          <div className="form-grid-2" style={{ marginTop: "var(--space-5)" }}>
            <FormField
              id="enq-email"
              name="email"
              type="email"
              label="Email Address"
              required
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="yatharth@habitex.in"
            />

            <FormField
              id="enq-contact-method"
              name="contactMethod"
              type="select"
              label="Preferred Contact Mode"
              value={formData.contactMethod}
              onChange={handleChange}
              options={["WhatsApp", "Phone Call", "Discreet Email", "Video Conference"]}
            />
          </div>

          <div className="form-grid-3" style={{ marginTop: "var(--space-5)" }}>
            <FormField
              id="enq-type"
              name="enquiryType"
              type="select"
              label="Enquiry Objective"
              value={formData.enquiryType}
              onChange={handleChange}
              options={[
                "Accompanied Site Inspection",
                "Cadastral Survey & Title Verification",
                "Financial Terms & Escrow Discussion",
                "Off-Market Portfolio Inquiry"
              ]}
            />

            <FormField
              id="enq-date"
              name="preferredDate"
              type="date"
              label="Preferred Inspection Date"
              value={formData.preferredDate}
              onChange={handleChange}
            />

            <FormField
              id="enq-time"
              name="preferredTime"
              type="select"
              label="Preferred Time Slot"
              value={formData.preferredTime}
              onChange={handleChange}
              options={["10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM (Sunset Inspection)"]}
            />
          </div>

          <div className="form-field" style={{ marginTop: "var(--space-5)" }}>
            <FormField
              id="enq-msg"
              name="message"
              type="textarea"
              label="Requirements / Specific Inquiries"
              required
              rows={4}
              value={formData.message}
              onChange={handleChange}
              error={errors.message}
              placeholder="Provide any specific requirements, financing conditions, or questions regarding title approvals..."
            />
          </div>

          <div style={{ marginTop: "var(--space-8)" }}>
            <button type="submit" className="btn btn-primary btn-lg w-100">
              Submit Formal Inspection Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Enquiry;
