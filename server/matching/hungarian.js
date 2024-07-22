// OLD PAGE: NOT IN USE, THE HUNGARIAN PARTS BEING USED ARE IN jaccard.js
import munkres from "munkres-js";

function calculateCompatibilityScores(supervisors, students) {
  let scoresMatrix = [];

  for (let i = 0; i < supervisors.length; i++) {
    let supervisorScores = [];
    for (let j = 0; j < students.length; j++) {
      let score = 0;

      if (supervisors[i].researchArea === students[j].course) {
        score += 10;
      } else if (supervisors[i].faculty.equals(students[j].faculty)) {
        score += 5;
      } else {
        score += 1;
      }

      supervisorScores.push(score);
    }
    scoresMatrix.push(supervisorScores);
  }

  return scoresMatrix;
}

function findOptimalAssignments(scoresMatrix) {
  const maxScore = scoresMatrix
    .flat()
    .reduce((max, score) => Math.max(max, score), 0);
  const costMatrix = scoresMatrix.map((row) =>
    row.map((score) => maxScore - score)
  );
  const assignments = munkres(costMatrix);

  return assignments;
}

function simulateMatches(assignments, supervisors, students, scoresMatrix) {
  let matchDetails = [];

  let sameFacultyCount = 0;
  let differentFacultyCount = 0;
  let researchAreaMatchCount = 0;
  let totalCost = 0;

  const maxScore = scoresMatrix
    .flat()
    .reduce((max, score) => Math.max(max, score), 0);

  for (let [supervisorIndex, studentIndex] of assignments) {
    if (
      supervisorIndex >= supervisors.length ||
      studentIndex >= students.length
    ) {
      console.error(
        `Invalid assignment: supervisorIndex=${supervisorIndex}, studentIndex=${studentIndex}`
      );
      continue;
    }

    const supervisor = supervisors[supervisorIndex];
    const student = students[studentIndex];

    let score = scoresMatrix[supervisorIndex][studentIndex];
    let matchCost = maxScore - score;
    totalCost += matchCost;

    if (!supervisor || !student) {
      console.error(
        `Missing supervisor or student for assignment: supervisorIndex=${supervisorIndex}, studentIndex=${studentIndex}`
      );
      continue;
    }

    if (supervisor.faculty.equals(student.faculty)) {
      sameFacultyCount++;
    } else {
      differentFacultyCount++;
    }
    if (supervisor.researchArea === student.course) {
      researchAreaMatchCount++;
    }

    matchDetails.push({
      "Supervisor + Student": `${supervisor.name} + ${student.name}`,
      Details: `Research Area: ${supervisor.researchArea}, Course: ${student.course}`,
      "Match Cost": matchCost,
    });
  }

  console.log("Statistics:");
  console.log(`Same faculty pairs: ${sameFacultyCount}`);
  console.log(`Different faculty pairs: ${differentFacultyCount}`);
  console.log(`Research area matches course: ${researchAreaMatchCount}`);
  console.log(`Total cost of matching: ${totalCost}`);
  console.table(matchDetails);

  return matchDetails;
}

async function updateMatchesInDatabase(assignments, supervisors, students) {
  let updatePromises = [];

  for (let [supervisorIndex, studentIndex] of assignments) {
    if (
      supervisorIndex >= supervisors.length ||
      studentIndex >= students.length
    ) {
      console.error(
        `Invalid assignment: supervisorIndex=${supervisorIndex}, studentIndex=${studentIndex}`
      );
      continue;
    }

    const supervisor = supervisors[supervisorIndex];
    const student = students[studentIndex];

    if (!supervisor || !student) {
      console.error(
        `Missing supervisor or student for assignment: supervisorIndex=${supervisorIndex}, studentIndex=${studentIndex}`
      );
      continue;
    }

    updatePromises.push(
      student.updateOne({ assignedSupervisor: supervisor._id })
    );
    updatePromises.push(
      supervisor.updateOne({ $push: { assignedStudents: student._id } })
    );
  }

  await Promise.all(updatePromises);
}

export // calculateCompatibilityScores,
// findOptimalAssignments,
// simulateMatches,
// updateMatchesInDatabase,
 {};
