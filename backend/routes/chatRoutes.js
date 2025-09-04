// routes/chatRoutes.js
import express from "express";
import { handleChat } from "../controllers/chatController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js"; // multer middleware

const router = express.Router();

// Single route for text OR image + text
router.post("/send",upload.single("file"), handleChat);

export default router;
