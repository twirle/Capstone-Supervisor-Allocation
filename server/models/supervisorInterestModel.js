import mongoose from "mongoose";

const supervisorInterestSchema = new mongoose.Schema({
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supervisor",
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  interest: {
    type: String,
    enum: [
      "Want to supervise",
      "Agreeable",
      "Conflict of interest",
      "Do not want to supervise",
    ],
    default: "Agreeable",
  },
  reason: {
    type: String,
    default: "",
    validate: {
      validator: function (value) {
        return this.interest === "Agreeable" || value.trim() !== "";
      },
      message: "Reason must be provided if interest is not 'Agreeable'",
    },
  },
});

const SupervisorInterest = mongoose.model(
  "SupervisorInterest",
  supervisorInterestSchema
);

export default SupervisorInterest;
