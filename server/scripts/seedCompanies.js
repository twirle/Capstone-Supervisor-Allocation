import dotenv from "dotenv";
import mongoose from "mongoose";
import natural from "natural";
import stopword from "stopword";
import lemmatizer from "wink-lemmatizer";
import Company from "../models/companyModel.js";
import Job from "../models/jobModel.js";
import companies from "./text/companies.js";

dotenv.config();
const tokenizer = new natural.WordTokenizer();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const clearExistingData = async () => {
  await Job.deleteMany({});
  await Company.deleteMany({});
  console.log("Cleared existing companies and jobs.");
};

function refineTokens(tokens) {
  let refinedTokens = tokens.filter(
    (token) => token.length > 1 && isNaN(token)
  );
  return stopword.removeStopwords(refinedTokens);
}

const seedData = async () => {
  await clearExistingData();

  for (const faculty in companies) {
    for (const companyData of companies[faculty]) {
      const { name, jobs } = companyData;

      // Ensure that we are passing an object with the key 'name'
      const newCompany = await Company.create({ name });
      console.log(`Created company: ${newCompany.name}`);

      for (const job of jobs) {
        const tokens = tokenizer.tokenize(job.scope.toLowerCase());
        const refinedTokens = refineTokens(tokens);
        let uniqueTokens = [...new Set(refinedTokens)];
        let lemmatizedTokens = uniqueTokens.map((token) =>
          lemmatizer.verb(token)
        );
        console.log(lemmatizedTokens);
        await Job.create({
          companyId: newCompany._id,
          title: job.title,
          scope: job.scope,
          tokens: lemmatizedTokens,
        });
      }
    }
  }

  console.log("Inserted companies and jobs successfully.");
};

seedData()
  .then(() => mongoose.disconnect())
  .catch((err) => {
    console.error("Error during seeding:", err);
    mongoose.disconnect();
  });
