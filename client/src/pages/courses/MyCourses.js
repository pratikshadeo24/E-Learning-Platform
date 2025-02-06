import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:4000/api/enrollments/my-courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnrollments(res.data);
      // each item has .course referencing the actual course
    } catch (err) {
      console.error('Failed to fetch enrolled courses', err);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>My Courses</h2>
      {enrollments.length === 0 ? <p>You are not enrolled in any course.</p> : (
        <ul>
          {enrollments.map((en) => (
            <li key={en._id}>
              <strong>{en.course?.title}</strong> – {en.course?.description}<br/>
              <Link to={`/my-courses/${en.course?._id}`} style={{ marginLeft: 8 }}>
                View Course
              </Link>
            </li>

          ))}
        </ul>
      )}
    </div>
  );
}

export default MyCourses;
