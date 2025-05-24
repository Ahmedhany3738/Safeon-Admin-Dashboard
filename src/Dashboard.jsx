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
import "./styles.css";

const Dashboard = ({ setIsLoggedIn }) => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeSubTab, setActiveSubTab] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // For SOS alerts detail view
  const [selectedAlert, setSelectedAlert] = useState(null);
  // For Community Reports detail view
  const [selectedReport, setSelectedReport] = useState(null);

  // When an alert is clicked in SOSAlertsSection, update the selected alert and switch to its detail view.
  const handleSelectAlert = (alert) => {
    setSelectedAlert(alert);
    setActiveSection("alertdetail");
  };

  // When a community report is clicked in CommunityReportsSection, update the selected report and switch to its detail view.
  const handleSelectReport = (report) => {
    setSelectedReport(report);
    setActiveSection("reportdetail");
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
            onSelectReport={handleSelectReport} // Pass our new handler to community reports
          />
        );
      case "zoney":
        return <Zoney searchQuery={searchQuery} />;
      case "users":
        return <UsersManagementSection searchQuery={searchQuery} />;
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
            onBack={() => setActiveSection("community")}
          />
        );
      default:
        return <AdminSection />;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
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
            <img src="https://i.pravatar.cc/40" alt="Profile" className="profile-pic" />
          </div>
        </header>
        <div className="content-area">{renderSection()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
