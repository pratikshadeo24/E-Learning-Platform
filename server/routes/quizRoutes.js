const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Course = require('../models/Course');
const Attempt = require('../models/Attempt');
const Enrollment = require('../models/Enrollment');
const { verifyToken, isTeacherOrAdmin } = require('../middlewares/authMiddleware');

// Create a quiz (Teacher)
router.post('/:courseId', verifyToken, isTeacherOrAdmin, async (req, res) => {
  try {
    // Ensure user is teacher or admin
    // Parse quiz data from req.body
    // quiz data from request
    const { title, questions, timeLimit, startTime, endTime, courseId } = req.body;

//     (optional) check if course exists, or if user is instructor of that course
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (req.user.role === 'TEACHER' && String(course.instructor) !== String(req.user.userId)) {
      return res.status(403).json({ error: 'You are not the instructor for this course', inst_id: course.instructor, user_id: req.user.userId });
    }
    // store creator reference if needed
    const quiz = await Quiz.create({
      title,
      questions,
      timeLimit,
      startTime,
      endTime,
      course: courseId,
      creator: req.user.userId
    });
    res.json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all quizzes
router.get('/:courseId', verifyToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // If teacher or admin, check if user is the instructor
    if (req.user.role === 'TEACHER') {
      if (String(course.instructor) !== String(req.user.userId)) {
        return res.status(403).json({ error: 'You do not teach this course' });
      }
    } else {
      // else, assume user is a student; must be enrolled
      const enrolled = await Enrollment.findOne({ student: req.user.userId, course: courseId });
      if (!enrolled) {
        return res.status(403).json({ error: 'You are not enrolled in this course' });
      }
    }
    const quizzes = await Quiz.find({ course: courseId });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});


// Get one quiz
router.get('/:courseId/:id', verifyToken, async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    // check the course
    const courseId = quiz.course;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // If teacher or admin, ensure they're the instructor of that course
    if (req.user.role === 'TEACHER') {
      if (String(course.instructor) !== String(req.user.userId)) {
        return res.status(403).json({ error: 'You do not teach this course' });
      }
    } else {
      // else assume user is a student; verify enrollment
      const enrolled = await Enrollment.findOne({
        student: req.user.userId,
        course: courseId
      });
      if (!enrolled) {
        return res.status(403).json({ error: 'You are not enrolled in this course' });
      }
    }
    res.json(quiz);
});

// Submit answers
router.post('/:courseId/:id/submit', verifyToken, async (req, res) => {
  try {
    const { answers } = req.body;
    // 'answers' is an array of selected option indexes, e.g. [3, 2]

    // Grab the quiz from DB
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    // check the course
    const courseId = quiz.course;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // If teacher or admin, ensure they're the instructor of that course
    if (req.user.role === 'TEACHER') {
      if (String(course.instructor) !== String(req.user.userId)) {
        return res.status(403).json({ error: 'You do not teach this course' });
      }
    } else {
      // else assume user is a student; verify enrollment
      const enrolled = await Enrollment.findOne({
        student: req.user.userId,
        course: courseId
      });
      if (!enrolled) {
        return res.status(403).json({ error: 'You are not enrolled in this course' });
      }
    }

    // Check time limit or endTime
    if (quiz.endTime && new Date() > quiz.endTime) {
    return res.status(400).json({ error: 'Quiz has ended' });
  }
    // Calculate score:
    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswerIndex) {
        score++;
      }
    });
    // Save attempt
    const attempt = await Attempt.create({
      user: req.user.userId,
      quiz: quiz._id,
      score,
      answers
    });

    // Respond with the score
    return res.json({ score, total: quiz.questions.length, attemptId: attempt._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error submitting quiz' });
  }
});

// e.g., GET /api/quizzes/:id/attempts
router.get('/:courseId/:id/attempts', verifyToken, isTeacherOrAdmin, async (req, res) => {
  try {
    const quizId = req.params.id;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    const course = await Course.findById(quiz.course);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // user must be teacher of this course or an admin
    if (req.user.role === 'TEACHER' && String(course.instructor) !== String(req.user.userId)) {
      return res.status(403).json({ error: 'Not authorized to view attempts for this quiz.' });
    }
    // fetch attempts for this quiz
    const attempts = await Attempt.find({ quiz: quizId })
      .populate('user', 'email role')
      .sort({ createdAt: -1 });

    // optionally compute stats like average score
    let totalScore = 0;
    for (const a of attempts) {
      totalScore += a.score;
    }
    const avgScore = attempts.length > 0 ? totalScore / attempts.length : 0;

    res.json({ attempts, avgScore });
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching attempts' });
  }
});

module.exports = router;
