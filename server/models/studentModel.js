import mongoose from "mongoose";

const { Schema } = mongoose;

const studentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  faculty: {
    type: Schema.Types.ObjectId,
    ref: "Faculty",
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  job: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  assignedSupervisor: {
    type: Schema.Types.ObjectId,
    ref: "Supervisor",
    default: null,
  },
});

export default mongoose.model("Student", studentSchema);
