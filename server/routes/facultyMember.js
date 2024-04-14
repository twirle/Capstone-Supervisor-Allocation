const express = require("express")

const {
  getFacultyMembers,
  getFacultyMember,
  updateFacultyMember
} = require('../controllers/facultyMemberController');
const { requireAuth, checkRole } = require('../middleware/requireAuth')

const router = express.Router();

// forces the user to be authenticated for route functions
router.use(requireAuth);

// GET all faculty members
router.get('/', getFacultyMembers);

// GET a single faculty member based on their 'Profile' Id
router.get('/user/:userId', getFacultyMember);

// POST a new faculty member
// moved to userService.js to handle creation and deletion

// UPDATE a faculty member
router.patch('/user/:userId', requireAuth, checkRole(['admin']), updateFacultyMember);

// DELETE a faculty member
// moved to userService.js to handle creation and deletion


module.exports = router;