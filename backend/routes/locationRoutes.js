// routes/locationRoutes.js
import express from "express";
import { saveLocation } from "../controllers/locationController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected route - requires authentication
router.post("/", authMiddleware, saveLocation);

export default router; 