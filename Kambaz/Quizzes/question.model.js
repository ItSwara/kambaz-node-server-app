import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false }
});

const questionSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    quizId: { type: String, ref: "Quiz", required: true },
    title: { type: String, required: true },
    questionType: { 
      type: String, 
      enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "MULTIPLE_ANSWER", "ESSAY"],
      required: true
    },
    points: { type: Number, default: 1 },
    options: [optionSchema],
    correctAnswer: { type: String }, // For TRUE_FALSE
    correctAnswers: [{ type: String }], // For MULTIPLE_ANSWER (IDs of correct options)
    sampleAnswer: { type: String } // For ESSAY (optional)
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);
export default Question;