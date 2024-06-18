import express from "express";

import {
  getJobs,
  getJob,
  getJobByCompany,
  createJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import { requireAuth, checkRole } from "../middleware/requireAuth.js";

const router = express.Router();

// forces the user to be authenticated for route functions
router.use(requireAuth);

// GET all jobs
router.get("/", getJobs);

// GET a single job based on 'jobId'
router.get("/:jobId", getJob);

// GET all jobs for a specific company
router.get("/company/:companyId", getJobByCompany);

// CREATE a job
router.post("/", requireAuth, checkRole(["admin"]), createJob);

// UPDATE a job
router.patch("/:jobId", requireAuth, checkRole(["admin"]), updateJob);

// DELETE a job
router.delete("/:jobId", requireAuth, checkRole(["admin"]), deleteJob);

export default router;
