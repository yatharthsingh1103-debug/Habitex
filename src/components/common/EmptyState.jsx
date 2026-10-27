import React from "react";
import { Link } from "react-router-dom";

export const EmptyState = ({
  icon,
  title = "No properties found",
  description = "Try adjusting your search criteria or filters to explore available holdings.",
  actionText,
  actionLink,
  onAction
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {icon || (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        )}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionText && (
        actionLink ? (
          <Link to={actionLink} className="btn btn-primary btn-sm">
            {actionText}
          </Link>
        ) : (
          <button type="button" onClick={onAction} className="btn btn-primary btn-sm">
            {actionText}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
