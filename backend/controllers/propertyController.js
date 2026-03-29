import Property from "../models/Property.js";
import { v2 as cloudinary } from "cloudinary";

// ─── OWNER: Create property ───────────────────────────────────────────────────
export const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      propertyType,
      bedrooms,
      bathrooms,
      area,
      amenities,
    } = req.body;

    // Input validation
    if (!title || !description || !price || !propertyType) {
      return res.status(400).json({
        success: false,
        message: "Title, description, price and propertyType are required",
      });
    }

    const location = {
      address: req.body?.location?.address || req.body["location[address]"],
      city: req.body?.location?.city || req.body["location[city]"],
      state: req.body?.location?.state || req.body["location[state]"],
      pincode: req.body?.location?.pincode || req.body["location[pincode]"],
    };

    if (!location.address || !location.city) {
      return res.status(400).json({
        success: false,
        message: "Address and city are required",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    const images = req.files.map((file) => ({
      url: file.path, // Cloudinary URL
      public_id: file.filename, // Cloudinary public_id
    }));

    const property = await Property.create({
      title,
      description,
      price: Number(price),
      propertyType: propertyType.toLowerCase(),
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      bathrooms: bathrooms ? Number(bathrooms) : undefined,
      area: area ? Number(area) : undefined,
      amenities: (() => {
        if (!amenities) return [];
        if (Array.isArray(amenities)) return amenities;
        try {
          return JSON.parse(amenities);
        } catch {
          return amenities
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
      })(),
      location,
      owner: req.user._id,
      images,
      status: "pending", // always starts pending — admin must approve
    });

    res.status(201).json({
      success: true,
      message: "Property submitted for admin approval",
      data: property,
    });
  } catch (error) {
    console.error("createProperty error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PUBLIC: Get all approved properties (paginated) ─────────────────────────
export const getApprovedProperties = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const filter = {
      status: "approved",
      availabilityStatus: "available",
    };

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate("owner", "name email phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Property.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: properties,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PUBLIC: Get single property ──────────────────────────────────────────────
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "owner",
      "name email phone profileImage",
    );

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    // Increment view count
    property.views += 1;
    await property.save();

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PUBLIC: Search & filter properties ──────────────────────────────────────
export const searchProperties = async (req, res) => {
  try {
    const {
      city,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { status: "approved", availabilityStatus: "available" };

    if (city) filter["location.city"] = new RegExp(city, "i");
    if (propertyType) filter.propertyType = propertyType.toLowerCase();
    if (bedrooms) filter.bedrooms = Number(bedrooms);
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Math.max(1, Number(page)) - 1) * Math.min(50, Number(limit));

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate("owner", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Property.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      data: properties,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── OWNER: Get own listings ──────────────────────────────────────────────────
export const getOwnerProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── OWNER: Update property ───────────────────────────────────────────────────
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    // Ownership check
    if (property.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not your property" });
    }

    const allowedUpdates = [
      "title",
      "description",
      "price",
      "propertyType",
      "bedrooms",
      "bathrooms",
      "area",
      "amenities",
      "availabilityStatus",
      "location",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) property[field] = req.body[field];
    });

    // If new images uploaded, append them
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
      property.images.push(...newImages);
    }

    // Re-submit for approval if key fields changed
    property.status = "pending";

    const updated = await property.save();

    res.status(200).json({
      success: true,
      message: "Property updated and resubmitted for approval",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── OWNER: Delete property ───────────────────────────────────────────────────
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    if (property.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not your property" });
    }

    // Delete images from Cloudinary
    await Promise.all(
      property.images.map((img) => cloudinary.uploader.destroy(img.public_id)),
    );

    await property.deleteOne();

    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
