// services/notificationService.js
import api from "./api";

/**
 * Fetch the latest 5 notifications for the logged-in user.
 * GET /api/notifications/
 */
export async function getNotifications() {
  const res = await api.get("/notifications/");
  return res.data?.data?.notifications || [];
}

/**
 * Mark a single notification as read.
 * PATCH /api/notifications/<notifId>/read/
 */
export async function markNotificationRead(notifId) {
  const res = await api.patch(`/notifications/${notifId}/read/`);
  return res.data;
}

/**
 * Mark all notifications as read.
 * PATCH /api/notifications/read-all/
 */
export async function markAllNotificationsRead() {
  const res = await api.patch("/notifications/read-all/");
  return res.data;
}

/**
 * Manually create a notification from the frontend (optional).
 * POST /api/notifications/
 * type: "general" | "test" | "profile" | "achievement"
 */
export async function createNotification({ title, message, type = "general" }) {
  const res = await api.post("/notifications/", { title, message, type });
  return res.data;
}