// server/routes/assignmentRoutes.js
const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const { verifyToken, isTeacherOrAdmin } = require('../middlewares/authMiddleware');

// CREATE assignment
router.post('/:courseId', verifyToken, isTeacherOrAdmin, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, dueDate } = req.body;

    // check if teacher owns the course
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (String(course.instructor) !== String(req.user.userId)) {
      return res.status(403).json({ error: 'You do not own this course' });
    }

    const assignment = await Assignment.create({
      course: courseId,
      title,
      description,
      dueDate
    });
    return res.json({ message: 'Assignment created', assignment });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create assignment' });
  }
});

// GET assignments for a course
router.get('/:courseId', verifyToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    // optional: check if user is teacher or enrolled student
    const assignments = await Assignment.find({ course: courseId });
    res.json(assignments);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// GET single assignment detail (Teacher or Student)
router.get('/:courseId/:assignmentId', verifyToken, async (req, res) => {
  try {
    const { courseId, assignmentId } = req.params;

    // Find the assignment
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });

    // Check if assignment belongs to the course
    if (String(assignment.course) !== String(courseId)) {
      return res.status(400).json({ error: 'Assignment does not belong to this course' });
    }

    // (Optional) check if user is teacher or enrolled student
    // for read access. If you want to block non-enrolled users:
    // - If teacher, ensure course.instructor == req.user.userId
    // - If student, ensure enrollment in that course

    res.json(assignment);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch assignment detail' });
  }
});

// UPDATE assignment
router.patch('/:courseId/:assignmentId', verifyToken, isTeacherOrAdmin, async (req, res) => {
  try {
    const { courseId, assignmentId } = req.params;
    const { title, description, dueDate } = req.body;

    // check ownership
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (String(course.instructor) !== String(req.user.userId)) {
      return res.status(403).json({ error: 'You do not own this course' });
    }

    const assignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      { title, description, dueDate },
      { new: true }
    );
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });

    res.json({ message: 'Assignment updated', assignment });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update assignment' });
  }
});

// DELETE assignment
router.delete('/:courseId/:assignmentId', verifyToken, isTeacherOrAdmin, async (req, res) => {
  try {
    const { courseId, assignmentId } = req.params;
    // check ownership
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (String(course.instructor) !== String(req.user.userId)) {
      return res.status(403).json({ error: 'You do not own this course' });
    }

    await Assignment.findByIdAndRemove(assignmentId);
    res.json({ message: 'Assignment deleted' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete assignment' });
  }
});

module.exports = router;
