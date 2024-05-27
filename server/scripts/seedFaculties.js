import dotenv from "dotenv";
import mongoose from "mongoose";
import Faculty from "../models/facultyModel.js"; // Adjust path as necessary

dotenv.config();

// Ensure connection to the database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

const facultyData = {
  "Food, Chemical and Biotechnology": [
    "Chemical Engineering",
    "Food Technology",
    "Pharmaceutical Engineering",
  ],
  "Infocomm Technology": [
    "Applied Artificial Intelligence",
    "Applied Computing (Fintech)",
    "Computer Engineering",
    "Computer Science in Interactive Media and Game Development",
    "Computer Science in Real-Time Interactive Simulation",
    "Computing Science",
    "Digital Art and Animation",
    "Information and Communications Technology (Information Security)",
    "Information Communications Technology (Software Engineering)",
  ],
};

const seedFaculties = async () => {
  try {
    await Faculty.deleteMany({}); // Optional: Clears the existing faculties

    const facultyPromises = Object.entries(facultyData).map(
      async ([name, courses]) => {
        const faculty = new Faculty({ name, courses });
        await faculty.save();
        console.log(`Faculty seeded: ${name}`);
      }
    );

    await Promise.all(facultyPromises);
    console.log("All faculties have been seeded successfully.");
  } catch (error) {
    console.error("Error seeding faculties:", error);
  } finally {
    mongoose.disconnect();
  }
};

seedFaculties()
  .then(() =>
    mongoose.disconnect().then(() => console.log("MongoDB Disconnected"))
  )
  .catch((error) => {
    console.error("Seeding faculties failed", error);
    mongoose.disconnect().then(() => console.log("MongoDB Disconnected"));
  });
