// src/components/CommunityReportsSection.jsx
import React, { useState, useEffect } from "react";
import { getReports } from "../api/adminAPI";
import "../styles.css";

const tabs = ["Pending", "Handled"];

const CommunityReportsSection = ({ activeSubTab, searchQuery, onSelectReport }) => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch live reports data from your API
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const data = await getReports();
        // Expecting getReports() to return an array of reports
        setReports(data);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Error fetching reports");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Filter reports: if tab is "Pending", only reports with status 'pending'
  // Otherwise, everything not pending is considered Handled
  const filteredReports = reports.filter(report => {
    if (activeTab === "Pending") {
      return report.status && report.status.toLowerCase() === "pending";
    } else if (activeTab === "Handled") {
      return report.status && report.status.toLowerCase() !== "pending";
    }
    return true;
  });

  // Helper to truncate text
  const truncateText = (text, maxLength = 60) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className="community-reports-section card" style={{ padding: "20px" }}>
      <h2>
        <i className="fas fa-exclamation-triangle icon"></i> Community Reports
      </h2>
      <div className="tabs" style={{ marginBottom: "10px" }}>
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
            style={{ marginRight: "10px" }}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading reports...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : filteredReports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <div className="reports-list">
          {filteredReports.map(report => (
            <div
              key={report._id}
              className="report-item"
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                cursor: "pointer",
                display: "flex",
              }}
              onClick={() => onSelectReport(report)}
            >
              <div className="media-thumbnail" style={{ marginRight: "10px" }}>
                {report.photos && report.photos.length > 0 ? (
                  <img
                    src={report.photos[0]}
                    alt={report.emergencyType}
                    width="100"
                    height="60"
                  />
                ) : (
                  <img
                    src="https://via.placeholder.com/150"
                    alt={report.emergencyType}
                    width="100"
                    height="60"
                  />
                )}
              </div>
              <div className="report-info">
                <p>
                  <strong>
                    {report.userId && report.userId.name ? report.userId.name : "Unknown User"}
                  </strong>
                </p>
                <p>Category: {report.emergencyType}</p>
                <p>
                  Location:{" "}
                  {report.location && report.location.address ? report.location.address : "Unknown Location"}
                </p>
                <p>
                  Date:{" "}
                  {report.createdAt
                    ? new Date(report.createdAt).toLocaleDateString()
                    : ""}
                </p>
                <p>Description: {truncateText(report.description)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityReportsSection;
