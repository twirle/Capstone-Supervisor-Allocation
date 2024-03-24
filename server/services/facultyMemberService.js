const FacultyMember = require('../models/facultyMemberModel');

// Create Student Profile
async function createProfile(userId, additionalInfo) {
    try {
        const profile = await FacultyMember.create({
            user: userId,
            name: additionalInfo.name,
            faculty: additionalInfo.faculty
        });
        return profile;
    } catch (error) {
        throw new Error('Error creating mentor profile:', error);
    }
}

module.exports = { createProfile };