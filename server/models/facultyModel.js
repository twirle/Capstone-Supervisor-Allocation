import mongoose from "mongoose";

const { Schema } = mongoose;

const facultySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  courses: [String],
});

export default mongoose.model("Faculty", facultySchema);
