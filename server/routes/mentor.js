const express = require("express")

const {
  getMentors,
  getMentor,
  updateMentor
} = require('../controllers/mentorController');
const { requireAuth, checkRole } = require('../middleware/requireAuth')

const router = express.Router();

// forces the user to be authenticated for route functions
router.use(requireAuth);

// GET all mentors
router.get('/', getMentors);

// GET a single mentor based on their 'User' Id
router.get('/:userId', getMentor);

// POST a new mentor
// moved to userService.js to handle creation and deletion

// UPDATE a mentor
router.patch('/:userId', requireAuth, checkRole(['admin']), updateMentor);

// DELETE a mentor
// moved to userService.js to handle creation and deletion

module.exports = router;