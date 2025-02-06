// server/routes/postRoutes.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Course = require('../models/Course');
const { verifyToken, isTeacherOrAdmin } = require('../middlewares/authMiddleware');

// CREATE a post
router.post('/:courseId', verifyToken, isTeacherOrAdmin, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { content } = req.body;

    // check course ownership
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (String(course.instructor) !== String(req.user.userId)) {
      return res.status(403).json({ error: 'You do not own this course' });
    }

    const post = await Post.create({ course: courseId, content });
    res.json({ message: 'Post created', post });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// GET posts for a course
router.get('/:courseId', verifyToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    // optionally check if teacher or enrolled student
    const posts = await Post.find({ course: courseId });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// UPDATE post
router.patch('/:courseId/:postId', verifyToken, isTeacherOrAdmin, async (req, res) => {
  try {
    const { courseId, postId } = req.params;
    const { content } = req.body;

    // check ownership
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (String(course.instructor) !== String(req.user.userId)) {
      return res.status(403).json({ error: 'You do not own this course' });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { content },
      { new: true }
    );
    if (!updatedPost) return res.status(404).json({ error: 'Post not found' });

    res.json({ message: 'Post updated', updatedPost });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// DELETE post
router.delete('/:courseId/:postId', verifyToken, isTeacherOrAdmin, async (req, res) => {
  try {
    const { courseId, postId } = req.params;
    // check ownership
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (String(course.instructor) !== String(req.user.userId)) {
      return res.status(403).json({ error: 'You do not own this course' });
    }

    await Post.findByIdAndRemove(postId);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

module.exports = router;
