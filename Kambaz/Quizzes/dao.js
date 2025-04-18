import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File paths
const quizzesPath = path.join(__dirname, '..', 'data', 'quizzes.json');

// Make sure the data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create the quizzes.json file if it doesn't exist
if (!fs.existsSync(quizzesPath)) {
  fs.writeFileSync(quizzesPath, '[]', 'utf8');
}

/**
 * Read quizzes data
 */
const readQuizzes = () => {
  try {
    const data = fs.readFileSync(quizzesPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading quizzes:', error);
    return [];
  }
};

/**
 * Write quizzes data
 */
const writeQuizzes = (quizzes) => {
  try {
    fs.writeFileSync(quizzesPath, JSON.stringify(quizzes, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing quizzes:', error);
    return false;
  }
};

/**
 * Find all quizzes
 */
export const findAllQuizzes = () => {
  return readQuizzes();
};

/**
 * Find a quiz by ID
 */
export const findQuizById = (quizId) => {
  const quizzes = readQuizzes();
  return quizzes.find(quiz => quiz._id === quizId) || null;
};

/**
 * Find all quizzes for a specific course
 */
export const findQuizzesForCourse = (courseId) => {
  const quizzes = readQuizzes();
  return quizzes.filter(quiz => quiz.course === courseId);
};

/**
 * Create a new quiz
 */
export const createQuiz = (quiz) => {
  const quizzes = readQuizzes();
  
  // Generate ID if not provided
  if (!quiz._id) {
    quiz._id = `Q${Date.now()}`;
  }
  
  // Set default values
  quiz.questions = quiz.questions || 0;
  quiz.points = quiz.points || 0;
  quiz.published = quiz.published || false;
  
  quizzes.push(quiz);
  writeQuizzes(quizzes);
  
  return quiz;
};

/**
 * Update an existing quiz
 */
export const updateQuiz = (quizId, updatedQuizData) => {
  const quizzes = readQuizzes();
  const index = quizzes.findIndex(quiz => quiz._id === quizId);
  
  if (index === -1) return null;
  
  // Merge existing quiz with updated data
  quizzes[index] = { ...quizzes[index], ...updatedQuizData };
  
  writeQuizzes(quizzes);
  return quizzes[index];
};

/**
 * Delete a quiz
 */
export const deleteQuiz = (quizId) => {
  const quizzes = readQuizzes();
  const quizIndex = quizzes.findIndex(quiz => quiz._id === quizId);
  
  if (quizIndex === -1) return { success: false };
  
  quizzes.splice(quizIndex, 1);
  writeQuizzes(quizzes);
  
  return { success: true };
};

/**
 * Toggle quiz published status
 */
export const toggleQuizPublished = (quizId) => {
  const quizzes = readQuizzes();
  const index = quizzes.findIndex(quiz => quiz._id === quizId);
  
  if (index === -1) return null;
  
  quizzes[index].published = !quizzes[index].published;
  writeQuizzes(quizzes);
  
  return quizzes[index];
};

/**
 * Update quiz question count and total points
 */
export const updateQuizStats = (quizId, questionCount, totalPoints) => {
  const quizzes = readQuizzes();
  const index = quizzes.findIndex(quiz => quiz._id === quizId);
  
  if (index === -1) return null;
  
  quizzes[index].questions = questionCount;
  quizzes[index].points = totalPoints;
  
  writeQuizzes(quizzes);
  return quizzes[index];
};