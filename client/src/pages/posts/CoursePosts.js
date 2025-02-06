// src/pages/student/CoursePosts.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function CoursePosts() {
  const { courseId } = useParams();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, [courseId]);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:4000/api/posts/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(res.data);
    } catch (err) {
      setError('Failed to fetch posts');
    }
  };

  if (error) {
    return <p style={{ color:'red' }}>{error}</p>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Course Announcements/Posts</h2>
      {posts.length === 0 ? (
        <p>No posts found for this course.</p>
      ) : (
        <ul>
          {posts.map((p) => (
            <li key={p._id}>
              <Link to={`/my-courses/${courseId}/posts/${p._id}`}>
                {p.content.slice(0, 50)}...
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CoursePosts;
