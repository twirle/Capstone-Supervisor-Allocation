require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/studentModel')
const Supervisor = require('../models/supervisorModel')

async function resetAssignments() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Reset assignedSupervisor for all students
        await Student.updateMany({}, { $set: { assignedSupervisor: null } });

        // Reset assignedStudents for all supervisors
        // If your supervisor model doesn't directly link to students, adjust this part
        await Supervisor.updateMany({}, { $set: { assignedStudents: [] } });

        console.log('Reset completed successfully.');
    } catch (error) {
        console.error('Error resetting assignments:', error);
    } finally {
        await mongoose.disconnect();
    }
}

resetAssignments();
