import express from "express";

import {
  getSupervisors,
  getSupervisor,
  updateSupervisor,
} from "../controllers/supervisorController.js";
import { requireAuth, checkRole } from "../middleware/requireAuth.js";

const router = express.Router();

// forces the user to be authenticated for route functions
router.use(requireAuth);

// GET all supervisors
router.get("/", getSupervisors);

// GET a single supervisor based on their 'User' Id
router.get("/:userId", getSupervisor);

// POST a new supervisor
// moved to userService.js to handle creation and deletion

// UPDATE a supervisor
router.patch("/:userId", requireAuth, checkRole(["admin"]), updateSupervisor);

// DELETE a supervisor
// moved to userService.js to handle creation and deletion

export default router;
