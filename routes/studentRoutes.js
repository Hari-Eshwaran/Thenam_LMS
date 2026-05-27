import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { validateRequest } from "../middlewares/validate.js";
import { getStudentById, getStudents, getStudentsByClass } from "../controllers/studentController.js";
import { classIdParamsSchema, paginationQuerySchema } from "../validators/apiSchemas.js";

const router = express.Router();

router.get("/", validateRequest({ query: paginationQuerySchema }), asyncHandler(getStudents));
router.get("/class/:classId", validateRequest({ params: classIdParamsSchema }), asyncHandler(getStudentsByClass));
router.get("/:id", asyncHandler(getStudentById));

export default router;

