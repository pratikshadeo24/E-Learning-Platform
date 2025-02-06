import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function CourseQuizzes() {
  const { courseId } = useParams(); // courseId
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetchCourseQuizzes();
  }, [courseId]);

  const fetchCourseQuizzes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:4000/api/quizzes/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizzes(res.data);
    } catch (err) {
      console.error('Failed to fetch quizzes', err);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Quizzes in This Course</h2>
      {quizzes.length === 0 ? <p>No quizzes posted yet.</p> : (
        <ul>
          {quizzes.map((q) => (
            <li key={q._id}>
              <Link to={`/my-courses/${courseId}/quizzes/${q._id}`}>{q.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CourseQuizzes;
