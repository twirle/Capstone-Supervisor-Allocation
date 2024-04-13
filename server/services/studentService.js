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
        throw new Error('Error creating student profile:', error)
    }
}

async function deleteProfile(userId) {
    try {
        console.log('Deleting profile:', userId)
        const profile = await Student.findOneAndDelete({ user: userId })
        if (!profile) {
            throw new Error('Student profile not found for deletion')
        }
        console.log('Deleted student profile for:', userId)
        return profile
    } catch (error) {
        throw new Error('Error deleting student profile:', error)
    }
}
module.exports = { createProfile, deleteProfile }