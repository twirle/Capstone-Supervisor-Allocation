import mongoose from "mongoose";

const { Schema } = mongoose;

const companySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.model("Company", companySchema);
