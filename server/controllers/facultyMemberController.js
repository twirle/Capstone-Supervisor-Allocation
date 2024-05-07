import FacultyMember from "../models/facultyMemberModel.js";
import mongoose from "mongoose";

// get all Faculty Members
const getFacultyMembers = async (req, res) => {
  try {
    const facultyMembers = await FacultyMember.find({})
      .sort({ createdAt: -1 })
      .populate("user faculty");
    res.status(200).json(facultyMembers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get a single Faculty Member by User ID with access control
const getFacultyMember = async (req, res) => {
  const { userId } = req.params; // Adjusted parameter name for clarity

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(404).json({ error: "Invalid user ID" });
  }

  const facultyMember = await FacultyMember.findOne({ user: userId }).populate(
    "user faculty"
  );
  if (!facultyMember) {
    return res
      .status(404)
      .json({ error: "No faculty member associated with this user ID" });
  }

  // Check if the requesting user is the faculty member themselves or an admin
  if (
    facultyMember.user._id.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return res
      .status(403)
      .json({ error: "Not authorized to access this faculty member" });
  }

  res.status(200).json(facultyMember);
};

// update a faculty member
const updateFacultyMember = async (req, res) => {
  const { userId } = req.params;
  console.log(`Attempting to update facultymember with ID: ${userId}`);
  const updateData = req.body;

  try {
    const facultyMember = await FacultyMember.findOneAndUpdate(
      { user: userId },
      updateData,
      { new: true }
    ).populate("user faculty");
    if (!facultyMember) {
      console.error(`No faculty member found with ID: ${userId}`);
      return res.status(404).json({ error: "No such faculty member" });
    }
    // console.log(`Updated Faculty Member: ${facultyMember}`);
    res.status(200).json(facultyMember);
  } catch (error) {
    console.error(`Error updating facultymember: ${error}`);
    res.status(400).json({ error: error.message });
  }
};

export { getFacultyMembers, getFacultyMember, updateFacultyMember };
