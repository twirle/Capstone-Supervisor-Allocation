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

// change user password
const updateUserPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body
        const user = await User.findById(req.params.id)

        if (!user) {
            return res.status(404).send({ error: 'User not found for password update' })
        }

        // verify old password
        const passIsMatch = await bcrypt.compare(oldPassword, user.password)
        if (!passIsMatch) {
            return res.status(400).send({ error: 'Old password is incorrect' })
        }

        // validate new password
        if (!newPassword || !validator.isStrongPassword(newPassword)) {
            return res.status(400).send({ error: 'Invalid new password' })
        }

        // hash password and save
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(newPassword, salt)
        await user.save()

        res.status(200).send({ message: 'Password updated successfully' })
    } catch (err) {
        res.status(500).send({ error: error.message })
    }
}

// update user role NOT IN USE
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

// remove user using cascadeDelete
const removeUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.remove(); // This triggers the pre-remove middleware for cascade deletion

        res.json({ message: 'User and related documents deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during user deletion' });
    }
};



module.exports = { loginUser, getAllUsers, updateUserPassword, deleteUser, removeUser }