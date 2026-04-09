import Property    from "../models/Property.js";
import User        from "../models/User.js";
import RentRequest from "../models/RentRequest.js";

// ─── Get all properties (any status) ─────────────────────────────────────────
export const getAllProperties = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = status ? { status } : {};
    const skip   = (Number(page) - 1) * Number(limit);

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate("owner", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Property.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true, count: properties.length,
      total, totalPages: Math.ceil(total / Number(limit)), data: properties,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get pending properties ───────────────────────────────────────────────────
export const getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "pending" })
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true, count: properties.length, data: properties,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Approve property ─────────────────────────────────────────────────────────
export const approveProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true, runValidators: false }
    );

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    res.status(200).json({
      success: true, message: "Property approved", data: property,
    });
  } catch (error) {
    console.error("approveProperty error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Reject property ──────────────────────────────────────────────────────────
export const rejectProperty = async (req, res) => {
  try {
    // ✅ Use findByIdAndUpdate to avoid Mongoose validation/strict mode issues
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true, runValidators: false }
    );

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    res.status(200).json({
      success: true, message: "Property rejected", data: property,
    });
  } catch (error) {
    console.error("rejectProperty error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get all users ────────────────────────────────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;
    const filter = role ? { role } : {};
    const skip   = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true, count: users.length,
      total, totalPages: Math.ceil(total / Number(limit)), data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Deactivate user ──────────────────────────────────────────────────────────
export const deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ success: false, message: "Cannot deactivate an admin" });
    }

    user.isActive = !user.isActive; // toggle
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
      data: { _id: user._id, isActive: user.isActive },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get all rent requests ────────────────────────────────────────────────────
export const getAllRentRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = status ? { status } : {};
    const skip   = (Number(page) - 1) * Number(limit);

    const [requests, total] = await Promise.all([
      RentRequest.find(filter)
        .populate("tenant",  "name email")
        .populate("owner",   "name email")
        .populate("property","title location status")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      RentRequest.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true, count: requests.length,
      total, totalPages: Math.ceil(total / Number(limit)), data: requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};