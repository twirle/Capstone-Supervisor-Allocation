function findGreedyAssignments(jaccardScores) {
  const assignments = [];
  const supervisorCap = 10;
  const numSupervisors = jaccardScores.length;
  const numStudents = jaccardScores[0].length;
  const supervisorStudentCount = Array(numSupervisors).fill(0);

  // Create an array of all possible [supervisor, student, score] tuples
  const scoreTuples = [];
  for (let i = 0; i < numSupervisors; i++) {
    for (let j = 0; j < numStudents; j++) {
      scoreTuples.push([i, j, jaccardScores[i][j]]);
    }
  }

  // Sort the tuples by score in descending order
  scoreTuples.sort((a, b) => b[2] - a[2]);
  console.log("scoreTuples", scoreTuples);

  // Track assigned students to avoid multiple assignments
  const assignedStudents = new Set();
  let rounds = 0;

  // Assign students to supervisors based on highest scores first
  for (const [supervisor, student, score] of scoreTuples) {
    rounds++;
    if (
      supervisorStudentCount[supervisor] < supervisorCap &&
      !assignedStudents.has(student)
    ) {
      assignments.push([supervisor, student]);
      supervisorStudentCount[supervisor]++;
      assignedStudents.add(student);
    }
    // console.log("assignedStudents:", assignedStudents);

    // break if all students are already assigned
    if (assignedStudents.size === numStudents) {
      break;
    }
  }
  console.log("total rounds:", rounds);

  return assignments;
}

export { findGreedyAssignments };
