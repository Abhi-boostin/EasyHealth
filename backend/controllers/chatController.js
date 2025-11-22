import { getGeminiResponse } from "../services/geminiService.js";
import { pdfToImages } from "../utils/pdfUtils.js";
import { findNearbyHospitals } from "../services/placesService.js";
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

export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    const file = req.file;
    const userId = req.user.id; // Get user ID from JWT middleware

    console.log("Chat request received:", { 
      hasMessage: !!message, 
      hasFile: !!file, 
      userId 
    });

    if (!message && !file) {
      return res.status(400).json({ error: "Message or File is required" });
    }

    // Fetch user by ID to get location
    const user = await User.findById(userId);
    
    if (!user) {
      console.error("User not found:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    let locationInfo = "User location not provided.";
    let hospitals = [];
    let userLat = null;
    let userLng = null;

    if (user?.location?.coordinates && user.location.coordinates.length === 2) {
      [userLng, userLat] = user.location.coordinates;
      const address = user.location.address || "Unknown location";
      locationInfo = `User is at ${address} (lat: ${userLat}, long: ${userLng}).`;
      
      // Find nearby hospitals
      hospitals = await findNearbyHospitals(userLat, userLng);
      console.log(`Found ${hospitals.length} nearby hospitals`);
    }

    console.log("Location info:", locationInfo);

    let botReply;

    if (file) {
      console.log("Processing file:", file.mimetype, file.originalname);
      
      if (file.mimetype === "application/pdf") {
        // Convert PDF to images
        const images = await pdfToImages(file.buffer);

        if (images.length > 16) {
          return res.json({
            success: true,
            userMessage: message,
            botReply:
              "The document is too long. Please consult a doctor directly for such detailed records.",
            file: file.originalname,
          });
        }

        botReply = await getGeminiResponse(
          message || "",
          null,
          null,
          images,
          locationInfo
        );
      } else {
        // Single image
        botReply = await getGeminiResponse(
          message || "", 
          file.buffer, 
          file.mimetype, 
          [],
          locationInfo
        );
      }
    } else {
      // Text only
      console.log("Processing text message:", message);
      botReply = await getGeminiResponse(
        message || "",
        null,
        null,
        [],
        locationInfo
      );
    }

    console.log("Bot reply generated successfully");

    // Format hospital information if available
    let hospitalInfo = "";
    if (hospitals.length > 0) {
      hospitalInfo = "\n\n🏥 **Nearby Hospitals & Clinics:**\n\n";
      hospitals.forEach((hospital, index) => {
        hospitalInfo += `${index + 1}. **${hospital.name}**\n`;
        hospitalInfo += `   📍 ${hospital.address}\n`;
        hospitalInfo += `   📞 ${hospital.phone}\n`;
        hospitalInfo += `   ⭐ Rating: ${hospital.rating}/5 (${hospital.totalRatings} reviews)\n`;
        hospitalInfo += `   📏 Distance: ${hospital.distance}\n`;
        hospitalInfo += `   🕒 Status: ${hospital.openNow}\n`;
        if (hospital.website) {
          hospitalInfo += `   🌐 ${hospital.website}\n`;
        }
        hospitalInfo += `\n`;
      });
    }

    return res.json({
      success: true,
      userMessage: message,
      botReply: botReply + hospitalInfo,
      file: file ? file.originalname : null,
      hospitals: hospitals, // Send structured data for frontend
      userLocation: userLat && userLng ? { lat: userLat, lng: userLng } : null
    });
  } catch (error) {
    console.error("Chat Controller Error:", error.message);
    console.error("Error stack:", error.stack);
    return res.status(500).json({ 
      error: "Something went wrong",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
