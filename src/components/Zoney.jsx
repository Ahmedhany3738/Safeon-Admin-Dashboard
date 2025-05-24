import React, { useState } from "react";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Dummy zones data with coordinates, zone type, title, description, and radius in meters.
const dummyZones = [
  {
    id: "1",
    lat: 30.06,
    lng: 31.22,
    zoneType: "red",
    title: "Nasr City",
    description: "Nasr City: Risky (Kidnapping)",
    // radius in meters for red zones
    radius: 1200,
  },
  {
    id: "2",
    lat: 30.07,
    lng: 31.23,
    zoneType: "moderate",
    title: "Maadi",
    description: "Maadi: Moderate risk (Petty Theft)",
    radius: 1000,
  },
  {
    id: "3",
    lat: 30.05,
    lng: 31.21,
    zoneType: "green",
    title: "Heliopolis",
    description: "Heliopolis: Safe (Low Crime Rate)",
    radius: 800,
  },
  {
    id: "4",
    lat: 30.08,
    lng: 31.25,
    zoneType: "red",
    title: "Garden City",
    description: "Garden City: High Risk (Armed Robbery)",
    radius: 1200,
  },
  {
    id: "5",
    lat: 30.04,
    lng: 31.20,
    zoneType: "moderate",
    title: "Zamalek",
    description: "Zamalek: Moderate (Burglary Incidents)",
    radius: 1000,
  },
  {
    id: "6",
    lat: 30.09,
    lng: 31.24,
    zoneType: "green",
    title: "Dokki",
    description: "Dokki: Safe (Very Low Risk)",
    radius: 800,
  },
  {
    id: "7",
    lat: 30.10,
    lng: 31.26,
    zoneType: "red",
    title: "Downtown",
    description: "Downtown: Critical (High Kidnapping Incidents)",
    radius: 1200,
  },
];

// Helper function to determine the path options for a circle based on zone type.
const getPathOptionsForZone = (zoneType) => {
  if (zoneType === "red")
    return { color: "red", fillColor: "red", fillOpacity: 0.3 };
  if (zoneType === "moderate")
    return { color: "orange", fillColor: "orange", fillOpacity: 0.3 };
  if (zoneType === "green")
    return { color: "green", fillColor: "green", fillOpacity: 0.3 };
  // default fallback
  return { color: "blue", fillColor: "blue", fillOpacity: 0.3 };
};

const Zoney = ({ reports }) => {
  // Use passed reports if available; otherwise fallback to dummyZones.
  const zones = reports && reports.length > 0 ? reports : dummyZones;

  // State to track which zone type is selected.
  const [selectedZoneType, setSelectedZoneType] = useState("red");

  // Filter the zones based on the selected zone type.
  const filteredZones = zones.filter((zone) => zone.zoneType === selectedZoneType);

  return (
    <div className="zoney-section card" style={{ padding: "20px" }}>
      <h2>Reports Locations</h2>

      {/* Buttons to select zone type */}
      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={() => setSelectedZoneType("red")}
          style={{
            marginRight: "10px",
            backgroundColor: "red",
            color: "white",
            padding: "8px",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Red Zones
        </button>
        <button
          onClick={() => setSelectedZoneType("moderate")}
          style={{
            marginRight: "10px",
            backgroundColor: "orange",
            color: "white",
            padding: "8px",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Moderate Zones
        </button>
        <button
          onClick={() => setSelectedZoneType("green")}
          style={{
            backgroundColor: "green",
            color: "white",
            padding: "8px",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Green Zones
        </button>
      </div>

      {/* Leaflet Map */}
      <MapContainer
        center={[30.06, 31.22]}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Draw a Circle for each filtered zone */}
        {filteredZones.map((zone) => (
          <Circle
            key={zone.id}
            center={[zone.lat, zone.lng]}
            radius={zone.radius}
            pathOptions={getPathOptionsForZone(zone.zoneType)}
          >
            <Popup>
              <strong>{zone.title}</strong>
              <br />
              {zone.description}
            </Popup>
          </Circle>
        ))}
      </MapContainer>

      {/* Insights Section */}
      <div style={{ marginTop: "20px" }}>
        <h3>Zone Insights</h3>
        {filteredZones.length ? (
          filteredZones.map((zone) => (
            <p key={zone.id}>
              <strong>{zone.title}:</strong> {zone.description}
            </p>
          ))
        ) : (
          <p>No zones available for {selectedZoneType}.</p>
        )}
      </div>
    </div>
  );
};

export default Zoney;
