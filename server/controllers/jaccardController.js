import Student from "../models/studentModel.js";
import Supervisor from "../models/supervisorModel.js";
import Job from "../models/jobModel.js";

import {
  calculateJaccardScores,
  fetchAllSupervisorInterests,
  calculateCompatibilityScores,
  simulateMatches,
  findOptimalAssignments,
  updateMatchesInDatabase,
} from "../matching/jaccard.js";

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
      student.tokens = tokens;
      return student;
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
    let supervisorInterestMap = await fetchAllSupervisorInterests();

    const jaccardScores = calculateJaccardScores(
      supervisors,
      students,
      supervisorInterestMap
    );
    console.log("jaccardScores:", jaccardScores);
    const assignments = findOptimalAssignments(jaccardScores);
    console.log("Assignments:", assignments);
    const matchDetails = simulateMatches(
      assignments,
      supervisors,
      students,
      jaccardScores
    );
    console.log("matchDetails:", matchDetails);

    await updateMatchesInDatabase(assignments, supervisors, students);
    console.log("update database");

    res.status(200).json({
      message: "Jaccard matching process completed successfully.",
      matches: matchDetails,
    });
  } catch (error) {
    console.error("Jaccard matching error:", error);
    res.status(500).json({
      error: "An error occurred during the Jaccard matching process.",
    });
  }
};

export { runJaccardMatching };
