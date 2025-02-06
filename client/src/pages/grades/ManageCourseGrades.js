import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ManageCourseGrades() {
  const { courseId } = useParams();
  const [grades, setGrades] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [gradeValue, setGradeValue] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchGrades();
    // eslint-disable-next-line
  }, [courseId]);

  const fetchGrades = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:4000/api/grades/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGrades(res.data);
    } catch (err) {
      setMessage('Failed to fetch grades');
    }
  };

  const handleSetGrade = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:4000/api/grades/${courseId}`,
        { studentId, gradeValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setStudentId('');
      setGradeValue('');
      fetchGrades();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to set grade');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Manage Grades</h3>
      {message && <p>{message}</p>}
      <label>Student ID:</label><br/>
      <input
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      /><br/>
      <label>Grade Value:</label><br/>
      <input
        value={gradeValue}
        onChange={(e) => setGradeValue(e.target.value)}
      /><br/>
      <button onClick={handleSetGrade}>Set/Update Grade</button>
      <hr/>
      <ul>
        {grades.map((g) => (
          <li key={g._id}>
            Student: {g.student?.email} — Grade: {g.gradeValue}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageCourseGrades;
