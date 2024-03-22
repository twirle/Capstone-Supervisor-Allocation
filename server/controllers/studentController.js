const Student = require('../models/studentModel')
const mongoose = require('mongoose')

// get all Students
const getStudents = async (req, res) => {
    const students = await Student.find({}).sort({ createdAt: -1 })

    res.status(200).json(students)
}

// get a single Student with access control
const getStudent = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such student' })
    }

    const student = await Student.findById(id);

    if (!student) {
        return res.status(404).json({ error: 'No such student' })
    }

    // Check if the requesting user is the student themselves or an admin
    if (student._id.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to access this student' })
    }

    res.status(200).json(student);
}


// create a new Student
const createStudent = async (req, res) => {
    const { name, course, faculty, company, assignedMentor } = req.body

    let emptyFields = []
    // check if admin
    if (!['admin'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Not authorized to create a student' })
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
        const student = await Student.create({ name, course, faculty, company, assignedMentor })
        res.status(200).json(student)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// update a Student
const updateStudent = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // This might include user ID, but be cautious with allowing this to change

    try {
        const student = await Student.findByIdAndUpdate(id, updateData, { new: true });
        if (!student) {
            return res.status(404).json({ error: 'No such student' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// delete a Student
const deleteStudent = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such Student' })
    }

    const student = await Student.findOneAndDelete({ _id: id })

    if (!student) {
        return res.status(400).json({ error: 'No such Student' })
    }

    res.status(200).json(student)
}

module.exports = {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent
}