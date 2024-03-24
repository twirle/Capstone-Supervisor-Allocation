const Mentor = require('../models/mentorModel')
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


// create a new Mentor
const createMentor = async (req, res) => {
    const { name, faculty, researchArea, assignedStudent } = req.body

    let emptyFields = []
    // check if admin
    if (!['admin'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Not authorized to create a mentor' })
    }

    if (!name) {
        emptyFields.push('name')
    }
    if (!course) {
        emptyFields.push('course')
    }
    if (!faculty) {
        emptyFields.push('faculty')
    }
    if (!company) {
        emptyFields.push('company')
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all fields.', emptyFields })
    }

    // add to the database
    try {
        const mentor = await Mentor.create({ name, faculty, researchArea, assignedStudent })
        res.status(200).json(mentor)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// update a Mentor
const updateMentor = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // This might include user ID, but be cautious with allowing this to change

    try {
        const mentor = await Mentor.findByIdAndUpdate(id, updateData, { new: true });
        if (!mentor) {
            return res.status(404).json({ error: 'No such mentor' });
        }
        res.status(200).json(mentor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// delete a Mentor
const deleteMentor = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such Mentor' })
    }

    const mentor = await Mentor.findOneAndDelete({ _id: id })

    if (!mentor) {
        return res.status(400).json({ error: 'No such Mentor' })
    }

    res.status(200).json(mentor)
}

module.exports = {
    getMentors,
    getMentor,
    createMentor,
    updateMentor,
    deleteMentor
}