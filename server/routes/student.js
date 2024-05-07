import express from "express";

import {
  getStudents,
  getStudent,
  updateStudent,
  aggregateStudents,
} from "../controllers/studentController.js";
import { requireAuth, checkRole } from "../middleware/requireAuth.js";

const router = express.Router();

// forces the user to be authenticated for route functions
router.use(requireAuth);

// GET all student
router.get("/", getStudents);

// aggregate students
router.get(
  "/aggregate",
  requireAuth,
  checkRole(["admin", "facultyMember"]),
  aggregateStudents
);

// GET a single student based on their 'Profile' Id
router.get("/:userId", getStudent);

// UPDATE a student
router.patch(
  "/:userId",
  requireAuth,
  checkRole(["admin", "facultyMember"]),
  updateStudent
);

export default router;
