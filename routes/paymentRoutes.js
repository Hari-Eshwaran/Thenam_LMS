import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { validateRequest } from "../middlewares/validate.js";
import { createPayment, getPayments } from "../controllers/paymentController.js";
import { paymentCreateSchema } from "../validators/apiSchemas.js";

const router = express.Router();

router.get("/", asyncHandler(getPayments));
router.post("/", validateRequest({ body: paymentCreateSchema }), asyncHandler(createPayment));

export default router;

