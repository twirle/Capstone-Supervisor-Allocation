import Student from "../models/studentModel.js";
import Supervisor from "../models/supervisorModel.js";
import {
  calculateJaccardScores,
  updateMatchesInDatabase,
} from "../matching/jaccard.js";

async function fetchStudents() {
  return await Student.find({ assignedSupervisor: { $exists: false } })
    .populate("job")
    .exec();
}

async function fetchSupervisors() {
  return await Supervisor.find().exec();
}

const runJaccardMatching = async (req, res) => {
  try {
    const supervisors = await fetchSupervisors();
    const students = await fetchStudents();

    const scoresMatrix = calculateJaccardScores(supervisors, students);
    const bestMatches = scoresMatrix.filter(
      (match) => match.score >= YOUR_DEFINED_THRESHOLD
    ); // Filter matches meeting a minimum score threshold

    await updateMatchesInDatabase(bestMatches);

    res.status(200).json({
      message: "Jaccard matching process completed successfully.",
      matches: bestMatches,
    });
  } catch (error) {
    console.error("Jaccard matching error:", error);
    res.status(500).json({
      error: "An error occurred during the Jaccard matching process.",
    });
  }
};

export { runJaccardMatching };
