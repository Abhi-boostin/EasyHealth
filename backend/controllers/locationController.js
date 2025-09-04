// controllers/locationController.js
import User from "../models/User.js";

// Phone number formatting function
const formatPhoneNumber = (phone) => {
  if (!phone) return null;
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (!cleaned.startsWith('+')) {
    return `+91${cleaned}`;
  }
  return cleaned;
};

export const saveLocation = async (req, res) => {
  try {
    const { latitude, longitude, address, phone } = req.body;

    // Format phone number to match database format
    const formattedPhone = formatPhoneNumber(phone);

    if (!latitude || !longitude || !formattedPhone) {
      return res.status(400).json({ error: "Latitude, longitude and phone are required" });
    }

    const user = await User.findOneAndUpdate(
      { phone: formattedPhone },
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