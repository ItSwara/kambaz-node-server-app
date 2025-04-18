import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as quizDao from '../Quizzes/dao.js';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File paths
const questionsPath = path.join(__dirname, '..', 'data', 'questions.json');

// Make sure the data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create the questions.json file if it doesn't exist
if (!fs.existsSync(questionsPath)) {
  fs.writeFileSync(questionsPath, '[]', 'utf8');
}

/**
 * Read questions data
 */
const readQuestions = () => {
  try {
    const data = fs.readFileSync(questionsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading questions:', error);
    return [];
  }
};

/**
 * Write questions data
 */
const writeQuestions = (questions) => {
  try {
    fs.writeFileSync(questionsPath, JSON.stringify(questions, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing questions:', error);
    return false;
  }
};

/**
 * Find all questions for a quiz
 */
export const findQuestionsForQuiz = (quizId) => {
  const questions = readQuestions();
  return questions.filter(question => question.quizId === quizId);
};

/**
 * Find a specific question by ID
 */
export const findQuestionById = (questionId) => {
  const questions = readQuestions();
  return questions.find(question => question._id === questionId) || null;
};

/**
 * Create a new question for a quiz
 */
export const createQuestion = (question) => {
  const questions = readQuestions();
  
  // Generate ID if not provided
  if (!question._id) {
    question._id = `QQ${Date.now()}`;
  }
  
  questions.push(question);
  writeQuestions(questions);
  
  // Update the quiz stats (question count and total points)
  updateQuizStats(question.quizId);
  
  return question;
};

/**
 * Update an existing question
 */
export const updateQuestion = (questionId, updatedQuestionData) => {
  const questions = readQuestions();
  const index = questions.findIndex(question => question._id === questionId);
  
  if (index === -1) return null;
  
  // Get the quiz ID before updating
  const quizId = questions[index].quizId;
  
  // Merge existing question with updated data
  questions[index] = { ...questions[index], ...updatedQuestionData };
  
  writeQuestions(questions);
  
  // Update the quiz stats if needed
  updateQuizStats(quizId);
  if (updatedQuestionData.quizId && updatedQuestionData.quizId !== quizId) {
    updateQuizStats(updatedQuestionData.quizId);
  }
  
  return questions[index];
};

/**
 * Delete a question
 */
export const deleteQuestion = (questionId) => {
  const questions = readQuestions();
  const index = questions.findIndex(question => question._id === questionId);
  
  if (index === -1) return { success: false };
  
  // Get the quiz ID before deleting
  const quizId = questions[index].quizId;
  
  // Remove the question
  questions.splice(index, 1);
  writeQuestions(questions);
  
  // Update the quiz stats
  updateQuizStats(quizId);
  
  return { success: true };
};

/**
 * Helper function to update quiz stats based on questions
 */
const updateQuizStats = (quizId) => {
  const questions = readQuestions();
  const quizQuestions = questions.filter(question => question.quizId === quizId);
  const totalPoints = quizQuestions.reduce((sum, q) => sum + (q.points || 0), 0);
  
  // Update the quiz with new stats
  quizDao.updateQuizStats(quizId, quizQuestions.length, totalPoints);
};