import Job from "../models/jobModel.js";
import mongoose from "mongoose";
import natural from "natural";
import stopword from "stopword";
import lemmatizer from "wink-lemmatizer";

const tokenizer = new natural.WordTokenizer();

// GET all jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET a single job by ID
const getJob = async (req, res) => {
  const { jobId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(404).json({ error: "Invalid jobId" });
  }

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getJobByCompany = async (req, res) => {
  const { companyId } = req.params;
  try {
    const jobs = await Job.find({ companyId });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createJob = async (req, res) => {
  const { companyId, title, scope } = req.body;

  // Validate the companyId exists
  const companyExists = await Company.findById(companyId);
  if (!companyExists) {
    return res.status(404).json({ error: "Company not found" });
  }

  try {
    // tokenise job scope
    const tokens = tokenizer.tokenize(scope.toLowerCase());
    const cleanTokens = stopword.removeStopwords(tokens);
    let uniqueTokens = [...new Set(cleanTokens)];
    let lemmatizedTokens = uniqueTokens.map((token) => lemmatizer.verb(token));

    // create new job
    const newJob = new Job({ companyId, title, scope, lemmatizedTokens });
    await newJob.save();
    res.status(201).json(newMap);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE a job by ID
const updateJob = async (req, res) => {
  const { jobId } = req.params;
  const updateData = req.body;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(404).json({ error: "Invalid job ID" });
  }

  try {
    const job = await Job.findByIdAndUpdate(jobId, updateData, {
      new: true,
    });
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteJob = async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findByIdAndDelete(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getJobs, getJob, getJobByCompany, createJob, updateJob, deleteJob };
