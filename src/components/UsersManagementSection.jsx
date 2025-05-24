// src/components/UserManagementSection.jsx
import React, { useState } from "react";

// Enhanced dummy user data with a profileImage property.
const dummyUsers = [
  {
    id: "user123",
    username: "JohnDoe",
    latestLocation: "Cairo, Egypt",
    phone: "+20123456789",
    email: "john@example.com",
    status: "gold",
    profileImage: "https://i.pravatar.cc/150?img=3", // dummy user image
    trustedMembers: [
      { name: "Alice", relationship: "Friend" },
      { name: "Bob", relationship: "Family" }
    ],
    sosAlerts: [
      "SOS Alert on 2025-05-17 10:00 AM: Emergency in North Cairo",
      "SOS Alert on 2025-05-18 12:30 PM: Fire alert"
    ],
    reportingIssues: [
      "Reporting Issue on 2025-05-16: Suspicious behavior reported"
    ],
    communityPosts: [
      "Community Post on 2025-05-15: Neighborhood watch update"
    ]
  },
  {
    id: "user456",
    username: "JaneSmith",
    latestLocation: "Alexandria, Egypt",
    phone: "+20198765432",
    email: "jane@example.com",
    status: "premium",
    profileImage: "https://i.pravatar.cc/150?img=5", // another dummy image
    trustedMembers: [{ name: "Cathy", relationship: "Colleague" }],
    sosAlerts: [
      "SOS Alert on 2025-05-10 08:30 AM: Medical emergency"
    ],
    reportingIssues: [
      "Reporting Issue on 2025-05-01: Traffic incident reported"
    ],
    communityPosts: [
      "Community Post on 2025-05-02: Local community event announcement"
    ]
  }
];

const UserManagementSection = () => {
  const [searchId, setSearchId] = useState("");
  const [userData, setUserData] = useState(null);
  const [actionMessage, setActionMessage] = useState("");

  // Search for a user with the given user ID from dummy data
  const handleSearch = () => {
    const foundUser = dummyUsers.find(
      (user) => user.id.toLowerCase() === searchId.trim().toLowerCase()
    );
    if (foundUser) {
      setUserData(foundUser);
      setActionMessage("");
    } else {
      setUserData(null);
      setActionMessage("User not found.");
    }
  };

  // Dummy admin actions simulate API calls.
  const handleBanUser = () => {
    setActionMessage("User has been banned.");
  };

  const handleDeactivateUser = () => {
    setActionMessage("User account has been deactivated.");
  };

  const handleSendMessage = () => {
    setActionMessage("Message sent to the user.");
  };

  return (
    <div
      className="user-management-section card"
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "30px auto",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        backgroundColor: "#fff"
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>User Management</h2>

      {/* Search Bar */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter user ID..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          style={{
            padding: "10px",
            width: "60%",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginRight: "10px"
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Search
        </button>
      </div>

      {userData && (
        <div
          className="user-details"
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            backgroundColor: "#f9f9f9"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            <img
              src={userData.profileImage}
              alt={`${userData.username} avatar`}
              style={{
                borderRadius: "50%",
                width: "150px",
                height: "150px",
                objectFit: "cover",
                marginRight: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
            />
            <div>
              <h3 style={{ margin: "0" }}>{userData.username}</h3>
              <p style={{ margin: "5px 0", color: "#555" }}>
                <strong>User ID:</strong> {userData.id}
              </p>
              <p style={{ margin: "5px 0", color: "#555" }}>
                <strong>Status:</strong> {userData.status.charAt(0).toUpperCase() + userData.status.slice(1)}
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <p><strong>Latest Location:</strong> {userData.latestLocation}</p>
            <p><strong>Phone:</strong> {userData.phone}</p>
            <p><strong>Email:</strong> {userData.email}</p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ marginBottom: "10px" }}>Trusted Members</h4>
            <ul style={{ listStyle: "none", paddingLeft: "0" }}>
              {userData.trustedMembers.map((member, index) => (
                <li key={index} style={{ marginBottom: "5px" }}>
                  {member.name} - <em>{member.relationship}</em>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4>SOS Alerts History</h4>
            <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
              {userData.sosAlerts.map((alert, index) => (
                <li key={index}>{alert}</li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4>Reporting Issues History</h4>
            <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
              {userData.reportingIssues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4>Community Posts History</h4>
            <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
              {userData.communityPosts.map((post, index) => (
                <li key={index}>{post}</li>
              ))}
            </ul>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <button
              onClick={handleBanUser}
              style={{
                padding: "10px 15px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Ban User
            </button>
            <button
              onClick={handleDeactivateUser}
              style={{
                padding: "10px 15px",
                backgroundColor: "orange",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Deactivate Account
            </button>
            <button
              onClick={handleSendMessage}
              style={{
                padding: "10px 15px",
                backgroundColor: "green",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Send Message
            </button>
          </div>

          {actionMessage && (
            <div style={{ marginTop: "20px", color: "green", fontWeight: "bold" }}>
              {actionMessage}
            </div>
          )}
        </div>
      )}

      {!userData && actionMessage && (
        <div style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
          {actionMessage}
        </div>
      )}
    </div>
  );
};

export default UserManagementSection;
