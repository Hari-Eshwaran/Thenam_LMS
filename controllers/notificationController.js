import { AppError } from "../utils/appError.js";
import { ok } from "../utils/apiResponse.js";
import {
  getUnreadNotificationCount,
  listNotificationsForStudent,
  markNotificationRead,
} from "../services/notificationService.js";

export async function getNotificationsForStudent(req, res) {
  const studentId = req.params.studentId;
  const notifications = await listNotificationsForStudent(studentId);
  return ok(res, notifications);
}

export async function getUnreadNotificationsCount(req, res) {
  const studentId = req.params.studentId;
  const unreadCount = await getUnreadNotificationCount(studentId);
  return ok(res, { student_id: studentId, unread_count: unreadCount });
}

export async function markNotificationAsRead(req, res) {
  const notification = await markNotificationRead(req.params.notificationId);
  if (!notification) {
    throw new AppError("Notification not found.", 404);
  }
  return ok(res, notification);
}