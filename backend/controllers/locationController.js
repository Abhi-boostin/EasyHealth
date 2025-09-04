// controllers/locationController.js
import User from "../models/User.js";

export const saveLocation = async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;
    const userId = req.user.id; // from auth middleware

    // Validate location data
    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    // Update user with location data
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

    res.json({
      success: true,
      message: "Location saved successfully",
      location: user.location
    });
  } catch (error) {
    console.error("Location Controller Error:", error);
    res.status(500).json({ error: "Failed to save location" });
  }
}; 