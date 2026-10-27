import React from "react";

export const LoadingState = ({ message = "Loading portfolio..." }) => {
  return (
    <div className="empty-state" style={{ minHeight: "260px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ display: "inline-block", width: "40px", height: "40px", border: "3px solid var(--color-border)", borderTopColor: "var(--color-primary-brand)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto var(--space-4)" }} />
      <p style={{ color: "var(--color-text-secondary)", fontWeight: 500 }}>{message}</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingState;
