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
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: false,
      },
      address: {
        type: String,
        required: false,
      },
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    }
  },
  { timestamps: true }
);

// Create geospatial index for location-based queries
userSchema.index({ location: '2dsphere' });

const User = mongoose.model("User", userSchema);
export default User;
