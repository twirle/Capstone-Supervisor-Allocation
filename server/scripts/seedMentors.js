require('dotenv').config();
const mongoose = require('mongoose');
const Mentor = require('../models/mentorModel');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// Sample faculties and research areas
const faculties = {
    "Infocomm Technology": ["Blockchain", "Cybersecurity", "Artificial Intelligence"],
    "Food, Chemical and Biotechnology": ["Food Processing", "Biomedical Engineering", "Chemical Synthesis"]
};

const usedNames = new Set(); // Track used names to ensure uniqueness
const operations = [];

async function createMentorUser(fullName, faculty, researchArea) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('defaultPassword', salt);
    const userEmail = `${fullName.replace(' ', '').toLowerCase()}@example.com`;

    const user = new User({
        email: userEmail,
        password: hashedPassword,
        role: 'mentor',
    });

    await user.save();

    const mentor = new Mentor({
        user: user._id,
        name: fullName,
        faculty: faculty,
        researchArea: researchArea,
    });

    await mentor.save();
}

for (let i = 0; i < 10; i++) {
    let fullName, faculty, researchArea; // Declare variables outside the do-while loop
    do {
        const facultyKeys = Object.keys(faculties);
        faculty = facultyKeys[Math.floor(Math.random() * facultyKeys.length)];
        researchArea = faculties[faculty][Math.floor(Math.random() * faculties[faculty].length)];

        // Randomly select a first name and a last name
        const firstName = ["John", "Jane", "Chris", "Pat", "Alex", "Taylor", "Jordan", "Casey", "Morgan", "Jamie"][Math.floor(Math.random() * 10)];
        const lastName = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor"][Math.floor(Math.random() * 10)];
        fullName = `${firstName} ${lastName}`;
    } while (usedNames.has(fullName)); // Keep generating until a unique name is found

    usedNames.add(fullName); // Mark the name as used
    operations.push(createMentorUser(fullName, faculty, researchArea));
}

Promise.all(operations)
    .then(() => {
        console.log('Inserted 10 mentors successfully');
        mongoose.disconnect();
    })
    .catch(err => {
        console.error(err);
        mongoose.disconnect();
    });
