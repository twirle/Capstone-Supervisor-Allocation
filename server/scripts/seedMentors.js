require('dotenv').config();
const mongoose = require('mongoose');
const Mentor = require('../models/mentorModel');
const User = require('../models/userModel');
const Faculty = require('../models/facultyModel');
const bcrypt = require('bcrypt');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const clearExistingMentorsAndUsers = async () => {
    await Mentor.deleteMany({});
    await User.deleteMany({ role: 'mentor' });
    console.log('Cleared existing mentors and mentor users.');
};

// Function to create a single mentor user
const createMentorUser = async (fullName, facultyId, researchArea) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('defaultPassword', salt);
    let userEmail = `${fullName.replace(/\s+/g, '').toLowerCase()}@sit.edu.sg`;

    // Create user with unique email
    let counter = 0;
    while (await User.findOne({ email: userEmail })) {
        counter++;
        userEmail = `${fullName.replace(/\s+/g, '').toLowerCase()}${counter}@sit.edu.sg`;
    }

    const user = await User.create({
        email: userEmail,
        password: hashedPassword,
        role: 'mentor',
    });

    await Mentor.create({
        user: user._id,
        name: fullName,
        faculty: facultyId,
        researchArea: researchArea,
    });
};

// Main function to seed mentors
const seedMentors = async () => {
    await clearExistingMentorsAndUsers();
    const faculties = await Faculty.find({});
    const totalMentors = 10; // Total number of mentors you want to create
    const allResearchAreas = faculties.reduce((acc, faculty) => acc.concat(faculty.courses.map(researchArea => ({ faculty: faculty._id, researchArea }))), []);

    for (let i = 0; i < totalMentors; i++) {
        // Select a random research area from all research areas
        const randomIndex = Math.floor(Math.random() * allResearchAreas.length);
        const { faculty, researchArea } = allResearchAreas[randomIndex];

        // Generate a unique name
        // Generate a unique name for mentors
        const firstNames = ["Morgan", "Taylor", "Jordan", "Casey", "Cameron", "Avery", "Riley", "Alexis", "Peyton", "Quinn"];
        const lastNames = ["Murphy", "Kelly", "Ryan", "Reed", "Parker", "Campbell", "Owen", "Brooks", "Kennedy", "Ellis"];

        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const fullName = `${firstName} ${lastName}`;

        await createMentorUser(fullName, faculty, researchArea);
    }

    console.log(`Inserted ${totalMentors} mentors successfully.`);
};


seedMentors()
    .then(() => mongoose.disconnect().then(() => console.log('MongoDB Disconnected')))
    .catch(error => {
        console.error('Seeding mentors failed', error);
        mongoose.disconnect().then(() => console.log('MongoDB Disconnected'));
    });