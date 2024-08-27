import express from "express";

import { getMatchResults } from "../controllers/matchResultController.js";
import { requireAuth, checkRole } from "../middleware/requireAuth.js";

const router = express.Router();

// forces the user to be authenticated for route functions
router.use(requireAuth);

// GET all match results
router.get("/", requireAuth, checkRole(["admin"]), getMatchResults);

export default router;
