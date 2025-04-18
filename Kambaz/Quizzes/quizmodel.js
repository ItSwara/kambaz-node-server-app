import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    course: { type: String, ref: "Course", required: true },
    quizType: { 
      type: String, 
      enum: ["Graded Quiz", "Practice Quiz", "Graded Survey", "Ungraded Survey"],
      default: "Graded Quiz"
    },
    points: { type: Number, default: 0 },
    assignmentGroup: { 
      type: String, 
      enum: ["QUIZZES", "EXAMS", "ASSIGNMENTS", "PROJECT"],
      default: "QUIZZES"
    },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 30 },
    multipleAttempts: { type: Boolean, default: false },
    attempts: { type: Number, default: 1 },
    showCorrectAnswers: { 
      type: String,
      enum: ["Immediately", "After Last Attempt", "After Due Date", "Never"],
      default: "Immediately"
    },
    accessCode: { type: String },
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    due_date: { type: Date },
    available_from_date: { type: Date },
    availableUntil: { type: Date },
    published: { type: Boolean, default: false },
    questions: { type: Number, default: 0 },
    description: { type: String }
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;