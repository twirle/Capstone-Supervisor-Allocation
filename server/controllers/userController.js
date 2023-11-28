const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

// login user
const loginUser = async (req, res) => {
    const { email, password, role } = req.body
    try {
        const user = await User.login(email, password, role)
        // create a token
        const token = createToken(user._id)
        res.status(200).json({ email, token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// signup user
const signupUser = async (req, res) => {
    console.log(req.body)
    const { email, password, role } = req.body
    try {
        const user = await User.signup(email, password, role)

        // create token
        const token = createToken(user._id)
        res.status(200).json({ email, token, role })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = { signupUser, loginUser }