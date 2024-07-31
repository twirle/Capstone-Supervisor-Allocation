function createPreferenceLists(jaccardScores) {
  const numSupervisors = jaccardScores.length;
  const numStudents = jaccardScores[0].length;

  const studentPreferences = Array.from({ length: numStudents }, () => []);
  const supervisorPreferences = Array.from(
    { length: numSupervisors },
    () => []
  );

  for (let student = 0; student < numStudents; student++) {
    const scores = jaccardScores.map((row, supervisor) => ({
      supervisor,
      score: row[student],
    }));
    scores.sort((a, b) => b.score - a.score);
    studentPreferences[student] = scores.map((item) => item.supervisor);
  }
  // console.log("studentPreferences", studentPreferences);

  for (let supervisor = 0; supervisor < numSupervisors; supervisor++) {
    const scores = jaccardScores[supervisor].map((score, student) => ({
      student,
      score,
    }));
    scores.sort((a, b) => b.score - a.score);
    supervisorPreferences[supervisor] = scores.map((item) => item.student);
  }
  // console.log("supervisorPreferences", supervisorPreferences);

  return { studentPreferences, supervisorPreferences };
}

function findGaleShapleyAssignments(jaccardScores) {
  const { studentPreferences, supervisorPreferences } =
    createPreferenceLists(jaccardScores);
//   console.log(studentPreferences, supervisorPreferences);

  const supervisorCapacities = new Array(supervisorPreferences.length).fill(10);
  const numStudents = studentPreferences.length;
  const numSupervisors = supervisorPreferences.length;

  const hospitalMatches = Array.from({ length: numSupervisors }, () => []);
  const residentMatches = new Array(numStudents).fill(null);

  const nextProposalIndex = new Array(numStudents).fill(0);

  let freeResidents = Array.from({ length: numStudents }, (_, index) => index);

  while (freeResidents.length > 0) {
    const resident = freeResidents.shift();
    const residentPrefs = studentPreferences[resident];

    // Propose to the next hospital on the resident's preference list
    const hospital = residentPrefs[nextProposalIndex[resident]];
    nextProposalIndex[resident]++;

    hospitalMatches[hospital].push(resident);

    // Sort the hospital's matches according to its preferences
    hospitalMatches[hospital].sort((a, b) => {
      return (
        supervisorPreferences[hospital].indexOf(a) -
        supervisorPreferences[hospital].indexOf(b)
      );
    });

    // If the hospital exceeds its capacity, reject the least preferred resident
    if (hospitalMatches[hospital].length > supervisorCapacities[hospital]) {
      const rejectedResident = hospitalMatches[hospital].pop();
      residentMatches[rejectedResident] = null;
      freeResidents.push(rejectedResident);
    }

    // Update the match for the resident
    residentMatches[resident] = hospital;
  }

  return residentMatches.map((hospital, resident) => [hospital, resident]);
}

export { findGaleShapleyAssignments };
