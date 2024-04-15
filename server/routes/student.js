const express = require("express")

const {
  getStudents,
  getStudent,
  updateStudent
} = require('../controllers/studentController');
const { requireAuth, checkRole } = require('../middleware/requireAuth')

const router = express.Router();

// forces the user to be authenticated for route functions
router.use(requireAuth);

// GET all student
router.get('/', getStudents);

// GET a single student based on their 'Profile' Id
router.get('/:userId', getStudent);

// POST a new student
// moved to userService.js to handle creation and deletion

// UPDATE a student
router.patch('/:userId', requireAuth, checkRole(['admin', 'facultyMember']), updateStudent);

// DELETE a student
// moved to userService.js to handle creation and deletion


module.exports = router