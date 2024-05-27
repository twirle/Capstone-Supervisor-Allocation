import mongoose from "mongoose";

const { Schema } = mongoose;

const supervisorSchema = new Schema({
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
  researchArea: {
    type: String,
    default: null,
  },
  assignedStudents: [
    {
      type: Schema.Types.ObjectId,
      ref: "Student",
      default: [],
    },
  ],
});

export default mongoose.model("Supervisor", supervisorSchema);
