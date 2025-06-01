// src/components/ReportDetail.jsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const ReportDetail = ({ reportData, onBack, onViewUser }) => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (reportData) {
      setReport(reportData);
    }
  }, [reportData]);

  if (!report) {
    return <div className="loading-message">Loading report details...</div>;
  }

  // Extract lat/lng correctly from the API response
  const lat = report.location?.coordinates[0] || null; // Your API uses [lat, lng], so swap these values
  const lng = report.location?.coordinates[1] || null;

  return (
    <div className="report-detail card">
      <button onClick={() => onBack("community")} className="back-btn">
        &larr; Back to Community Reports
      </button>
      <h2 className="report-title">
        <i className="fas fa-exclamation-triangle icon"></i> Report Details
      </h2>

      <div className="report-section report-info">
        <h3>User Details</h3>
        {report.userId ? (
          <>
            <p>
              <strong>Name:</strong>{" "}
              <button className="user-clickable" onClick={() => onViewUser(report.userId._id)}>
                {report.userId.name}
              </button>
            </p>
            <p>
              <strong>Email:</strong> {report.userId.email}
            </p>
            <p>
              <strong>Phone:</strong> {report.userId.phone_num}
            </p>
            <img src={report.userId.profileImage} alt={`${report.userId.name} profile`} className="small-profile-img" />
          </>
        ) : (
          <p>User details not available.</p>
        )}
        <h3>Report Information</h3>
        <p><strong>Emergency Type:</strong> {report.emergencyType}</p>
        <p><strong>Status:</strong> {report.status}</p>
        <p><strong>Location:</strong> {report.location?.address || "Unknown Location"}</p>
        <p><strong>Date:</strong> {new Date(report.createdAt).toLocaleString()}</p>
        <p><strong>Description:</strong> {report.description || "No description provided."}</p>
      </div>

      <div className="report-section report-map">
        <h3>Location Map</h3>
        {lat && lng ? (
          <MapContainer center={[lat, lng]} zoom={13} className="map-container">
            <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[lat, lng]}>
              <Popup>{report.location.address}</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p>Location coordinates not available.</p>
        )}
      </div>

      {/* Media Section */}
      <div className="report-section report-media">
        <h3>Media</h3>
        {report.photos && report.photos.length > 0 ? (
          report.photos.map((photo, index) => (
            <img key={index} src={photo} alt="Report media" width="250" />
          ))
        ) : (
          <p>No media available.</p>
        )}
      </div>
    </div>
  );
};

export default ReportDetail;
