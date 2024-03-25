const express = require('express')

// controller functions
const { loginUser, getAllUsers, deleteUser, updateUserPassword, removeUser } = require('../controllers/userController')
const { requireAuth, checkRole } = require('../middleware/requireAuth')
const userService = require('../services/userService')

const router = express.Router()

// login route
router.post('/login', loginUser)

// sign up route
// router.post('/signup', signupUser)
router.post('/signup', async (req, res) => {
    try {
        const { email, password, role, additionalInfo } = req.body;
        const user = await userService.signupUser(email, password, role, additionalInfo);
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// get all users
router.get('/all', requireAuth, checkRole(['admin']), getAllUsers)

// change user password
router.patch('/:id/changePassword', requireAuth, updateUserPassword);

// update user role
// router.patch('/:id/role', requireAuth, checkRole(['admin']), updateUserRole)

// delete a user
router.delete('/:id', requireAuth, checkRole(['admin']), deleteUser)

// remove user (for cascadeDelete)
// router.delete('/:id/remove', requireAuth, checkRole(['admin']), removeUser);



module.exports = router