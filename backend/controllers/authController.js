import bcrypt from "bcrypt";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// ==================== REGISTER ====================
export const register = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Step 1: check if user already exists
    const userExists = await User.exists({ phone });
    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Step 2: hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 3: generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    // Step 4: create user
    const user = await User.create({
      phone,
      password: hashedPassword,
      otp,
      otpExpiresAt: otpExpiry,
    });

    // Step 5: send OTP using Twilio
    await client.messages.create({
      body: `Your EasyHealth verification code is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    res.status(201).json({ msg: "OTP sent successfully", userId: user._id });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// ==================== VERIFY OTP ====================
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ msg: "User already verified" });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ msg: "OTP expired" });
    }

    if (otp !== user.otp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
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

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (!user.isVerified) {
      return res.status(400).json({ msg: "User not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = generateToken(user._id);

    res.json({
      msg: "Login successful",
      token,
      user: { id: user._id, phone: user.phone },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};
