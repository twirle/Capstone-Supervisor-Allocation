const express = require("express")

const {
  getMentors,
  getMentor,
  createMentor,
  deleteMentor,
  updateMentor
} = require('../controllers/mentorController');
const { requireAuth, checkRole } = require('../middleware/requireAuth')

const router = express.Router();

// forces the user to be authenticated for route functions
router.use(requireAuth);

// GET all mentors
router.get('/', getMentors);

// GET a single student
router.get('/:id', getMentor);

// // POST a new mentor
// router.post('/', requireAuth, checkRole(['admin']), createMentor);

// UPDATE a mentor
router.patch('/:id', requireAuth, checkRole(['admin']), updateMentor);

// // DELETE a mentor
// router.delete('/:id', deleteMentor);


module.exports = router;