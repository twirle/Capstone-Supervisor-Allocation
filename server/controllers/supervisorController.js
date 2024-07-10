import Supervisor from "../models/supervisorModel.js";
import mongoose from "mongoose";

// get all Supervisors
const getSupervisors = async (req, res) => {
  try {
    const supervisors = await Supervisor.find({})
      .sort({ createdAt: -1 })
      .populate("faculty", "name")
      .populate("user", "email")
      .populate("assignedStudents", "name");
    res.status(200).json(supervisors);
    // console.log("Supervisors with populated data:", supervisors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get a single Supervisor with access control
const getSupervisor = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(404).json({ error: "Invalid user ID" });
  }

  const supervisor = await Supervisor.findOne({ user: userId })
    .populate("faculty", "name")
    .populate("user", "email")
    .populate("assignedStudents", "name course faculty job company");
  if (!supervisor) {
    return res
      .status(404)
      .json({ error: "No supervisor found with this user ID" });
  }

  // Check if the requesting user is the supervisor themselves or an admin
  if (
    supervisor.user._id.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return res
      .status(403)
      .json({ error: "Not authorized to access this supervisor" });
  }

  res.status(200).json(supervisor);
};

// update a Supervisor
const updateSupervisor = async (req, res) => {
  const { userId } = req.params;
  console.log(`Attempting to update supervisor with ID: ${userId}`);
  const updateData = req.body;

  try {
    const supervisor = await Supervisor.findOneAndUpdate(
      { user: userId },
      updateData,
      { new: true }
    ).populate("user faculty");
    if (!supervisor) {
      console.error(`No supervisor found with ID: ${userId}`);
      return res.status(404).json({ error: "No such supervisor" });
    }
    // console.log(`Updated Supervisor: ${supervisor}`);
    res.status(200).json(supervisor);
  } catch (error) {
    console.error(`Error updating supervisor: ${error}`);
    res.status(400).json({ error: error.message });
  }
};

export { getSupervisors, getSupervisor, updateSupervisor };
