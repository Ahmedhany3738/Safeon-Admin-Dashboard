import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const API_BASE_URL =
  "https://safeon-git-main-malakmekkawys-projects.vercel.app/user/admin/";

// Replace with your provided token
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODM3OTIwOGI0NjU1NTkzZjViYTM3ZTkiLCJpYXQiOjE3NDg1NTg2MDIsImV4cCI6MTc0OTE2MzQwMn0.G7PcOJ2ZFI5Hih6Z69rHm-Gse3sx-5yM_4GqF-y0X68";

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

const UsersManagementSection = ({
  selectedUserId,
  onViewProfile,
  onSelectAlert,
  onSelectReportingIssue,
  onSelectCommunityPost,
}) => {
  const [searchId, setSearchId] = useState("");
  const [userData, setUserData] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // When selectedUserId (from parent) changes, fetch that profile
  useEffect(() => {
    if (selectedUserId && selectedUserId.trim()) {
      fetchUserData(selectedUserId);
    } else {
      setUserData(null);
    }
    // Reset originalUser whenever a new top-level user is selected.
    setOriginalUser(null);
  }, [selectedUserId]);

  const fetchUserData = async (userId) => {
    if (!userId.trim()) {
      setErrorMessage("Enter a valid user ID.");
      return;
    }
    setLoading(true);
    setErrorMessage("");

    const url = `${API_BASE_URL}${userId}`;
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        let errorDetails = "";
        try {
          const errorData = await response.json();
          errorDetails = errorData.message || JSON.stringify(errorData);
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
        }
        throw new Error(`User not found or server error. ${errorDetails}`);
      }
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchUserData(searchId);
  };

  // When a trusted contact is clicked, save the current user as original and load the new profile.
  const handleTrustedMemberClick = (contact) => {
    if (!originalUser) {
      setOriginalUser(userData);
    }
    fetchUserData(contact.userId._id);
  };

  // Back arrow restores the original user data.
  const handleBack = () => {
    if (originalUser) {
      setUserData(originalUser);
      setOriginalUser(null);
    }
  };

  // Default profile picture
  const defaultProfilePic = "https://via.placeholder.com/150";

  return (
    <div className="users-management">
      {/* Original Search Bar at the Top */}
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

      {/* Back Arrow if we've navigated into a trusted contact */}
      {originalUser && (
        <div className="back-arrow" onClick={handleBack}>
          ← Back
        </div>
      )}

      {loading ? (
        <p className="loading-message">Loading user profile...</p>
      ) : errorMessage ? (
        <p className="error-message">{errorMessage}</p>
      ) : userData ? (
        <div className="user-data-container">
          {/* User Profile Section */}
          <div className="user-profile">
            <div className="user-header">
              <img
                src={
                  userData.userInfo.profileImage
                    ? userData.userInfo.profileImage
                    : defaultProfilePic
                }
                alt={`${userData.userInfo.name} avatar`}
                className="user-avatar"
              />
              <div className="user-info">
                <h3>{userData.userInfo.name}</h3>
                <p>
                  <strong>User ID:</strong> {userData.userInfo.id}
                </p>
                <p>
                  <strong>Email:</strong> {userData.userInfo.email}
                </p>
                <p>
                  <strong>Phone:</strong> {userData.userInfo.phone_num}
                </p>
              </div>
            </div>

            {/* Trusted Contacts Section */}
            <div className="trusted-contacts">
              <h4>Trusted Contacts</h4>
              <ul className="trusted-contacts-list">
                {userData.userInfo.trustedContacts?.map((contact, idx) => (
                  <li
                    key={idx}
                    className="clickable-item"
                    onClick={() => handleTrustedMemberClick(contact)}
                  >
                    <img
                      src={
                        contact.userId.profileImage
                          ? contact.userId.profileImage
                          : defaultProfilePic
                      }
                      alt={`${contact.name} avatar`}
                      className="contact-avatar"
                    />
                    <span>
                      {contact.name} - {contact.phone_num}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* SOS Alerts Section */}
          <div
            className="sos-alerts-section clickable-item"
            onClick={() =>
              userData.sosAlerts &&
              userData.sosAlerts.length > 0 &&
              onSelectAlert(userData.sosAlerts[0])
            }
          >
            <h4>SOS Alerts</h4>
            {userData.sosAlerts && userData.sosAlerts.length > 0 ? (
              <ul className="sos-alerts-list">
                {userData.sosAlerts.map((alert) => (
                  <li
                    key={alert._id}
                    className="sos-alert-item clickable-item"
                    onClick={() => onSelectAlert(alert)}
                  >
                    <p>
                      <strong>Status:</strong> {alert.status}
                    </p>
                    <p>
                      <strong>Location:</strong> {alert.location.address} (
                      {alert.location.lat}, {alert.location.lng})
                    </p>
                    <p>
                      <strong>Created:</strong>{" "}
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                    <div className="alert-map">
                      <MapContainer
                        center={[alert.location.lat, alert.location.lng]}
                        zoom={13}
                        scrollWheelZoom={false}
                        style={{ height: "150px", width: "100%" }}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker
                          position={[alert.location.lat, alert.location.lng]}
                        >
                          <Popup>Alert Location</Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No SOS alerts available.</p>
            )}
          </div>

          {/* Community Posts Section */}
          <div className="community-posts-section">
            <h4>Community Posts</h4>
            {userData.communityPosts && userData.communityPosts.length > 0 ? (
              <ul className="community-posts-list">
                {userData.communityPosts.map((post) => (
                  <li
                    key={post._id}
                    className="community-post-item clickable-item"
                    onClick={() => onSelectCommunityPost(post)}
                  >
                    <p>
                      <strong>Description:</strong> {post.description}
                    </p>
                    <p>
                      <strong>Location:</strong> {post.location.address}
                    </p>
                    <p>
                      <strong>Status:</strong> {post.status}
                    </p>
                    <p>
                      <strong>Posted:</strong>{" "}
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No community posts available.</p>
            )}
          </div>

          {/* Emergency Reports Section */}
          <div
            className="emergency-reports-section clickable-item"
            onClick={() =>
              userData.emergencyReports &&
              userData.emergencyReports.length > 0 &&
              onSelectReportingIssue(userData.emergencyReports[0])
            }
          >
            <h4>Emergency Reports</h4>
            {userData.emergencyReports &&
            userData.emergencyReports.length > 0 ? (
              <ul className="emergency-reports-list">
                {userData.emergencyReports.map((report) => (
                  <li
                    key={report._id}
                    className="emergency-report-item clickable-item"
                    onClick={() => onSelectReportingIssue(report)}
                  >
                    <p>{report.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No emergency reports available.</p>
            )}
          </div>
        </div>
      ) : (
        <p className="info-message">No user data to display.</p>
      )}
    </div>
  );
};

export default UsersManagementSection;
