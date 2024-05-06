const Student = require("../models/studentModel");
const Supervisor = require("../models/supervisorModel");
const {
  calculateCompatibilityScores,
  findOptimalAssignments,
  updateMatches,
} = require("../matching");

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

const runMatchingProcess = async (req, res) => {
  try {
    const supervisors = await fetchSupervisors();
    console.log(`Supervisors: ${supervisors.length}`);
    const students = await fetchStudents();
    console.log(`Students: ${students.length}`);

    const scoresMatrix = calculateCompatibilityScores(supervisors, students);
    const assignments = findOptimalAssignments(scoresMatrix);

    const matchDetails = await updateMatches(
      assignments,
      supervisors,
      students,
      scoresMatrix
    );

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

const resetMatching = async (req, res) => {
  try {
    // Reset assignedSupervisor for all students
    await Student.updateMany({}, { $set: { assignedSupervisor: null } });

    // Reset assignedStudents for all supervisors
    await Supervisor.updateMany({}, { $set: { assignedStudents: [] } });

    res.status(200).json({ message: "All assignments have been reset." });
  } catch (error) {
    console.error("Resetting error:", error);
    res.status(500).json({ error: "Failed to reset assignments." });
  }
};

module.exports = { runMatchingProcess, resetMatching };
