import mongoose from "mongoose";

const rentRequestSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      // ✅ FIX: added "cancelled" so tenant cancel works and shows in admin
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },

    message: {
      type: String,
      trim: true,
      maxlength: [500, "Message cannot exceed 500 characters"],
    },

    moveInDate: {
      type: Date,
      validate: {
        validator: (date) => date >= new Date(),
        message: "Move-in date must be in the future",
      },
    },

    // Owner's response message when approving/rejecting
    ownerResponse: {
      type: String,
      trim: true,
      maxlength: [500, "Response cannot exceed 500 characters"],
    },

    // When owner responded
    respondedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Prevent duplicate requests from same tenant on same property
rentRequestSchema.index({ property: 1, tenant: 1 }, { unique: true });
rentRequestSchema.index({ owner: 1, status: 1 });
rentRequestSchema.index({ tenant: 1, status: 1 });

const RentRequest = mongoose.model("RentRequest", rentRequestSchema);

export default RentRequest;
