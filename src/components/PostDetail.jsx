// src/components/PostDetail.jsx
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

const PostDetail = ({ post, onBack, onViewUser }) => {
  if (!post) {
    return <p style={{ padding: "20px" }}>Post details not available.</p>;
  }

  // If post.userId is a string, attempt to fetch full user details.
  const [userDetails, setUserDetails] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState("");

  useEffect(() => {
    if (post && typeof post.userId === "string") {
      const fetchUserDetails = async () => {
        setUserLoading(true);
        try {
          const API_BASE_URL =
            "https://safeon-git-main-malakmekkawys-projects.vercel.app/user/admin/";
          const token =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzhlYWM3NmY2MmQ0ZmYyYjAwNTdmNSIsImlhdCI6MTc0ODcyODYyOCwiZXhwIjoxNzQ5MzMzNDI4fQ.L5GMymp9iKQxnjUYicFoo6HXN2JDGnqh-a6TMrfxAcQ";
          const response = await fetch(`${API_BASE_URL}${post.userId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch user details");
          }
          const data = await response.json();
          console.log("Fetched user details:", data);
          // Adjust if your API returns the full user info under a different property.
          setUserDetails(data.user);
        } catch (error) {
          console.error(error);
          setUserError("Error fetching user details");
        } finally {
          setUserLoading(false);
        }
      };
      fetchUserDetails();
    }
  }, [post]);

  // Determine full user info: if post.userId is an object, use it; if not, use fetched userDetails.
  const fullUser =
    typeof post.userId === "object" ? post.userId : userDetails || null;
  const userDisplay = fullUser && fullUser.name ? fullUser.name : post.userId;

  return (
    <div style={{ padding: "20px" }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          padding: "8px 12px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        &larr; Back to Posts
      </button>
      <h2>{userDisplay}'s Post</h2>
      <p style={{ fontSize: "0.9rem", color: "#777" }}>
        Posted on: {new Date(post.createdAt).toLocaleString()}
      </p>

      {/* User Details Section */}
      <div
        onClick={() =>
          onViewUser && onViewUser(fullUser ? fullUser._id : post.userId)
        }
        style={{
          margin: "20px 0",
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "5px",
          cursor: "pointer",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3>User Details</h3>
        {userLoading ? (
          <p>Loading user details...</p>
        ) : userError ? (
          <p style={{ color: "red" }}>{userError}</p>
        ) : fullUser ? (
          <>
            {fullUser.profileImage ? (
              <img
                src={fullUser.profileImage}
                alt="User Profile"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
            ) : (
              <p style={{ fontStyle: "italic" }}>User ID: {post.userId}</p>
            )}
            <p>
              <strong>Name:</strong> {fullUser.name}
            </p>
            {fullUser.email && (
              <p>
                <strong>Email:</strong> {fullUser.email}
              </p>
            )}
            {fullUser.phone_num && (
              <p>
                <strong>Phone:</strong> {fullUser.phone_num}
              </p>
            )}
          </>
        ) : (
          <p style={{ fontStyle: "italic" }}>No additional user details available. (User ID: {post.userId})</p>
        )}
        <p style={{ fontSize: "0.8rem", color: "#007bff" }}>
          Click for full profile
        </p>
      </div>

      {/* Map Section */}
      {post.location?.coordinates ? (
        <div style={{ marginBottom: "20px" }}>
          <h3>Location</h3>
          <MapContainer
            center={[
              post.location.coordinates[1],
              post.location.coordinates[0],
            ]}
            zoom={14}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
            />
            <Marker
              position={[
                post.location.coordinates[1],
                post.location.coordinates[0],
              ]}
            >
              <Popup>{post.location.address || "Unknown Location"}</Popup>
            </Marker>
          </MapContainer>
        </div>
      ) : (
        <p>Location data not available.</p>
      )}

      {/* Post Image (if available) */}
      {post.images && post.images.length > 0 && (
        <img
          src={post.images[0]}
          alt="Post"
          style={{
            width: "100%",
            borderRadius: "5px",
            marginBottom: "20px",
          }}
        />
      )}

      {/* Post Details */}
      <p>
        <strong>Description:</strong> {post.description || "No details provided"}
      </p>
      <p>
        <strong>Status:</strong> {post.status}
      </p>
    </div>
  );
};

export default PostDetail;
