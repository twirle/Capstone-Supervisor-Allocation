import Company from "../models/companyModel.js";
import mongoose from "mongoose";

// GET all companies
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({});
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET a single company by ID
const getCompany = async (req, res) => {
  const { companyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    return res.status(404).json({ error: "Invalid company ID" });
  }

  try {
    const company = await Company.findById(companyId);
    console.log(company); // Check if `_id` is included in the logs
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCompany = async (req, res) => {
  const { name } = req.body; // Ensure you handle all necessary company attributes

  try {
    const newCompany = new Company({ name });
    await newCompany.save();
    res.status(201).json(newCompany);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE a company by ID
const updateCompany = async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(404).json({ error: "Invalid company ID" });
  }

  try {
    const company = await Company.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCompany = async (req, res) => {
  const { companyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    return res.status(404).json({ error: "Invalid company ID" });
  }

  try {
    const company = await Company.findByIdAndDelete(companyId);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
};
