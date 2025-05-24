import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import AdminSection from "./components/AdminSection";
import SOSAlertsSection from "./components/SOSAlertsSection";
import CommunityReportsSection from "./components/CommunityReportsSection";
import UsersManagementSection from "./components/UsersManagementSection";
import Zoney from "./components/Zoney";
import AlertDetail from "./components/AlertDetail.jsx";
import ReportDetail from "./components/ReportDetail.jsx"; // New Report Detail component for community reports
import Notifications from "./components/Notifications";
import CommunityPostsAdmin from "./components/CommunityPostsAdmin.jsx";
import "./styles.css";

const Dashboard = ({ setIsLoggedIn }) => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeSubTab, setActiveSubTab] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // For SOS alert detail view.
  const [selectedAlert, setSelectedAlert] = useState(null);
  // For report detail view.
  const [selectedReport, setSelectedReport] = useState(null);
  // For trusted member profile view.
  const [selectedTrustedMember, setSelectedTrustedMember] = useState(null);
  // For user detail load from community posts (by userId).
  const [selectedUserId, setSelectedUserId] = useState(null);

  // When a sidebar menu item is clicked, use this helper to clear selectedUserId if needed.
  const handleSectionChange = (sectionKey) => {
    if (sectionKey === "users") {
      // Clear any previously selected user ID so that the search bar shows empty.
      setSelectedUserId(null);
    }
    setActiveSection(sectionKey);
  };

  // Called when an SOS alert is clicked.
  const handleSelectAlert = (alert) => {
    setSelectedAlert(alert);
    setActiveSection("alertdetail");
  };

  // Called when a community report (or a reporting issue/community post in Users Management) is clicked.
  const handleSelectReport = (report) => {
    setSelectedReport(report);
    setActiveSection("reportdetail");
  };

  // Called when a trusted member is clicked from Users Management.
  const handleViewTrustedProfile = (member) => {
    setSelectedTrustedMember(member);
    setActiveSection("userprofile");
  };

  // Called when a community post's user avatar is clicked.
  // This should set a user ID so that UsersManagementSection auto-loads that user's details.
  const handleViewUser = (userId) => {
    setSelectedUserId(userId);
    setActiveSection("users");
  };

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdminSection searchQuery={searchQuery} />;
      case "sos":
        return (
          <SOSAlertsSection
            activeSubTab={activeSubTab}
            searchQuery={searchQuery}
            onSelectAlert={handleSelectAlert}
          />
        );
      case "community":
        return (
          <CommunityReportsSection
            activeSubTab={activeSubTab}
            searchQuery={searchQuery}
            onSelectReport={(report) => {
              setSelectedReport(report);
              setActiveSection("reportdetail");
            }}
          />
        );
      case "posts":
        return <CommunityPostsAdmin onViewUser={handleViewUser} />;
      case "zoney":
        return <Zoney searchQuery={searchQuery} />;
      case "users":
        return (
          <UsersManagementSection
            selectedUserId={selectedUserId} // will be null when opened from sidebar
            searchQuery={searchQuery}
            onViewProfile={handleViewTrustedProfile}
            onSelectAlert={handleSelectAlert}
            onSelectReportingIssue={handleSelectReport}
            onSelectCommunityPost={handleSelectReport}
          />
        );
      case "notifications":
        return <Notifications searchQuery={searchQuery} />;
      case "alertdetail":
        return (
          <AlertDetail
            alertData={selectedAlert}
            onBack={() => setActiveSection("sos")}
          />
        );
      case "reportdetail":
        return (
          <ReportDetail
            reportData={selectedReport}
            onBack={() => setActiveSection("users")}
          />
        );
      case "userprofile":
        return (
          <UserProfile
            memberData={selectedTrustedMember}
            onBack={() => setActiveSection("users")}
          />
        );
      default:
        return <AdminSection searchQuery={searchQuery} />;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
        onLogout={() => setIsLoggedIn(false)}
      />
      <div className={`main-content ${activeSection}-layout`}>
        <header className="dashboard-header">
          <div className="header-left">
            <input
              type="text"
              placeholder="Search reports, cases, etc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="header-right">
            <img
              src="https://i.pravatar.cc/40"
              alt="Profile"
              className="profile-pic"
            />
          </div>
        </header>
        <div className="content-area">{renderSection()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
