// src/pages/courses/StudentCourseDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function CourseDetail() {
  const { courseId } = useParams(); // courseId
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourseDetail();
    // eslint-disable-next-line
  }, [courseId]);

  const fetchCourseDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:4000/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourse(res.data);
    } catch (err) {
      setError('Failed to fetch course details.');
    }
  };

  if (!course && !error) {
    return <p>Loading course details...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{course.title}</h2>
      <p>{course.description}</p>

      {/* You might show instructor info if needed */}
      {/* <p>Instructor: {course.instructor?.email}</p> */}

      <hr />
      <h3>Course Contents</h3>
      <ul>
        {/* Link to the route that shows quizzes for this course */}
        <li>
          <Link to={`/my-courses/${courseId}/quizzes`}>Quizzes</Link>
        </li>
        {/* Link to the route that shows assignments */}
        <li>
          <Link to={`/my-courses/${courseId}/assignments`}>Assignments</Link>
        </li>
        {/* Link to the route that shows grades */}
        <li>
          <Link to={`/my-courses/${courseId}/grades`}>Grades</Link>
        </li>
        <li>
          <Link to={`/my-courses/${courseId}/posts`}>Posts</Link>
        </li>
      </ul>
    </div>
  );
}

export default CourseDetail;
