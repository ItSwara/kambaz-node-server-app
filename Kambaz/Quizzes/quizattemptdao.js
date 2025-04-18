import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as questionDao from './questiondao.js';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File paths
const attemptsPath = path.join(__dirname, '..', 'data', 'attempts.json');

// Make sure the data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create the attempts.json file if it doesn't exist
if (!fs.existsSync(attemptsPath)) {
  fs.writeFileSync(attemptsPath, '[]', 'utf8');
}

/**
 * Read attempts data
 */
const readAttempts = () => {
  try {
    const data = fs.readFileSync(attemptsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading attempts:', error);
    return [];
  }
};

/**
 * Write attempts data
 */
const writeAttempts = (attempts) => {
  try {
    fs.writeFileSync(attemptsPath, JSON.stringify(attempts, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing attempts:', error);
    return false;
  }
};

/**
 * Find all attempts for a quiz
 */
export const findAttemptsForQuiz = (quizId) => {
  const attempts = readAttempts();
  return attempts.filter(attempt => attempt.quizId === quizId);
};

/**
 * Find all attempts for a quiz by a specific user
 */
export const findUserAttemptsForQuiz = (quizId, userId) => {
  const attempts = readAttempts();
  return attempts.filter(attempt => attempt.quizId === quizId && attempt.userId === userId);
};

/**
 * Find a specific attempt by ID
 */
export const findAttemptById = (attemptId) => {
  const attempts = readAttempts();
  return attempts.find(attempt => attempt._id === attemptId) || null;
};

/**
 * Create a new quiz attempt
 */
export const createQuizAttempt = (quizId, userId) => {
  const attempts = readAttempts();
  
  // Count existing attempts by this user
  const userAttempts = attempts.filter(attempt => attempt.quizId === quizId && attempt.userId === userId);
  const attemptCount = userAttempts.length;
  
  // Get all questions for this quiz to calculate total possible points
  const quizQuestions = questionDao.findQuestionsForQuiz(quizId);
  const totalPossible = quizQuestions.reduce((sum, q) => sum + (q.points || 0), 0);
  
  // Create a new attempt
  const newAttempt = {
    _id: `QA${Date.now()}`,
    quizId,
    userId,
    startTime: new Date().toISOString(),
    totalPossible,
    attemptNumber: attemptCount + 1,
    answers: [],
    score: 0,
    completed: false
  };
  
  attempts.push(newAttempt);
  writeAttempts(attempts);
  
  return newAttempt;
};

/**
 * Submit an answer for a quiz attempt
 */
export const submitAnswer = (attemptId, questionId, answer) => {
  // Find the question to check if the answer is correct
  const question = questionDao.findQuestionById(questionId);
  
  if (!question) {
    throw new Error("Question not found");
  }
  
  let isCorrect = false;
  let pointsEarned = 0;
  
  // Determine if the answer is correct based on question type
  if (question.questionType === "MULTIPLE_CHOICE") {
    const correctOption = question.options.find(opt => opt.isCorrect);
    isCorrect = answer.selectedOption === correctOption?.id;
    pointsEarned = isCorrect ? question.points : 0;
  } else if (question.questionType === "TRUE_FALSE") {
    isCorrect = answer.trueFalseAnswer === question.correctAnswer;
    pointsEarned = isCorrect ? question.points : 0;
  } else if (question.questionType === "MULTIPLE_ANSWER") {
    // All correct options must be selected and no incorrect options
    const correctOptionIds = question.options
      .filter(opt => opt.isCorrect)
      .map(opt => opt.id);
    
    const allCorrectSelected = correctOptionIds.every(id => 
      answer.selectedOptions.includes(id)
    );
    
    const noIncorrectSelected = answer.selectedOptions.every(id => 
      correctOptionIds.includes(id)
    );
    
    isCorrect = allCorrectSelected && noIncorrectSelected;
    pointsEarned = isCorrect ? question.points : 0;
  } else if (question.questionType === "ESSAY") {
    // Essays are manually graded, so we don't set isCorrect or pointsEarned yet
    isCorrect = null;
    pointsEarned = null;
  }
  
  // Add the answer to the attempt
  const attempts = readAttempts();
  const index = attempts.findIndex(attempt => attempt._id === attemptId);
  
  if (index === -1) {
    throw new Error("Attempt not found");
  }
  
  // Check if question has already been answered
  const existingAnswerIndex = attempts[index].answers.findIndex(a => a.questionId === questionId);
  
  if (existingAnswerIndex !== -1) {
    // Update existing answer
    attempts[index].answers[existingAnswerIndex] = {
      questionId,
      ...answer,
      isCorrect,
      pointsEarned
    };
  } else {
    // Add new answer
    attempts[index].answers.push({
      questionId,
      ...answer,
      isCorrect,
      pointsEarned
    });
  }
  
  writeAttempts(attempts);
  
  return attempts[index];
};

/**
 * Complete a quiz attempt
 */
export const completeQuizAttempt = (attemptId) => {
  const attempts = readAttempts();
  const index = attempts.findIndex(attempt => attempt._id === attemptId);
  
  if (index === -1) {
    throw new Error("Attempt not found");
  }
  
  // Calculate score (excluding essay questions which need manual grading)
  const score = attempts[index].answers.reduce((sum, ans) => {
    return sum + (ans.pointsEarned || 0);
  }, 0);
  
  const percentScore = (score / attempts[index].totalPossible) * 100;
  
  // Update the attempt with completion info
  attempts[index].endTime = new Date().toISOString();
  attempts[index].completed = true;
  attempts[index].score = score;
  attempts[index].percentScore = percentScore;
  
  writeAttempts(attempts);
  
  return attempts[index];
};

/**
 * Grade an essay question
 */
export const gradeEssayQuestion = (attemptId, questionId, pointsEarned) => {
  const attempts = readAttempts();
  const attemptIndex = attempts.findIndex(attempt => attempt._id === attemptId);
  
  if (attemptIndex === -1) {
    throw new Error("Attempt not found");
  }
  
  // Find the answer index
  const answerIndex = attempts[attemptIndex].answers.findIndex(ans => 
    ans.questionId === questionId
  );
  
  if (answerIndex === -1) {
    throw new Error("Answer not found");
  }
  
  // Update the answer with the points earned
  attempts[attemptIndex].answers[answerIndex].pointsEarned = pointsEarned;
  attempts[attemptIndex].answers[answerIndex].isCorrect = pointsEarned > 0;
  
  // Recalculate total score
  const score = attempts[attemptIndex].answers.reduce((sum, ans) => {
    return sum + (ans.pointsEarned || 0);
  }, 0);
  
  const percentScore = (score / attempts[attemptIndex].totalPossible) * 100;
  
  // Update the attempt
  attempts[attemptIndex].score = score;
  attempts[attemptIndex].percentScore = percentScore;
  
  writeAttempts(attempts);
  
  return attempts[attemptIndex];
};