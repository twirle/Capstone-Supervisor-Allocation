require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/studentModel')
const Mentor = require('../models/mentorModel')

async function resetAssignments() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Reset assignedMentor for all students
        await Student.updateMany({}, { $set: { assignedMentor: null } });

        // Reset assignedStudents for all mentors
        // If your mentor model doesn't directly link to students, adjust this part
        await Mentor.updateMany({}, { $set: { assignedStudents: [] } });

        console.log('Reset completed successfully.');
    } catch (error) {
        console.error('Error resetting assignments:', error);
    } finally {
        await mongoose.disconnect();
    }
}

resetAssignments();
