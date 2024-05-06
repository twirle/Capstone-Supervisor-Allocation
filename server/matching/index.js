const munkres = require('munkres-js')

function calculateCompatibilityScores(supervisors, students) {
    let scoresMatrix = [];
    // console.log('Supervisor sample:', supervisors[0]);
    // console.log('Student sample:', students[0]);

    for (let i = 0; i < supervisors.length; i++) {
        let supervisorScores = [];
        for (let j = 0; j < students.length; j++) {
            let score = 0;

            // Check if the student's course matches the supervisor's research area.
            if (supervisors[i].researchArea === students[j].course) {
                // Highest score for a direct match in research area and course.
                score += 10;
            } else if (supervisors[i].faculty.equals(students[j].faculty)) {
                // Moderate score for being in the same faculty but no direct match in research area.
                score += 5;
            } else {
                // Lowest score for not being in the same faculty.
                score += 1;
            }

            console.log(`Calculating score for supervisor ${supervisors[i].name} and student ${students[j].name}:`, score);
            supervisorScores.push(score);
        }
        scoresMatrix.push(supervisorScores);
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

    // `assignments` is an array of [supervisorIndex, studentIndex] pairs.
    return assignments;
}

async function updateMatches(assignments, supervisors, students, scoresMatrix) {
    let updatePromises = []
    let matchDetails = []

    let sameFacultyCount = 0;
    let differentFacultyCount = 0;
    let researchAreaMatchCount = 0;
    let totalCost = 0

    const maxScore = scoresMatrix.flat().reduce((max, score) => Math.max(max, score), 0)

    for (let [supervisorIndex, studentIndex] of assignments) {
        if (supervisorIndex >= supervisors.length || studentIndex >= students.length) {
            console.error(`Invalid assignment: supervisorIndex=${supervisorIndex}, studentIndex=${studentIndex}`);
            continue; // Skip invalid assignments
        }

        const supervisor = supervisors[supervisorIndex];
        const student = students[studentIndex];

        let score = scoresMatrix[supervisorIndex][studentIndex];
        let matchCost = maxScore - score; // Convert score back to cost for this pair
        totalCost += matchCost;


        if (!supervisor || !student) {
            console.error(`Missing supervisor or student for assignment: supervisorIndex=${supervisorIndex}, studentIndex=${studentIndex}`);
            continue; // Skip if supervisor or student is missing
        }

        // Update the student model with the assigned supervisor's ID
        updatePromises.push(student.updateOne({ assignedSupervisor: supervisor._id }));

        // Update the supervisor model by adding the student to the supervisor's list of assignedStudents
        updatePromises.push(supervisor.updateOne({ $push: { assignedStudents: student._id } }));

        // Calculate statistics
        if (supervisor.faculty.equals(student.faculty)) {
            sameFacultyCount++;
        } else {
            differentFacultyCount++;
        }
        if (supervisor.researchArea === student.course) {
            researchAreaMatchCount++;
        }

        // Collect match details for logging or response
        matchDetails.push({
            "Supervisor + Student": `${supervisor.name} + ${student.name}`,
            "Details": `Research Area: ${supervisor.researchArea}, Course: ${student.course}`,
            "Match Cost": matchCost
        });
    }

    // Await all updates to finish
    await Promise.all(updatePromises);

    // Display the match details in table form
    console.log('Statistics:');
    console.log(`Same faculty pairs: ${sameFacultyCount}`);
    console.log(`Different faculty pairs: ${differentFacultyCount}`);
    console.log(`Research area matches course: ${researchAreaMatchCount}`);
    console.log(`Total cost of matching: ${totalCost}`);
    console.table(matchDetails);

    return matchDetails
}


module.exports = { calculateCompatibilityScores, findOptimalAssignments, updateMatches }