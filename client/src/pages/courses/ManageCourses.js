import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function ManageCourses() {
  const [allCourses, setAllCourses] = useState([]);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const fetchAllCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:4000/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllCourses(res.data);

      // Now filter them based on user ID
      if (token) {
        const decoded = jwtDecode(token);
        const userId = decoded.userId; // or however your JWT payload is structured

        const teacherOnly = res.data.filter((course) => {
          return course.instructor && course.instructor._id === userId;
        });
        setTeacherCourses(teacherOnly);
      }
    } catch (err) {
      setError('Failed to load courses');
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/manage-courses/${courseId}`);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Manage My Courses</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      {teacherCourses.length === 0 ? (
        <p>You have not created any courses yet (or the data is empty).</p>
      ) : (
        <ul>
          {teacherCourses.map((c) => (
            <li key={c._id}>
              <strong>{c.title}</strong> - {c.description}
              <button style={{ marginLeft: 10 }} onClick={() => handleCourseClick(c._id)}>
                Manage
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ManageCourses;
