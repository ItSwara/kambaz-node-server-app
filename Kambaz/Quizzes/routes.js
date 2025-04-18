import * as quizDao from "./dao.js";
import * as questionDao from "./questiondao.js";
import * as attemptDao from "./quizattemptdao.js";

export default function QuizRoutes(app) {
  // =========== Quiz routes ===========
  
  // Get all quizzes
  const findAllQuizzes = (req, res) => {
    try {
      const quizzes = quizDao.findAllQuizzes();
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Get a specific quiz by ID
  const findQuizById = (req, res) => {
    try {
      const quiz = quizDao.findQuizById(req.params.quizId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Update a quiz
  const updateQuiz = (req, res) => {
    try {
      const updatedQuiz = quizDao.updateQuiz(req.params.quizId, req.body);
      if (!updatedQuiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.json(updatedQuiz);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Delete a quiz
  const deleteQuiz = (req, res) => {
    try {
      const result = quizDao.deleteQuiz(req.params.quizId);
      if (!result.success) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Toggle quiz published status
  const toggleQuizPublished = (req, res) => {
    try {
      const quiz = quizDao.toggleQuizPublished(req.params.quizId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // =========== Course-specific quiz routes ===========
  
  // Get all quizzes for a course
  const findQuizzesForCourse = (req, res) => {
    try {
      const quizzes = quizDao.findQuizzesForCourse(req.params.courseId);
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Create a new quiz for a course
  const createQuiz = (req, res) => {
    try {
      const newQuiz = {
        ...req.body,
        course: req.params.courseId
      };
      const quiz = quizDao.createQuiz(newQuiz);
      res.status(201).json(quiz);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // =========== Question routes ===========
  
  // Get all questions for a quiz
  const findQuestionsForQuiz = (req, res) => {
    try {
      const questions = questionDao.findQuestionsForQuiz(req.params.quizId);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Create a new question for a quiz
  const createQuestion = (req, res) => {
    try {
      const newQuestion = {
        ...req.body,
        quizId: req.params.quizId
      };
      const question = questionDao.createQuestion(newQuestion);
      res.status(201).json(question);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Update a question
  const updateQuestion = (req, res) => {
    try {
      const updatedQuestion = questionDao.updateQuestion(
        req.params.questionId,
        req.body
      );
      if (!updatedQuestion) {
        return res.status(404).json({ message: "Question not found" });
      }
      res.json(updatedQuestion);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Delete a question
  const deleteQuestion = (req, res) => {
    try {
      const result = questionDao.deleteQuestion(req.params.questionId);
      if (!result.success) {
        return res.status(404).json({ message: "Question not found" });
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // =========== Quiz attempt routes ===========
  
  // Get all attempts for a quiz
  const findAttemptsForQuiz = (req, res) => {
    try {
      const userId = req.query.userId;
      let attempts;
      
      if (userId) {
        // Get attempts for a specific user
        attempts = attemptDao.findUserAttemptsForQuiz(req.params.quizId, userId);
      } else {
        // Get all attempts for the quiz (for faculty)
        attempts = attemptDao.findAttemptsForQuiz(req.params.quizId);
      }
      
      res.json(attempts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Create a new quiz attempt
  const createQuizAttempt = (req, res) => {
    try {
      const userId = req.body.userId || (req.session?.currentUser?._id); 
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const attempt = attemptDao.createQuizAttempt(req.params.quizId, userId);
      res.status(201).json(attempt);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Submit an answer for a quiz attempt
  const submitAnswer = (req, res) => {
    try {
      const { questionId, ...answer } = req.body;
      if (!questionId) {
        return res.status(400).json({ message: "Question ID is required" });
      }
      
      const updatedAttempt = attemptDao.submitAnswer(
        req.params.attemptId,
        questionId,
        answer
      );
      
      res.json(updatedAttempt);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Complete a quiz attempt
  const completeQuizAttempt = (req, res) => {
    try {
      const completedAttempt = attemptDao.completeQuizAttempt(
        req.params.attemptId
      );
      
      res.json(completedAttempt);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Grade an essay question
  const gradeEssayQuestion = (req, res) => {
    try {
      const { questionId, pointsEarned } = req.body;
      if (!questionId || pointsEarned === undefined) {
        return res.status(400).json({ 
          message: "Question ID and points earned are required" 
        });
      }
      
      const gradedAttempt = attemptDao.gradeEssayQuestion(
        req.params.attemptId,
        questionId,
        pointsEarned
      );
      
      res.json(gradedAttempt);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // =========== Register all routes ===========
  
  // Quiz CRUD routes
  app.get("/api/quizzes", findAllQuizzes);
  app.get("/api/quizzes/:quizId", findQuizById);
  app.put("/api/quizzes/:quizId", updateQuiz);
  app.delete("/api/quizzes/:quizId", deleteQuiz);
  app.put("/api/quizzes/:quizId/toggle-published", toggleQuizPublished);
  
  // Course-specific quiz routes
  app.get("/api/courses/:courseId/quizzes", findQuizzesForCourse);
  app.post("/api/courses/:courseId/quizzes", createQuiz);
  
  // Question routes
  app.get("/api/quizzes/:quizId/questions", findQuestionsForQuiz);
  app.post("/api/quizzes/:quizId/questions", createQuestion);
  app.put("/api/quizzes/questions/:questionId", updateQuestion);
  app.delete("/api/quizzes/questions/:questionId", deleteQuestion);
  
  // Quiz attempt routes
  app.get("/api/quizzes/:quizId/attempts", findAttemptsForQuiz);
  app.post("/api/quizzes/:quizId/attempts", createQuizAttempt);
  app.post("/api/quizzes/attempts/:attemptId/answers", submitAnswer);
  app.put("/api/quizzes/attempts/:attemptId/complete", completeQuizAttempt);
  app.put("/api/quizzes/attempts/:attemptId/grade", gradeEssayQuestion);
}