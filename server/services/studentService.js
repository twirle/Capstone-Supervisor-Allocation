const Student = require('../models/studentModel');

// Create Student Profile
async function createProfile(userId, additionalInfo) {
    try {
        const profile = await Student.create({
            user: userId,
            name: additionalInfo.name,
            faculty: additionalInfo.faculty,
            course: additionalInfo.course,
            company: additionalInfo.company
        });
        return profile;
    } catch (error) {
        throw new Error('Error creating student profile:', error);
    }
}

module.exports = { createProfile };