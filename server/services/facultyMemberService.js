const FacultyMember = require('../models/facultyMemberModel');

// Create FacultyMember Profile
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

// Delete FacultyMember profile
async function deleteProfile(userId) {
    try {
        console.log('Deleting profile:', userId)
        const profile = await FacultyMember.findOneAndDelete({ user: userId })
        if (!profile) {
            throw new Error('FacultyMember profile not found for deletion')
        }
        console.log('Deleted FacultyMember profile for:', userId)
        return profile
    } catch (error) {
        throw new Error('Error deleting faculty member profile:', error)
    }
}

module.exports = { createProfile, deleteProfile };