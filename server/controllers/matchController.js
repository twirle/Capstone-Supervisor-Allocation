import {
  prepareMatchingData,
  resetMatching,
  calculateJaccardScores,
  findHungarianAssignments,
  findGreedyAssignments,
  simulateMatches,
  updateMatchesInDatabase,
} from "../services/matchService.js";

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

export { runHungarianMatching, runGreedyMatching, resetMatching };
