// src/components/Notifications.jsx
import React, { useState, useEffect } from "react";
import "../styles.css"; // assuming styles.css is at src/ level

const dummyNotifications = [
  {
    id: 1,
    title: "New Report Received",
    message: "A new report has been filed in your area.",
    time: "2 minutes ago"
  },
  {
    id: 2,
    title: "User Feedback",
    message: "A user provided feedback on your recent update.",
    time: "15 minutes ago"
  },
  {
    id: 3,
    title: "Maintenance Notice",
    message: "Scheduled maintenance will take place tomorrow at 2 AM.",
    time: "1 hour ago"
  },
  {
    id: 4,
    title: "System Alert",
    message: "High traffic detected in your area.",
    time: "Just now"
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  // Simulate fetching notifications
  useEffect(() => {
    setTimeout(() => {
      setNotifications(dummyNotifications);
    }, 1000);
  }, []);

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p className="no-notifications">No notifications at the moment.</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((notif) => (
            <li key={notif.id} className="notification-card">
              <div className="notification-header">
                <span className="notification-title">{notif.title}</span>
                <span className="notification-time">{notif.time}</span>
              </div>
              <p className="notification-message">{notif.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
