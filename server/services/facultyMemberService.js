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
        throw new Error('Error creating supervisor profile:', error);
    }
}

// Delete FacultyMember profile
async function deleteProfile(userId) {
    try {
        console.log('Deleting profile:', userId)
        const profile = await FacultyMember.findOneAndDelete({ user: userId })
        if (!profile) {
            console.error('FacultyMember profile not found for User ID:', userId);
            throw new Error('FacultyMember profile not found for deletion')
        }
        console.log('Deleted FacultyMember profile for:', userId)
        return profile
    } catch (error) {
        console.error('Error deleting faculty member profile:', error)
        throw new Error('Error deleting faculty member profile:', error)
    }
}

module.exports = { createProfile, deleteProfile };