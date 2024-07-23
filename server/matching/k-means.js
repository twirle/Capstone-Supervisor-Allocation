import { kmeans } from "ml-kmeans";
import { findHungarianAssignments } from "./hungarian.js";

// Utility function to normalize scores
const normalizeScores = (scores) => {
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  return scores.map((score) => (score - minScore) / (maxScore - minScore));
};

// Function to perform K-Means clustering and find assignments
const findKMeansAssignments = (jaccardScores, numClusters) => {
  const numSupervisors = jaccardScores.length;
  const numStudents = jaccardScores[0].length;
  const supervisorCapacity = 10;

  // Flatten and normalize the Jaccard scores for clustering
  const flattenedScores = jaccardScores.flat();
  const normalizedScores = normalizeScores(flattenedScores);
  const features = normalizedScores.map((score, idx) => {
    const supervisorIndex = Math.floor(idx / numStudents);
    const studentIndex = idx % numStudents;
    return [supervisorIndex, studentIndex, score];
  });

  // Perform K-Means clustering
  const { clusters } = kmeans(features, numClusters);
  const assignments = [];
  const assignedStudents = new Set();
  const supervisorCounts = Array(numSupervisors).fill(0);
  console.log("Clusters:", clusters);

  // Match within each cluster using the Hungarian algorithm
  for (let clusterIndex = 0; clusterIndex < numClusters; clusterIndex++) {
    const clusterFeatures = features.filter(
      (_, idx) => clusters[idx] === clusterIndex
    );
    const clusterJaccardScores = Array.from({ length: numSupervisors }, () =>
      Array(numStudents).fill(0)
    );

    clusterFeatures.forEach(([supervisorIndex, studentIndex, score]) => {
      clusterJaccardScores[supervisorIndex][studentIndex] = score;
    });

    const clusterAssignments = findHungarianAssignments(clusterJaccardScores);

    clusterAssignments.forEach(([supervisorIndex, studentIndex]) => {
      if (
        !assignedStudents.has(studentIndex) &&
        supervisorCounts[supervisorIndex] < supervisorCapacity
      ) {
        assignments.push([supervisorIndex, studentIndex]);
        assignedStudents.add(studentIndex);
        supervisorCounts[supervisorIndex]++;
      }
    });

    console.log(
      "Cluster Assignments for Cluster Index",
      clusterIndex,
      ":",
      clusterAssignments
    );
  }

  // Ensure every student gets assigned by distributing remaining students to available supervisors
  for (let studentIndex = 0; studentIndex < numStudents; studentIndex++) {
    if (!assignedStudents.has(studentIndex)) {
      for (
        let supervisorIndex = 0;
        supervisorIndex < numSupervisors;
        supervisorIndex++
      ) {
        if (supervisorCounts[supervisorIndex] < supervisorCapacity) {
          assignments.push([supervisorIndex, studentIndex]);
          assignedStudents.add(studentIndex);
          supervisorCounts[supervisorIndex]++;
          break;
        }
      }
    }
  }

  // Final optimization to improve overall match quality
  const finalAssignments = optimizeFinalAssignments(
    assignments,
    jaccardScores,
    supervisorCapacity
  );
  return finalAssignments;
};

// Function to optimize final assignments across clusters
const optimizeFinalAssignments = (
  assignments,
  jaccardScores,
  supervisorCapacity
) => {
  // Create a score matrix from the assignments
  const scoresMatrix = Array.from({ length: jaccardScores.length }, () =>
    Array(jaccardScores[0].length).fill(0)
  );
  assignments.forEach(([supervisorIndex, studentIndex]) => {
    scoresMatrix[supervisorIndex][studentIndex] =
      jaccardScores[supervisorIndex][studentIndex];
  });

  // Run the Hungarian algorithm on the score matrix to optimize the final assignments
  const optimizedAssignments = findHungarianAssignments(scoresMatrix);

  // Ensure supervisor capacities are respected in the final optimized assignments
  const finalAssignments = [];
  const supervisorCounts = Array(jaccardScores.length).fill(0);
  optimizedAssignments.forEach(([supervisorIndex, studentIndex]) => {
    if (supervisorCounts[supervisorIndex] < supervisorCapacity) {
      finalAssignments.push([supervisorIndex, studentIndex]);
      supervisorCounts[supervisorIndex]++;
    }
  });

  return finalAssignments;
};

export { findKMeansAssignments };
