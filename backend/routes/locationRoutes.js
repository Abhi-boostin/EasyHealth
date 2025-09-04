// routes/locationRoutes.js
import express from "express";
import { saveLocation } from "../controllers/locationController.js";    

const router = express.Router();

// Protected route - requires authentication
router.post("/", saveLocation);

export default router; 