import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { validateRequest } from "../middlewares/validate.js";
import { chat } from "../controllers/aiController.js";
import { aiChatSchema } from "../validators/apiSchemas.js";

const router = express.Router();

router.post("/chat", validateRequest({ body: aiChatSchema }), asyncHandler(chat));

export default router;

