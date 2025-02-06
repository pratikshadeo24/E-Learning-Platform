// src/pages/student/CourseAssignmentDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function AssignmentDetail() {
  const { courseId, assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssignment();
    // eslint-disable-next-line
  }, [courseId, assignmentId]);

  const fetchAssignment = async () => {
    try {
      const token = localStorage.getItem('token');
      // e.g. GET /api/assignments/:courseId/:assignmentId
      const res = await axios.get(`http://localhost:4000/api/assignments/${courseId}/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignment(res.data);
    } catch (err) {
      setError('Failed to load assignment detail');
    }
  };

  if (error) return <p style={{ color:'red' }}>{error}</p>;
  if (!assignment) return <p>Loading assignment...</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{assignment.title}</h2>
      <p>{assignment.description}</p>
      <p>Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleString() : 'N/A'}</p>
    </div>
  );
}

export default AssignmentDetail;
