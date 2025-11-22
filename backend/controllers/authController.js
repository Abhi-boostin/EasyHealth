import bcrypt from "bcrypt";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { sendOTP as sendTwilioOTP } from "../services/twilioService.js";

// Phone number formatting function
const formatPhoneNumber = (phone) => {
  if (!phone) return null;
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (!cleaned.startsWith('+')) {
    return `+91${cleaned}`;
  }
  return cleaned;
};

// ==================== REGISTER ====================
export const register = async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    const formattedPhone = formatPhoneNumber(phone);
    
    // Check if user already exists
    const existingUser = await User.findOne({ phone: formattedPhone });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Send OTP via Twilio
    try {
      await sendTwilioOTP(formattedPhone);
    } catch (twilioError) {
      console.error("Twilio Error:", twilioError);
      return res.status(500).json({ 
        msg: "Failed to send OTP. Please check your phone number." 
      });
    }

    // Create user after OTP is sent successfully
    const user = await User.create({
      phone: formattedPhone,
      password: hashedPassword,
      isVerified: false
    });

    res.status(201).json({ 
      success: true, 
      msg: "OTP sent to your phone number", 
      userId: user._id
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// ==================== VERIFY OTP ====================
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const formattedPhone = formatPhoneNumber(phone);

    const user = await User.findOne({ phone: formattedPhone });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ msg: "User already verified" });
    }

    // Verify OTP with Twilio
    const { verifyOTP: verifyTwilioOTP } = await import("../services/twilioService.js");
    
    try {
      const verification = await verifyTwilioOTP(formattedPhone, otp);
      
      if (!verification.success) {
        return res.status(400).json({ msg: "Invalid or expired OTP" });
      }
    } catch (twilioError) {
      console.error("Twilio Verification Error:", twilioError);
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    await user.save();

    res.json({ msg: "User verified successfully" });
  } catch (error) {
    console.error("Verify OTP Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// ==================== LOGIN ====================
export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const formattedPhone = formatPhoneNumber(phone);

    const user = await User.findOne({ phone: formattedPhone });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (!user.isVerified) {
      return res.status(400).json({ msg: "User not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = generateToken(user._id);

    res.json({
      success: true,
      msg: "Login successful",
      token,
      user: { 
        id: user._id, 
        phone: user.phone 
      }
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};
