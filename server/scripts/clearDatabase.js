import dotenv from "dotenv";
import mongoose from "mongoose";
import Student from "../models/studentModel.js"; // Adjust path as necessary
import Supervisor from "../models/supervisorModel.js"; // Make sure to adjust the path as necessary
import User from "../models/userModel.js"; // Adjust path as necessary for the User model
import Faculty from "../models/facultyModel.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

const clearDatabase = async () => {
  try {
    // Delete all student records
    await Student.deleteMany({});
    console.log("All students have been deleted.");

    // Delete all supervisor records
    await Supervisor.deleteMany({});
    console.log("All supervisors have been deleted.");

    // Delete all user records except for admins
    await User.deleteMany({ role: { $ne: "admin" } });
    console.log("All non-admin user accounts have been deleted.");

    // Delete all user records except for admins
    await Faculty.deleteMany({});
    console.log("All faculties have been deleted.");
  } catch (error) {
    console.error("Error clearing collections:", error);
  } finally {
    mongoose.disconnect();
  }
};

clearDatabase();
