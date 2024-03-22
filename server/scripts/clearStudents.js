require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/studentModel'); // Adjust path as necessary

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

const clearStudents = async () => {
    try {
        await Student.deleteMany({});
        console.log('All students have been deleted.');
    } catch (error) {
        console.error('Error clearing student collection:', error);
    } finally {
        mongoose.disconnect();
    }
};

clearStudents();
