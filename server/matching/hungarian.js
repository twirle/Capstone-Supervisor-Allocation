import munkres from "munkres-js";
function oldfindHungarianAssignments(jaccardScores) {
  const maxScore = jaccardScores
    .flat()
    .reduce((max, score) => Math.max(max, score), 0);

  console.log("maxScore:", maxScore);

  const costMatrix = jaccardScores.map((row) =>
    row.map((score) => maxScore - score)
  );

  console.log("findoptimalcostmatrix:", costMatrix);
  const assignments = munkres(costMatrix);

  return assignments;
}

function findHungarianAssignments(jaccardScores) {
  const supervisorCapacity = 10;

  // Find the maximum score in the jaccardScores matrix
  const maxScore = jaccardScores
    .flat()
    .reduce((max, score) => Math.max(max, score), 0);

  // Create the cost matrix by subtracting each score from the maxScore
  const costMatrix = jaccardScores.map((row) =>
    row.map((score) => maxScore - score)
  );

  // Expand the cost matrix based on supervisor capacities
  const expandedCostMatrix = expandCostMatrix(costMatrix, supervisorCapacity);

  // Run Hungarian algorithm to find the optimal assignments
  const assignments = munkres(expandedCostMatrix);

  // Map the assignments back to the original supervisors
  const originalAssignments = mapAssignmentsToOriginal(
    jaccardScores.length,
    supervisorCapacity,
    assignments
  );

  return originalAssignments;
}

function expandCostMatrix(jaccardScores, supervisorCapacity) {
  const expandedCostMatrix = [];
  const numSupervisors = jaccardScores.length;

  for (let supervisor = 0; supervisor < numSupervisors; supervisor++) {
    for (let cap = 0; cap < supervisorCapacity; cap++) {
      expandedCostMatrix.push([...jaccardScores[supervisor]]);
    }
  }
  console.log("expandedCostMatrix", expandedCostMatrix);

  return expandedCostMatrix;
}

function mapAssignmentsToOriginal(
  numSupervisors,
  supervisorCapacity,
  assignments
) {
  const supervisorMatches = [];
  const supervisorCapacities = new Array(numSupervisors).fill(
    supervisorCapacity
  );
  let currentSupervisor = 0;
  let capacityUsed = 0;

  for (const [expandedSupervisor, student] of assignments) {
    while (capacityUsed >= supervisorCapacities[currentSupervisor]) {
      currentSupervisor++;
      capacityUsed = 0;
    }
    supervisorMatches.push([currentSupervisor, student]);
    capacityUsed++;
  }

  return supervisorMatches;
}

export { findHungarianAssignments };
