// src/components/CommunityPostsAdmin.jsx
import React, { useState, useEffect } from "react";
import { getAllPosts, patchPostStatus } from "../api/adminAPI";

const CommunityPostsAdmin = ({ onViewPost }) => {
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState("pending"); // "pending", "approved", or "rejected"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await getAllPosts();
        console.log("Fetched posts:", data); // Log all posts
        if (data && Array.isArray(data)) {
          setPosts(data);
        } else {
          setPosts([]);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Error fetching posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Approve a post (update status to "approved")
  const handleApprovePost = async (postId) => {
    try {
      const updatedPost = await patchPostStatus(postId, "approved");
      console.log("Post approved:", updatedPost);
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
    } catch (err) {
      console.error("Error approving post:", err);
      alert("Failed to update post status");
    }
  };

  // Reject a post (update status to "rejected")
  const handleRejectPost = async (postId) => {
    try {
      const updatedPost = await patchPostStatus(postId, "rejected");
      console.log("Post rejected:", updatedPost);
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
    } catch (err) {
      console.error("Error rejecting post:", err);
      alert("Failed to update post status");
    }
  };

  // Helper: convert status to lowercase safely.
  const statusToLower = (s) => (s ? s.toString().toLowerCase() : "");
  const pendingPosts = posts.filter(
    (post) => statusToLower(post.status) === "pending"
  );
  const approvedPosts = posts.filter(
    (post) => statusToLower(post.status) === "approved"
  );
  const rejectedPosts = posts.filter(
    (post) => statusToLower(post.status) === "rejected"
  );

  console.log("Approved posts:", approvedPosts);

  // Helper to truncate text.
  const truncate = (text, length = 80) =>
    text && text.length > length ? text.substring(0, length) + "..." : text;

  // Improved renderPostCard with null checks for userId:
  const renderPostCard = (post, showActions = false) => {
    // Check if userId exists before accessing .name.
    const userDisplay =
      post.userId && typeof post.userId === "object"
        ? (post.userId.name ? post.userId.name : "Unknown User")
        : (post.userId ? post.userId : "Unknown User");

    return (
      <div
        key={post._id}
        className="post-card clickable-item"
        style={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #ddd",
          borderRadius: "5px",
          padding: "10px",
          marginBottom: "10px",
          backgroundColor: "#fff",
          cursor: "pointer",
        }}
        onClick={() => onViewPost && onViewPost(post)}
      >
        {post.images && post.images.length > 0 && (
          <img
            src={post.images[0]}
            alt="Post thumbnail"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "5px",
              marginRight: "10px",
            }}
          />
        )}
        <div style={{ flex: 1 }}>
          <p style={{ margin: "0", fontWeight: "bold" }}>{userDisplay}</p>
          <p style={{ margin: "5px 0" }}>{truncate(post.description, 100)}</p>
          <p style={{ margin: "0", fontSize: "0.85rem", color: "#777" }}>
            {post.location?.address || "Location not provided"}
          </p>
          <p style={{ margin: "0", fontSize: "0.75rem", color: "#aaa" }}>
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
        {showActions && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleApprovePost(post._id);
              }}
              style={{
                padding: "8px 16px",
                fontSize: "1rem",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Approve
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRejectPost(post._id);
              }}
              style={{
                padding: "8px 16px",
                fontSize: "1rem",
                backgroundColor: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Reject
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading)
    return <p style={{ padding: "20px" }}>Loading posts...</p>;
  if (error)
    return <p style={{ padding: "20px", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Community Posts</h2>
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => setView("pending")}
          style={{
            backgroundColor: view === "pending" ? "#007bff" : "#ddd",
            color: view === "pending" ? "#fff" : "#000",
            border: "none",
            borderRadius: "5px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Pending Posts
        </button>
        <button
          onClick={() => setView("approved")}
          style={{
            backgroundColor: view === "approved" ? "#007bff" : "#ddd",
            color: view === "approved" ? "#fff" : "#000",
            border: "none",
            borderRadius: "5px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Approved Posts
        </button>
        <button
          onClick={() => setView("rejected")}
          style={{
            backgroundColor: view === "rejected" ? "#007bff" : "#ddd",
            color: view === "rejected" ? "#fff" : "#000",
            border: "none",
            borderRadius: "5px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Rejected Posts
        </button>
      </div>

      {view === "pending" && (
        <div>
          {pendingPosts.length === 0
            ? <p>No pending posts.</p>
            : pendingPosts.map((post) => renderPostCard(post, true))}
        </div>
      )}
      {view === "approved" && (
        <div>
          {approvedPosts.length === 0
            ? <p>No approved posts.</p>
            : approvedPosts.map((post) => renderPostCard(post))}
        </div>
      )}
      {view === "rejected" && (
        <div>
          {rejectedPosts.length === 0
            ? <p>No rejected posts.</p>
            : rejectedPosts.map((post) => renderPostCard(post))}
        </div>
      )}
    </div>
  );
};

export default CommunityPostsAdmin;
