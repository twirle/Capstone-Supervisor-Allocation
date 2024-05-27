// NOT IN USE

import express from 'express';
import { requireAuth, checkRole } from '../middleware/requireAuth.js';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

router.use(requireAuth);
router.use(checkRole(['admin']));

// POST a new user
router.post('/create-user', adminController.createUser);

// GET all users
router.get('/users', adminController.getAllUsers);

// UPDATE a user
router.patch('/update-user/:id', adminController.updateUserRole);

// DELETE a user
// Add your DELETE route here if needed

export default router;
