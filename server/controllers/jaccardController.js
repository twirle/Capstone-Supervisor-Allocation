import Student from "../models/studentModel.js";
import Supervisor from "../models/supervisorModel.js";
import Job from "../models/jobModel.js";

import {
  calculateJaccardScores,
  updateMatchesInDatabase,
} from "../matching/jaccard.js";

const MATCH_THRESHOLD = 0.01;

async function fetchStudents() {
  const students = await Student.find({
    $or: [
      { assignedSupervisor: { $exists: false } },
      { assignedSupervisor: null },
    ],
  })
    .select("name job")
    .exec();
  return students;
}

async function getJobTokens(jobId) {
  const job = await Job.findById(jobId).select("tokens").exec();
  return job ? job.tokens : [];
}

async function enrichStudentsWithJobTokens(students) {
  return Promise.all(
    students.map(async (student) => {
      const tokens = await getJobTokens(student.job);
      return { ...student.toObject(), tokens }; // Converting mongoose document to object and adding tokens
    })
  );
}

async function fetchSupervisors() {
  return await Supervisor.find().exec();
}

const runJaccardMatching = async (req, res) => {
  try {
    const supervisors = await fetchSupervisors();
    let students = await fetchStudents();
    students = await enrichStudentsWithJobTokens(students);

    students.forEach((student) => {
      console.log(student.name);
      console.log(student.tokens);
    });

    const scoresMatrix = calculateJaccardScores(supervisors, students);
    const bestMatches = scoresMatrix.filter(
      (match) => match.score >= MATCH_THRESHOLD
    );

    // console.log(scoresMatrix);

    await updateMatchesInDatabase(bestMatches, supervisors, students);

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
