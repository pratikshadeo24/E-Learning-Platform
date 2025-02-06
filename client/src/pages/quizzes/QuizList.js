import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setError('');
    try {
      // Include token if your server requires auth
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:4000/api/quizzes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuizzes(res.data);
    } catch (err) {
      setError('Failed to fetch quizzes');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>All Quizzes</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {quizzes.length === 0 ? (
        <p>No quizzes found.</p>
      ) : (
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz._id}>
              <Link to={`/quizzes/${quiz._id}`}>{quiz.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default QuizList;
