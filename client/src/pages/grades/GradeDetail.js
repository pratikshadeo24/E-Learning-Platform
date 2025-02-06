// src/pages/student/CourseGradeDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function GradeDetail() {
  const { courseId, gradeId } = useParams();
  const [grade, setGrade] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGrade();
    // eslint-disable-next-line
  }, [courseId, gradeId]);

  const fetchGrade = async () => {
    try {
      const token = localStorage.getItem('token');
      // e.g. GET /api/grades/:courseId/:gradeId
      const res = await axios.get(`http://localhost:4000/api/grades/${courseId}/${gradeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGrade(res.data);
    } catch (err) {
      setError('Failed to load grade detail');
    }
  };

  if (error) return <p style={{ color:'red' }}>{error}</p>;
  if (!grade) return <p>Loading grades...</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{grade.student}</h2>
      <p>{grade.gradeValue}</p>
    </div>
  );
}

export default GradeDetail;
