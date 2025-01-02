import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
});

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  questions: [questionSchema],
  acceptable: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  completed: [],
});

export default mongoose.model("Test", testSchema);
