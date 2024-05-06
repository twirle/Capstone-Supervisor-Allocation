const express = require("express")

const {
  getSupervisors,
  getSupervisor,
  updateSupervisor
} = require('../controllers/supervisorController');
const { requireAuth, checkRole } = require('../middleware/requireAuth')

const router = express.Router();

// forces the user to be authenticated for route functions
router.use(requireAuth);

// GET all supervisors
router.get('/', getSupervisors);

// GET a single supervisor based on their 'User' Id
router.get('/:userId', getSupervisor);

// POST a new supervisor
// moved to userService.js to handle creation and deletion

// UPDATE a supervisor
router.patch('/:userId', requireAuth, checkRole(['admin']), updateSupervisor);

// DELETE a supervisor
// moved to userService.js to handle creation and deletion

module.exports = router;