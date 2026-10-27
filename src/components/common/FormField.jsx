import React, { forwardRef } from "react";

export const FormField = forwardRef(({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  hint,
  required = false,
  placeholder = "",
  options = [], // For select fields
  rows = 4, // For textarea
  min,
  max,
  step,
  disabled = false,
  className = "",
  children
}, ref) => {
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="required-mark" aria-hidden="true">*</span>}
        </label>
      )}

      {children ? (
        children
      ) : type === "select" ? (
        <select
          ref={ref}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`form-select ${error ? "has-error" : ""}`}
        >
          {options.map((opt) => {
            const optVal = typeof opt === "object" ? opt.value : opt;
            const optLabel = typeof opt === "object" ? opt.label : opt;
            return (
              <option key={optVal} value={optVal}>
                {optLabel}
              </option>
            );
          })}
        </select>
      ) : type === "textarea" ? (
        <textarea
          ref={ref}
          id={id}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`form-textarea ${error ? "has-error" : ""}`}
        />
      ) : (
        <input
          ref={ref}
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`form-input ${error ? "has-error" : ""}`}
        />
      )}

      {hint && !error && (
        <span id={hintId} className="form-hint">
          {hint}
        </span>
      )}

      {error && (
        <span id={errorId} className="field-error-msg" role="alert">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
});

FormField.displayName = "FormField";

export default FormField;
