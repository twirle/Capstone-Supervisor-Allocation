const Student = require('../models/studentModel')
const mongoose = require('mongoose')

// get all Students
const getStudents = async (req, res) => {
    try {
        const students = await Student.find({}).sort({ createdAt: -1 }).populate('user')
        res.status(200).json(students)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}

// get a single Student with access control
const getStudent = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).json({ error: 'Invalid user ID' })
    }

    const student = await Student.findOne({ user: userId }).populate('user faculty')
    if (!student) {
        return res.status(404).json({ error: 'No student found with this user ID' })
    }

    // Check if the requesting user is the student themselves or an admin
    if (student._id.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to access this student' })
    }

    res.status(200).json(student);
}

// update a Student
const updateStudent = async (req, res) => {
    const { userId } = req.params
    console.log(`Attempting to update student with ID: ${userId}`);
    const updateData = req.body

    try {
        const student = await Student.findOneAndUpdate({ user: userId }, updateData, { new: true }).populate('user faculty')
        if (!student) {
            console.error(`No student found with ID: ${userId}`);
            return res.status(404).json({ error: 'No such student' });
        }
        console.log(`Updated student: ${student}`);
        res.status(200).json(student);
    } catch (error) {
        console.error(`Error updating mentor: ${error}`);
        res.status(400).json({ error: error.message });
    }
};


module.exports = {
    getStudents,
    getStudent,
    updateStudent
}