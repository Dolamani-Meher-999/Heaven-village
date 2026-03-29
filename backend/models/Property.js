import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },

    propertyType: {
      type: String,
      enum: ["apartment", "house", "pg", "villa"],
      required: true,
    },

    location: {
      address: { type: String, required: true },
      city:    { type: String, required: true },
      state:   { type: String },
      pincode: { type: String },
    },

    // ✅ Only ONE images array — Cloudinary version
    images: [
      {
        url:       { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Admin approval status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // Availability after approval
    availabilityStatus: {
      type: String,
      enum: ["available", "rented", "unavailable"],
      default: "available",
    },

    bedrooms:  { type: Number, min: 0 },
    bathrooms: { type: Number, min: 0 },
    area:      { type: Number, min: 0 }, // in sq ft

    amenities: {
      type: [String],
      enum: ["WiFi", "AC", "Parking", "Gym", "Pool", "Furnished", "Pets Allowed"],
      default: [],
    },

    views: { type: Number, default: 0 },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ✅ Indexes for common queries
propertySchema.index({ "location.city": 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ owner: 1 });
propertySchema.index({ availabilityStatus: 1 });
propertySchema.index({ price: 1 });

const Property = mongoose.model("Property", propertySchema);

export default Property;