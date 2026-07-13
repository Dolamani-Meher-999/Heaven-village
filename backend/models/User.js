import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    phone: {
      type: String,
      match: [/^\+?[\d\s\-]{7,15}$/, "Invalid phone number"],
    },

    role: {
      type: String,
      enum: ["tenant", "owner", "admin"],
      default: "tenant",
    },

    profileImage: {
      url:       { type: String, default: "" },
      public_id: { type: String, default: "" },
    },

    bio: {
      type: String,
      maxlength: [300, "Bio cannot exceed 300 characters"],
      trim: true,
    },

    // For owners — their base city/location
    location: {
      city:  { type: String, trim: true },
      state: { type: String, trim: true },
    },

    // Tenant: properties they saved/bookmarked
    savedProperties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],

    // For future email verification flow
    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken:       { type: String },
    verificationTokenExpiry: { type: Date },

    // For password reset flow
    resetPasswordToken:       { type: String },
    resetPasswordTokenExpiry: { type: Date },

    // Soft delete — admin can deactivate accounts
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Index for fast lookups
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model("User", userSchema);

export default User;