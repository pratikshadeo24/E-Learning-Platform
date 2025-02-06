import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function ManageCourseQuizzes() {
  const { courseId } = useParams();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetchQuizzes();
    // eslint-disable-next-line
  }, [courseId]);

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('token');
      // if you have /api/quizzes/by-course/:courseId:
      const res = await axios.get(`http://localhost:4000/api/quizzes/by-course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizzes(res.data);
    } catch (err) {
      console.error('Failed to fetch quizzes');
    }
  };

  return (
    <div>
      <h3>Manage Quizzes</h3>
      <Link to="/create-quiz">+ Create New Quiz</Link>
      {/* or a variant that pre-fills courseId */}
      <hr />
      <ul>
        {quizzes.map((q) => (
          <li key={q._id}>
            {q.title}{' '}
            {/* Link to quiz analytics, e.g. /quizzes/:quizId/attempts */}
            <Link to={`/quizzes/${q._id}/analytics`} style={{ marginLeft: 8 }}>
              View Analytics
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageCourseQuizzes;
