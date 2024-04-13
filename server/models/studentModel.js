const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: true
    },
    course: {
        type: String,
        required: true
    },
    company: {
        type: String,
        require: true
    },
    assignedMentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentor',
        default: null
    },
    assignedMentorName: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('Student', studentSchema)
