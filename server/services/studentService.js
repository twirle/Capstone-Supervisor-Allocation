import Student from "../models/studentModel.js";

// Create Student Profile
async function createProfile(userId, additionalInfo) {
  try {
    const profile = await Student.create({
      user: userId,
      name: additionalInfo.name,
      faculty: additionalInfo.faculty,
      course: additionalInfo.course,
      company: additionalInfo.company,
      jobScope: additionalInfo.jobScope
    });
    return profile;
  } catch (error) {
    throw new Error("Error creating student profile:", error);
  }
}

async function deleteProfile(userId) {
  try {
    console.log("Deleting profile:", userId);
    const profile = await Student.findOneAndDelete({ user: userId });
    if (!profile) {
      console.error("Student profile not found for User ID:", userId);
      throw new Error("Student profile not found for deletion");
    }
    console.log("Deleted student profile for:", userId);
    return profile;
  } catch (error) {
    console.error("Error deleting student profile:", error);
    throw new Error("Error deleting student profile:", error);
  }
}
export { createProfile, deleteProfile };
