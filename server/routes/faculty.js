const express = require("express");

const {
  getFaculties,
  getFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} = require("../controllers/facultyController");
const { requireAuth, checkRole } = require("../middleware/requireAuth");

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

module.exports = router;
