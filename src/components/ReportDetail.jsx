import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default icon issues with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const ReportDetail = ({ reportData, onBack }) => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    // Simulate fetching or using passed reportData
    if (reportData) {
      setReport(reportData);
    }
  }, [reportData]);

  if (!report) {
    return <div>Loading report details...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={onBack} style={{ marginBottom: "20px" }}>
        &larr; Back to Community Reports
      </button>
      <h2>Report Details</h2>
      
      {/* User and Report Information */}
      <div style={{ border: "1px solid #ccc", padding: "20px", marginBottom: "20px" }}>
        <h3>User Details</h3>
        <p>
          <strong>Username:</strong> {report.username}
        </p>
        {report.userDetails && (
          <>
            <p>
              <strong>Full Name:</strong> {report.userDetails.fullName}
            </p>
            <p>
              <strong>Email:</strong> {report.userDetails.email}
            </p>
            <p>
              <strong>Phone:</strong> {report.userDetails.phone}
            </p>
          </>
        )}
        <h3>Report Information</h3>
        <p>
          <strong>Category:</strong> {report.category}
        </p>
        <p>
          <strong>Location:</strong> {report.location}
        </p>
        <p>
          <strong>Date:</strong> {report.date}
        </p>
        <p>
          <strong>Description:</strong> {report.description}
        </p>
      </div>
      
      {/* Map Section */}
      <div style={{ border: "1px solid #ccc", padding: "20px", marginBottom: "20px" }}>
        <h3>Location Map</h3>
        {report.coordinates ? (
          <MapContainer
            center={[report.coordinates.lat, report.coordinates.lng]}
            zoom={13}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[report.coordinates.lat, report.coordinates.lng]}>
              <Popup>{report.location}</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p>Location coordinates not available.</p>
        )}
      </div>
      
      {/* Media Section */}
      <div style={{ border: "1px solid #ccc", padding: "20px" }}>
        <h3>Media</h3>
        {report.mediaType === "video" ? (
          <video width="600" controls>
            <source src={report.media} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={report.media} alt="Report media" width="600" />
        )}
      </div>
    </div>
  );
};

export default ReportDetail;
