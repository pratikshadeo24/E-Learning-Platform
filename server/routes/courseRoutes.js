// server/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { verifyToken, isTeacherOrAdmin } = require('../middlewares/authMiddleware');

// Create a new course (teacher or admin)
router.post('/', verifyToken, isTeacherOrAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;
    // The instructor is the currently logged in user
    const newCourse = await Course.create({
      title,
      description,
      instructor: req.user.userId
    });
    res.json(newCourse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all courses (for testing)
router.get('/', verifyToken, async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get a single course by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'email');
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching course details' });
  }
});

// server/routes/courseRoutes.js
router.patch('/:courseId', verifyToken, isTeacherOrAdmin, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description } = req.body;

    // Fetch the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Ensure teacher is actually the instructor
    if (String(course.instructor) !== String(req.user.userId)) {
      return res.status(403).json({ error: 'You do not own this course' });
    }

    // Update fields
    if (title) course.title = title;
    if (description) course.description = description;
    await course.save();

    return res.json({ message: 'Course updated successfully', course });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update course' });
  }
});

router.delete('/:courseId', verifyToken, isTeacherOrAdmin, async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Ensure teacher is actually the instructor
    if (String(course.instructor) !== String(req.user.userId)) {
      return res.status(403).json({ error: 'You do not own this course' });
    }

    // Optional: check if any enrollments or data exist; either remove them or block deletion
    await course.remove();
    return res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete course' });
  }
});


module.exports = router;
