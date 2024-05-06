const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Helper function to create token
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

// Create user (Admin functionality)
const createUser = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const user = await User.signup(email, password, role);
        const token = createToken(user._id);
        res.status(200).json({ email, token, role });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update user's role
const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        const user = await User.findByIdAndUpdate(id, { role }, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Other admin functionalities...

// Additional admin functionalities can be added here
// const getStudent
// const createStudent
// const getSupervisor
// const createSupervisor
// ...

module.exports = { createToken, createUser, updateUserRole, getAllUsers };
