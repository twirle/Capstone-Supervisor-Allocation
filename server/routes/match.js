import express from "express";
import {
  runHungarianMatching,
  runGreedyMatching,
  resetMatching,
} from "../controllers/matchController.js";
import { requireAuth, checkRole } from "../middleware/requireAuth.js";

const router = express.Router();

// Endpoint to trigger the hungarian matching process
router.post(
  "/hungarianMatch",
  requireAuth,
  checkRole(["admin"]),
  runHungarianMatching
);

// Endpoint to trigger the greedy matching process
router.post(
  "/greedyMatch",
  requireAuth,
  checkRole(["admin"]),
  runGreedyMatching
);

// Reset matches
router.post("/reset", requireAuth, checkRole(["admin"]), resetMatching);

export default router;
