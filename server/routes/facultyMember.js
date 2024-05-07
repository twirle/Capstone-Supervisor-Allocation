import express from 'express';

import {
  getFacultyMembers,
  getFacultyMember,
  updateFacultyMember
} from '../controllers/facultyMemberController.js';
import { requireAuth, checkRole } from '../middleware/requireAuth.js';

const router = express.Router();

// forces the user to be authenticated for route functions
router.use(requireAuth);

// GET all faculty members
router.get('/', getFacultyMembers);

// GET a single faculty member based on their 'Profile' Id
router.get('/:userId', getFacultyMember);

// POST a new faculty member
// moved to userService.js to handle creation and deletion

// UPDATE a faculty member
router.patch('/:userId', requireAuth, checkRole(['admin']), updateFacultyMember);

// DELETE a faculty member
// moved to userService.js to handle creation and deletion

export default router;
