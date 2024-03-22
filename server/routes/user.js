const express = require('express')

// controller functions
const { signupUser, loginUser, getAllUsers, deleteUser } = require('../controllers/userController')
const {requireAuth, checkRole} = require('../middleware/requireAuth')

const router = express.Router()

// login route
router.post('/login', loginUser)

// sign up route
router.post('/signup', signupUser)

// get all users
router.get('/all', requireAuth, checkRole(['admin']), getAllUsers)

// delete a user
router.delete('/:id', requireAuth, checkRole(['admin']), deleteUser)


module.exports = router