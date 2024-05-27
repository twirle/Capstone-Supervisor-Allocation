import dotenv from "dotenv";
import mongoose from "mongoose";
import Student from "../models/studentModel.js";
import Supervisor from "../models/supervisorModel.js";

dotenv.config();

async function resetAssignments() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Reset assignedSupervisor for all students
    await Student.updateMany({}, { $set: { assignedSupervisor: null } });

    // Reset assignedStudents for all supervisors
    // If your supervisor model doesn't directly link to students, adjust this part
    await Supervisor.updateMany({}, { $set: { assignedStudents: [] } });

    console.log("Reset completed successfully.");
  } catch (error) {
    console.error("Error resetting assignments:", error);
  } finally {
    await mongoose.disconnect();
  }
}

resetAssignments();
