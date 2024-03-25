require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/studentModel'); // Adjust the path as necessary
const User = require('../models/userModel'); // Adjust the path as necessary
const bcrypt = require('bcrypt');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// Sample faculties and courses
const faculties = {
    "Food, Chemical and Biotechnology": [
        "Chemical Engineering",
        "Food Technology",
        "Pharmaceutical Engineering"
    ],
    "Infocomm Technology": [
        "Applied Artificial Intelligence",
        "Applied Computing (Fintech)",
        "Computer Engineering",
        "Computer Science in Interactive Media and Game Development",
        "Computer Science in Real-Time Interactive Simulation",
        "Computing Science",
        "Digital Art and Animation",
        "Information and Communications Technology (Information Security)",
        "Information Communications Technology (Software Engineering)"
    ]
};

// Companies array for each faculty
const companies = {
    "Food, Chemical and Biotechnology": [
        "Nestle",
        "PepsiCo",
        "Mondelez",
        "Danone",
        "General Mills"
    ],
    "Infocomm Technology": [
        "Google",
        "Microsoft",
        "Apple",
        "Amazon",
        "Facebook"
    ]
};

const usedNames = new Set(); // Track used names to ensure uniqueness
const operations = [];

async function createStudentUser(fullName, faculty, course, companyName) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('defaultPassword', salt);
    const userEmail = `${fullName.replace(/\s+/g, '').toLowerCase()}@example.com`;

    const user = new User({
        email: userEmail,
        password: hashedPassword,
        role: 'student',
    });

    await user.save();

    const student = new Student({
        user: user._id,
        name: fullName,
        faculty: faculty,
        course: course,
        company: companyName,
    });

    await student.save();
}

for (let i = 0; i < 10; i++) {
    let fullName, faculty, course, companyName; // Declare variables outside the do-while loop
    do {
        const facultyKeys = Object.keys(faculties);
        faculty = facultyKeys[Math.floor(Math.random() * facultyKeys.length)];
        course = faculties[faculty][Math.floor(Math.random() * faculties[faculty].length)];

        // Randomly select a first name and a last name
        const firstName = ["Jason", "Maria", "Kevin", "Sarah", "James", "Emily", "Michael", "Rachel", "David", "Anna"][Math.floor(Math.random() * 10)];
        const lastName = ["Teo", "Lim", "Tan", "Lee", "Ong", "Ng", "Wong", "Koh", "Goh", "Chen"][Math.floor(Math.random() * 10)];
        fullName = `${firstName} ${lastName}`;

        // Randomly select a company name based on the faculty
        companyName = companies[faculty][Math.floor(Math.random() * companies[faculty].length)];
    } while (usedNames.has(fullName)); // Keep generating until a unique name is found

    usedNames.add(fullName); // Mark the name as used
    operations.push(createStudentUser(fullName, faculty, course, companyName));
}


Promise.all(operations)
    .then(() => {
        console.log('Inserted 10 students successfully');
        mongoose.disconnect();
    })
    .catch(err => {
        console.error(err);
        mongoose.disconnect();
    });
