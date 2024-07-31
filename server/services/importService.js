// importService.js
import csv from "csv-parser";
import stream from "stream";
import Faculty from "../models/facultyModel.js";
import Company from "../models/companyModel.js";
import Job from "../models/jobModel.js";
import { signupUser } from "../services/userService.js";

async function getFacultyId(facultyName) {
  const faculty = await Faculty.findOne({ name: facultyName });
  if (!faculty) throw new Error(`Faculty not found: ${facultyName}`);
  return faculty._id;
}

async function getCompanyId(companyName) {
  const company = await Company.findOne({ name: companyName });
  if (!company) throw new Error(`Company not found: ${companyName}`);
  return company._id;
}

async function getJobId(jobTitle) {
  const job = await Job.findOne({ title: jobTitle });
  if (!job) throw new Error(`Job not found: ${jobTitle}`);
  return job._id;
}

function parseCSV(buffer) {
  return new Promise((resolve, reject) => {
    const results = [];
    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);

    bufferStream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

async function importStudents(buffer) {
  const students = await parseCSV(buffer);
  for (const student of students) {
    const { name, faculty, course, company, job } = student;
    try {
      const facultyId = await getFacultyId(faculty);
      const companyId = await getCompanyId(company);
      const jobId = await getJobId(job);

      await signupUser(
        `${name.toLowerCase().replace(/ /g, "")}@sit.edu.sg`,
        "testASD123!@#",
        "student",
        {
          name,
          faculty: facultyId,
          course,
          company: companyId,
          job: jobId,
        }
      );
      console.log(`Successfully imported student: ${name}`);
    } catch (error) {
      console.error(`Failed to import student: ${name}`, error);
    }
  }
}

async function importSupervisors(buffer) {
  const supervisors = await parseCSV(buffer);
  for (const supervisor of supervisors) {
    const { name, faculty, researchArea } = supervisor;
    try {
      const facultyId = await getFacultyId(faculty);

      await signupUser(
        `${name.toLowerCase().replace(/ /g, "")}@sit.edu.sg`,
        "testASD123!@#",
        "supervisor",
        {
          name,
          faculty: facultyId,
          researchArea: researchArea.split(", "),
        }
      );
      console.log(`Successfully imported supervisor: ${name}`);
    } catch (error) {
      console.error(`Failed to import supervisor: ${name}`, error);
    }
  }
}

export { importStudents, importSupervisors };
