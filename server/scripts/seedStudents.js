require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/studentModel');
const User = require('../models/userModel');
const Faculty = require('../models/facultyModel');
const bcrypt = require('bcrypt');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const companies = {
    "Food, Chemical and Biotechnology": ["Nestle", "PepsiCo", "Mondelez", "Danone", "General Mills"],
    "Infocomm Technology": ["Google", "Microsoft", "Apple", "Amazon", "Facebook"]
};

const clearExistingStudentsAndUsers = async () => {
    await Student.deleteMany({});
    await User.deleteMany({ role: 'student' });
    console.log('Cleared existing students and student users.');
};

const fetchFaculties = async () => {
    return await Faculty.find({});
};

const createStudentUser = async (fullName, facultyId, course, companyName) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('defaultPassword', salt);

    // Keep trying new email suffixes until a unique one is found
    let userEmail = `${fullName.replace(/\s+/g, '').toLowerCase()}@sit.edu.sg`;
    for (let suffix = ""; await User.findOne({ email: userEmail }); suffix = Math.floor(Math.random() * 10000).toString()) {
        userEmail = `${fullName.replace(/\s+/g, '').toLowerCase()}${suffix}@sit.edu.sg`;
    }

    const user = await User.create({
        email: userEmail,
        password: hashedPassword,
        role: 'student',
    });

    await Student.create({
        user: user._id,
        name: fullName,
        faculty: facultyId,
        course: course,
        company: companyName,
    });
};

const seedStudents = async () => {
    await clearExistingStudentsAndUsers();
    const faculties = await fetchFaculties();
    const totalStudents = 10; // Total number of students you want to create
    const allCourses = faculties.reduce((acc, faculty) => acc.concat(faculty.courses.map(course => ({ faculty: faculty._id, course }))), []);

    for (let i = 0; i < totalStudents; i++) {
        // Select a random course from all courses
        const randomIndex = Math.floor(Math.random() * allCourses.length);
        const { faculty, course } = allCourses[randomIndex];

        // Select a random company based on faculty name
        const facultyName = faculties.find(fac => fac._id.toString() === faculty.toString()).name;
        const companyName = companies[facultyName][Math.floor(Math.random() * companies[facultyName].length)];

        // Generate a unique name
        const firstNames = ["Jason", "Maria", "Kevin", "Sarah", "James", "Emily", "Michael", "Rachel", "David", "Anna"]
        const lastNames = ["Teo", "Lim", "Tan", "Lee", "Ong", "Ng", "Wong", "Koh", "Goh", "Chen"]

        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const fullName = `${firstName} ${lastName}`;

        await createStudentUser(fullName, faculty, course, companyName);
    }

    console.log(`Inserted ${totalStudents} students successfully.`);
};


seedStudents()
    .then(() => mongoose.disconnect())
    .catch(err => {
        console.error('Error during student seeding:', err);
        mongoose.disconnect();
    });
