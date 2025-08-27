import express from "express";
import { sendMessage } from "../controllers/chatController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Only one route for now
router.post("/send", sendMessage);

export default router;
