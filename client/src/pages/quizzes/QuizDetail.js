import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function QuizDetail() {
  const { courseId, quizId } = useParams(); // quiz ID from URL
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);


  useEffect(() => {
    fetchQuiz();
    // eslint-disable-next-line
  }, [courseId, quizId]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit(); // auto-submit or disable
    }
  }, [timeLeft]);

  const fetchQuiz = async () => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:4000/api/quizzes/${courseId}/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.timeLimit) {
      setTimeLeft(res.data.timeLimit * 60); // if it's in minutes, convert to seconds
        }
      setQuiz(res.data);
      setUserAnswers(
        res.data.questions ? res.data.questions.map(() => null) : []
      );
    } catch (err) {
      setError('Failed to load quiz');
    }
  };

  // Timer effect
  useEffect(() => {
    let timerId;
    if (timeLeft !== null) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [timeLeft]);


  const handleOptionChange = (qIndex, optionIndex) => {
    const updated = [...userAnswers];
    updated[qIndex] = optionIndex;
    setUserAnswers(updated);
  };

  const handleSubmit = async () => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:4000/api/quizzes/${courseId}/${quizId}/submit`,
        { answers: userAnswers },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Example response: { score: 3, total: 5 }
      setScore(res.data.score);
    } catch (err) {
      setError('Submission failed');
    }
  };

  if (!quiz) return <p style={{ padding: '1rem' }}>Loading quiz...</p>;

  return (
    <div style={{ padding: '1rem' }}>
      {timeLeft !== null && (
        <p>Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}</p>
      )}
      {/* quiz questions + submit button */}
      <h2>{quiz.title}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {score !== null ? (
        <p>Your Score: {score}</p>
      ) : (
        <>
          {quiz.questions?.map((q, qIndex) => (
            <div key={qIndex} style={{ marginTop: 16 }}>
              <p><strong>Question {qIndex + 1}:</strong> {q.question}</p>
              {q.options.map((opt, optIndex) => (
                <label key={optIndex} style={{ display: 'block' }}>
                  <input
                    type="radio"
                    name={`question-${qIndex}`}
                    value={optIndex}
                    onChange={() => handleOptionChange(qIndex, optIndex)}
                    checked={userAnswers[qIndex] === optIndex}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
          <button onClick={handleSubmit} style={{ marginTop: 16 }}>
            Submit Answers
          </button>
        </>
      )}
    </div>
  );
}

export default QuizDetail;
