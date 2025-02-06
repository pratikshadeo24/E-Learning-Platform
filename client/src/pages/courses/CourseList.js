import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:4000/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to fetch courses', err);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:4000/api/enrollments/${courseId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Enrolled successfully!');
      navigate('/my-courses');
    } catch (err) {
      alert(err.response?.data?.error || 'Enrollment failed');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>All Courses</h2>
      {courses.length === 0 ? <p>No courses found.</p> : (
        <ul>
          {courses.map((c) => (
            <li key={c._id}>
              <strong>{c.title}</strong> – {c.description}
              <button onClick={() => handleEnroll(c._id)}>
                Enroll
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CourseList;
