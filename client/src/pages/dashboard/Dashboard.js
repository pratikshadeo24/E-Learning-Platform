import React from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Dashboard() {
  const token = localStorage.getItem('token');
  let role = '';
  if (token) {
    const decoded = jwtDecode(token);
    role = decoded.role; // We assume the JWT has { role: 'STUDENT' | 'TEACHER' | 'ADMIN' }
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Dashboard</h2>
      {role === 'TEACHER' && (
        <>
          <Link to="/add-course">Add New Course</Link><br />
          <Link to="/manage-courses">Manage Courses</Link><br />
        </>
      )}

      {role === 'STUDENT' && (
        <>
          {/* Some student-specific links, e.g. enroll in courses, my courses */}
          <Link to="/courses">View All Courses</Link><br />
          <Link to="/my-courses">My Courses</Link><br />
        </>
      )}

    </div>
  );
}

export default Dashboard;
