import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { validateRequest } from "../middlewares/validate.js";
import {
	getAssignmentsAnalytics,
	getAttendanceAnalytics,
	getClassAnalytics,
	getFinanceAnalytics,
	getOverviewAnalytics,
	getStudentAnalytics,
	getTeacherAnalytics,
} from "../controllers/analyticsController.js";
import { classIdParamsSchema, studentAnalyticsParamsSchema, teacherAnalyticsParamsSchema } from "../validators/apiSchemas.js";

const router = express.Router();

router.get("/overview", asyncHandler(getOverviewAnalytics));
router.get("/student/:studentId", validateRequest({ params: studentAnalyticsParamsSchema }), asyncHandler(getStudentAnalytics));
router.get("/class/:classId", validateRequest({ params: classIdParamsSchema }), asyncHandler(getClassAnalytics));
router.get("/teacher/:teacherId", validateRequest({ params: teacherAnalyticsParamsSchema }), asyncHandler(getTeacherAnalytics));
router.get("/attendance", asyncHandler(getAttendanceAnalytics));
router.get("/assignments", asyncHandler(getAssignmentsAnalytics));
router.get("/finance", asyncHandler(getFinanceAnalytics));

export default router;