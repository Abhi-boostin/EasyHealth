// routes/chatRoutes.js
import express from "express";
import { handleChat } from "../controllers/chatController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Protected route - requires authentication
router.post("/send", authMiddleware, upload.single("file"), handleChat);

export default router;
