// controllers/locationController.js
import User from "../models/User.js";

export const saveLocation = async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;
    const userId = req.user.id; // Get user ID from JWT middleware

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        location: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          address: address || null,
          lastUpdated: new Date()
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, message: "Location saved" });
  } catch (error) {
    console.error("Location Error:", error);
    res.status(500).json({ error: "Failed to save location" });
  }
}; 