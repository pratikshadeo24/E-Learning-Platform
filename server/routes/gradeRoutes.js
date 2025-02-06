// server/routes/gradeRoutes.js
const express = require('express');
const router = express.Router();
const Grade = require('../models/Grade');
const Course = require('../models/Course');
const { verifyToken, isTeacherOrAdmin } = require('../middlewares/authMiddleware');

// CREATE/UPDATE a grade for a student in a course
router.post('/:courseId', verifyToken, isTeacherOrAdmin, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentId, gradeValue } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (String(course.instructor) !== String(req.user.userId)) {
      return res.status(403).json({ error: 'You do not own this course' });
    }

    // upsert grade
    const updatedGrade = await Grade.findOneAndUpdate(
      { course: courseId, student: studentId },
      { gradeValue, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    res.json({ message: 'Grade recorded/updated', updatedGrade });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record grade' });
  }
});

// GET all grades for a course
router.get('/:courseId', verifyToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const grades = await Grade.find({ course: courseId }).populate('student', 'email');
    res.json(grades);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
});

// Optionally, you can add a DELETE route for removing a grade, etc.

module.exports = router;
