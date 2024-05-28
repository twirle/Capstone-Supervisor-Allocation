import mongoose from "mongoose";

const { Schema } = mongoose;

const jobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  scope: {
    type: String,
    required: true,
  },
});

const companySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  jobs: [jobSchema],
});

export default mongoose.model("Company", companySchema);
