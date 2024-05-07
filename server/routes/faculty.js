import express from "express";

import {
  getFaculties,
  getFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} from "../controllers/facultyController.js";
import { requireAuth, checkRole } from "../middleware/requireAuth.js";

const router = express.Router();

// forces the user to be authenticated for route functions
router.use(requireAuth);

// GET all faculty
router.get("/", getFaculties);

// GET a single faculty
router.get("/:id", getFaculty);

// POST a new faculty
router.post("/", requireAuth, checkRole(["admin"]), createFaculty);

// UPDATE a faculty
router.patch("/:id", requireAuth, checkRole(["admin"]), updateFaculty);

// DELETE a faculty
router.delete("/:id", deleteFaculty);

export default router;
