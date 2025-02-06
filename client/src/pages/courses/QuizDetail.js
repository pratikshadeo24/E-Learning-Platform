import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function QuizDetail() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuiz();
    // eslint-disable-next-line
  }, [quizId]);

  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:4000/api/quizzes/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuiz(res.data);
      setUserAnswers(res.data.questions.map(() => null));
    } catch (err) {
      setError('Failed to load quiz');
    }
  };

  const handleOptionChange = (qIndex, optIndex) => {
    const updated = [...userAnswers];
    updated[qIndex] = optIndex;
    setUserAnswers(updated);
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:4000/api/quizzes/${quizId}/submit`, {
        answers: userAnswers
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setScore(res.data.score);
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed');
    }
  };

  if (!quiz) return <p>Loading quiz...</p>;
  if (error) return <p style={{ color:'red' }}>{error}</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{quiz.title}</h2>
      {score !== null ? (
        <p>Your Score: {score} / {quiz.questions.length}</p>
      ) : (
        <>
          {quiz.questions.map((q, qIndex) => (
            <div key={qIndex} style={{ margin: '1rem 0' }}>
              <p><strong>Question {qIndex+1}:</strong> {q.question}</p>
              {q.options.map((opt, optIndex) => (
                <label key={optIndex} style={{ display: 'block' }}>
                  <input
                    type="radio"
                    name={`q-${qIndex}`}
                    checked={userAnswers[qIndex] === optIndex}
                    onChange={() => handleOptionChange(qIndex, optIndex)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
          <button onClick={handleSubmit}>Submit Answers</button>
        </>
      )}
    </div>
  );
}

export default QuizDetail;
