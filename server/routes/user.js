import express from "express";
import {
  loginUser,
  getAllUsers,
  getUser,
  changePassword,
  handleImport,
} from "../controllers/userController.js";
import { requireAuth, checkRole } from "../middleware/requireAuth.js";
import { signupUser, deleteUserandProfile } from "../services/userService.js";
import { upload, handleFileImport } from "../controllers/importController.js";

const router = express.Router();

// Login route
router.post("/login", loginUser);

// Sign up route, accessible only by admins
router.post("/signup", requireAuth, checkRole(["admin"]), async (req, res) => {
  try {
    const { email, password, role, additionalInfo } = req.body;
    const user = await signupUser(email, password, role, additionalInfo);
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a user, accessible only by admins
router.delete(
  "/:userId",
  requireAuth,
  checkRole(["admin"]),
  async (req, res) => {
    try {
      await deleteUserandProfile(req.params.userId);
      res.status(204).send(); // No content to send back
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get all users, accessible only by admins
router.get("/all", requireAuth, checkRole(["admin"]), getAllUsers);

// Get single user, accessible only by admins
router.get("/:userId", requireAuth, checkRole(["admin"]), getUser);

// Change user password, requires authentication
router.patch("/:userId/changePassword", requireAuth, changePassword);

// Import
router.post(
  "/import",
  requireAuth,
  checkRole(["admin"]),
  upload,
  handleFileImport
);

export default router;
