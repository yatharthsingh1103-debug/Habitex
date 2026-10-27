import React from "react";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="container" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-16) 0" }}>
      <div style={{ textAlign: "center", maxWidth: "520px" }}>
        <div style={{ fontSize: "5rem", fontWeight: 800, color: "var(--color-primary-brand)", lineHeight: 1, marginBottom: "var(--space-2)" }}>
          404
        </div>
        <h1 style={{ fontSize: "1.8rem", color: "var(--color-primary)", marginBottom: "var(--space-3)" }}>
          Holding Not Found
        </h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "1rem", lineHeight: 1.6, marginBottom: "var(--space-6)" }}>
          The requested property dossier, listing reference, or portal route could not be located in our active directory. It may have been archived or privatized.
        </p>
        <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center" }}>
          <Link to="/" className="btn btn-primary">
            Return to Marketplace
          </Link>
          <Link to="/properties" className="btn btn-secondary">
            Browse All Properties
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
