const mongoose = require('mongoose');
const { comparePassword } = require('../utils/securityUtils');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'supervisor', 'student', 'facultyMember'],
        required: true
    }
});

// // Signup static method
// userSchema.statics.signUp = async function (email, password, role) {
//     // Validate input
//     if (!email || !password) {
//         throw new Error('All fields must be filled.');
//     }
//     if (!validator.isEmail(email)) {
//         throw new Error('Email is not valid.');
//     }
//     if (!validator.isStrongPassword(password)) {
//         throw new Error('Password is not strong enough.');
//     }

//     // Check if email is already in use
//     const exists = await this.findOne({ email });
//     if (exists) {
//         throw new Error('Email already in use.');
//     }

//     // Hash password using utility
//     const hashedPassword = await hashPassword(password);

//     // Create user with hashed password
//     const user = await this.create({
//         email,
//         password: hashedPassword,
//         role
//     });
//     return user;
// };

// Login static method
userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw new Error('All fields must be filled.');
    }

    const user = await this.findOne({ email });
    if (!user) {
        throw new Error('Incorrect email.');
    }

    // Compare password using utility
    const match = await comparePassword(password, user.password);
    if (!match) {
        throw new Error('Incorrect password.');
    }

    return user;
};

module.exports = mongoose.model('User', userSchema);