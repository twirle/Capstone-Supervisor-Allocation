// UNUSED AFTER INTEGRATION WITH JACCARD TOKENISATION
import Student from "../models/studentModel.js";
import Supervisor from "../models/supervisorModel.js";
import {
  calculateCompatibilityScores,
  findOptimalAssignments,
  simulateMatches,
  updateMatchesInDatabase,
} from "../matching/hungarian.js";

async function fetchStudents() {
  return await Student.find({
    $or: [
      { assignedSupervisor: { $exists: false } },
      { assignedSupervisor: null },
    ],
  }).exec();
}

async function fetchSupervisors() {
  return await Supervisor.find().exec();
}

const runHungarianMatching = async (req, res) => {
  try {
    const supervisors = await fetchSupervisors();
    console.log(`Supervisors: ${supervisors.length}`);
    const students = await fetchStudents();
    console.log(`Students: ${students.length}`);

    const scoresMatrix = calculateCompatibilityScores(supervisors, students);
    const assignments = findOptimalAssignments(scoresMatrix);
    const matchDetails = simulateMatches(
      assignments,
      supervisors,
      students,
      scoresMatrix
    );

    await updateMatchesInDatabase(assignments, supervisors, students);

    res.status(200).json({
      message: "Matching process completed successfully.",
      scoresMatrix: scoresMatrix,
      matches: matchDetails,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred during the matching process." });
  }
};

export { runHungarianMatching };
