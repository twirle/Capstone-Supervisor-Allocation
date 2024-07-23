import {
  prepareMatchingData,
  resetMatching,
  calculateJaccardScores,
  simulateMatches,
  updateMatchesInDatabase,
} from "../services/matchService.js";

import { findHungarianAssignments } from "../matching/hungarian.js";
import { findGreedyAssignments } from "../matching/greedy.js";
import { findGaleShapleyAssignments } from "../matching/galeShapley.js";
import { findKMeansAssignments } from "../matching/k-means.js";

const runHungarianMatching = async (req, res) => {
  try {
    const { supervisors, students, supervisorInterestMap } =
      await prepareMatchingData();
    const jaccardScores = calculateJaccardScores(
      supervisors,
      students,
      supervisorInterestMap
    );
    console.log("jaccardScores:", jaccardScores);
    const assignments = findHungarianAssignments(jaccardScores);
    console.log("Assignments:", assignments);
    const matchDetails = simulateMatches(
      assignments,
      supervisors,
      students,
      jaccardScores
    );
    console.log("matchDetails:", matchDetails);

    await updateMatchesInDatabase(
      assignments,
      supervisors,
      students,
      jaccardScores
    );

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

const runGreedyMatching = async (req, res) => {
  try {
    const { supervisors, students, supervisorInterestMap } =
      await prepareMatchingData();
    const jaccardScores = calculateJaccardScores(
      supervisors,
      students,
      supervisorInterestMap
    );
    console.log("jaccardScores:", jaccardScores);
    const assignments = findGreedyAssignments(jaccardScores);
    console.log("greedy assignments", assignments);
    const matchDetails = simulateMatches(
      assignments,
      supervisors,
      students,
      jaccardScores
    );
    console.log("matchDetails:", matchDetails);

    await updateMatchesInDatabase(
      assignments,
      supervisors,
      students,
      jaccardScores
    );

    res.status(200).json({
      message: "Greedy matching process completed successfully.",
      matches: matchDetails,
    });
  } catch (error) {
    console.error("Greedy matching error:".error);
    res.status(500).json({
      error: "An error occurred during the Greedy matching process.",
    });
  }
};

const runGaleShapleyMatch = async (req, res) => {
  try {
    const { supervisors, students, supervisorInterestMap } =
      await prepareMatchingData();
    const jaccardScores = calculateJaccardScores(
      supervisors,
      students,
      supervisorInterestMap
    );
    const assignments = findGaleShapleyAssignments(jaccardScores);
    console.log("gale shapley assignments", assignments);
    const matchDetails = simulateMatches(
      assignments,
      supervisors,
      students,
      jaccardScores
    );
    console.log("matchDetails:", matchDetails);

    await updateMatchesInDatabase(
      assignments,
      supervisors,
      students,
      jaccardScores
    );

    res.status(200).json({
      message: "Gale-Shalpey  matching process completed successfully.",
      matches: matchDetails,
    });
  } catch (error) {
    console.error("Gale-Shalpey matching error:".error);
    res.status(500).json({
      error: "An error occurred during the Gale-Shalpey matching process.",
    });
  }
};

const runKMeansMatch = async (req, res) => {
  try {
    const { supervisors, students, supervisorInterestMap } =
      await prepareMatchingData();
    const jaccardScores = calculateJaccardScores(
      supervisors,
      students,
      supervisorInterestMap
    );
    // const numClusters = Math.min(supervisors.length, students.length);
    const numClusters = 2;
    const assignments = findKMeansAssignments(jaccardScores, numClusters);
    console.log("kMeans assignments", assignments);
    const matchDetails = simulateMatches(
      assignments,
      supervisors,
      students,
      jaccardScores
    );
    console.log("matchDetails:", matchDetails);

    await updateMatchesInDatabase(
      assignments,
      supervisors,
      students,
      jaccardScores
    );

    res.status(200).json({
      message: "kMeans Gale-Shalpey matching process completed successfully.",
      matches: matchDetails,
    });
  } catch (error) {
    console.error("kMeans Gale-Shalpey matching error:".error);
    res.status(500).json({
      error:
        "An error occurred during the kMeans Gale-Shalpey matching process.",
    });
  }
};

export {
  runHungarianMatching,
  runGreedyMatching,
  runGaleShapleyMatch,
  runKMeansMatch,
  resetMatching,
};
