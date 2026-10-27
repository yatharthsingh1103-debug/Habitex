import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAllProperties } from "../features/properties/propertiesSelectors";
import { selectAllEnquiries, updateEnquiryStatus, deleteEnquiry } from "../features/enquiries/enquiriesSlice";
import { selectFavoriteCount } from "../features/favorites/favoritesSlice";
import { StorageService } from "../services/storageService";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { showToast } = useUI();

  const allProperties = useSelector(selectAllProperties);
  const enquiries = useSelector(selectAllEnquiries);
  const savedCount = useSelector(selectFavoriteCount);

  const myListingsIds = StorageService.getMyListings();
  const myListings = allProperties.filter((p) => myListingsIds.includes(p.id));

  // Compute portfolio valuation
  const portfolioValuation = myListings.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const formattedValuation = portfolioValuation > 10000000
    ? `₹${(portfolioValuation / 10000000).toFixed(2)} Cr`
    : `₹${portfolioValuation.toLocaleString("en-IN")}`;

  const [activeTab, setActiveTab] = useState("enquiries"); // 'enquiries' | 'listings'

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateEnquiryStatus({ id, status: newStatus }));
    showToast(`Inspection status updated to "${newStatus}"`, "success");
  };

  const handleDeleteEnquiry = (id) => {
    dispatch(deleteEnquiry(id));
    showToast("Enquiry record deleted.", "info");
  };

  return (
    <div className="container" style={{ padding: "var(--space-8) var(--space-6) var(--space-16)" }}>
      {/* Welcome Banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-4)", marginBottom: "var(--space-8)" }}>
        <div>
          <span className="badge badge-featured" style={{ marginBottom: "var(--space-2)" }}>
            {user?.role || "Seller"} Account
          </span>
          <h1 style={{ fontSize: "2rem", color: "var(--color-primary)", marginBottom: "var(--space-1)" }}>
            Advisory & Portfolio Console
          </h1>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Welcome back, <strong>{user?.name || "Yatharth"}</strong> ({user?.email || "yatharth@habitex.in"}).
          </p>
        </div>

        <div style={{ display: "flex", gap: "var(--space-3)" }}>
          <Link to="/enquiry" className="btn btn-secondary btn-sm">
            Book Site Visit
          </Link>
          <Link to="/add-property" className="btn btn-primary btn-sm">
            + List New Property
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
          </div>
          <div>
            <div className="stat-val">{myListings.length}</div>
            <div className="stat-label">Active Portfolio Listings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#EFF6FF", color: "#1D4ED8" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div>
            <div className="stat-val">{enquiries.length}</div>
            <div className="stat-label">Enquiries & Inspections</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#FEF2F2", color: "#B91C1C" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <div>
            <div className="stat-val">{savedCount}</div>
            <div className="stat-label">Saved Holdings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "var(--color-accent-subtle)", color: "var(--color-accent)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <div className="stat-val" style={{ fontSize: "1.45rem" }}>{formattedValuation}</div>
            <div className="stat-label">Managed Asset Valuation</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-6)", borderBottom: "1px solid var(--color-border)" }}>
        <button
          type="button"
          onClick={() => setActiveTab("enquiries")}
          style={{
            padding: "0.75rem 1.25rem",
            fontWeight: 700,
            fontSize: "0.95rem",
            color: activeTab === "enquiries" ? "var(--color-primary-brand)" : "var(--color-text-secondary)",
            borderBottom: activeTab === "enquiries" ? "3px solid var(--color-primary-brand)" : "3px solid transparent",
            cursor: "pointer"
          }}
        >
          Enquiry & Inspection Requests ({enquiries.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("listings")}
          style={{
            padding: "0.75rem 1.25rem",
            fontWeight: 700,
            fontSize: "0.95rem",
            color: activeTab === "listings" ? "var(--color-primary-brand)" : "var(--color-text-secondary)",
            borderBottom: activeTab === "listings" ? "3px solid var(--color-primary-brand)" : "3px solid transparent",
            cursor: "pointer"
          }}
        >
          My Listed Holdings ({myListings.length})
        </button>
      </div>

      {/* Tab 1: Enquiries Table */}
      {activeTab === "enquiries" && (
        <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", overflow: "hidden", boxShadow: "var(--shadow-xs)" }}>
          {enquiries.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ background: "var(--color-surface-subtle)", borderBottom: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}>
                    <th style={{ padding: "var(--space-4)" }}>Client</th>
                    <th style={{ padding: "var(--space-4)" }}>Holding Target</th>
                    <th style={{ padding: "var(--space-4)" }}>Inspection Objective</th>
                    <th style={{ padding: "var(--space-4)" }}>Scheduled Window</th>
                    <th style={{ padding: "var(--space-4)" }}>Status</th>
                    <th style={{ padding: "var(--space-4)", textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((enq) => (
                    <tr key={enq.id} style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
                      <td style={{ padding: "var(--space-4)" }}>
                        <div style={{ fontWeight: 700 }}>{enq.clientName}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>{enq.phone} • {enq.email}</div>
                      </td>
                      <td style={{ padding: "var(--space-4)" }}>
                        <Link to={`/properties/${enq.propertyId}`} style={{ fontWeight: 600, color: "var(--color-primary-brand)" }}>
                          {enq.propertyTitle}
                        </Link>
                      </td>
                      <td style={{ padding: "var(--space-4)", fontSize: "0.85rem" }}>
                        {enq.enquiryType}
                      </td>
                      <td style={{ padding: "var(--space-4)", fontSize: "0.85rem" }}>
                        <div>{enq.preferredDate || "Immediate"}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{enq.preferredTime}</div>
                      </td>
                      <td style={{ padding: "var(--space-4)" }}>
                        <select
                          value={enq.status || "Pending"}
                          onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                          className="form-select"
                          style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem", width: "auto" }}
                        >
                          <option value="New">New</option>
                          <option value="Scheduled">Scheduled</option>
                          <option value="Pending">Pending</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td style={{ padding: "var(--space-4)", textAlign: "right" }}>
                        <button
                          type="button"
                          onClick={() => handleDeleteEnquiry(enq.id)}
                          className="btn btn-outline btn-sm"
                          style={{ color: "var(--color-error)", borderColor: "var(--color-error)", padding: "0.2rem 0.5rem", fontSize: "0.75rem" }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: "var(--space-10)", textAlign: "center", color: "var(--color-text-muted)" }}>
              No enquiries registered yet. Submissions from the enquiry form will be logged here.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Listings */}
      {activeTab === "listings" && (
        <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", overflow: "hidden", boxShadow: "var(--shadow-xs)" }}>
          {myListings.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ background: "var(--color-surface-subtle)", borderBottom: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}>
                    <th style={{ padding: "var(--space-4)" }}>Holding Title</th>
                    <th style={{ padding: "var(--space-4)" }}>City</th>
                    <th style={{ padding: "var(--space-4)" }}>Type</th>
                    <th style={{ padding: "var(--space-4)" }}>Valuation</th>
                    <th style={{ padding: "var(--space-4)", textAlign: "right" }}>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {myListings.map((p) => (
                    <tr key={p.id} style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
                      <td style={{ padding: "var(--space-4)", fontWeight: 700 }}>
                        <Link to={`/properties/${p.id}`} style={{ color: "var(--color-primary)" }}>
                          {p.title}
                        </Link>
                      </td>
                      <td style={{ padding: "var(--space-4)" }}>{p.city}</td>
                      <td style={{ padding: "var(--space-4)" }}>{p.propertyType}</td>
                      <td style={{ padding: "var(--space-4)", fontWeight: 700, color: "var(--color-primary-brand)" }}>
                        {p.formattedPrice}
                      </td>
                      <td style={{ padding: "var(--space-4)", textAlign: "right" }}>
                        <Link to={`/properties/${p.id}`} className="btn btn-secondary btn-sm">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: "var(--space-10)", textAlign: "center", color: "var(--color-text-muted)" }}>
              No personal properties published yet. <Link to="/add-property" style={{ color: "var(--color-primary-brand)", fontWeight: 700 }}>Click here to add one</Link>.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
