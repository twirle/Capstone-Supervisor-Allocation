import express from "express";

import {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../controllers/companyController.js";
import { requireAuth, checkRole } from "../middleware/requireAuth.js";

const router = express.Router();

// forces the user to be authenticated for route functions
router.use(requireAuth);

// GET all companies
router.get("/", getCompanies);

// GET a single company based on 'companyId'
router.get("/:companyId", getCompany);

// POST a new company
router.post("/", requireAuth, checkRole(["admin"]), createCompany);

// DELETE a company
router.delete("/:companyId", requireAuth, checkRole(["admin"]), deleteCompany);

// UPDATE a company
router.patch("/:companyId", requireAuth, checkRole(["admin"]), updateCompany);

export default router;
