// src/Dashboard.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import SOSAlertsSection from "./components/SOSAlertsSection";
import CommunityReportsSection from "./components/CommunityReportsSection";
import UsersManagementSection from "./components/UsersManagementSection";
import Zoney from "./components/Zoney";
import AlertDetail from "./components/AlertDetail.jsx";
import ReportDetail from "./components/ReportDetail.jsx";
import Notifications from "./components/Notifications";
import CommunityPostsAdmin from "./components/CommunityPostsAdmin.jsx";
import PostDetail from "./components/PostDetail.jsx";

// API functions – these are from your APIs file
import { getDashboardStatus, getAllPosts, getReports, getAllAlerts } from "./api/adminAPI";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./styles.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Helper to aggregate an array of items by their createdAt month.
const aggregateByMonth = (dataArray) => {
  const counts = {};
  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  dataArray.forEach(item => {
    const date = new Date(item.createdAt);
    const month = date.toLocaleString("default", { month: "short" });
    if (monthOrder.includes(month)) {
      counts[month] = (counts[month] || 0) + 1;
    }
  });
  return counts;
};

const Dashboard = ({ setIsLoggedIn }) => {
  // Navigation states.
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeSubTab, setActiveSubTab] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Detail views.
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedTrustedMember, setSelectedTrustedMember] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  // Dashboard metrics state.
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [metricsError, setMetricsError] = useState("");

  // Chart data states.
  const [postsByMonth, setPostsByMonth] = useState({});
  const [reportsByMonth, setReportsByMonth] = useState({});
  const [alertsByMonth, setAlertsByMonth] = useState({});

  // Fetch live dashboard metrics.
  useEffect(() => {
    const fetchMetrics = async () => {
      setMetricsLoading(true);
      try {
        const data = await getDashboardStatus();
        console.log("Dashboard metrics:", data);
        if (data && data.stats) {
          // Your API returns an object with a "stats" property.
          setDashboardMetrics(data.stats);
        } else {
          throw new Error("Unexpected metrics format");
        }
      } catch (err) {
        console.error("Error fetching dashboard metrics:", err);
        setMetricsError(err.message || "Error loading dashboard metrics");
      } finally {
        setMetricsLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  // Fetch and aggregate posts.
  useEffect(() => {
    const fetchPostsData = async () => {
      try {
        const posts = await getAllPosts();
        setPostsByMonth(aggregateByMonth(posts));
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPostsData();
  }, []);

  // Fetch and aggregate reports.
  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        const reports = await getReports();
        setReportsByMonth(aggregateByMonth(reports));
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchReportsData();
  }, []);

  // Fetch and aggregate alerts.
  useEffect(() => {
    const fetchAlertsData = async () => {
      try {
        const alertsResponse = await getAllAlerts();
        const alertsArray = alertsResponse || [];
        setAlertsByMonth(aggregateByMonth(alertsArray));
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };
    fetchAlertsData();
  }, []);

  // Prepare chart data objects.
  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const buildChartData = (aggregatedData, label) => {
    const chartLabels = monthOrder.filter(month => aggregatedData[month] !== undefined);
    const chartValues = chartLabels.map(month => aggregatedData[month]);
    return {
      labels: chartLabels,
      datasets: [
        {
          label,
          data: chartValues,
          backgroundColor: "rgba(255, 0, 0, 0.6)", // Red bars.
        },
      ],
    };
  };

  const postsChartData = buildChartData(postsByMonth, "Posts");
  const reportsChartData = buildChartData(reportsByMonth, "Reports");
  const alertsChartData = buildChartData(alertsByMonth, "Alerts");

  // Navigation handlers.
  const handleSectionChange = (sectionKey) => {
    if (sectionKey === "users") {
      setSelectedUserId(null);
    }
    setActiveSection(sectionKey);
  };

  const handleSelectAlert = (alert) => {
    setSelectedAlert(alert);
    setActiveSection("alertdetail");
  };

  const handleSelectReport = (report) => {
    setSelectedReport(report);
    setActiveSection("reportdetail");
  };

  const handleViewTrustedProfile = (member) => {
    setSelectedTrustedMember(member);
    setActiveSection("userprofile");
  };

  const handleViewPost = (post) => {
    console.log("handleViewPost invoked with post:", post);
    setSelectedPost(post);
    setActiveSection("postsdetail");
  };

  const handleViewUser = (userId) => {
    console.log("User clicked on profile with ID:", userId);
    setSelectedUserId(userId);
    setActiveSection("users");
  };

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="dashboard-charts-container">
            <h2>
              <i className="fas fa-chart-bar icon"></i> Dashboard Overview
            </h2>
            <div className="charts-row">
              <div className="chart-section">
                <h3>
                  <i className="fas fa-file-alt icon"></i> Posts Overview
                </h3>
                <div className="chart-container">
                  <Bar
                    data={postsChartData}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        title: { display: true, text: "Posts by Month" },
                      },
                    }}
                  />
                </div>
              </div>
              <div className="chart-section">
                <h3>
                  <i className="fas fa-exclamation-triangle icon"></i> Reports Overview
                </h3>
                <div className="chart-container">
                  <Bar
                    data={reportsChartData}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        title: { display: true, text: "Reports by Month" },
                      },
                    }}
                  />
                </div>
              </div>
              <div className="chart-section">
                <h3>
                  <i className="fas fa-bell icon"></i> Alerts Overview
                </h3>
                <div className="chart-container">
                  <Bar
                    data={alertsChartData}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        title: { display: true, text: "Alerts by Month" },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
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
        return <CommunityPostsAdmin onViewPost={handleViewPost} />;
      case "zoney":
        return <Zoney searchQuery={searchQuery} />;
      case "users":
        return (
          <UsersManagementSection
            selectedUserId={selectedUserId}
            searchQuery={searchQuery}
            onViewProfile={(userId) => {
              console.log("UsersManagementSection: Viewing profile for", userId);
            }}
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
        return <div>User Profile Component (to be implemented)</div>;
      case "postsdetail":
        return (
          <PostDetail
            post={selectedPost}
            onBack={() => setActiveSection("posts")}
            onViewUser={handleViewUser}
          />
        );
      default:
        return <div>No section available.</div>;
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
          {metricsLoading ? (
            <p>Loading Metrics...</p>
          ) : metricsError ? (
            <p className="error-text">{metricsError}</p>
          ) : dashboardMetrics ? (
            <div className="hidden-metrics"></div> // Optionally, add textual metrics if needed.
          ) : (
            <p>No metrics available.</p>
          )}
        </header>
        <div className="content-area">{renderSection()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
