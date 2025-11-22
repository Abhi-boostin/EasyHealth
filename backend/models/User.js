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
    location: {
      latitude: {
        type: Number,
        required: false,
      },
      longitude: {
        type: Number,
        required: false,
      },
      address: {
        type: String,
        required: false,
      },
      lastUpdated: {
        type: Date,
        required: false,
      }
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
