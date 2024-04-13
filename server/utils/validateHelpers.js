const validator = require('validator');

const validateUserFields = (email, password) => {
    if (!email || !password) throw new Error('All fields must be filled.');
    if (!validator.isEmail(email)) throw new Error('Email is not valid.');
    if (!validator.isStrongPassword(password)) throw new Error('Password is not strong enough.');
}

const validateUserInput = (email, password, role, additionalInfo) => {
    validateUserFields(email, password); // Reuse existing validation for email and password.
    if (!['student', 'mentor', 'facultyMember'].includes(role) && role !== 'admin') {
        throw new Error('Invalid or missing role.');
    }
    if (role !== 'admin' && !additionalInfo) {
        throw new Error('Additional info is required for student, mentor, and faculty member roles.');
    }
}

module.exports = { validateUserFields, validateUserInput };
