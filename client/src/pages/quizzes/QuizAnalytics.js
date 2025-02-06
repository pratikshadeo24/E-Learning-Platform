import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function QuizAnalytics() {
  const { id } = useParams(); // quizId
  const [attempts, setAttempts] = useState([]);
  const [avgScore, setAvgScore] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAttempts();
    // eslint-disable-next-line
  }, []);

  const fetchAttempts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:4000/api/quizzes/${id}/attempts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttempts(res.data.attempts);
      setAvgScore(res.data.avgScore);
    } catch (err) {
      setError('Failed to load attempts or you are not authorized.');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Quiz Analytics</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Average Score: {avgScore.toFixed(2)}</p>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>User</th>
            <th>Score</th>
            <th>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {attempts.map((att) => (
            <tr key={att._id} style={{ borderBottom: '1px solid #ccc' }}>
              <td>{att.user?.email}</td>
              <td>{att.score}</td>
              <td>{new Date(att.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QuizAnalytics;
