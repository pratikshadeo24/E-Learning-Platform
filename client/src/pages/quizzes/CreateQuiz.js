import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CreateQuiz() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', options: [], correctAnswerIndex: 0 }
  ]);

  useEffect(() => {
    // fetch courses taught by this teacher
    fetchTeacherCourses();
  }, []);

  const fetchTeacherCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:4000/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter only courses where user is the instructor
      // or handle that logic in the backend
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to fetch courses');
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', options: [], correctAnswerIndex: 0 }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleAddOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push('');
    setQuestions(updated);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:4000/api/quizzes', {
        title,
        questions,
        courseId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Quiz created successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Quiz creation failed');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Create Quiz</h2>
      <form onSubmit={handleCreate}>
        <div>
          <label>Course:</label><br/>
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
            <option value="">-- Select a Course --</option>
            {courses.map((c) => (
              <option value={c._id} key={c._id}>{c.title}</option>
            ))}
          </select>
        </div>
        <div style={{ marginTop: 8 }}>
          <label>Quiz Title:</label><br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {questions.map((q, qIndex) => (
          <div key={qIndex} style={{ border: '1px solid #ccc', margin: '8px 0', padding: '8px' }}>
            <label>Question:</label><br />
            <input
              type="text"
              value={q.question}
              onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
              required
            />
            <div style={{ marginTop: 8 }}>
              <strong>Options:</strong>
              {q.options.map((opt, optIndex) => (
                <div key={optIndex}>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                    required
                  />
                  {/* Mark correct answer */}
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={q.correctAnswerIndex === optIndex}
                    onChange={() => handleQuestionChange(qIndex, 'correctAnswerIndex', optIndex)}
                  />
                  <label>Correct</label>
                </div>
              ))}
              <button type="button" onClick={() => handleAddOption(qIndex)}>
                + Add Option
              </button>
            </div>
          </div>
        ))}

        <button type="button" onClick={handleAddQuestion}>+ Add Another Question</button><br/><br/>
        <button type="submit">Create Quiz</button>
      </form>
    </div>
  );
}

export default CreateQuiz;
