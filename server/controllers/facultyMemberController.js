const FacultyMember = require('../models/facultyMemberModel')
const mongoose = require('mongoose')

// get all Faculty Members
const getFacultyMembers = async (req, res) => {
    const facultyMembers = await FacultyMember.find({}).sort({ createdAt: -1 })

    res.status(200).json(facultyMembers)
}

// get a single Faculty Member with access control
const getFacultyMember = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such faculty member' })
    }

    const facultyMember = await FacultyMember.findById(id);

    if (!facultyMember) {
        return res.status(404).json({ error: 'No such faculty member' })
    }

    // Check if the requesting user is the faculty member themselves or an admin
    if (facultyMember._id.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to access this faculty member' })
    }

    res.status(200).json(facultyMember);
}


// create a new faculty member
const createFacultyMember = async (req, res) => {
    const { name, faculty } = req.body

    let emptyFields = []
    // check if admin
    if (!['admin'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Not authorized to create a faculty member' })
    }

    if (!name) {
        emptyFields.push('name')
    }
    if (!faculty) {
        emptyFields.push('faculty')
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all fields.', emptyFields })
    }

    // add to the database
    try {
        const facultyMember = await FacultyMember.create({ name, faculty })
        res.status(200).json(facultyMember)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// update a faculty member
const updateFacultyMember = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // This might include user ID, but be cautious with allowing this to change

    try {
        const facultyMember = await FacultyMember.findByIdAndUpdate(id, updateData, { new: true });
        if (!facultyMember) {
            return res.status(404).json({ error: 'No such faculty member' });
        }
        res.status(200).json(facultyMember);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// delete a faculty member
const deleteFacultyMember = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such faculty member' })
    }

    const facultyMember = await facultyMember.findOneAndDelete({ _id: id })

    if (!facultyMember) {
        return res.status(400).json({ error: 'No such faculty member' })
    }

    res.status(200).json(facultyMember)
}

module.exports = {
    getFacultyMember,
    getFacultyMembers,
    createFacultyMember,
    updateFacultyMember,
    deleteFacultyMember
}