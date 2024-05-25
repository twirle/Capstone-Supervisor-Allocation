import express from "express";
import { createOrUpdateSupervisorInterest } from "../controllers/supervisorInterestController.js";
import { requireAuth, checkRole } from "../middleware/requireAuth.js";

const router = express.Router();

// Route to handle creating or updating supervisor interest
router.use(requireAuth);

router.post(
  "/",
  requireAuth,
  checkRole(["supervisor", "admin"]),
  createOrUpdateSupervisorInterest
);
export default router;
