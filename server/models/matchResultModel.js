import mongoose from "mongoose";

const { Schema } = mongoose;

const matchResultSchema = new Schema({
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Supervisor",
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Student",
  },
  score: Number,
});

export default mongoose.model("MatchResult", matchResultSchema);
