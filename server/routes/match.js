import express from "express";
import { runHungarianMatching } from "../controllers/hungarianController.js";
import {
  runJaccardMatching,
  resetMatching,
} from "../controllers/jaccardController.js";
import { requireAuth, checkRole } from "../middleware/requireAuth.js";

const router = express.Router();

// Endpoint to trigger the hungarian matching process
router.post(
  "/hungarianMatch",
  requireAuth,
  checkRole(["admin"]),
  runHungarianMatching
);

// Endpoint to trigger the jaccard matching process
router.post(
  "/jaccardMatch",
  requireAuth,
  checkRole(["admin"]),
  runJaccardMatching
);

// Reset matches
router.post("/reset", requireAuth, checkRole(["admin"]), resetMatching);

export default router;
