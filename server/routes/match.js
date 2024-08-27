import express from "express";
import {
  runHungarianMatching,
  runGreedyMatching,
  runGaleShapleyMatch,
  runKMeansMatch,
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

// Endpoint to trigger the galeShapleyMatch matching process
router.post(
  "/galeShapleyMatch",
  requireAuth,
  checkRole(["admin"]),
  runGaleShapleyMatch
);

// Endpoint to trigger the galeShapleyMatch matching process
router.post("/kMeansMatch", requireAuth, checkRole(["admin"]), runKMeansMatch);

// Reset matches
router.post("/reset", requireAuth, checkRole(["admin"]), resetMatching);

export default router;
