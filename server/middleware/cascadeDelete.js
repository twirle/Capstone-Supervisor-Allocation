const FacultyMember = require('../models/facultyMemberModel')
const Mentor = require('../models/mentorModel')
const Student = require('../models/studentModel')

async function deleteUserRelatedData(userId) {
    // Perform deletion of related documents when the user is removed
    console.log('Reached cascadeDelete')
    await Promise.all([
        FacultyMember.deleteMany({ user: userId }),
        Mentor.deleteMany({ user: userId }),
        Student.deleteMany({ user: userId }),
    ]);
}

module.exports = { deleteUserRelatedData };
