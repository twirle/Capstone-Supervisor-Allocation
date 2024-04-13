const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
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
    researchArea: {
        type: String,
        default: null
    },
    assignedStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        default: []
    }]
});

module.exports = mongoose.model('Mentor', mentorSchema)
