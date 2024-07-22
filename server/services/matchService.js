import Student from "../models/studentModel.js";
import Supervisor from "../models/supervisorModel.js";
import Job from "../models/jobModel.js";
import matchResult from "../models/matchResultModel.js";

import {
  calculateJaccardScores,
  fetchAllSupervisorInterests,
  simulateMatches,
  findHungarianAssignments,
  updateMatchesInDatabase,
} from "../matching/jaccard.js";

import { findGreedyAssignments } from "../matching/greedy.js";

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

async function enrichStudentsWithJobTokens(students) {
  return Promise.all(
    students.map(async (student) => {
      const tokens = await getJobTokens(student.job);
      student.tokens = tokens;
      return student;
    })
  );
}

async function getJobTokens(jobId) {
  const job = await Job.findById(jobId).select("tokens").exec();
  return job ? job.tokens : [];
}

async function fetchSupervisors() {
  return await Supervisor.find().exec();
}

async function prepareMatchingData() {
  const supervisors = await fetchSupervisors();
  let students = await fetchStudents();
  students = await enrichStudentsWithJobTokens(students);
  let supervisorInterestMap = await fetchAllSupervisorInterests();
  return { supervisors, students, supervisorInterestMap };
}

const resetMatching = async (req, res) => {
  try {
    // Reset assignedSupervisor for all students
    await Student.updateMany({}, { $set: { assignedSupervisor: null } });

    // Reset assignedStudents for all supervisors
    await Supervisor.updateMany({}, { $set: { assignedStudents: [] } });
    await matchResult.deleteMany({});

    res.status(200).json({ message: "All assignments have been reset." });
  } catch (error) {
    console.error("Resetting error:", error);
    res.status(500).json({ error: "Failed to reset assignments." });
  }
};

export {
  prepareMatchingData,
  resetMatching,
  calculateJaccardScores,
  findHungarianAssignments,
  findGreedyAssignments,
  simulateMatches,
  updateMatchesInDatabase,
};
