import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  taskName: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "waiting",
  },
  phase: {
    type: String,
    default: "phase1",
  },
  description: { type: String },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
