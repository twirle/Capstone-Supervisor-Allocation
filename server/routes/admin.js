// NOT IN USE

const express = require('express');
const { requireAuth, checkRole } = require('../middleware/requireAuth');
const adminController = require('../controllers/adminController');

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


// Additional routes...

module.exports = router;

