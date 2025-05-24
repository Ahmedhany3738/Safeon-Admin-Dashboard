// src/components/Sidebar.jsx
import React from "react";
import { 
  FaTachometerAlt, 
  FaBell, 
  FaComments, 
  FaMapMarkedAlt, 
  FaUserCog, 
  FaRegBell, 
  FaSignOutAlt 
} from "react-icons/fa";

const mainMenu = [
  { key: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { key: "sos", label: "SOS Alerts", icon: <FaBell /> },
  { key: "community", label: "Community Reports", icon: <FaComments /> },
  { key: "zoney", label: "Zoney", icon: <FaMapMarkedAlt /> },
  { key: "users", label: "Users", icon: <FaUserCog /> },
  { key: "notifications", label: "Notifications", icon: <FaRegBell /> }
];


const Sidebar = ({ activeSection, setActiveSection, onLogout }) => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-header">Admin Panel</h2>
      <ul className="nav-list">
        {mainMenu.map((item) => (
          <li key={item.key}>
            <div
              className={`nav-item ${activeSection === item.key ? "active" : ""}`}
              onClick={() => setActiveSection(item.key)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </div>
          </li>
        ))}
      </ul>
      <div className="sidebar-footer">
        <button className="logout-button" onClick={onLogout}>
          <FaSignOutAlt className="logout-icon" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
