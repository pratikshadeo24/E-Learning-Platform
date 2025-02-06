// server/routes/enrollmentRoutes.js
const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { verifyToken } = require('../middlewares/authMiddleware');
// Enroll a student in a course
router.post('/:courseId', verifyToken, async (req, res) => {
  try {
    // the logged in user (assume they're a student)
    const studentId = req.user.userId;
    const { courseId } = req.params;

    // Optional: check if course exists
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // check if already enrolled
    const existing = await Enrollment.findOne({ student: studentId, course: courseId });
    if (existing) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId
    });
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
});

// Get courses the user is enrolled in
router.get('/my-courses', verifyToken, async (req, res) => {
  try {
    const studentId = req.user.userId;
    const enrollments = await Enrollment.find({ student: studentId })
      .populate('course');
    res.json(enrollments);
    // The front-end can read .course to see the course details
  } catch (error) {
    res.status(500).json({ error: 'Error fetching enrollments' });
  }
});

module.exports = router;
