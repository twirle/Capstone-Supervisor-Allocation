import express from "express";
import {
  runMatchingProcess,
  resetMatching,
} from "../controllers/matchController.js";
import { requireAuth, checkRole } from "../middleware/requireAuth.js";

const router = express.Router();

// Endpoint to trigger the matching process
router.post("/match", requireAuth, checkRole(["admin"]), runMatchingProcess);

// Reset matches
router.post("/reset", requireAuth, checkRole(["admin"]), resetMatching);

export default router;
