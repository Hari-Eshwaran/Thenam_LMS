import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { validateRequest } from "../middlewares/validate.js";
import { createAssignment, getAssignmentsByClass, getAssignmentsByStudent } from "../controllers/assignmentController.js";
import { assignmentCreateSchema, classIdParamsSchema } from "../validators/apiSchemas.js";

const router = express.Router();

router.get("/student/:studentId", asyncHandler(getAssignmentsByStudent));
router.get("/:classId", validateRequest({ params: classIdParamsSchema }), asyncHandler(getAssignmentsByClass));
router.post("/", validateRequest({ body: assignmentCreateSchema }), asyncHandler(createAssignment));

export default router;

