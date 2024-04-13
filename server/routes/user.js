const express = require('express');
const router = express.Router();
const UserService = require('../services/userService'); // Ensure this is correctly imported

// Controller functions
const { loginUser, getAllUsers, updateUserPassword } = require('../controllers/userController');
const { requireAuth, checkRole } = require('../middleware/requireAuth');

// Login route
router.post('/login', loginUser);

// Sign up route, accessible only by admins
router.post('/signup', requireAuth, checkRole(['admin']), async (req, res) => {
    try {
        const { email, password, role, additionalInfo } = req.body;
        const user = await UserService.signupUser(email, password, role, additionalInfo);
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all users, accessible only by admins
router.get('/all', requireAuth, checkRole(['admin']), getAllUsers);

// Change user password, requires authentication
router.patch('/:id/changePassword', requireAuth, updateUserPassword);

// Delete a user, accessible only by admins
router.delete('/:userId', requireAuth, checkRole(['admin']), async (req, res) => {
    try {
        await UserService.deleteUserandProfile(req.params.userId);
        res.status(204).send(); // No content to send back
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
