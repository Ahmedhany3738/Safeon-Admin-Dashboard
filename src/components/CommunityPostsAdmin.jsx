// src/components/CommunityPostsAdmin.jsx
import React, { useState } from "react";

// Dummy posts data
const dummyPosts = [
  {
    id: "post1",
    userId: "user123",
    username: "JohnDoe",
    profileImage: "https://i.pravatar.cc/150?img=3",
    content: "This is a community post from JohnDoe. I love our neighborhood!",
    status: "pending",
    submittedAt: "2025-05-15 12:00 PM"
  },
  {
    id: "post2",
    userId: "user456",
    username: "JaneSmith",
    profileImage: "https://i.pravatar.cc/150?img=5",
    content: "Neighborhood event coming soon!",
    status: "approved",
    submittedAt: "2025-05-14 09:00 AM"
  },
  {
    id: "post3",
    userId: "user123",
    username: "JohnDoe",
    profileImage: "https://i.pravatar.cc/150?img=3",
    content: "Suspicious activity reported near the park.",
    status: "rejected",
    submittedAt: "2025-05-13 04:30 PM"
  },
  {
    id: "post4",
    userId: "user456",
    username: "JaneSmith",
    profileImage: "https://i.pravatar.cc/150?img=5",
    content: "Looking forward to the upcoming festival!",
    status: "pending",
    submittedAt: "2025-05-16 11:00 AM"
  }
];

const CommunityPostsAdmin = ({ onViewUser }) => {
  const [posts, setPosts] = useState(dummyPosts);
  const [selectedTab, setSelectedTab] = useState("pending");

  // Filter posts based on current tab
  const filteredPosts = posts.filter((post) => post.status === selectedTab);

  // Action handlers:
  const handleApprove = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, status: "approved" } : post
      )
    );
  };

  const handleReject = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, status: "rejected" } : post
      )
    );
  };

  const handleDelete = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  return (
    <div className="community-posts-admin">
      <h2>Community Posts Submissions</h2>
      <div className="tabs">
        <button
          className={selectedTab === "approved" ? "active" : ""}
          onClick={() => setSelectedTab("approved")}
        >
          Approved
        </button>
        <button
          className={selectedTab === "pending" ? "active" : ""}
          onClick={() => setSelectedTab("pending")}
        >
          Pending
        </button>
        <button
          className={selectedTab === "rejected" ? "active" : ""}
          onClick={() => setSelectedTab("rejected")}
        >
          Rejected
        </button>
      </div>

      <div className="posts-list">
        {filteredPosts.length === 0 ? (
          <p>No posts in this category.</p>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <img
                  src={post.profileImage}
                  alt={`${post.username}'s avatar`}
                  className="post-user-avatar"
                  onClick={() => onViewUser && onViewUser(post.userId)}
                />
                <div className="post-user-info">
                  <h4>{post.username}</h4>
                  <p className="post-date">{post.submittedAt}</p>
                </div>
              </div>
              <div className="post-content">
                <p>{post.content}</p>
              </div>
              <div className="post-actions">
                {selectedTab === "pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(post.id)}
                      className="approve-btn"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(post.id)}
                      className="reject-btn"
                    >
                      Reject
                    </button>
                  </>
                )}
                {selectedTab === "approved" && (
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                )}
                {selectedTab === "rejected" && <span>No actions available</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityPostsAdmin;
