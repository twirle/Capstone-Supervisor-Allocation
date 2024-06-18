import express from "express";
import {
  runHungarianMatching,
  resetMatching,
} from "../controllers/hungarianController.js";
import { requireAuth, checkRole } from "../middleware/requireAuth.js";

const router = express.Router();

// Endpoint to trigger the matching process
router.post("/match", requireAuth, checkRole(["admin"]), runHungarianMatching);

// Reset matches
router.post("/reset", requireAuth, checkRole(["admin"]), resetMatching);

export default router;
