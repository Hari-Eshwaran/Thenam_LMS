import { AppError } from "../utils/appError.js";
import { ok } from "../utils/apiResponse.js";
import {
  getAssignmentsAnalytics as getAssignmentsAnalyticsService,
  getAttendanceAnalytics as getAttendanceAnalyticsService,
  getClassAnalytics as getClassAnalyticsService,
  getFinanceAnalytics as getFinanceAnalyticsService,
  getOverviewAnalytics as getOverviewAnalyticsService,
  getStudentAnalytics as getStudentAnalyticsService,
  getTeacherAnalytics as getTeacherAnalyticsService,
} from "../services/analyticsService.js";

export async function getClassAnalytics(req, res) {
  const classId = req.params.classId;
  const response = await getClassAnalyticsService(classId);
  return ok(res, response);
}

export async function getOverviewAnalytics(req, res) {
  const response = await getOverviewAnalyticsService();
  return ok(res, response);
}

export async function getStudentAnalytics(req, res) {
  const response = await getStudentAnalyticsService(req.params.studentId);
  if (!response) {
    throw new AppError("Student analytics not found.", 404);
  }
  return ok(res, response);
}

export async function getTeacherAnalytics(req, res) {
  const response = await getTeacherAnalyticsService(req.params.teacherId);
  if (!response) {
    throw new AppError("Teacher analytics not found.", 404);
  }
  return ok(res, response);
}

export async function getAttendanceAnalytics(req, res) {
  const response = await getAttendanceAnalyticsService();
  return ok(res, response);
}

export async function getAssignmentsAnalytics(req, res) {
  const response = await getAssignmentsAnalyticsService();
  return ok(res, response);
}

export async function getFinanceAnalytics(req, res) {
  const response = await getFinanceAnalyticsService();
  return ok(res, response);
}