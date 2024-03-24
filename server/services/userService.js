const User = require('../models/userModel')
const Student = require('../models/studentModel')
const Mentor = require('../models/mentorModel')
const Faculty = require('../models/facultyModel')
const bcrypt = require('bcrypt')
const validator = require('validator')

async function signupUser(email, password, role, additionalInfo) {

    // validation
    if (!email || !password) {
        throw Error('All fields must be filled.');
    }

    if (!validator.isEmail(email)) {
        throw Error('Email is not valid.');
    }

    if (!validator.isStrongPassword(password)) {
        throw Error('Password is not strong enough.');
    }

    const exists = await User.findOne({ email });
    if (exists) {
        throw Error('Email already in use.');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.signup({ email, password: hash, role });

    // Now handle the role-specific profile creation
    if (role === 'student') {
        await Student.create({ user: user._id, additionalInfo });
    } else if (role === 'mentor') {
        await Mentor.create({ user: user._id, additionalInfo });
    } else if (role === 'faculty') {
        await Faculty.create({ user: user._id, additionalInfo });
    }

    return user;
}

module.exports = { signupUser };
