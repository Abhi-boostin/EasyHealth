import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String, // OTP hash yaha save hoga
    },
    otpExpiresAt: {
      type: Date, // OTP expiry time
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
