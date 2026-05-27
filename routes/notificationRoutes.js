import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import {
	getNotificationsForStudent,
	getUnreadNotificationsCount,
	markNotificationAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/:studentId", asyncHandler(getNotificationsForStudent));
router.get("/student/:studentId/unread-count", asyncHandler(getUnreadNotificationsCount));
router.patch("/:notificationId/read", asyncHandler(markNotificationAsRead));

export default router;