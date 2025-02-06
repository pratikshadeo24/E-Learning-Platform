// src/pages/student/CourseGrades.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function CourseGrades() {
  const { courseId } = useParams();
  const [gradeRecord, setGradeRecord] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGrade();
    // eslint-disable-next-line
  }, [courseId]);

  const fetchGrade = async () => {
    try {
      const token = localStorage.getItem('token');
      // Possibly GET /api/grades/:courseId?studentId=...
      // or if your route automatically looks up the student's grade
      const res = await axios.get(`http://localhost:4000/api/grades/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // You might return an object like { gradeValue: "A", updatedAt: ... }
      // or an array if multiple grades.
      setGradeRecord(res.data);
    } catch (err) {
      setError('Failed to load grades');
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!gradeRecord) return <p>Loading your grade...</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>My Grade for This Course</h2>
      <p><strong>Grade:</strong> {gradeRecord.gradeValue || 'N/A'}</p>
      <p><em>Last Updated: {new Date(gradeRecord.updatedAt).toLocaleString()}</em></p>
    </div>
  );
}

export default CourseGrades;
