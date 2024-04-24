const Student = require("../models/studentModel");
const Faculty = require("../models/facultyModel");
const mongoose = require("mongoose");

// get all Students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find({})
      .sort({ createdAt: -1 })
      .populate("user", "email")
      .populate("faculty", "name")
      .populate("assignedMentor", "name");

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
    .populate({
      path: "faculty",
      select: "name",
    })
    .populate({
      path: "assignedMentor",
      select: "name",
    });
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
    ).populate("user faculty");
    if (!student) {
      console.error(`No student found with ID: ${userId}`);
      return res.status(404).json({ error: "No such student" });
    }
    // console.log(`Updated student: ${student}`);
    res.status(200).json(student);
  } catch (error) {
    console.error(`Error updating mentor: ${error}`);
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
        $unwind: {
          path: "$facultyDetails",
          preserveNullAndEmptyArrays: true, // This will include students without faculty in the result
        },
      },
      {
        $group: {
          _id: {
            course: "$course",
            faculty: "$facultyDetails.name", // Use faculty name from the lookup
            company: "$company",
          },
          students: { $push: { _id: "$_id", name: "$name" } },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0, // Exclude this field
          course: "$_id.course",
          faculty: "$_id.faculty",
          company: "$_id.company",
          students: 1,
          count: 1,
        },
      },
    ]);

    res.json(aggregation);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error during student aggregation");
  }
};

module.exports = {
  getStudents,
  getStudent,
  updateStudent,
  aggregateStudents,
};
