import munkres from "munkres-js";
import SupervisorInterest from "../models/supervisorInterestModel.js";
// calculate jaccard similarity score and prepare for hungarian algorithm

function jaccardIndex(setA, setB) {
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  if (union.size === 0) return 0;
  const score = intersection.size / union.size;
  console.log(
    `Intersection Size: ${intersection.size}, Union Size: ${union.size}, Score: ${score}`
  );
  return score;
}

function calculateJaccardScores(supervisors, students, supervisorInterestMap) {
  let scoresMatrix = [];
  let detailedResults = [];

  for (let supervisor of supervisors) {
    const supervisorSet = new Set(
      supervisor.researchArea.flatMap((area) => splitHashtags(area))
    );
    let supervisorScores = [];
    let supervisorDetails = {
      supervisorName: supervisor.name,
      matches: [],
    };

    for (let student of students) {
      const studentSet = new Set(student.tokens);
      let jaccardScore = jaccardIndex(supervisorSet, studentSet);
      console.log("jaccardScore:", jaccardScore);

      // Construct a unique key to fetch interest score
      const interestKey = `${supervisor._id}_${student.company}_${student.jobTitle}`;
      const interest = supervisorInterestMap.get(interestKey) || "Agreeable"; // Default to 'Agreeable' if not found
      const interestScore = convertInterestToScore(interest);
      console.log("interestScore:", interestScore);

      // Calculate final score by combining Jaccard score with interest score
      const finalScore = jaccardScore * interestScore;
      console.log("finalScore:", finalScore);

      supervisorScores.push(finalScore); // Store combined score in matrix
      supervisorDetails.matches.push({
        studentName: student.name,
        score: finalScore.toFixed(2), // Adjust precision for readability
      });
    }

    scoresMatrix.push(supervisorScores);
    detailedResults.push(supervisorDetails); // Collect detailed results
    console.log("scoresMatrix:", scoresMatrix);
  }

  // Log detailed results
  detailedResults.forEach((supervisorResult) => {
    console.log(
      `Top matches for Supervisor ${supervisorResult.supervisorName}:`
    );
    supervisorResult.matches
      .sort((a, b) => b.score - a.score) // Sort matches by score in descending order
      .forEach((match) =>
        console.log(`   - ${match.studentName}: ${match.score}`)
      );
  });

  return scoresMatrix; // Optionally return the raw scores matrix
}

async function updateMatchesInDatabase(assignments, supervisors, students) {
  let updatePromises = [];

  for (let assignment of assignments) {
    const [supervisorIndex, studentIndex] = assignment; // Correct destructuring
    const supervisor = supervisors[supervisorIndex];
    const student = students[studentIndex];

    if (!supervisor || !student) {
      console.error(
        `Missing supervisor or student for match: supervisorIndex=${supervisorIndex}, studentIndex=${studentIndex}`
      );
      continue;
    }

    updatePromises.push(
      student.updateOne({ assignedSupervisor: supervisor._id }),
      supervisor.updateOne({ $push: { assignedStudents: student._id } })
    );
  }

  await Promise.all(updatePromises);
}

function splitHashtags(tag) {
  return tag
    .replace("#", "")
    .split(/(?=[A-Z0-9])/)
    .join(" ")
    .toLowerCase()
    .split(" ");
}

async function fetchAllSupervisorInterests() {
  const interests = await SupervisorInterest.find({});
  const supervisorInterestMap = new Map();

  interests.forEach((interest) => {
    // Construct a unique key using both the company name and job title
    const key = `${interest.supervisor}_${interest.company}_${interest.jobTitle}`;

    let supervisorMap =
      supervisorInterestMap.get(interest.supervisor) || new Map();
    supervisorMap.set(key, interest.interest);

    // Update the map with the newly added key-value pair
    supervisorInterestMap.set(interest.supervisor, supervisorMap);
  });

  console.log("Supervisor Interest Map:", supervisorInterestMap);
  return supervisorInterestMap;
}

function convertInterestToScore(interest) {
  switch (interest) {
    case "Want to supervise":
      return 1.5;
    case "Agreeable":
      return 1.0;
    case "Conflict of interest":
      return 0.5;
    case "Do not want to supervise":
      return 0.1;
    default:
      return 1.0; // Default case if interest level is unknown
  }
}

function calculateCompatibilityScores(scoreMatrix) {
  // Convert the Jaccard scores to a format suitable for the Hungarian algorithm
  const maxScore = scoreMatrix
    .flat()
    .reduce((max, score) => Math.max(max, score), 0);
  return scoreMatrix.map((row) => row.map((score) => maxScore - score));
}

function findOptimalAssignments(scoresMatrix) {
  const maxScore = scoresMatrix
    .flat()
    .reduce((max, score) => Math.max(max, score), 0);
  console.log("maxScore:", maxScore);
  const costMatrix = scoresMatrix.map((row) =>
    row.map((score) => maxScore - score)
  );

  console.log("findoptimalcostmatrix:", costMatrix);
  const assignments = munkres(costMatrix);

  return assignments;
}

function simulateMatches(assignments, supervisors, students, jaccardScores) {
  let matchDetails = [];
  for (let [supervisorIndex, studentIndex] of assignments) {
    // Check for valid indices
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

    // Ensure you are accessing the score correctly
    const score = jaccardScores[supervisorIndex][studentIndex];
    const detail = {
      Supervisor: supervisor.name,
      Student: student.name,
      Score: score, // Make sure 'score' is correctly retrieved and not undefined
    };
    matchDetails.push(detail);
  }
  return matchDetails;
}

export {
  calculateJaccardScores,
  fetchAllSupervisorInterests,
  calculateCompatibilityScores,
  simulateMatches,
  findOptimalAssignments,
  updateMatchesInDatabase,
};
