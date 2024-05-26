import express from "express";
import {
  createOrUpdateSupervisorInterest,
  getSupervisorInterests,
} from "../controllers/supervisorInterestController.js";
import { requireAuth, checkRole } from "../middleware/requireAuth.js";

const router = express.Router();

// Route to handle creating or updating supervisor interest
router.use(requireAuth);

// Fetch all interests for a supervisor
router.get(
  "/bySupervisor/:supervisorId",
  requireAuth,
  checkRole(["supervisor", "admin"]),
  getSupervisorInterests
);

// Create/Update new or existing supervisor interest
router.post(
  "/",
  requireAuth,
  checkRole(["supervisor", "admin"]),
  createOrUpdateSupervisorInterest
);

export default router;
