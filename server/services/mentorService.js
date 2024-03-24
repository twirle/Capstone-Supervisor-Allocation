const Mentor = require('../models/mentorModel');

// Create Student Profile
async function createProfile(userId, additionalInfo) {
    try {
        const profile = await Mentor.create({
            user: userId,
            name: additionalInfo.name,
            faculty: additionalInfo.faculty,
            researchArea: additionalInfo.researchArea
        });
        return profile;
    } catch (error) {
        throw new Error('Error creating mentor profile:', error);
    }
}

module.exports = { createProfile };