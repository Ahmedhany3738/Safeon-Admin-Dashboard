import React, { useEffect, useState } from "react";

const SOSAlertsSection = ({ activeSubTab, searchQuery, onSelectAlert }) => {
  const [reports, setReports] = useState([]);
  const [view, setView] = useState("pending");

  useEffect(() => {
    // Dummy data for SOS alerts that can be replaced with real API data.
    const dummyReports = [
      {
        id: 1,
        userId: "user123",
        location: "Cairo, Egypt",
        timestamp: "5 minutes ago",
        pickedUp: false,
        status: "pending",
        title: "SOS Alert from user123",
        description: "User needs immediate assistance at Cairo."
      },
      {
        id: 2,
        userId: "user456",
        location: "Giza, Egypt",
        timestamp: "10 minutes ago",
        pickedUp: true,
        status: "approved",
        title: "SOS Alert from user456",
        description: "User reported an incident in Giza."
      },
      {
        id: 3,
        userId: "user789",
        location: "Alexandria, Egypt",
        timestamp: "15 minutes ago",
        pickedUp: false,
        status: "pending",
        title: "SOS Alert from user789",
        description: "User requires urgent help in Alexandria."
      }
    ];
    setReports(dummyReports);
  }, []);

  // Filter based on view (pending/approved) and the search query.
  const filteredReports = reports
    .filter((report) => report.status === view)
    .filter((report) =>
      report.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="sos-alerts-section card" style={{ padding: "20px" }}>
      <h2>SOS Alerts - {view.charAt(0).toUpperCase() + view.slice(1)}</h2>

      {/* Toggle between pending and approved alerts */}
      <div className="view-buttons" style={{ marginBottom: "10px" }}>
        <button
          className={view === "pending" ? "active" : ""}
          onClick={() => setView("pending")}
          style={{ marginRight: "10px" }}
        >
          View Pending Alerts
        </button>
        <button
          className={view === "approved" ? "active" : ""}
          onClick={() => setView("approved")}
        >
          View Approved Alerts
        </button>
      </div>

      {/* List of alerts */}
      <div className="reports-list">
        {filteredReports.length === 0 && <p>No reports found.</p>}
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="report-item"
            onClick={() => onSelectAlert(report)}
            style={{
              cursor: "pointer",
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #ccc"
            }}
          >
            <p>
              <strong>{report.title}</strong>
            </p>
            <p>User ID: {report.userId}</p>
            <p>Location: {report.location}</p>
            <p>Sent: {report.timestamp}</p>
            <p>Picked Up: {report.pickedUp ? "Yes" : "No"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SOSAlertsSection;
