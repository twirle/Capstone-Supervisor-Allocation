import dotenv from "dotenv";
import mongoose from "mongoose";
import Supervisor from "../models/supervisorModel.js";
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

const clearExistingSupervisorsAndUsers = async () => {
  await Supervisor.deleteMany({});
  await User.deleteMany({ role: "supervisor" });
  console.log("Cleared existing supervisors and supervisor users.");
};

// Function to create a single supervisor user
const createSupervisorUser = async (fullName, facultyId, researchArea) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("defaultPassword", salt);
  let userEmail = `${fullName.replace(/\s+/g, "").toLowerCase()}@sit.edu.sg`;

  // Create user with unique email
  let counter = 0;
  while (await User.findOne({ email: userEmail })) {
    counter++;
    userEmail = `${fullName
      .replace(/\s+/g, "")
      .toLowerCase()}${counter}@sit.edu.sg`;
  }

  const user = await User.create({
    email: userEmail,
    password: hashedPassword,
    role: "supervisor",
  });

  await Supervisor.create({
    user: user._id,
    name: fullName,
    faculty: facultyId,
    researchArea: researchArea,
  });
};

// Main function to seed supervisors
const seedSupervisors = async () => {
  await clearExistingSupervisorsAndUsers();
  const faculties = await Faculty.find({});
  const totalSupervisors = 50; // Total number of supervisors you want to create
  const allResearchAreas = faculties.reduce(
    (acc, faculty) =>
      acc.concat(
        faculty.courses.map((researchArea) => ({
          faculty: faculty._id,
          researchArea,
        }))
      ),
    []
  );

  for (let i = 0; i < totalSupervisors; i++) {
    // Select a random research area from all research areas
    const randomIndex = Math.floor(Math.random() * allResearchAreas.length);
    const { faculty, researchArea } = allResearchAreas[randomIndex];

    // Generate a unique name
    // Generate a unique name for supervisors
    const firstNames = [
      "Morgan",
      "Taylor",
      "Jordan",
      "Casey",
      "Cameron",
      "Avery",
      "Riley",
      "Alexis",
      "Peyton",
      "Quinn",
      "Jordan",
      "Harper",
      "Reese",
      "Sawyer",
      "Rowan",
      "Dakota",
      "Emerson",
      "Finley",
      "Emery",
      "Aubrey",
      "Charlie",
      "Skyler",
      "Hayden",
      "Jaden",
      "Kendall",
      "Parker",
      "Tatum",
      "Armani",
      "Blair",
      "Dallas",
      "Frankie",
      "Elliot",
      "Phoenix",
      "River",
      "Sage",
      "Shiloh",
      "Spencer",
      "Terry",
      "Jamie",
      "Leslie",
      "Micah",
      "Morgan",
      "Drew",
      "Brett",
      "Carter",
      "Devin",
      "Jessie",
      "Reagan",
      "Robin",
      "Stevie",
    ];

    const lastNames = [
      "Murphy",
      "Kelly",
      "Ryan",
      "Reed",
      "Parker",
      "Campbell",
      "Owen",
      "Brooks",
      "Kennedy",
      "Ellis",
      "Bailey",
      "Collins",
      "Frost",
      "Hudson",
      "Hunter",
      "Jensen",
      "Lane",
      "Logan",
      "Mckenzie",
      "Morgan",
      "Murphy",
      "Perry",
      "Porter",
      "Ray",
      "Reese",
      "Reid",
      "Riley",
      "Ross",
      "Russell",
      "Sanders",
      "Scott",
      "Shaw",
      "Shelby",
      "Sheridan",
      "Simmons",
      "Sloan",
      "Spencer",
      "Tate",
      "Terry",
      "Todd",
      "Tyler",
      "Valentine",
      "Wallace",
      "Watts",
      "Webb",
      "Wells",
      "West",
      "Wilder",
      "Wiley",
      "Winters",
    ];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;

    await createSupervisorUser(fullName, faculty, researchArea);
  }

  console.log(`Inserted ${totalSupervisors} supervisors successfully.`);
};

seedSupervisors()
  .then(() =>
    mongoose.disconnect().then(() => console.log("MongoDB Disconnected"))
  )
  .catch((error) => {
    console.error("Seeding supervisors failed", error);
    mongoose.disconnect().then(() => console.log("MongoDB Disconnected"));
  });
