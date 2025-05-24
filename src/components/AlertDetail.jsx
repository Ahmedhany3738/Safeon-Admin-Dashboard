import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default icon issues with Leaflet (needed for many bundlers)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const AlertDetail = ({ alertData, onBack }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // When alertData is provided, add extra properties.
    if (alertData) {
      const dummyAlertData = {
        ...alertData,
        username: alertData.userId, // mapping userId to username
        liveVideoStream: "Live Video Streaming...",
        saved: true,
        pickedUp: alertData.pickedUp,
        trustedMembersStatus: [
          { member: "trusted1", status: "responding" },
          { member: "trusted2", status: "responded" },
        ],
        recordedVideo: "https://www.w3schools.com/html/mov_bbb.mp4",
        // Add dummy coordinates if not provided – using Cairo coordinates as an example.
        coordinates: alertData.coordinates || { lat: 30.0444, lng: 31.2357 },
      };
      setData(dummyAlertData);
    }
  }, [alertData]);

  if (!data) {
    return <div>Loading alert details...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={onBack} style={{ marginBottom: "20px" }}>
        &larr; Back to Alerts
      </button>
      <h2>Alert Details for Report ID: {data.id}</h2>

      {/* Live Video Section */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Live Video</h3>
        <div
          style={{
            width: "640px",
            height: "360px",
            backgroundColor: "#000",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {data.liveVideoStream}
        </div>
      </div>

      {/* Live Location Map */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Live Location</h3>
        {data.coordinates ? (
          <MapContainer
            center={[data.coordinates.lat, data.coordinates.lng]}
            zoom={13}
            style={{ height: "360px", width: "640px" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
                OpenStreetMap
              </a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[data.coordinates.lat, data.coordinates.lng]}>
              <Popup>{data.location}</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p>Location coordinates not available.</p>
        )}
      </div>

      {/* User Details */}
      <div style={{ marginBottom: "20px" }}>
        <h3>User Details</h3>
        <p>
          <strong>Username:</strong> {data.username}
        </p>
        <p>
          <strong>Location:</strong> {data.location}
        </p>
      </div>

      {/* Trusted Members Status */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Trusted Members Response</h3>
        <ul>
          {data.trustedMembersStatus.map((memberStatus, index) => (
            <li key={index}>
              {memberStatus.member}: {memberStatus.status}
            </li>
          ))}
        </ul>
      </div>

      {/* Alert Status */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Alert Status</h3>
        <p>
          <strong>Alert Saved:</strong> {data.saved ? "Yes" : "No"}
        </p>
        <p>
          <strong>Call Picked Up:</strong> {data.pickedUp ? "Yes" : "No"}
        </p>
      </div>

      {/* Recorded Video Playback */}
      <div>
        <h3>Recorded Video</h3>
        {data.recordedVideo ? (
          <video width="640" height="360" controls>
            <source src={data.recordedVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <p>No recorded video available.</p>
        )}
      </div>
    </div>
  );
};

export default AlertDetail;
