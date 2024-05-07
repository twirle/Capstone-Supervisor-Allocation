import Faculty from "../models/facultyModel.js";
import mongoose from "mongoose";

// Get all faculties
const getFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find({}).sort({ createdAt: -1 });
    res.status(200).json(faculties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single faculty by id
const getFaculty = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Faculty not found" });
  }
  try {
    const faculty = await Faculty.findById(id);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.status(200).json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new faculty
const createFaculty = async (req, res) => {
  const { name, courses } = req.body;
  try {
    const newFaculty = new Faculty({ name, courses });
    await newFaculty.save();
    res.status(201).json(newFaculty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a faculty
const updateFaculty = async (req, res) => {
  const { id } = req.params;
  const { name, courses } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Faculty not found" });
  }
  try {
    const updatedFaculty = await Faculty.findByIdAndUpdate(
      id,
      { name, courses },
      { new: true }
    );
    res.status(200).json(updatedFaculty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a faculty
const deleteFaculty = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Faculty not found" });
  }
  try {
    await Faculty.findByIdAndDelete(id);
    res.status(200).json({ message: "Faculty deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getFaculties,
  getFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
};
