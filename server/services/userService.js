const User = require('../models/userModel')
const StudentService = require('../services/studentService')
const MentorService = require('../services/mentorService')
const FacultyService = require('../services/facultyMemberService')
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
    
    if ((role === 'student' || role === 'mentor' || role === 'facultyMember') && !additionalInfo) {
        throw new Error('additionalInfo is required for all users');
    }


    const exists = await User.findOne({ email });
    if (exists) {
        throw Error('Email already in use.');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create the basic user
    const user = await User.create({ email, password: hash, role });

    switch (role) {
        case 'student':
            await StudentService.createProfile(user._id, additionalInfo)
            break
        case 'mentor':
            await MentorService.createProfile(user._id, additionalInfo)
            break
        case 'facultyMember':
            await FacultyService.createProfile(user._id, additionalInfo)
            break
    }
}

module.exports = { signupUser };
