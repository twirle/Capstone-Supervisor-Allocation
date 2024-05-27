import mongoose from "mongoose";
import { comparePassword } from "../utils/securityUtils.js";

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "supervisor", "student", "facultyMember"],
    required: true,
  },
});

// Login static method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw new Error("All fields must be filled.");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("Incorrect email.");
  }

  // Compare password using utility
  const match = await comparePassword(password, user.password);
  if (!match) {
    throw new Error("Incorrect password.");
  }

  return user;
};

export default mongoose.model("User", userSchema);
