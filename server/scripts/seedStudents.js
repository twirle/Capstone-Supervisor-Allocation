import dotenv from "dotenv";
import mongoose from "mongoose";
import Student from "../models/studentModel.js";
import User from "../models/userModel.js";
import Faculty from "../models/facultyModel.js";
import Company from "../models/companyModel.js";
import Job from "../models/jobModel.js";
import matchResult from "../models/matchResultModel.js";
import bcrypt from "bcrypt";
import { firstNames, lastNames } from "./text/names.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const clearExistingStudentsAndUsers = async () => {
  await Student.deleteMany({});
  await User.deleteMany({ role: "student" });
  await matchResult.deleteMany({});
  console.log("Cleared existing students and student users.");
};

const fetchFaculties = async () => {
  return await Faculty.find({});
};

const fetchCompanies = async () => {
  return await Company.find({});
};

const fetchJobsForCompany = async (companyId) => {
  return await Job.find({ companyId: companyId });
};

const createStudentUser = async (
  fullName,
  facultyId,
  course,
  companyId,
  jobId
) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("defaultPassword", salt);

  // Keep trying new email suffixes until a unique one is found
  let userEmail = `${fullName.replace(/\s+/g, "").toLowerCase()}@sit.edu.sg`;
  for (
    let suffix = "";
    await User.findOne({ email: userEmail });
    suffix = Math.floor(Math.random() * 10000).toString()
  ) {
    userEmail = `${fullName
      .replace(/\s+/g, "")
      .toLowerCase()}${suffix}@sit.edu.sg`;
  }

  const user = await User.create({
    email: userEmail,
    password: hashedPassword,
    role: "student",
  });

  await Student.create({
    user: user._id,
    name: fullName,
    faculty: facultyId,
    course: course,
    company: companyId,
    job: jobId,
  });
};

const seedStudents = async () => {
  await clearExistingStudentsAndUsers();
  const faculties = await fetchFaculties();
  const companies = await fetchCompanies();
  const totalStudents = 30;
  const allCourses = faculties.reduce(
    (acc, faculty) =>
      acc.concat(
        faculty.courses.map((course) => ({ faculty: faculty._id, course }))
      ),
    []
  );

  for (let i = 0; i < totalStudents; i++) {
    // Select a random course from all courses
    const randomIndex = Math.floor(Math.random() * allCourses.length);
    const { faculty, course } = allCourses[randomIndex];

    // Select a random company based on faculty name
    const facultyName = faculties.find(
      (fac) => fac._id.toString() === faculty.toString()
    ).name;
    const relevantCompanies = companies.filter((company) =>
      facultyName === "Food, Chemical and Biotechnology"
        ? ["Nestle", "PepsiCo", "Mondelez", "Danone", "General Mills"].includes(
            company.name
          )
        : ["Google", "Microsoft", "Apple", "Amazon", "Facebook"].includes(
            company.name
          )
    );
    const company =
      relevantCompanies[Math.floor(Math.random() * relevantCompanies.length)];

    // Select a random job from the chosen company
    const jobs = await fetchJobsForCompany(company._id);

    // Select a random job from the jobs related to the chosen company
    const job = jobs[Math.floor(Math.random() * jobs.length)];

    // Generate a unique name
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;

    await createStudentUser(fullName, faculty, course, company._id, job._id);
  }

  const randomIndex = Math.floor(Math.random() * allCourses.length);
  const { faculty, course } = allCourses[randomIndex];

  // Select a random company based on faculty name
  const testFacultyName = faculties.find(
    (fac) => fac._id.toString() === faculty.toString()
  ).name;
  const relevantCompanies = companies.filter((company) =>
    testFacultyName === "Food, Chemical and Biotechnology"
      ? ["Nestle", "PepsiCo", "Mondelez", "Danone", "General Mills"].includes(
          company.name
        )
      : ["Google", "Microsoft", "Apple", "Amazon", "Facebook"].includes(
          company.name
        )
  );
  const testCompany =
    relevantCompanies[Math.floor(Math.random() * relevantCompanies.length)];
  const testJobs = await fetchJobsForCompany(testCompany._id);
  const testJob = testJobs[Math.floor(Math.random() * testJobs.length)];

  await createStudentUser(
    "Student Test",
    faculty,
    course,
    testCompany._id,
    testJob._id
  );

  console.log(`Inserted ${totalStudents + 1} students successfully.`);
};

seedStudents()
  .then(() => mongoose.disconnect())
  .catch((err) => {
    console.error("Error during student seeding:", err);
    mongoose.disconnect();
  });
