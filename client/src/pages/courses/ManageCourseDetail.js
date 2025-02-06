// src/pages/courses/ManageCourseDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function ManageCourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    // decode JWT to get user info
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.userId);  // or whatever your payload uses
      setRole(decoded.role);
    }
    fetchCourse();
    // eslint-disable-next-line
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:4000/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourse(res.data);
    } catch (err) {
      setMessage('Failed to load course details');
    }
  };

  // An optional front-end check to ensure the instructor is the logged-in user
  const isInstructor = () => {
    return course && course.instructor && course.instructor._id === userId;
  };

  if (!course && !message) return <p>Loading...</p>;
  if (message) return <p style={{ color: 'red' }}>{message}</p>;

  // If the user is not the instructor (or admin), you might do a quick check:
  if (!isInstructor() && role !== 'ADMIN') {
    return <p>You do not have permission to manage this course.</p>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Manage Course: {course.title}</h2>
      <p>{course.description}</p>

      <hr />

      <h3>Actions / Sections</h3>
      <ul>
        {/* Create Post or Announcements */}
        <li><Link to={`/manage-courses/${courseId}/posts`}>Posts / Announcements</Link></li>
        {/* Post Assignments */}
        <li><Link to={`/manage-courses/${courseId}/assignments`}>Assignments</Link></li>
        {/* Post Grades */}
        <li><Link to={`/manage-courses/${courseId}/grades`}>Grades</Link></li>
        {/* Quizzes & Analytics */}
        <li><Link to={`/manage-courses/${courseId}/quizzes`}>Quizzes</Link></li>
      </ul>
    </div>
  );
}

export default ManageCourseDetail;
