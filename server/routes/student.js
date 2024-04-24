const express = require("express");

const {
  getStudents,
  getStudent,
  updateStudent,
  aggregateStudents,
} = require("../controllers/studentController");
const { requireAuth, checkRole } = require("../middleware/requireAuth");

const router = express.Router();

// forces the user to be authenticated for route functions
router.use(requireAuth);

// GET all student
router.get("/", getStudents);

// GET a single student based on their 'Profile' Id
router.get("/:userId", getStudent);

// UPDATE a student
router.patch(
  "/:userId",
  requireAuth,
  checkRole(["admin", "facultyMember"]),
  updateStudent
);

// aggregate students
router.get(
  "/aggregate",
  requireAuth,
  checkRole(["admin", "facultyMember"]),
  aggregateStudents
);

module.exports = router;
