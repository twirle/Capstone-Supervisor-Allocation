import dotenv from "dotenv";
import mongoose from "mongoose";
import Student from "../models/studentModel.js";
import User from "../models/userModel.js";
import Faculty from "../models/facultyModel.js";
import bcrypt from "bcrypt";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const companies = {
  "Food, Chemical and Biotechnology": [
    "Nestle",
    "PepsiCo",
    "Mondelez",
    "Danone",
    "General Mills",
  ],
  "Infocomm Technology": ["Google", "Microsoft", "Apple", "Amazon", "Facebook"],
};

const jobScopes = {
  "Nestle": ["Food Scientist", "Quality Control", "Research Analyst"],
  "PepsiCo": ["Food Technician", "Quality Assurance", "Product Development"],
  "Mondelez": ["Food Engineer", "Quality Specialist", "Innovation Specialist"],
  "Danone": ["Food Technologist", "Microbiologist", "Production Supervisor"],
  "General Mills": ["Product Developer", "Food Scientist", "Lab Technician"],
  "Google": ["Software Engineer", "Data Analyst", "Cloud Engineer"],
  "Microsoft": ["Developer", "Project Manager", "Business Analyst"],
  "Apple": ["iOS Developer", "UX Designer", "Hardware Engineer"],
  "Amazon": ["Software Developer", "Data Engineer", "Product Manager"],
  "Facebook": ["Data Scientist", "Software Engineer", "Research Scientist"],
};

const clearExistingStudentsAndUsers = async () => {
  await Student.deleteMany({});
  await User.deleteMany({ role: "student" });
  console.log("Cleared existing students and student users.");
};

const fetchFaculties = async () => {
  return await Faculty.find({});
};

const createStudentUser = async (fullName, facultyId, course, companyName, jobScope) => {
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
    company: companyName,
    jobScope: jobScope,
  });
};

const seedStudents = async () => {
  await clearExistingStudentsAndUsers();
  const faculties = await fetchFaculties();
  const totalStudents = 200;
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
    const companyName =
      companies[facultyName][
        Math.floor(Math.random() * companies[facultyName].length)
      ];

    // Select a random job scope for the chosen company
    const jobScope = jobScopes[companyName][
      Math.floor(Math.random() * jobScopes[companyName].length)
    ];

    // Generate a unique name
    const firstNames = [
      "Jason",
      "Maria",
      "Kevin",
      "Sarah",
      "James",
      "Emily",
      "Michael",
      "Rachel",
      "David",
      "Anna",
      "Ella",
      "George",
      "Natalie",
      "Liam",
      "Sophia",
      "John",
      "Amelia",
      "Oliver",
      "Megan",
      "Noah",
      "Emma",
      "Lucas",
      "Chloe",
      "Aiden",
      "Lily",
      "Gabriel",
      "Zoe",
      "Benjamin",
      "Charlotte",
      "Ethan",
      "Ethan",
      "Olivia",
      "Daniel",
      "Harper",
      "Ava",
      "William",
      "Mia",
      "Alexander",
      "Sophia",
      "Evelyn",
      "Benjamin",
      "Amelia",
      "Logan",
      "Abigail",
      "Elijah",
      "Henry",
      "Grace",
      "Emily",
      "Oliver",
      "Charlotte",
      "Samuel",
      "Elizabeth",
      "Michael",
      "Penelope",
      "Jack",
      "Isabella",
      "Lucas",
      "Harper",
      "Aiden",
      "Madison",
    ];

    const lastNames = [
      "Teo",
      "Lim",
      "Tan",
      "Lee",
      "Ong",
      "Ng",
      "Wong",
      "Koh",
      "Goh",
      "Chen",
      "Ho",
      "Low",
      "Yeo",
      "Yeoh",
      "Choo",
      "Foo",
      "Cheong",
      "Soh",
      "Toh",
      "Ang",
      "Kwan",
      "Lau",
      "Phua",
      "Quek",
      "Sia",
      "Tay",
      "Heng",
      "Loh",
      "Chia",
      "Lim",
      "Tan",
      "Koh",
      "Chia",
      "Lim",
      "Yap",
      "Pang",
      "Ng",
      "Koh",
      "Yeo",
      "Tan",
      "Ong",
      "Chong",
      "Tan",
      "Tan",
      "Chan",
      "Lee",
      "Lee",
      "Ho",
      "Wong",
      "Lee",
      "Tan",
      "Tan",
      "Wong",
      "Ng",
      "Lim",
      "Lim",
      "Lee",
      "Chua",
      "Tan",
      "Tan",
      "Ng",
      "Yap",
      "Pang",
      "Chong",
      "Chan",
      "Ho",
      "Wong",
      "Lee",
      "Chua",
    ];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;

    await createStudentUser(fullName, faculty, course, companyName, jobScope);
  }

  console.log(`Inserted ${totalStudents} students successfully.`);
};

seedStudents()
  .then(() => mongoose.disconnect())
  .catch((err) => {
    console.error("Error during student seeding:", err);
    mongoose.disconnect();
  });
