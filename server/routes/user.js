const express = require('express')

// controller functions
const { loginUser, getAllUsers, deleteUser, updateUserRole } = require('../controllers/userController')
const { requireAuth, checkRole } = require('../middleware/requireAuth')
const userService = require('../services/userService')
const { updateFacultyMember } = require('../controllers/facultyMemberController')

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

// update user role
router.patch('/:id/role', requireAuth, checkRole(['admin']), updateUserRole)

// delete a user
router.delete('/:id', requireAuth, checkRole(['admin']), deleteUser)


module.exports = router