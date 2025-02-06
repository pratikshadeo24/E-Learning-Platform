import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ManageCourseQuizzes() {
  const { courseId } = useParams(); // from /manage-courses/:courseId/quizzes
  const [quizzes, setQuizzes] = useState([]);
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', options: [], correctAnswerIndex: 0 }
  ]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchQuizzes();
    // eslint-disable-next-line
  }, [courseId]);

  // 1) FETCH all quizzes for this course
  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:4000/api/quizzes/by-course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizzes(res.data);
    } catch (err) {
      setMessage('Failed to fetch quizzes');
    }
  };

  // 2) CREATE a new quiz
  const handleCreateQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      // We assume your create route is POST /api/quizzes with a body that includes courseId
      const res = await axios.post('http://localhost:4000/api/quizzes',
        { title, questions, courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Quiz created successfully');
      // Clear form
      setTitle('');
      setQuestions([{ question: '', options: [], correctAnswerIndex: 0 }]);
      // Refresh list
      fetchQuizzes();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to create quiz');
    }
  };

  // 2a) Add question
  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: [], correctAnswerIndex: 0 }]);
  };

  // 2b) Update question text
  const handleQuestionChange = (qIndex, field, value) => {
    const updated = [...questions];
    updated[qIndex][field] = value;
    setQuestions(updated);
  };

  // 2c) Add option
  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push('');
    setQuestions(updated);
  };

  // 2d) Update option text
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  // 3) DELETE a quiz (optional)
  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4000/api/quizzes/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Quiz deleted');
      fetchQuizzes(); // refresh
    } catch (err) {
      setMessage('Failed to delete quiz');
    }
  };

  // (Optional) 4) EDIT a quiz could be handled with a separate form or modal.

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Manage Quizzes for Course</h3>
      {message && <p>{message}</p>}

      <hr />
      {/* CREATE NEW QUIZ FORM */}
      <div style={{ marginBottom: '2rem' }}>
        <h4>Create a New Quiz</h4>
        <div>
          <label>Quiz Title:</label><br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* QUESTIONS */}
        {questions.map((q, qIndex) => (
          <div key={qIndex} style={{ border: '1px solid #ccc', margin: '8px 0', padding: '8px' }}>
            <label>Question Text:</label><br />
            <input
              type="text"
              value={q.question}
              onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
            />
            <div style={{ marginTop: 8 }}>
              <strong>Options:</strong>
              {q.options.map((opt, optIndex) => (
                <div key={optIndex}>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                  />
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={q.correctAnswerIndex === optIndex}
                    onChange={() => handleQuestionChange(qIndex, 'correctAnswerIndex', optIndex)}
                  />
                  <label>Correct</label>
                </div>
              ))}
              <button onClick={() => addOption(qIndex)}>+ Add Option</button>
            </div>
          </div>
        ))}
        <button onClick={addQuestion}>+ Add Another Question</button>
        <br /><br />

        <button onClick={handleCreateQuiz}>Create Quiz</button>
      </div>

      <hr />
      {/* LIST QUIZZES */}
      <h4>Existing Quizzes</h4>
      {quizzes.length === 0 ? (
        <p>No quizzes found for this course.</p>
      ) : (
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz._id} style={{ margin: '8px 0' }}>
              <strong>{quiz.title}</strong> (Questions: {quiz.questions.length})
              {' '}
              <button
                onClick={() => handleDeleteQuiz(quiz._id)}
                style={{ marginLeft: 8 }}
              >
                Delete
              </button>
              {/* Optional: Edit button to open an edit form/modal */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ManageCourseQuizzes;
