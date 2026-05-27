import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { validateRequest } from "../middlewares/validate.js";
import { createMarks, getMarksByStudent } from "../controllers/marksController.js";
import { marksCreateSchema } from "../validators/apiSchemas.js";

const router = express.Router();

router.get("/:studentId", asyncHandler(getMarksByStudent));
router.post("/", validateRequest({ body: marksCreateSchema }), asyncHandler(createMarks));

export default router;

