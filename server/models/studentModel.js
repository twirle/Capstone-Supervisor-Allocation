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
    type: String,
    require: true,
  },
  assignedSupervisor: {
    type: Schema.Types.ObjectId,
    ref: "Supervisor",
    default: null,
  },
  assignedSupervisorName: {
    type: String,
    default: "",
  },
});

export default mongoose.model("Student", studentSchema);
