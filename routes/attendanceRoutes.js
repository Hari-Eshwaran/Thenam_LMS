import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { validateRequest } from "../middlewares/validate.js";
import {
	createAttendance,
	getAttendanceByClass,
	getAttendanceByStudent,
	getAttendanceSummaryByStudent,
} from "../controllers/attendanceController.js";
import { attendanceCreateSchema, classIdParamsSchema } from "../validators/apiSchemas.js";

const router = express.Router();

router.get("/class/:classId", validateRequest({ params: classIdParamsSchema }), asyncHandler(getAttendanceByClass));
router.get("/student/:studentId/summary", asyncHandler(getAttendanceSummaryByStudent));
router.get("/:studentId", asyncHandler(getAttendanceByStudent));
router.post("/", validateRequest({ body: attendanceCreateSchema }), asyncHandler(createAttendance));

export default router;

