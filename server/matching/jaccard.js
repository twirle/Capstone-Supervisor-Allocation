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
  let bestMatches = [];
  const MATCH_THRESHOLD = 0.01;

  for (let supervisor of supervisors) {
    const supervisorSet = new Set(
      supervisor.researchArea.map((area) => area.replace("#", "").trim())
    );

    for (let student of students) {
      const studentSet = new Set(student.tokens);
      let jaccardScore = jaccardIndex(supervisorSet, studentSet);

      if (jaccardScore >= MATCH_THRESHOLD) {
        // Ensure the score is above the threshold
        bestMatches.push({
          score: jaccardScore,
          supervisorName: supervisor.name,
          studentName: student.name,
          supervisorIndex: supervisors.indexOf(supervisor),
          studentIndex: students.indexOf(student),
        });
      }
    }
  }

  // Sort matches by score in descending order
  bestMatches.sort((a, b) => b.score - a.score);

  // Log the top matches for each supervisor
  supervisors.forEach((supervisor, index) => {
    console.log(`Top matches for Supervisor ${supervisor.name}:`);
    bestMatches
      .filter((match) => match.supervisorIndex === index)
      .slice(0, 10) // Adjust number to show top N matches
      .forEach((match) =>
        console.log(`   - ${match.studentName}: ${match.score.toFixed(2)}`)
      );
  });

  return bestMatches; // Return only the best matches
}

async function updateMatchesInDatabase(matches, supervisors, students) {
  let updatePromises = [];

  for (let match of matches) {
    const supervisor = supervisors[match.supervisorIndex];
    const student = students[match.studentIndex];

    if (!supervisor || !student || !student.updateOne) {
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

export { calculateJaccardScores, updateMatchesInDatabase };
