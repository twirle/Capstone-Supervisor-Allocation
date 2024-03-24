const express = require("express")

const {
  getFacultyMembers,
  getFacultyMember,
  createFacultyMember,
  deleteFacultyMember,
  updateFacultyMember
} = require('../controllers/facultyMemberController');
const { requireAuth, checkRole } = require('../middleware/requireAuth')

const router = express.Router();

// forces the user to be authenticated for route functions
router.use(requireAuth);

// GET all faculty members
router.get('/', getFacultyMembers);

// GET a single faculty member
router.get('/:id', getFacultyMember);

// POST a new faculty member
router.post('/', requireAuth, checkRole(['admin']), createFacultyMember);

// UPDATE a faculty member
router.patch('/:id', requireAuth, checkRole(['admin']), updateFacultyMember);

// DELETE a faculty member
router.delete('/:id', deleteFacultyMember);


module.exports = router;