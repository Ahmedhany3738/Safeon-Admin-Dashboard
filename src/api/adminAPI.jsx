// src/api/adminAPI.js
const BASE_URL =
  "https://safeon-git-main-malakmekkawys-projects.vercel.app/Admin";

// Example token – in production, store this securely.
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODM3OTIwOGI0NjU1NTkzZjViYTM3ZTkiLCJpYXQiOjE3NDg1NTg2MDIsImV4cCI6MTc0OTE2MzQwMn0.G7PcOJ2ZFI5Hih6Z69rHm-Gse3sx-5yM_4GqF-y0X68";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

/* LOGIN ADMIN */
export const loginAdmin = async (username, password) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers,
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error("Login failed");
  }
  return response.json();
};

/* GET DASHBOARD STATUS */
export const getDashboardStatus = async () => {
  const response = await fetch(`${BASE_URL}/dashboard/status`, { headers });
  if (!response.ok) {
    throw new Error("Error fetching dashboard status");
  }
  return response.json();
};

/* GET ALL REPORTS */
export const getReports = async () => {
  const response = await fetch(`${BASE_URL}/reports`, { headers });
  if (!response.ok) {
    throw new Error("Error fetching reports");
  }
  const data = await response.json();
  return data.reports;
};

/* PATCH REPORT STATUS */
export const patchReportStatus = async (reportId, status) => {
  const response = await fetch(
    `${BASE_URL}/reports/${reportId}/status`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    }
  );
  if (!response.ok) {
    throw new Error("Error updating report status");
  }
  return response.json();
};

/* GET APPROVED POSTS */
export const getApprovedPosts = async () => {
  const response = await fetch(`${BASE_URL}/posts/approved`, { headers });
  if (!response.ok) {
    throw new Error("Error fetching approved posts");
  }
  const data = await response.json();
  return data.posts;
};

/* GET ALL POSTS */
export const getAllPosts = async () => {
  const response = await fetch(`${BASE_URL}/posts`, { headers });
  if (!response.ok) {
    throw new Error("Error fetching posts");
  }
  const data = await response.json();
  return data.posts;
};

/* PATCH POST STATUS */
export const patchPostStatus = async (postId, status) => {
  const response = await fetch(`${BASE_URL}/posts/${postId}/status`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error("Error updating post status");
  }
  const data = await response.json();
  return data.post; // The updated post is within "post"
};

/* GET ALERTS (Filtered by location if needed) */
export const getFilteredAlerts = async (filterQuery = "") => {
  const response = await fetch(`${BASE_URL}/alerts${filterQuery}`, {
    headers,
  });
  if (!response.ok) {
    throw new Error("Error fetching alerts");
  }
  const data = await response.json();
  return data.alerts;
};

/* GET ALL SOS ALERTS */
export const getAllAlerts = async () => {
  const response = await fetch(`${BASE_URL}/sos`, { headers });
  if (!response.ok) {
    throw new Error("Error fetching SOS alerts");
  }
  const data = await response.json();
  return data.sosAlerts;
};
