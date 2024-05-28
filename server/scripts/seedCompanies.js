import dotenv from "dotenv";
import mongoose from "mongoose";
import Company from "../models/companyModel.js";
import companies from "./text/companies.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const clearExistingCompanies = async () => {
  await Company.deleteMany({});
  console.log("Cleared existing companies.");
};

const seedCompanies = async () => {
  await clearExistingCompanies();

  for (const faculty in companies) {
    for (const company of companies[faculty]) {
      await Company.create(company);
    }
  }

  console.log("Inserted companies successfully.");
};

seedCompanies()
  .then(() => mongoose.disconnect())
  .catch((err) => {
    console.error("Error during company seeding:", err);
    mongoose.disconnect();
  });
