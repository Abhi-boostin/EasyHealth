// controllers/locationController.js
import User from "../models/User.js";

export const saveLocation = async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;
    const userId = req.user.id; // Get user ID from JWT middleware

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    // Validate coordinates
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ error: "Invalid coordinates" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        location: {
          type: 'Point',
          coordinates: [lng, lat], // GeoJSON format: [longitude, latitude]
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
      message: "Location saved",
      location: {
        latitude: lat,
        longitude: lng,
        address: address
      }
    });
  } catch (error) {
    console.error("Location Error:", error);
    res.status(500).json({ error: "Failed to save location" });
  }
}; 