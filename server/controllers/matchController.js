const Student = require('../models/studentModel');
const Mentor = require('../models/mentorModel');
const { calculateCompatibilityScores, findOptimalAssignments, updateMatches, logMatchesWithoutUpdating } = require('../matching')

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

        const matchDetails = await updateMatches(assignments, mentors, students);
        // const matchDetails = await logMatchesWithoutUpdating(assignments, mentors, students);
        

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

module.exports = { runMatchingProcess }