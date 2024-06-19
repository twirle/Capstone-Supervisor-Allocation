import Student from "../models/studentModel.js";
import Faculty from "../models/facultyModel.js";
import Company from "../models/companyModel.js";
import mongoose from "mongoose";

// get all Students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find({})
      .sort({ createdAt: -1 })
      .populate("user", "email")
      .populate("faculty", "name")
      .populate("assignedSupervisor", "name")
      .populate("company", "name")
      .populate("job", "title scope");

    // console.log("Students with populated data:", students);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get a single Student with access control
const getStudent = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(404).json({ error: "Invalid user ID" });
  }

  const student = await Student.findOne({ user: userId })
    .populate("user", "email")
    .populate("faculty", "name")
    .populate("assignedSupervisor", "name")
    .populate("company", "name")
    .populate("job", "title scope");

  if (!student) {
    return res
      .status(404)
      .json({ error: "No student found with this user ID" });
  }

  // Check if the requesting user is the student themselves or an admin
  if (student._id.toString() !== req.user.id && req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Not authorized to access this student" });
  }

  res.status(200).json(student);
};

// update a Student
const updateStudent = async (req, res) => {
  const { userId } = req.params;
  console.log(`Attempting to update student with ID: ${userId}`);
  const updateData = req.body;

  try {
    const student = await Student.findOneAndUpdate(
      { user: userId },
      updateData,
      { new: true }
    ).populate("user faculty company job assignedSupervisor");
    if (!student) {
      console.error(`No student found with ID: ${userId}`);
      return res.status(404).json({ error: "No such student" });
    }
    // console.log(`Updated student: ${student}`);
    res.status(200).json(student);
  } catch (error) {
    console.error(`Error updating supervisor: ${error}`);
    res.status(400).json({ error: error.message });
  }
};

const aggregateStudents = async (req, res) => {
  try {
    const aggregation = await Student.aggregate([
      {
        $lookup: {
          from: "faculties",
          localField: "faculty",
          foreignField: "_id",
          as: "facultyDetails",
        },
      },
      {
        $unwind: "$facultyDetails",
      },
      {
        $lookup: {
          from: "companies",
          localField: "company",
          foreignField: "_id",
          as: "companyDetails",
        },
      },
      {
        $unwind: "$companyDetails",
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $lookup: {
          from: "jobs",
          localField: "job",
          foreignField: "_id",
          as: "jobDetails",
        },
      },
      {
        $unwind: {
          path: "$jobDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          company: "$companyDetails.name",
          jobTitle: "$jobDetails.title",
          jobScope: "$jobDetails.scope",
          faculty: "$facultyDetails.name",
          student: {
            name: "$name",
            email: "$userDetails.email",
            jobTitle: "$jobDetails.title",
          },
        },
      },
      {
        $group: {
          _id: {
            company: "$company",
            jobTitle: "$jobTitle",
            jobScope: "$jobScope",
            faculty: "$faculty",
          },
          students: { $push: "$student" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          company: "$_id.company",
          jobTitle: "$_id.jobTitle",
          jobScope: "$_id.jobScope",
          faculty: "$_id.faculty",
          students: 1,
          count: 1,
        },
      },
    ]);

    // console.log("Aggregated Data:", aggregation); // Add console log to see aggregated data
    res.json(aggregation);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error during student aggregation");
  }
};

export { getStudents, getStudent, updateStudent, aggregateStudents };
