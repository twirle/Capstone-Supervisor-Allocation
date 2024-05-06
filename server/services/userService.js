const User = require('../models/userModel');
const StudentService = require('./studentService');
const SupervisorService = require('./supervisorService');
const FacultyService = require('./facultyMemberService');
const { hashPassword } = require('../utils/securityUtils');
const { validateUserInput } = require('../utils/validateHelpers');
{ }

async function signupUser(email, password, role, additionalInfo) {

    // Validate user input using centralized helper function
    validateUserInput(email, password, role, additionalInfo);

    const exists = await User.findOne({ email });
    if (exists) {
        throw new Error('Email already in use.');
    }

    const hashedPassword = await hashPassword(password);

    // create user
    const user = await User.create({ email, password: hashedPassword, role });

    switch (role) {
        case 'student':
            await StudentService.createProfile(user._id, additionalInfo);
            break;
        case 'supervisor':
            await SupervisorService.createProfile(user._id, additionalInfo);
            break;
        case 'facultyMember':
            await FacultyService.createProfile(user._id, additionalInfo);
            break;
        default:
            break;
    }

    return user;
}

async function deleteUserandProfile(userId) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            console.error(`User with ID ${userId} not found.`);
            throw new Error('User not found.');
        }

        switch (user.role) {
            case 'supervisor':
                await SupervisorService.deleteProfile(userId)
                break
            case 'student':
                await StudentService.deleteProfile(userId)
                break
            case 'facultyMember':
                await FacultyService.deleteProfile(userId)
                break
        }

        // After profile deletion, delete the user
        await User.deleteOne({ _id: userId })
        console.log(`User and all related data deleted successfully: ${userId}`)
    } catch (error) {
        console.error(`Error deleting user: ${error.message}`)
        throw error
    }
}

module.exports = { signupUser, deleteUserandProfile };