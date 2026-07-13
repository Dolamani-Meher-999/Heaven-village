import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ─── AUTH MIDDLEWARE ───────────────────────────────────────────────────────────
export const protect = async (req, res, next) => {
  try {
    // 1. Extract token
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const token = req.headers.authorization.split(" ")[1];

    // 2. Verify signature + expiry
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      const message =
        err.name === "TokenExpiredError"
          ? "Session expired, please login again"
          : "Not authorized, token invalid";
      return res.status(401).json({ message });
    }

    // 3. Check user still exists in DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    // 4. Check account is active
    if (!user.isActive) {
      return res.status(403).json({ message: "Account has been deactivated" });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Server error in authentication" });
  }
};

// ─── ROLE MIDDLEWARE ───────────────────────────────────────────────────────────
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Guard: protect must run first
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(" or ")}`,
      });
    }

    next();
  };
};