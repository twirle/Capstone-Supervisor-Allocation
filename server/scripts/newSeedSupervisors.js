import dotenv from "dotenv";
import mongoose from "mongoose";
import Supervisor from "../models/supervisorModel.js";
import User from "../models/userModel.js";
import Faculty from "../models/facultyModel.js";
import bcrypt from "bcrypt";
import { firstNames, lastNames } from "./text/names.js";
import { facultyHashtags } from "./text/hashtags.js";

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
const createSupervisorUser = async (fullName, facultyId, researchHashtags) => {
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
    researchArea: researchHashtags,
  });
};

// Main function to seed supervisors
const seedSupervisors = async () => {
  await clearExistingSupervisorsAndUsers();
  const faculties = await Faculty.find({});
  const totalSupervisors = 5;

  for (let i = 0; i < totalSupervisors; i++) {
    const facultyIndex = Math.floor(Math.random() * faculties.length);
    const faculty = faculties[facultyIndex];
    const possibleHashtags = facultyHashtags[faculty.name];

    const selectedHashtags = [];
    while (selectedHashtags.length < 3) {
      const randomHashtag =
        possibleHashtags[Math.floor(Math.random() * possibleHashtags.length)];
      if (!selectedHashtags.includes(randomHashtag)) {
        selectedHashtags.push(randomHashtag);
      }
    }

    const fullName = `${
      firstNames[Math.floor(Math.random() * firstNames.length)]
    } ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;

    await createSupervisorUser(fullName, faculty._id, selectedHashtags);
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
