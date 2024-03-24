const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body
    console.log('Attempting to login with:', req.body)

    try {
        const user = await User.login(email, password,)
        // create a token
        const token = createToken(user._id)
        res.status(200).json({ id: user._id, email, token, role: user.role })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// signup user: moved to userService.js to reduce bloat


// get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// update user role
const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        const user = await User.findByIdAndUpdate(id, { role }, { new: true });
        if (!user) {
            throw new Error('User not found');
        }
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// delete user
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { loginUser, getAllUsers, updateUserRole, deleteUser }