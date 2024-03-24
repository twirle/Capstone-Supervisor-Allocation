const mongoose = require('mongoose');

const facultyMemberSchema = new mongoose.Schema({
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
        type: String,
        required: true
    }
});

module.exports = mongoose.model('FacultyMember', facultyMemberSchema)
