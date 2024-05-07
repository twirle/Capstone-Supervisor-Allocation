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
  interestLevel: {
    type: String,
    enum: [
      "Full acceptance",
      "Agreeable",
      "Conflict of interest",
      "Do not want to supervise",
    ],
    default: "Agreeable",
    required: true,
  },
  reason: {
    type: String,
    default: null,
    trim: true,
    validate: {
      validator: function (value) {
        // Reason should be provided if interestLevel is not 'Agreeable'
        if (this.interestLevel !== "Agreeable") {
          return value && value.trim().length > 0;
        }
        return true;
      },
      message: 'Reason is required when interest level is not "Agreeable".',
    },
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model("SupervisorInterest", supervisorInterestSchema);
