const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'User'
    // },
    name: {
        type: String,
        required: true
    },
    faculty: {
        type: String,
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
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'User'
        type: String
    }
});

module.exports = mongoose.model('Student', studentSchema)
