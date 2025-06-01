// src/components/AlertDetail.jsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const AlertDetail = function ({ alertData, onBack }) {
  const [alert, setAlert] = useState(null);

  useEffect(function () {
    if (alertData) {
      setAlert(alertData);
    }
  }, [alertData]);

  if (!alert) {
    return <div className="loading-message">Loading alert details...</div>;
  }

  // Extract latitude and longitude from the alert's location object
  const lat = alert.location && alert.location.lat ? alert.location.lat : null;
  const lng = alert.location && alert.location.lng ? alert.location.lng : null;

  return (
    <div className="alert-detail card">
      <button
        onClick={function () {
          onBack("sos");
        }}
        className="back-btn"
      >
        &larr; Back to SOS Alerts
      </button>
      <h2 className="alert-title">
        <i className="fas fa-bell icon"></i> Alert Details
      </h2>

      {/* Alert Information */}
      <div className="alert-section alert-info">
        <h3>Alert Information</h3>
        <p>
          <strong>Status:</strong> {alert.status}
        </p>
        <p>
          <strong>Location:</strong> {alert.location.address || "Unknown Location"}
        </p>
        <p>
          <strong>Date:</strong> {new Date(alert.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Live Location Map */}
      <div className="alert-section alert-map">
        <h3>Live Location</h3>
        {lat && lng ? (
          <MapContainer center={[lat, lng]} zoom={13} className="map-container">
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lng]}>
              <Popup>{alert.location.address}</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p>Location coordinates not available.</p>
        )}
      </div>

      {/* Media Section */}
      <div className="alert-section alert-media">
        <h3>Alert Media</h3>
        {alert.videoStreamUrl ? (
          <video width="640" height="360" controls>
            <source src={alert.videoStreamUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <p>No live stream available.</p>
        )}
      </div>

      {/* Trusted Contacts */}
      <div className="alert-section alert-info">
        <h3>Trusted Contacts</h3>
        {alert.trustedContacts && alert.trustedContacts.length > 0 ? (
          <ul>
            {alert.trustedContacts.map(function (contact, idx) {
              return <li key={idx}>{contact}</li>;
            })}
          </ul>
        ) : (
          <p>No trusted contacts available.</p>
        )}
      </div>

      {/* Response Time */}
      <div className="alert-section alert-info">
        <h3>Response Time</h3>
        <p>
          {alert.responseTime ? alert.responseTime + " seconds" : "Not recorded"}
        </p>
      </div>
    </div>
  );
};

export default AlertDetail;
