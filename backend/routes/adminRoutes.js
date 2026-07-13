// ─── adminRoutes.js ───────────────────────────────────────────────────────────
import express from "express";
import {
  getPendingProperties,
  approveProperty,
  rejectProperty,
  getAllProperties,      // ← new
  getAllUsers,           // ← new
  deactivateUser,       // ← new
  getAllRentRequests,    // ← new
} from "../controllers/adminController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

const adminOnly = [protect, authorizeRoles("admin")];

// Properties
router.get("/properties",              ...adminOnly, getAllProperties);
router.get("/properties/pending",      ...adminOnly, getPendingProperties);
router.put("/properties/:id/approve",  ...adminOnly, approveProperty);
router.put("/properties/:id/reject",   ...adminOnly, rejectProperty);

// Users
router.get("/users",                   ...adminOnly, getAllUsers);
router.put("/users/:id/deactivate",    ...adminOnly, deactivateUser);

// Rent Requests
router.get("/rent-requests",           ...adminOnly, getAllRentRequests);

export default router;