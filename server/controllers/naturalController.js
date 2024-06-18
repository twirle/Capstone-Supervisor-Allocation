import Student from "../models/studentModel.js";
import Supervisor from "../models/supervisorModel.js";
import {
  tokenizeText,
  calculateTokenScores,
  updateMatches,
} from "../matching/natural.js";

async function runTokenizationMatching(req, res) {
  try {
    const supervisors = await Supervisor.find().exec();
    const students = await Student.find({
      $or: [
        { assignedSupervisor: { $exists: false } },
        { assignedSupervisor: null },
      ],
    }).exec();

    // Assume tokenizeText and calculateTokenScores are functions you'll define to handle tokenization and scoring
    const tokenizedData = tokenizeText(supervisors, students);
    const scoresMatrix = calculateTokenScores(tokenizedData);

    // Assume updateMatches will handle the database update logic
    const matches = updateMatches(scoresMatrix);

    res.status(200).json({
      message: "Tokenization matching process completed successfully.",
      matches,
    });
  } catch (error) {
    console.error("Tokenization matching error:", error);
    res.status(500).json({
      error: "An error occurred during the tokenization matching process.",
    });
  }
}

async function resetTokenizationMatching(req, res) {
  // Reset logic here...
}

export { runTokenizationMatching, resetTokenizationMatching };
