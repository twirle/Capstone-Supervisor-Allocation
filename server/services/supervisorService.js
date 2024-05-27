import Supervisor from "../models/supervisorModel.js";

// Create Supervisor profile
async function createProfile(userId, additionalInfo) {
  try {
    console.log(userId, additionalInfo);
    const profile = await Supervisor.create({
      user: userId,
      name: additionalInfo.name,
      faculty: additionalInfo.faculty,
      researchArea: additionalInfo.researchArea,
    });
    return profile;
  } catch (error) {
    throw new Error("Error creating supervisor profile:", error);
  }
}

// Delete Supervisor profile
async function deleteProfile(userId) {
  try {
    console.log("Deleting profile:", userId);
    const profile = await Supervisor.findOneAndDelete({ user: userId });
    if (!profile) {
      console.error("Supervisor profile not found for User ID:", userId);
      throw new Error("Supervisor profile not found for deletion");
    }
    console.log("Deleted supervisor profile for:", userId);
    return profile;
  } catch (error) {
    console.error("Error deleting supervisor profile", error);
    throw new Error("Error deleting supervisor profile:", error);
  }
}

export { createProfile, deleteProfile };
