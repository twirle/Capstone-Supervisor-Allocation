import natural from "natural";
const tokenizer = new natural.WordTokenizer();

function tokenizedScore(supervisorResearchAreas, studentJobScope) {
  const supervisorTokens = supervisorResearchAreas.flatMap((area) =>
    tokenizer.tokenize(area)
  );
  const studentTokens = tokenizer.tokenize(studentJobScope);
  const commonTokens = supervisorTokens.filter((token) =>
    studentTokens.includes(token)
  );
  return commonTokens.length; // Simple scoring based on common token count
}

function tokenizedScore(supervisorResearchAreas, studentJobScope) {
  const supervisorTokens = supervisorResearchAreas.flatMap((area) =>
    tokenizer.tokenize(area)
  );
  const studentTokens = tokenizer.tokenize(studentJobScope);
  const commonTokens = supervisorTokens.filter((token) =>
    studentTokens.includes(token)
  );
  return commonTokens.length; // Simple scoring based on common token count
}

async function updateMatchesInDatabase(
  assignments,
  supervisors,
  students,
  method = "hungarian"
) {
  let updatePromises = [];

  for (let [supervisorIndex, studentIndex] of assignments) {
    const supervisor = supervisors[supervisorIndex];
    const student = students[studentIndex];
    updatePromises.push(
      student.updateOne({
        assignedSupervisor: supervisor._id,
        matchMethod: method,
      })
    );
    updatePromises.push(
      supervisor.updateOne({
        $push: {
          assignedStudents: { student: student._id, matchMethod: method },
        },
      })
    );
  }

  await Promise.all(updatePromises);
}
