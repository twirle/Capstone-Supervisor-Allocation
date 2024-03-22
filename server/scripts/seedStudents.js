require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/studentModel'); // Adjust the path as necessary

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

const studentsToInsert = [];

for (let i = 0; i < 30; i++) {
    const facultyKeys = Object.keys(faculties);
    const faculty = facultyKeys[Math.floor(Math.random() * facultyKeys.length)];
    const course = faculties[faculty][Math.floor(Math.random() * faculties[faculty].length)];

    // Randomly select a first name and a last name
    const firstName = ["Jason", "Maria", "Kevin", "Sarah", "James", "Emily", "Michael", "Rachel", "David", "Anna"][Math.floor(Math.random() * 10)];
    const lastName = ["Teo", "Lim", "Tan", "Lee", "Ong", "Ng", "Wong", "Koh", "Goh", "Chen"][Math.floor(Math.random() * 10)];
    const fullName = `${firstName} ${lastName}`;

    // Randomly select a company name based on the faculty
    const companyName = companies[faculty][Math.floor(Math.random() * companies[faculty].length)];

    const student = new Student({
        name: fullName,
        faculty: faculty,
        course: course,
        company: companyName
    });

    studentsToInsert.push(student.save());
}

Promise.all(studentsToInsert)
    .then(() => {
        console.log('Inserted 30 students successfully');
        mongoose.disconnect();
    })
    .catch(err => {
        console.error(err);
        mongoose.disconnect();
    });
