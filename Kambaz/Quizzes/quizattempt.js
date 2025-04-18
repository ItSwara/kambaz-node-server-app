import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  selectedOption: { type: String }, // For MULTIPLE_CHOICE
  selectedOptions: [{ type: String }], // For MULTIPLE_ANSWER
  trueFalseAnswer: { type: String, enum: ["TRUE", "FALSE"] }, // For TRUE_FALSE
  essayAnswer: { type: String }, // For ESSAY
  isCorrect: { type: Boolean },
  pointsEarned: { type: Number, default: 0 }
});

const quizAttemptSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    quizId: { type: String, ref: "Quiz", required: true },
    userId: { type: String, required: true },
    answers: [answerSchema],
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    score: { type: Number, default: 0 },
    totalPossible: { type: Number, required: true },
    percentScore: { type: Number },
    completed: { type: Boolean, default: false },
    attemptNumber: { type: Number, required: true }
  },
  { timestamps: true }
);

const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);
export default QuizAttempt;