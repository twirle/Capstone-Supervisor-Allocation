const express = require("express")

const {
  getStudents,
  getStudent,
  createStudent,
  deleteStudent,
  updateStudent
} = require('../controllers/studentController');
const { requireAuth, checkRole } = require('../middleware/requireAuth')

const router = express.Router();

// forces the user to be authenticated for route functions
router.use(requireAuth);

// GET all student
router.get('/', getStudents);

// GET a single student
router.get('/:id', getStudent);

// POST a new student
router.post('/', requireAuth, checkRole(['admin']), createStudent);

// UPDATE a student
router.patch('/:id', requireAuth, checkRole(['admin', 'facultyMember']), updateStudent);

// DELETE a student
router.delete('/:id', deleteStudent);


module.exports = router;