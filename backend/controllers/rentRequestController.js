import RentRequest from "../models/RentRequest.js";
import Property from "../models/Property.js";

// ─── TENANT: Submit a rent request ───────────────────────────────────────────
export const submitRentRequest = async (req, res) => {
  try {
    const { message, moveInDate } = req.body;
    const propertyId = req.params.id;
    const tenantId   = req.user._id;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    if (property.status !== "approved") {
      return res.status(400).json({ success: false, message: "Property is not available for rent requests" });
    }

    if (property.availabilityStatus !== "available") {
      return res.status(400).json({ success: false, message: "Property is already rented" });
    }

    if (property.owner.toString() === tenantId.toString()) {
      return res.status(400).json({ success: false, message: "You cannot request your own property" });
    }

    const existing = await RentRequest.findOne({ property: propertyId, tenant: tenantId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a request for this property",
        data: existing,
      });
    }

    if (moveInDate && new Date(moveInDate) < new Date()) {
      return res.status(400).json({ success: false, message: "Move-in date must be in the future" });
    }

    const rentRequest = await RentRequest.create({
      property:   propertyId,
      tenant:     tenantId,
      owner:      property.owner,
      message:    message || "",
      moveInDate: moveInDate || undefined,
    });

    await rentRequest.populate([
      { path: "property", select: "title location price images" },
      { path: "owner",    select: "name email phone" },
    ]);

    res.status(201).json({
      success: true,
      message: "Rent request submitted successfully",
      data:    rentRequest,
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "You have already submitted a request for this property" });
    }
    console.error("submitRentRequest error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── TENANT: Get own requests ─────────────────────────────────────────────────
export const getTenantRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { tenant: req.user._id };
    if (status) filter.status = status;

    const skip = (Math.max(1, Number(page)) - 1) * Math.min(20, Number(limit));

    const [requests, total] = await Promise.all([
      RentRequest.find(filter)
        .populate("property", "title location price images status availabilityStatus")
        .populate("owner",    "name email phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      RentRequest.countDocuments(filter),
    ]);

    res.status(200).json({
      success:    true,
      count:      requests.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      data:       requests,
    });

  } catch (error) {
    console.error("getTenantRequests error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── TENANT: Cancel a pending request ────────────────────────────────────────
export const cancelRentRequest = async (req, res) => {
  try {
    const request = await RentRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: "Rent request not found" });
    }

    if (request.tenant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not your request" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a request that is already ${request.status}`,
      });
    }

    // ✅ FIX: set status to "cancelled" instead of deleting
    // This way it shows up in admin panel under "Cancelled" tab
    // and tenant can still see it in their "My Requests" history
    request.status      = "cancelled";
    request.respondedAt = new Date();
    await request.save();

    res.status(200).json({
      success: true,
      message: "Rent request cancelled successfully",
      data:    request,
    });

  } catch (error) {
    console.error("cancelRentRequest error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── OWNER: Get all requests for their properties ─────────────────────────────
export const getRequestsForOwner = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { owner: req.user._id };
    if (status) filter.status = status;

    const skip = (Math.max(1, Number(page)) - 1) * Math.min(20, Number(limit));

    const [requests, total] = await Promise.all([
      RentRequest.find(filter)
        .populate("property", "title location price images")
        .populate("tenant",   "name email phone profileImage")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      RentRequest.countDocuments(filter),
    ]);

    res.status(200).json({
      success:    true,
      count:      requests.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      data:       requests,
    });

  } catch (error) {
    console.error("getRequestsForOwner error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── OWNER: Approve or reject a request ──────────────────────────────────────
export const updateRequestStatus = async (req, res) => {
  try {
    const { status, ownerResponse } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be 'approved' or 'rejected'" });
    }

    const request = await RentRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: "Rent request not found" });
    }

    if (request.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to manage this request" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ success: false, message: `Request already ${request.status}` });
    }

    request.status        = status;
    request.ownerResponse = ownerResponse || "";
    request.respondedAt   = new Date();
    await request.save();

    if (status === "approved") {
      await Property.findByIdAndUpdate(request.property, { availabilityStatus: "rented" });

      await RentRequest.updateMany(
        { property: request.property, _id: { $ne: request._id }, status: "pending" },
        { status: "rejected", ownerResponse: "Property has been rented to another tenant", respondedAt: new Date() }
      );
    }

    await request.populate([
      { path: "property", select: "title location price" },
      { path: "tenant",   select: "name email phone" },
    ]);

    res.status(200).json({
      success: true,
      message: `Request ${status} successfully`,
      data:    request,
    });

  } catch (error) {
    console.error("updateRequestStatus error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
