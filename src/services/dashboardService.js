// services/dashboardService.js
import api from "./api";

export async function fetchDashboard() {
  const res = await api.get("/dashboard/");
  return res.data.data;
  // returns: { user, stats, recent_attempts, score_trend, tag_performance, recent_posts, platform }
}

export async function fetchProfile() {
  const res = await api.get("/auth/profile/");
  return res.data.data;
}

export async function updateProfile(fields) {
  const res = await api.patch("/auth/profile/", fields);
  return res.data.data;
}