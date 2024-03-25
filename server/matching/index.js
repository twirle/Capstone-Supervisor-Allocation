const munkres = require('munkres-js')

function calculateCompatibilityScores(mentors, students) {
    let scoresMatrix = [];
    console.log('Mentor sample:', mentors[0]);
    console.log('Student sample:', students[0]);

    // Iterate through the mentors and students arrays correctly and access each object
    for (let i = 0; i < mentors.length; i++) {
        let mentorScores = [];
        for (let j = 0; j < students.length; j++) {
            let score = 0;
            // Correctly reference the properties of mentors and students
            if (mentors[i].faculty === students[j].faculty) score += 7;
            if (mentors[i].researchArea === students[j].course) score += 10;
            if (mentors[i].faculty !== students[j].faculty) score += 3;
            console.log(`Calculating score for mentor ${mentors[i].name} and student ${students[j].name}:`, score);
            mentorScores.push(score);
        }
        scoresMatrix.push(mentorScores);
    }

    return scoresMatrix;
}




function findOptimalAssignments(scoresMatrix) {
    // The Hungarian algorithm expects a cost matrix, where lower values are preferred.
    // Since your scores are the opposite (higher is better), you'll need to convert
    // scores to costs. One approach is to subtract all scores from a large number that
    // is guaranteed to be larger than any score.
    const maxScore = scoresMatrix.flat().reduce((max, score) => Math.max(max, score), 0);
    const costMatrix = scoresMatrix.map(row => row.map(score => maxScore - score));

    // Apply the Hungarian algorithm to find the optimal assignment.
    const assignments = munkres(costMatrix);

    // `assignments` is an array of [mentorIndex, studentIndex] pairs.
    return assignments;
}

async function updateMatches(assignments, mentors, students) {
    let updatePromises = []; // To collect all update promises
    let matchDetails = []; // To collect match details for logging or response

    for (let [mentorIndex, studentIndex] of assignments) {
        if (mentorIndex >= mentors.length || studentIndex >= students.length) {
            console.error(`Invalid assignment: mentorIndex=${mentorIndex}, studentIndex=${studentIndex}`);
            continue; // Skip invalid assignments
        }

        const mentor = mentors[mentorIndex];
        const student = students[studentIndex];

        if (!mentor || !student) {
            console.error(`Missing mentor or student for assignment: mentorIndex=${mentorIndex}, studentIndex=${studentIndex}`);
            continue; // Skip if mentor or student is missing
        }

        // Update the student model with the assigned mentor's ID
        updatePromises.push(student.updateOne({ assignedMentor: mentor._id }));

        // Update the mentor model by adding the student to the mentor's list of assignedStudents
        // This assumes the mentor model's `assignedStudents` field can store multiple student IDs
        updatePromises.push(mentor.updateOne({ assignedStudents: student._id }));

        // Collect match details for logging or response
        matchDetails.push({
            mentor: mentor.name,
            mentorId: mentor._id.toString(),
            student: student.name,
            studentId: student._id.toString(),
            // Include any additional details you might find relevant
        });
    }

    // Await all updates to finish
    await Promise.all(updatePromises);

    // Log or return the match details
    console.log('Match details:', matchDetails);

    return matchDetails; // Return the details of the matches for logging or review
}

// In your matching/index.js or wherever updateMatches is defined
async function logMatchesWithoutUpdating(assignments, mentors, students) {
    const matchDetails = [];

    for (let [mentorIndex, studentIndex] of assignments) {
        if (mentorIndex >= mentors.length || studentIndex >= students.length) {
            console.error(`Invalid assignment: mentorIndex=${mentorIndex}, studentIndex=${studentIndex}`);
            continue; // Skip invalid assignments
        }

        const mentor = mentors[mentorIndex];
        const student = students[studentIndex];

        if (!mentor || !student) {
            console.error(`Missing mentor or student for assignment: mentorIndex=${mentorIndex}, studentIndex=${studentIndex}`);
            continue; // Skip if mentor or student is missing
        }

        // Log the match without saving it to the database
        console.log(`Match found: Mentor ${mentor.name} (ID: ${mentor._id}) --> Student ${student.name} (ID: ${student._id})`);

        // Collect match details for logging or future use
        matchDetails.push({
            mentor: mentor.name,
            mentorId: mentor._id.toString(),
            student: student.name,
            studentId: student._id.toString(),
            // Include any additional details you might find relevant
        });
    }
    console.log('All match details:', matchDetails)

    return matchDetails; // Return the details of the matches for logging or review
}


module.exports = { calculateCompatibilityScores, findOptimalAssignments, updateMatches, logMatchesWithoutUpdating }