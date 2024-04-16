const Mentor = require('../models/mentorModel');

// Create Mentor profile
async function createProfile(userId, additionalInfo) {
    try {
        console.log(userId, additionalInfo)
        const profile = await Mentor.create({
            user: userId,
            name: additionalInfo.name,
            faculty: additionalInfo.faculty,
            researchArea: additionalInfo.researchArea,
        });
        return profile;
    } catch (error) {
        throw new Error('Error creating mentor profile:', error);
    }
}

// Delete Mentor profile
async function deleteProfile(userId) {
    try {
        console.log('Deleting profile:', userId)
        const profile = await Mentor.findOneAndDelete({ user: userId })
        if (!profile) {
            console.error('Mentor profile not found for User ID:', userId);
            throw new Error('Mentor profile not found for deletion')
        }
        console.log('Deleted mentor profile for:', userId)
        return profile
    } catch (error) {
        console.error('Error deleting mentor profile', error)
        throw new Error('Error deleting mentor profile:', error)
    }
}

module.exports = { createProfile, deleteProfile };