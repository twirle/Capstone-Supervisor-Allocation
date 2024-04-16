const Student = require('../models/studentModel');
const Mentor = require('../models/mentorModel');
const { calculateCompatibilityScores, findOptimalAssignments, updateMatches } = require('../matching')

async function fetchStudents() {
    return await Student.find({
        $or: [
            { assignedMentor: { $exists: false } },
            { assignedMentor: null }
        ]
    }).exec();

}

async function fetchMentors() {
    return await Mentor.find().exec();
}


const runMatchingProcess = async (req, res) => {
    try {
        const mentors = await fetchMentors()
        console.log(`Mentors: ${mentors.length}`)
        const students = await fetchStudents()
        console.log(`Students: ${students.length}`)

        const scoresMatrix = calculateCompatibilityScores(mentors, students);
        const assignments = findOptimalAssignments(scoresMatrix);

        const matchDetails = await updateMatches(assignments, mentors, students, scoresMatrix);

        res.status(200).json({
            message: "Matching process completed successfully.",
            scoresMatrix: scoresMatrix,
            matches: matchDetails
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during the matching process.' });
    }
}

const resetMatching = async (req, res) => {
    try {
        // Reset assignedMentor for all students
        await Student.updateMany({}, { $set: { assignedMentor: null } });

        // Reset assignedStudents for all mentors
        await Mentor.updateMany({}, { $set: { assignedStudents: [] } });

        res.status(200).json({ message: "All assignments have been reset." });
    } catch (error) {
        console.error('Resetting error:', error);
        res.status(500).json({ error: 'Failed to reset assignments.' });
    }
}

module.exports = { runMatchingProcess, resetMatching }