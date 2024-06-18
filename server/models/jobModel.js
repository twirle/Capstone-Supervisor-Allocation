import mongoose from "mongoose";

const { Schema } = mongoose;

const jobSchema = new Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Company",
  },
  title: {
    type: String,
    required: true,
  },
  scope: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Job", jobSchema);
