const Mentor = require('../models/mentorModel')
const MentorService = require('../services/mentorService')
const mongoose = require('mongoose')

// get all Mentors
const getMentors = async (req, res) => {
    const mentors = await Mentor.find({}).sort({ createdAt: -1 })

    res.status(200).json(mentors)
}

// get a single Mentor with access control
const getMentor = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such mentor' })
    }

    const mentor = await Mentor.findById(id);

    if (!mentor) {
        return res.status(404).json({ error: 'No such mentor' })
    }

    // Check if the requesting user is the mentor themselves or an admin
    if (mentor._id.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to access this mentor' })
    }

    res.status(200).json(mentor);
}

const UserService = require('../services/userService');

// // Create a new Mentor using UserService
// const createMentor = async (req, res) => {
//     const { email, password, name, faculty, researchArea } = req.body;

//     // Check for required fields and permissions
//     if (!req.user || !['admin'].includes(req.user.role)) {
//         return res.status(403).json({ error: 'Not authorized to create a mentor' });
//     }

//     let emptyFields = [];
//     if (!name) emptyFields.push('name');
//     if (!faculty) emptyFields.push('faculty');
//     if (!researchArea) emptyFields.push('researchArea');
//     if (!email || !password) emptyFields.push('email and password');

//     if (emptyFields.length > 0) {
//         return res.status(400).json({ error: 'Please fill in all fields', emptyFields });
//     }

//     // Use UserService to create a mentor user
//     try {
//         await UserService.signupUser(email, password, 'mentor', { name, faculty, researchArea });
//         res.status(201).json({ message: 'Mentor created successfully' });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };


// update a Mentor
const updateMentor = async (req, res) => {
    const { id } = req.params;
    console.log(`Attempting to update mentor with ID: ${id}`);
    const updateData = req.body;

    try {
        const mentor = await Mentor.findOneAndUpdate({ user: id }, updateData, { new: true });
        if (!mentor) {
            console.error(`No mentor found with ID: ${id}`);
            return res.status(404).json({ error: 'No such mentor' });
        }
        console.log(`Updated Mentor: ${mentor}`);
        res.status(200).json(mentor);
    } catch (error) {
        console.error(`Error updating mentor: ${error}`);
        res.status(400).json({ error: error.message });
    }
};
// // delete a Mentor
// const deleteMentor = async (req, res) => {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({ error: 'Invalid mentor ID' });
//     }

//     try {
//         await UserService.deleteUserAndProfile(id, 'mentor'); // This method should handle both user and mentor profile deletions.
//         res.status(200).json({ message: 'Mentor deleted successfully' });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// }



module.exports = {
    getMentors,
    getMentor,
    // createMentor,
    updateMentor,
    // deleteMentor
}