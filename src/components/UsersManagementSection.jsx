// src/components/UsersManagementSection.jsx
import React, { useState, useEffect } from "react";

// Dummy data for demonstration with two users having swapped trusted contacts.
const dummyUsers = [
  {
    id: "user123",
    username: "JohnDoe",
    latestLocation: "Cairo, Egypt",
    phone: "+20123456789",
    email: "john@example.com",
    status: "gold",
    profileImage: "https://i.pravatar.cc/150?img=3",
    // JohnDoe’s trusted contact is JaneSmith.
    trustedMembers: [{ name: "JaneSmith", relationship: "Trusted Contact" }],
    sosAlerts: [
      {
        id: "alert1",
        userId: "user123",
        text: "SOS Alert on 2025-05-17 10:00 AM: Emergency in North Cairo",
        pickedUp: false
      },
      {
        id: "alert2",
        userId: "user123",
        text: "SOS Alert on 2025-05-18 12:30 PM: Fire alert",
        pickedUp: true
      }
    ],
    reportingIssues: [
      { id: "issue1", text: "Reporting Issue on 2025-05-16: Suspicious behavior reported" }
    ],
    communityPosts: [
      { id: "post1", text: "Community Post on 2025-05-15: Neighborhood watch update" }
    ]
  },
  {
    id: "user456",
    username: "JaneSmith",
    latestLocation: "Alexandria, Egypt",
    phone: "+20198765432",
    email: "jane@example.com",
    status: "premium",
    profileImage: "https://i.pravatar.cc/150?img=5",
    // JaneSmith’s trusted contact is JohnDoe.
    trustedMembers: [{ name: "JohnDoe", relationship: "Trusted Contact" }],
    sosAlerts: [
      {
        id: "alert3",
        userId: "user456",
        text: "SOS Alert on 2025-05-10 08:30 AM: Medical emergency",
        pickedUp: false
      }
    ],
    reportingIssues: [
      { id: "issue2", text: "Reporting Issue on 2025-05-01: Traffic incident reported" }
    ],
    communityPosts: [
      { id: "post2", text: "Community Post on 2025-05-02: Local community event announcement" }
    ]
  }
];

const UsersManagementSection = ({
  searchQuery,
  selectedUserId, // New prop to load a specific user's details automatically.
  onViewProfile, // Callback that handles switching to a trusted member profile.
  onSelectAlert,
  onSelectReportingIssue,
  onSelectCommunityPost
}) => {
  const [searchId, setSearchId] = useState("");
  const [userData, setUserData] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  // Store the original user details for later "Back" navigation.
  const [originalUser, setOriginalUser] = useState(null);

  // If a selectedUserId prop is provided, load that user automatically.
  useEffect(() => {
    if (selectedUserId) {
      const foundUser = dummyUsers.find(
        (user) => user.id.toLowerCase() === selectedUserId.toLowerCase()
      );
      if (foundUser) {
        setUserData(foundUser);
        setOriginalUser(foundUser);
      }
    }
  }, [selectedUserId]);

  // Search for a user manually via input.
  const handleSearch = () => {
    const foundUser = dummyUsers.find(
      (user) => user.id.toLowerCase() === searchId.trim().toLowerCase()
    );
    if (foundUser) {
      setUserData(foundUser);
      setOriginalUser(foundUser);
      setActionMessage("");
    } else {
      setUserData(null);
      setActionMessage("User not found.");
      setOriginalUser(null);
    }
  };

  // Dummy admin action handlers.
  const handleBanUser = () => setActionMessage("User has been banned.");
  const handleDeactivateUser = () => setActionMessage("User account has been deactivated.");
  const handleSendMessage = () => setActionMessage("Message sent to the user.");

  // When clicking a trusted member card, look up that user from dummyUsers.
  const handleTrustedMemberClick = (member) => {
    if (!originalUser) setOriginalUser(userData);
    const foundUser = dummyUsers.find(
      (user) => user.username.toLowerCase() === member.name.toLowerCase()
    );
    if (foundUser) {
      setUserData(foundUser);
    } else {
      setUserData({
        id: member.id || "N/A",
        username: member.name,
        latestLocation: "Not Available",
        phone: "Not Available",
        email: "Not Available",
        status: "Not Available",
        profileImage: "https://via.placeholder.com/150",
        trustedMembers: [],
        sosAlerts: [],
        reportingIssues: [],
        communityPosts: []
      });
    }
  };

  // Allow going back to the original user's details.
  const handleBackToOriginal = () => {
    if (originalUser) {
      setUserData(originalUser);
      setOriginalUser(null);
    }
  };

  return (
    <div className="users-management">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter user ID..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-btn">
          Search
        </button>
      </div>

      {userData ? (
        <div className="user-details">
          <div className="user-header">
            <img
              src={userData.profileImage}
              alt={`${userData.username} avatar`}
              className="user-avatar"
            />
            <div className="user-info">
              <h3>{userData.username}</h3>
              <p>
                <strong>User ID:</strong> {userData.id}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {userData.status.charAt(0).toUpperCase() + userData.status.slice(1)}
              </p>
            </div>
          </div>

          <div className="user-contact">
            <p>
              <strong>Latest Location:</strong> {userData.latestLocation}
            </p>
            <p>
              <strong>Phone:</strong> {userData.phone}
            </p>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
          </div>

          {originalUser && (
            <button onClick={handleBackToOriginal} className="back-btn">
              Back
            </button>
          )}

          <div className="trusted-members">
            <h4>Trusted Members</h4>
            <div className="trusted-members-grid">
              {userData.trustedMembers.map((member, index) => (
                <div
                  key={index}
                  className="trusted-member-card"
                  onClick={() => handleTrustedMemberClick(member)}
                >
                  <img
                    src="https://via.placeholder.com/80"
                    alt={member.name}
                    className="trusted-member-avatar"
                  />
                  <h4>{member.name}</h4>
                  <p>{member.relationship}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="sos-alerts">
            <h4>SOS Alerts History</h4>
            <ul>
              {userData.sosAlerts.map((alert, idx) => (
                <li
                  key={idx}
                  className="clickable-item"
                  onClick={() => onSelectAlert && onSelectAlert(alert)}
                >
                  {alert.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="reporting-issues">
            <h4>Reporting Issues History</h4>
            <ul>
              {userData.reportingIssues.map((issue, idx) => (
                <li
                  key={idx}
                  className="clickable-item"
                  onClick={() =>
                    onSelectReportingIssue && onSelectReportingIssue(issue)
                  }
                >
                  {issue.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="community-posts">
            <h4>Community Posts History</h4>
            <ul>
              {userData.communityPosts.map((post, idx) => (
                <li
                  key={idx}
                  className="clickable-item"
                  onClick={() =>
                    onSelectCommunityPost && onSelectCommunityPost(post)
                  }
                >
                  {post.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="admin-actions">
            <button onClick={handleBanUser} className="action-btn ban-btn">
              Ban User
            </button>
            <button onClick={handleDeactivateUser} className="action-btn deactivate-btn">
              Deactivate Account
            </button>
            <button onClick={handleSendMessage} className="action-btn message-btn">
              Send Message
            </button>
          </div>

          {actionMessage && (
            <div className="action-message">{actionMessage}</div>
          )}
        </div>
      ) : (
        actionMessage && (
          <div className="error-message">{actionMessage}</div>
        )
      )}
    </div>
  );
};

export default UsersManagementSection;
