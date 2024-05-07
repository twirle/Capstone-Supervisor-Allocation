import mongoose from "mongoose";

const { Schema } = mongoose;

const supervisorInterestSchema = new Schema({
  supervisor: {
    type: Schema.Types.ObjectId,
    ref: "Supervisor",
    required: true,
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  interest: {
    type: String,
    enum: [
      "Full acceptance",
      "Agreeable",
      "Conflict of interest",
      "Do not want to supervise",
    ],
    default: "Agreeable",
  },
  reason: {
    type: String,
    default: "",
  },
});

export default mongoose.model("SupervisorInterest", supervisorInterestSchema);
