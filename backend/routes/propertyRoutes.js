// ─── propertyRoutes.js ────────────────────────────────────────────────────────
import express from "express";
import {
  createProperty,
  getApprovedProperties,
  getPropertyById,        // ← new
  updateProperty,         // ← new
  deleteProperty,         // ← new
  getOwnerProperties,     // ← new
  searchProperties,       // ← new
} from "../controllers/propertyController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import upload, { handleMulterError } from "../middleware/uploadMiddleware.js";
import {
  submitRentRequest,
  getRequestsForOwner,
  updateRequestStatus,
  getTenantRequests,
  cancelRentRequest,   // ← add this
} from "../controllers/rentRequestController.js";

const router = express.Router();

const ownerOnly  = [protect, authorizeRoles("owner")];
const tenantOnly = [protect, authorizeRoles("tenant")];
const authOnly   = [protect]; // any logged-in user

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/",           getApprovedProperties);   // all approved listings
router.get("/search",     searchProperties);         // filter/search
router.get("/:id",        getPropertyById);          // single property detail

// ── Owner ─────────────────────────────────────────────────────────────────────
router.post(
  "/",
  ...ownerOnly,
  upload.array("images", 5),
  createProperty
);
router.get("/owner/my-listings",   ...ownerOnly, getOwnerProperties);
router.put("/:id",                 ...ownerOnly, upload.array("images", 5), updateProperty);
router.delete("/:id",              ...ownerOnly, deleteProperty);
router.post(
  "/",
  ...ownerOnly,
  upload.array("images", 5),
  handleMulterError,        // ← add after upload
  createProperty
);

router.put(
  "/:id",
  ...ownerOnly,
  upload.array("images", 5),
  handleMulterError,        // ← add after upload
  updateProperty
);

// Owner: manage rent requests on their properties
router.get("/owner/rent-requests",         ...ownerOnly, getRequestsForOwner);
router.put("/owner/rent-requests/:id",     ...ownerOnly, updateRequestStatus);

// ── Tenant ────────────────────────────────────────────────────────────────────
router.post("/:id/rent-request",           ...tenantOnly, submitRentRequest);
router.get("/tenant/my-requests",          ...tenantOnly, getTenantRequests);
router.delete(
  "/tenant/rent-requests/:id",
  ...tenantOnly,
  cancelRentRequest
);



export default router;