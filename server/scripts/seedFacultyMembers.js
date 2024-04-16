require('dotenv').config()
const mongoose = require('mongoose')
const FacultyMember = require('../models/facultyMemberModel')
const User = require('../models/userModel')
const Faculty = require('../models/facultyModel')
const { hashPassword } = require('../utils/securityUtils')

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const clearExistingFacultyMembersAndUsers = async () => {
    await FacultyMember.deleteMany({});
    await User.deleteMany({ role: 'facultyMember' });
    console.log('Cleared existing faculty members and faculty member users.');
};

// Function to create a single faculty member user
const createFacultyMemberUser = async (fullName, facultyId) => {
    const hashedPassword = await hashPassword('defaultPassword');
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
        role: 'facultyMember',
    });

    await FacultyMember.create({
        user: user._id,
        name: fullName,
        faculty: facultyId,
    });
};

// Main function to seed faculty members
const seedFacultyMembers = async () => {
    await clearExistingFacultyMembersAndUsers();
    const faculties = await Faculty.find({});

    for (const faculty of faculties) {
        // Generate a unique name for faculty members
        const firstNames = ["Evelyn", "Jordan", "Taylor", "Morgan", "Jamie"];
        const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones"];

        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const fullName = `${firstName} ${lastName}`;

        await createFacultyMemberUser(fullName, faculty._id);
    }

    console.log(`Inserted ${faculties.length} faculty members successfully.`);
};

seedFacultyMembers()
    .then(() => mongoose.disconnect().then(() => console.log('MongoDB Disconnected')))
    .catch(error => {
        console.error('Seeding faculty members failed', error);
        mongoose.disconnect().then(() => console.log('MongoDB Disconnected'));
    });
