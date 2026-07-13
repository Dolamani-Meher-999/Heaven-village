import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          "properties",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [
      { width: 1200, height: 800, crop: "limit" }, // cap dimensions
      { quality: "auto" },                          // auto-compress
      { fetch_format: "auto" },                     // serve webp to browsers
    ],
  },
});

// ─── Multer error handler ─────────────────────────────────────────────────────
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Max size is 5MB per image",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many files. Max 5 images allowed",
      });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
  next(err); // pass non-multer errors to global error handler
};

const upload = multer({
  storage,
  limits: {
    fileSize:  5 * 1024 * 1024, // 5MB per file
    files:     5,               // max 5 images
  },
  fileFilter: (req, file, cb) => {
  const allowed = [
    "image/jpeg", "image/jpg", "image/png", 
    "image/webp", "image/gif"
  ];
  if (allowed.includes(file.mimetype) || file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
},
});

export default upload;