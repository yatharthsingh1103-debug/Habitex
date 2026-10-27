import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAllProperties } from "../features/properties/propertiesSelectors";
import { selectFavoriteIds, clearFavorites } from "../features/favorites/favoritesSlice";
import { useUI } from "../context/UIContext";
import PropertyCard from "../components/common/PropertyCard";
import EmptyState from "../components/common/EmptyState";

export const SavedProperties = () => {
  const dispatch = useDispatch();
  const { showToast, openModal } = useUI();
  const allProperties = useSelector(selectAllProperties);
  const favoriteIds = useSelector(selectFavoriteIds);

  const savedProperties = allProperties.filter((p) => favoriteIds.includes(p.id));

  const handleClearAll = () => {
    openModal({
      title: "Clear Saved Portfolio",
      content: <p>Are you sure you want to remove all saved properties from your portfolio bookmark?</p>,
      confirmText: "Clear All",
      onConfirm: () => {
        dispatch(clearFavorites());
        showToast("Saved properties portfolio cleared.", "info");
      }
    });
  };

  return (
    <div className="container" style={{ padding: "var(--space-8) var(--space-6) var(--space-16)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-4)", marginBottom: "var(--space-8)" }}>
        <div>
          <h1 style={{ fontSize: "2rem", color: "var(--color-primary)", marginBottom: "var(--space-2)" }}>
            Saved Properties Portfolio
          </h1>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Bookmarked prime residences and commercial investments synchronized with your account.
          </p>
        </div>

        {savedProperties.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="btn btn-outline btn-sm"
            style={{ color: "var(--color-error)", borderColor: "var(--color-error)" }}
          >
            Clear All Saved ({savedProperties.length})
          </button>
        )}
      </div>

      {savedProperties.length > 0 ? (
        <div className="properties-grid">
          {savedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Bookmarked Holdings"
          description="You haven't bookmarked any properties yet. Click the heart icon on any listing to save it here for fast comparison."
          actionText="Explore Properties Catalog"
          actionLink="/properties"
        />
      )}
    </div>
  );
};

export default SavedProperties;
