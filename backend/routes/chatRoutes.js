import express from "express";
import { createChat, getUserChats } from "../controllers/chatController.js";

const router = express.Router();

// New chat/message
router.post("/", createChat);

// Get all chats of a user
router.get("/:userId", getUserChats);

export default router;
