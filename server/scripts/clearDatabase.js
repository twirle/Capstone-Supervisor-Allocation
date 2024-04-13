require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/studentModel'); // Adjust path as necessary
const Mentor = require('../models/mentorModel'); // Make sure to adjust the path as necessary
const User = require('../models/userModel'); // Adjust path as necessary for the User model

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

const clearDatabase = async () => {
    try {
        // Delete all student records
        await Student.deleteMany({});
        console.log('All students have been deleted.');

        // Delete all mentor records
        await Mentor.deleteMany({});
        console.log('All mentors have been deleted.');

        // Delete all user records except for admins
        await User.deleteMany({ role: { $ne: 'admin' }});
        console.log('All non-admin user accounts have been deleted.');
    } catch (error) {
        console.error('Error clearing collections:', error);
    } finally {
        mongoose.disconnect();
    }
};

clearDatabase();
