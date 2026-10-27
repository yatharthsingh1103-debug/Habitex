import React from "react";

export const Button = ({
  children,
  variant = "primary", // 'primary' | 'secondary' | 'outline' | 'accent'
  size = "md", // 'sm' | 'md' | 'lg'
  className = "",
  fullWidth = false,
  type = "button",
  disabled = false,
  onClick,
  ...props
}) => {
  const sizeClass = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";
  const fullWidthClass = fullWidth ? "w-100" : "";
  const variantClass = `btn-${variant}`;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn ${variantClass} ${sizeClass} ${fullWidthClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
