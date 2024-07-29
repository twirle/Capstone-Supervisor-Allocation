import User from "../models/userModel.js";
import {
  createProfile as createStudentProfile,
  deleteProfile as deleteStudentProfile,
} from "./studentService.js";
import {
  createProfile as createSupervisorProfile,
  deleteProfile as deleteSupervisorProfile,
} from "./supervisorService.js";
import {
  createProfile as createFacultyProfile,
  deleteProfile as deleteFacultyProfile,
} from "./facultyMemberService.js";
import { hashPassword } from "../utils/securityUtils.js";
import { validateUserInput } from "../utils/validateHelpers.js";

async function signupUser(email, password, role, additionalInfo) {
  // Validate user input using centralized helper function
  validateUserInput(email, password, role, additionalInfo);

  const exists = await User.findOne({ email });
  if (exists) {
    throw new Error("Email already in use.");
  }

  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await User.create({ email, password: hashedPassword, role });

  switch (role) {
    case "student":
      await createStudentProfile(user._id, additionalInfo);
      break;
    case "supervisor":
      await createSupervisorProfile(user._id, additionalInfo);
      break;
    case "facultyMember":
      await createFacultyProfile(user._id, additionalInfo);
      break;
    default:
      break;
  }

  return user;
}

async function deleteUserandProfile(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error(`User with ID ${userId} not found.`);
      throw new Error("User not found.");
    }

    switch (user.role) {
      case "supervisor":
        await deleteSupervisorProfile(userId);
        break;
      case "student":
        await deleteStudentProfile(userId);
        break;
      case "facultyMember":
        await deleteFacultyProfile(userId);
        break;
    }

    // After profile deletion, delete the user
    await User.deleteOne({ _id: userId });
    console.log(`User and all related data deleted successfully: ${userId}`);
  } catch (error) {
    console.error(`Error deleting user: ${error.message}`);
    throw error;
  }
}

async function buildSignupUsers(usersData) {
  const createdUsers = [];
  for (const userData of usersData) {
    try {
      const user = await signupUser(
        userData.email,
        userData.password,
        userData.role,
        userdata.additionalInfo
      );
      createdUsers.push(user);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }
  return createdUsers;
}

export { signupUser, deleteUserandProfile, buildSignupUsers };
