// In your CommunityReportsSection.jsx file
import React, { useState } from "react";

const tabs = ["Pending", "Approved", "Rejected"];

const sampleReports = {
  Pending: [
    {
      id: "1",
      username: "userA",
      category: "Fire Accident",
      location: "Cairo, Egypt",
      date: "2025-05-17 10:00 AM",
      description:
        "There was a fire accident at a residential area. Flames were visible and first responders are on site.",
      media: "https://via.placeholder.com/150",
      mediaType: "image",
      coordinates: { lat: 30.0444, lng: 31.2357 }, // Cairo coordinates
      userDetails: {
        fullName: "Ahmed Ali",
        email: "ahmed@example.com",
        phone: "+201234567890"
      }
    },
    {
      id: "2",
      username: "userB",
      category: "Kidnapping",
      location: "Giza, Egypt",
      date: "2025-05-17 10:30 AM",
      description:
        "A kidnapping incident was reported near the market. The suspect was observed leaving in a dark vehicle.",
      media: "https://via.placeholder.com/150",
      mediaType: "image",
      coordinates: { lat: 30.0131, lng: 31.2089 }, // Giza coordinates
      userDetails: {
        fullName: "Sara Mahmoud",
        email: "sara@example.com",
        phone: "+201098765432"
      }
    }
  ],
  Approved: [
    {
      id: "3",
      username: "userC",
      category: "Robbery",
      location: "Alexandria, Egypt",
      date: "2025-05-16 09:00 AM",
      description:
        "A robbery occurred at a local shop. The suspect was apprehended after a chase and security footage is available.",
      media: "https://via.placeholder.com/150",
      mediaType: "image",
      coordinates: { lat: 31.2001, lng: 29.9187 }, // Alexandria coordinates
      userDetails: {
        fullName: "Hassan Kamel",
        email: "hassan@example.com",
        phone: "+201112223334"
      }
    }
  ],
  Rejected: [
    {
      id: "4",
      username: "userD",
      category: "Suspicious Activity",
      location: "Luxor, Egypt",
      date: "2025-05-15 08:00 AM",
      description:
        "Suspicious activity was reported by multiple witnesses and later determined to be a misunderstanding.",
      media: "https://via.placeholder.com/150",
      mediaType: "image",
      coordinates: { lat: 25.6872, lng: 32.6396 }, // Luxor coordinates
      userDetails: {
        fullName: "Mona Elzahraa",
        email: "mona@example.com",
        phone: "+201556677889"
      }
    }
  ]
};


const CommunityReportsSection = ({ activeSubTab, searchQuery, onSelectReport }) => {
  const [activeTab, setActiveTab] = useState("Pending");
  const reports = sampleReports[activeTab] || [];

  const truncateText = (text, maxLength = 60) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className="community-reports-section card" style={{ padding: "20px" }}>
      <h2>Community Reports</h2>
      <div className="tabs" style={{ marginBottom: "10px" }}>
        {tabs.map((tab) => (
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

      <div className="reports-list">
        {reports.length === 0 ? (
          <p>No reports found.</p>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
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
                <img src={report.media} alt={report.category} width="100" height="60" />
              </div>
              <div className="report-info">
                <p>
                  <strong>{report.username}</strong>
                </p>
                <p>Category: {report.category}</p>
                <p>Location: {report.location}</p>
                <p>Date: {report.date}</p>
                <p>Description: {truncateText(report.description)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityReportsSection;
