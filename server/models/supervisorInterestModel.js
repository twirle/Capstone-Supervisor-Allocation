const mongoose = require("mongoose");

const supervisorInterestSchema = new mongoose.Schema({
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supervisor",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
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

module.exports = mongoose.model("SupervisorInterest", supervisorInterestSchema);
