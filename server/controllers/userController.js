import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import {
  importStudents,
  importSupervisors,
} from "../services/importService.js";
import multer from "multer";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Attempting to login with:", req.body);

  try {
    const user = await User.login(email, password);
    // create a token
    const token = createToken(user._id);
    res.status(200).json({ _id: user._id, email, token, role: user.role });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get single user
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// change user password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .send({ error: "User not found for password update" });
    }

    // verify old password
    const passIsMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passIsMatch) {
      return res.status(400).send({ error: "Old password is incorrect" });
    }

    // validate new password
    if (!newPassword || !validator.isStrongPassword(newPassword)) {
      return res.status(400).send({ error: "Invalid new password" });
    }

    // hash password and save
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).send({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

const handleImport = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file provided." });
  }

  try {
    const filename = req.file.originalname;
    if (filename.startsWith("students_data")) {
      await importStudents(req.file.buffer);
      res.json({ message: "Student data imported successfully." });
    } else if (filename.startsWith("supervisors_data")) {
      await importSupervisors(req.file.buffer);
      res.json({ message: "Supervisor data imported successfully." });
    } else {
      throw new Error("Unknown file type.");
    }
  } catch (error) {
    console.error("Error during import:", error);
    res.status(500).json({ error: error.message });
  }
};

export { loginUser, getAllUsers, getUser, changePassword, handleImport };
