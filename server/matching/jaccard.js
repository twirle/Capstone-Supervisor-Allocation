function jaccardIndex(setA, setB) {
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size; // Jaccard Index = |Intersection| / |Union|
}

function calculateJaccardScores(supervisors, students) {
  let scoresMatrix = [];

  for (let supervisor of supervisors) {
    let supervisorScores = [];
    for (let student of students) {
      // Convert research areas and job tokens into sets
      const supervisorSet = new Set(supervisor.researchAreas);
      const studentSet = new Set(student.tokens);
      let jaccardScore = jaccardIndex(supervisorSet, studentSet);
      supervisorScores.push(jaccardScore);
    }
    scoresMatrix.push(supervisorScores);
  }

  return scoresMatrix;
}

function findBestMatches(scoresMatrix, threshold = 0.5) {
  let matches = [];
  for (let i = 0; i < scoresMatrix.length; i++) {
    for (let j = 0; j < scoresMatrix[i].length; j++) {
      if (scoresMatrix[i][j] >= threshold) {
        matches.push({
          supervisorIndex: i,
          studentIndex: j,
          score: scoresMatrix[i][j],
        });
      }
    }
  }
  // Sort matches by score descending
  return matches.sort((a, b) => b.score - a.score);
}

async function updateMatchesInDatabase(matches, supervisors, students) {
  let updatePromises = [];

  for (let match of matches) {
    const supervisor = supervisors[match.supervisorIndex];
    const student = students[match.studentIndex];

    if (!supervisor || !student) {
      console.error(
        `Missing supervisor or student for match: supervisorIndex=${match.supervisorIndex}, studentIndex=${match.studentIndex}`
      );
      continue;
    }

    // Updating the database with the match
    updatePromises.push(
      student.updateOne({ assignedSupervisor: supervisor._id })
    );
    updatePromises.push(
      supervisor.updateOne({ $push: { assignedStudents: student._id } })
    );
  }

  await Promise.all(updatePromises);
}

export { calculateJaccardScores, findBestMatches, updateMatchesInDatabase };
