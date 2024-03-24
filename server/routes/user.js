const express = require('express')

// controller functions
const { loginUser, getAllUsers, deleteUser } = require('../controllers/userController')
const { requireAuth, checkRole } = require('../middleware/requireAuth')
const userService = require('../services/userService')

const router = express.Router()

// login route
router.post('/login', loginUser)

// sign up route
// router.post('/signup', signupUser)
router.post('/signup', async (req, res) => {
    try {
        const { email, password, role, additionalInfo } = req.body
        const user = await userService.signUp(email, password, role, additionalInfo)
        res.status(201).json(user)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// get all users
router.get('/all', requireAuth, checkRole(['admin']), getAllUsers)

// delete a user
router.delete('/:id', requireAuth, checkRole(['admin']), deleteUser)


module.exports = router