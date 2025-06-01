// src/components/SOSAlertsSection.jsx
import React, { useEffect, useState } from "react";
import { getAllAlerts } from "../api/adminAPI";
import "../styles.css";

const SOSAlertsSection = function ({ searchQuery, onSelectAlert }) {
  const [alerts, setAlerts] = useState([]);
  const [view, setView] = useState("in_progress");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(function () {
    async function fetchAlerts() {
      setLoading(true);
      try {
        const data = await getAllAlerts();
        setAlerts(data);
      } catch (err) {
        console.error("Error fetching SOS alerts:", err);
        setError("Error fetching SOS alerts");
      } finally {
        setLoading(false);
      }
    }
    fetchAlerts();
  }, []);

  // Filter alerts by selected view ("in_progress" or "resolved")
  const filteredAlerts = alerts.filter(function (alert) {
    return (
      alert.status && alert.status.toLowerCase() === view.toLowerCase()
    );
  });

  return (
    <div className="sos-alerts-section card">
      <h2>
        <i className="fas fa-bell icon"></i>{" "}
        SOS Alerts - {view.charAt(0).toUpperCase() + view.slice(1)}
      </h2>

      <div className="view-buttons">
        <button
          className={"tab-button " + (view === "in_progress" ? "active" : "")}
          onClick={function () {
            setView("in_progress");
          }}
        >
          View In Progress Alerts
        </button>
        <button
          className={"tab-button " + (view === "resolved" ? "active" : "")}
          onClick={function () {
            setView("resolved");
          }}
        >
          View Resolved Alerts
        </button>
      </div>

      {loading ? (
        <p>Loading SOS alerts...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : filteredAlerts.length === 0 ? (
        <p>No alerts found.</p>
      ) : (
        <div className="alerts-list">
          {filteredAlerts.map(function (alert) {
            return (
              <div
                key={alert._id}
                className="alert-item"
                onClick={function () {
                  onSelectAlert(alert);
                }}
                style={{
                  cursor: "pointer",
                  marginBottom: "10px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  transition: "background-color 0.3s ease"
                }}
                onMouseEnter={function (e) {
                  e.currentTarget.style.backgroundColor = "#f9f9f9";
                }}
                onMouseLeave={function (e) {
                  e.currentTarget.style.backgroundColor = "#fff";
                }}
              >
                <p>
                  <strong>Location:</strong> {alert.location.address || "Unknown Location"}
                </p>
                <p>
                  <strong>Status:</strong> {alert.status}
                </p>
                <p>
                  <strong>Response Time:</strong>{" "}
                  {alert.responseTime ? alert.responseTime + " seconds" : "Not recorded"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SOSAlertsSection;
