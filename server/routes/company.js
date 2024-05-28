import express from "express";

import {
  getCompanies,
  getCompany,
  updateCompany,
} from "../controllers/companyController.js";
import { requireAuth, checkRole } from "../middleware/requireAuth.js";

const router = express.Router();

// forces the user to be authenticated for route functions
router.use(requireAuth);

// GET all companies
router.get("/", getCompanies);

// GET a single company based on 'Id'
router.get("/:userId", getCompany);

// UPDATE a company
router.patch("/:userId", requireAuth, checkRole(["admin"]), updateCompany);

export default router;
