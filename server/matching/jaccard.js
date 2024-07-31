import SupervisorInterest from "../models/supervisorInterestModel.js";
import matchResult from "../models/matchResultModel.js";
import Company from "../models/companyModel.js";
import Job from "../models/jobModel.js";

// calculate jaccard similarity score and prepare for hungarian algorithm
function jaccardIndex(setA, setB) {
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  if (union.size === 0) return 0;
  const score = intersection.size / union.size;
  // console.log(
  //   `Intersection Size: ${intersection.size}, Union Size: ${union.size}, Score: ${score}`
  // );
  return score;
}

function calculateJaccardScores(supervisors, students, supervisorInterestMap) {
  let scoresMatrix = [];
  let detailedResults = [];

  for (let supervisor of supervisors) {
    const supervisorSet = new Set(
      supervisor.researchArea.flatMap((area) => splitHashtags(area))
    );
    console.log("supervisorSet", supervisorSet);

    const supervisorId = supervisor.user.toString();
    console.log("Supervisor user in loop:", supervisorId);
    let supervisorScores = [];
    let supervisorDetails = {
      supervisorName: supervisor.name,
      matches: [],
    };

    for (let student of students) {
      const studentSet = new Set(student.tokens);
      let jaccardScore = jaccardIndex(supervisorSet, studentSet);
      console.log("jaccardScore:", jaccardScore);

      // Ensure student.company and student.job are IDs
      if (!student.company || !student.job) {
        console.error(`Missing company or job for student: ${student.name}`);
        continue; // Skip this student if data is incomplete
      }

      // Construct a unique key to fetch interest score
      const interestKey = `${supervisorId}_${student.company}_${student.job}`;
      console.log('Constructed interestKey:', interestKey);

      const interest = supervisorInterestMap.get(interestKey) || "Agreeable"; // Default to 'Agreeable' if not found
      console.log('Retrieved interest:', interest);

      const interestScore = convertInterestToScore(interest);
      console.log("interestScore:", interestScore);

      // Calculate final score by combining Jaccard score with interest score
      const finalScore = jaccardScore * interestScore;
      console.log("finalScore:", finalScore);

      supervisorScores.push(finalScore); // Store combined score in matrix
      supervisorDetails.matches.push({
        studentName: student.name,
        score: finalScore.toFixed(2), // Adjust precision for readability
      });
    }

    scoresMatrix.push(supervisorScores);
    detailedResults.push(supervisorDetails); // Collect detailed results
  }

  // Log detailed results
  detailedResults.forEach((supervisorResult) => {
    supervisorResult.matches
      .sort((a, b) => b.score - a.score); // Sort matches by score in descending order
  });

  return scoresMatrix; // Optionally return the raw scores matrix
}

async function updateMatchesInDatabase(
  assignments,
  supervisors,
  students,
  scores
) {
  let updatePromises = [];

  for (let assignment of assignments) {
    const [supervisorIndex, studentIndex] = assignment; // Correct destructuring
    const supervisor = supervisors[supervisorIndex];
    const student = students[studentIndex];
    const score = scores[supervisorIndex][studentIndex];

    if (!supervisor || !student) {
      console.error(
        `Missing supervisor or student for match: supervisorIndex=${supervisorIndex}, studentIndex=${studentIndex}`
      );
      continue;
    }

    updatePromises.push(
      student.updateOne({ assignedSupervisor: supervisor._id }),
      supervisor.updateOne({ $push: { assignedStudents: student._id } }),
      new matchResult({
        supervisor: supervisor._id,
        student: student._id,
        score,
      }).save()
    );
  }

  await Promise.all(updatePromises);
}

function splitHashtags(tag) {
  return tag
    .replace("#", "")
    .split(/(?=[A-Z0-9])/)
    .join(" ")
    .toLowerCase()
    .split(" ");
}

// async function fetchAllSupervisorInterests() {
//   const interests = await SupervisorInterest.find({});
//   console.log("interests", interests);
//   const supervisorInterestMap = new Map();

//   interests.forEach((interest) => {
//     // Construct a unique key using both the company name and job title
//     const key = `${interest.supervisor}_${interest.company._id}_${interest.job._id}`;
//     console.log("key", key);

//     let supervisorMap =
//       supervisorInterestMap.get(interest.supervisor) || new Map();
//     supervisorMap.set(key, interest.interest);

//     // Update the map with the newly added key-value pair
//     supervisorInterestMap.set(interest.supervisor, supervisorMap);
//   });

//   console.log("Supervisor Interest Map:", supervisorInterestMap);
//   return supervisorInterestMap;
// }

async function fetchAllSupervisorInterests() {
  try {
    const interests = await SupervisorInterest.find({});

    // Fetch all companies and jobs to create a map of names to IDs
    const companies = await Company.find({}).select('_id name').exec();
    const jobs = await Job.find({}).select('_id title').exec();

    const companyMap = new Map();
    const jobMap = new Map();

    companies.forEach(company => {
      companyMap.set(company.name, company._id.toString());
    });

    jobs.forEach(job => {
      jobMap.set(job.title, job._id.toString());
    });

    // Map interests with resolved company and job IDs
    const supervisorInterestMap = new Map();
    interests.forEach(interest => {
      const key = `${interest.supervisor.toString()}_${companyMap.get(interest.company)}_${jobMap.get(interest.jobTitle)}`;
      console.log("Key being added to map:", key);
      supervisorInterestMap.set(key, interest.interest);
    });

    console.log("Supervisor Interest Map:", supervisorInterestMap);
    return supervisorInterestMap;
  } catch (error) {
    console.error('Error fetching supervisor interests:', error);
    return new Map();
  }
}

function convertInterestToScore(interest) {
  switch (interest) {
    case "Want to supervise":
      return 1.5;
    case "Agreeable":
      return 1.0;
    case "Conflict of interest":
      return 0.5;
    case "Do not want to supervise":
      return 0.1;
    default:
      return 1.0; // Default case if interest level is unknown
  }
}

function simulateMatches(assignments, supervisors, students, jaccardScores) {
  let matchDetails = [];
  for (let [supervisorIndex, studentIndex] of assignments) {
    // Check for valid indices
    if (
      supervisorIndex >= supervisors.length ||
      studentIndex >= students.length
    ) {
      console.error(
        `Invalid assignment: supervisorIndex=${supervisorIndex}, studentIndex=${studentIndex}`
      );
      continue;
    }

    const supervisor = supervisors[supervisorIndex];
    const student = students[studentIndex];
    if (!supervisor || !student) {
      console.error(
        `Missing supervisor or student for assignment: supervisorIndex=${supervisorIndex}, studentIndex=${studentIndex}`
      );
      continue;
    }

    // Ensure you are accessing the score correctly
    const score = jaccardScores[supervisorIndex][studentIndex];
    const detail = {
      Supervisor: supervisor.name,
      Student: student.name,
      Score: score, // Make sure 'score' is correctly retrieved and not undefined
    };
    matchDetails.push(detail);
  }
  return matchDetails;
}

export {
  calculateJaccardScores,
  fetchAllSupervisorInterests,
  simulateMatches,
  updateMatchesInDatabase,
};
