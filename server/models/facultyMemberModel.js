import mongoose from "mongoose";

const { Schema } = mongoose;

const facultyMemberSchema = new Schema({
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
});

export default mongoose.model("FacultyMember", facultyMemberSchema);
