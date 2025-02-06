// src/pages/student/CoursePostDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function PostDetail() {
  const { courseId, postId } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line
  }, [courseId, postId]);

  const fetchPost = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:4000/api/posts/${courseId}/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPost(res.data);
    } catch (err) {
      setError('Failed to fetch post detail');
    }
  };

  if (error) return <p style={{color:'red'}}>{error}</p>;
  if (!post) return <p>Loading post...</p>;

  return (
    <div style={{ padding:'1rem' }}>
      <h2>Post Detail</h2>
      <p>{post.content}</p>
      <p><em>Posted on {new Date(post.createdAt).toLocaleString()}</em></p>
    </div>
  );
}

export default PostDetail;
