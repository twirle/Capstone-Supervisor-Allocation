function jaccardIndex(setA, setB) {
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  if (union.size === 0) return 0;
  const score = intersection.size / union.size;
  console.log(
    `Intersection Size: ${intersection.size}, Union Size: ${union.size}, Score: ${score}`
  );
  return score;
}

function calculateJaccardScores(supervisors, students) {
  let scoresMatrix = [];

  for (let supervisor of supervisors) {
    // console.log("Supervisor Research Areas:", supervisor.researchArea);
    const supervisorSet = new Set(
      supervisor.researchArea.map((area) => area.replace("#", "").trim())
    );

    let supervisorScores = [];
    console.log("Supervisor Research Areas:", Array.from(supervisorSet)); // Ensure correct formatting

    for (let student of students) {
      // const supervisorSet = new Set(supervisor.researchArea);
      // console.log("supervisorSet", supervisorSet);
      const studentSet = new Set(student.tokens);
      console.log(`${student.name} Tokens:`, Array.from(studentSet)); // Ensure tokens are correct

      let jaccardScore = jaccardIndex(supervisorSet, studentSet);
      console.log(
        `Jaccard Score for ${supervisor.name} and ${student.name}:`,
        jaccardScore
      );

      supervisorScores.push({
        score: jaccardScore,
        supervisorIndex: supervisors.indexOf(supervisor),
        studentIndex: students.indexOf(student),
      });
    }
    scoresMatrix.push(supervisorScores);
    // console.log(scoresMatrix);
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
