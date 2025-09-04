import bcrypt from "bcrypt";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const formatPhoneNumber = (phone) => {
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
    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60000); // 5 minutes

    const user = await User.create({
      phone: formattedPhone,
      password: hashedPassword,
      otp,
      otpExpiresAt: otpExpiry,
      isVerified: false
    });
    console.log(otp);

    await client.messages.create({
      body: `Your verification code is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });

    res.status(201).json({ 
      success: true,
      msg: "OTP sent", 
      userId: user._id 
    });

  } catch (error) {
    console.error(error);
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
    if (user.otpExpiresAt < new Date()) return res.status(400).json({ msg: "OTP expired" });
    if (otp !== user.otp) return res.status(400).json({ msg: "Invalid OTP" });

    user.otp = undefined;
    user.otpExpiresAt = undefined;
    user.isVerified = true;
    await user.save();

    res.json({ 
      success: true,
      msg: "User verified successfully" 
    });

  } catch (error) {
    console.error(error);
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
    if (!user.isVerified) return res.status(400).json({ msg: "Please verify your phone number first" });

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
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};
