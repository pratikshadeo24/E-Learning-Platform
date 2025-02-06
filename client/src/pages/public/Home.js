import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ padding: '1rem' }}>
      <h1>Welcome to E-Learning Portal</h1>
      <p>An all-in-one platform for courses, quizzes, and more.</p>
      <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
    </div>
  );
}

export default Home;
