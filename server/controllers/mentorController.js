const Mentor = require('../models/mentorModel')
const mongoose = require('mongoose')

// get all Mentors
const getMentors = async (req, res) => {
    try {
        const mentors = await Mentor.find({}).sort({ createdAt: -1 })
            .populate('faculty', 'name')
            .populate('user', 'email')
            .populate('assignedStudents', 'name')
        res.status(200).json(mentors)
        // console.log("Mentors with populated data:", mentors);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// get a single Mentor with access control
const getMentor = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).json({ error: 'Invalid user ID' })
    }

    const mentor = await Mentor.findOne({ user: userId })
        .populate('faculty', 'name')
        .populate('user', 'email')
        .populate('assignedStudents', 'name')
    if (!mentor) {
        return res.status(404).json({ error: 'No mentor found with this user ID' })
    }

    // Check if the requesting user is the mentor themselves or an admin
    if (mentor.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to access this mentor' })
    }

    res.status(200).json(mentor);
}

// update a Mentor
const updateMentor = async (req, res) => {
    const { userId } = req.params;
    console.log(`Attempting to update mentor with ID: ${userId}`);
    const updateData = req.body;

    try {
        const mentor = await Mentor.findOneAndUpdate({ user: userId }, updateData, { new: true }).populate('user faculty')
        if (!mentor) {
            console.error(`No mentor found with ID: ${userId}`);
            return res.status(404).json({ error: 'No such mentor' });
        }
        // console.log(`Updated Mentor: ${mentor}`);
        res.status(200).json(mentor);
    } catch (error) {
        console.error(`Error updating mentor: ${error}`);
        res.status(400).json({ error: error.message });
    }
};


module.exports = {
    getMentors,
    getMentor,
    updateMentor
}