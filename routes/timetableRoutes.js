import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { validateRequest } from "../middlewares/validate.js";
import { createTimetable, getTimetable } from "../controllers/timetableController.js";
import { timetableCreateSchema } from "../validators/apiSchemas.js";

const router = express.Router();

router.get("/", asyncHandler(getTimetable));
router.post("/", validateRequest({ body: timetableCreateSchema }), asyncHandler(createTimetable));

export default router;