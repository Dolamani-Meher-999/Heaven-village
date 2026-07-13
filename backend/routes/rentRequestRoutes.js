// ─── rentRequestRoutes.js ─────────────────────────────────────────────────────
import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  submitRentRequest,
  getRequestsForOwner,
  updateRequestStatus,
  getTenantRequests,
  cancelRentRequest,
} from "../controllers/rentRequestController.js";

const router = express.Router();

const ownerOnly  = [protect, authorizeRoles("owner")];
const tenantOnly = [protect, authorizeRoles("tenant")];

// ── Tenant ────────────────────────────────────────────────────────────────────
router.get("/tenant",         ...tenantOnly, getTenantRequests);   // GET  /api/rent-requests/tenant
router.patch("/:id/cancel",   ...tenantOnly, cancelRentRequest);   // PATCH /api/rent-requests/:id/cancel

// ── Owner ─────────────────────────────────────────────────────────────────────
router.get("/owner",          ...ownerOnly,  getRequestsForOwner); // GET  /api/rent-requests/owner
router.put("/:id/status",     ...ownerOnly,  updateRequestStatus); // PUT  /api/rent-requests/:id/status

export default router;