import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAllProperties } from "../features/properties/propertiesSelectors";
import { deleteProperty } from "../features/properties/propertiesSlice";
import { StorageService } from "../services/storageService";
import { useUI } from "../context/UIContext";
import EmptyState from "../components/common/EmptyState";

export const MyListings = () => {
  const dispatch = useDispatch();
  const { showToast, openModal } = useUI();
  const allProperties = useSelector(selectAllProperties);

  const myListingsIds = StorageService.getMyListings();
  const myListings = allProperties.filter((p) => myListingsIds.includes(p.id));

  const handleDelete = (property) => {
    openModal({
      title: "Confirm Listing Removal",
      content: (
        <p>
          Are you sure you want to remove <strong>"{property.title}"</strong> from the public marketplace? This action will delist the holding immediately.
        </p>
      ),
      confirmText: "Delete Holding",
      onConfirm: () => {
        dispatch(deleteProperty(property.id));
        showToast(`Listing "${property.title}" has been deleted.`, "info");
      }
    });
  };

  return (
    <div className="container" style={{ padding: "var(--space-8) var(--space-6) var(--space-16)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-4)", marginBottom: "var(--space-8)" }}>
        <div>
          <h1 style={{ fontSize: "2rem", color: "var(--color-primary)", marginBottom: "var(--space-2)" }}>
            My Published Portfolio
          </h1>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Manage and monitor your active holdings published across the Habitex directory.
          </p>
        </div>

        <Link to="/add-property" className="btn btn-primary">
          + Add New Holding
        </Link>
      </div>

      {myListings.length > 0 ? (
        <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", overflow: "hidden", boxShadow: "var(--shadow-xs)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ background: "var(--color-surface-subtle)", borderBottom: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}>
                  <th style={{ padding: "var(--space-4)" }}>Property</th>
                  <th style={{ padding: "var(--space-4)" }}>Typology</th>
                  <th style={{ padding: "var(--space-4)" }}>Mode</th>
                  <th style={{ padding: "var(--space-4)" }}>Price / Valuation</th>
                  <th style={{ padding: "var(--space-4)" }}>Status</th>
                  <th style={{ padding: "var(--space-4)", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myListings.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
                    <td style={{ padding: "var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        style={{ width: "54px", height: "42px", objectFit: "cover", borderRadius: "var(--radius-sm)" }}
                      />
                      <div>
                        <Link to={`/properties/${p.id}`} style={{ fontWeight: 700, color: "var(--color-primary)" }}>
                          {p.title}
                        </Link>
                        <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                          {p.locality}, {p.city}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "var(--space-4)" }}>{p.propertyType}</td>
                    <td style={{ padding: "var(--space-4)" }}>
                      <span className={`badge ${p.listingType === "Rent" ? "badge-rent" : "badge-sale"}`}>
                        {p.listingType}
                      </span>
                    </td>
                    <td style={{ padding: "var(--space-4)", fontWeight: 700, color: "var(--color-primary-brand)" }}>
                      {p.formattedPrice}
                    </td>
                    <td style={{ padding: "var(--space-4)" }}>
                      <span className="badge badge-verified">Active</span>
                    </td>
                    <td style={{ padding: "var(--space-4)", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "var(--space-2)" }}>
                        <Link to={`/properties/${p.id}`} className="btn btn-secondary btn-sm">
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(p)}
                          className="btn btn-outline btn-sm"
                          style={{ color: "var(--color-error)", borderColor: "var(--color-error)" }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No Published Listings"
          description="You have not published any properties to your personal portfolio yet."
          actionText="Publish Your First Property"
          actionLink="/add-property"
        />
      )}
    </div>
  );
};

export default MyListings;
