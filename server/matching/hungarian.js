import munkres from "munkres-js";
function findHungarianAssignments(jaccardScores) {
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

export { findHungarianAssignments };
