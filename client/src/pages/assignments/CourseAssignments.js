// src/pages/student/CourseAssignments.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function CourseAssignments() {
  const { courseId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssignments();
    // eslint-disable-next-line
  }, [courseId]);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:4000/api/assignments/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(res.data);
    } catch (err) {
      setError('Failed to fetch assignments');
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Course Assignments</h2>
      {assignments.length === 0 ? (
        <p>No assignments yet.</p>
      ) : (
        <ul>
          {assignments.map((a) => (
            <li key={a._id}>
              <Link to={`/my-courses/${courseId}/assignments/${a._id}`}>
                <strong>{a.title}</strong>
              </Link>
              <br/>
              Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'N/A'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CourseAssignments;
