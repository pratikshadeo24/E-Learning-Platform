import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ManageCoursePosts() {
  const { courseId } = useParams();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

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
      setMessage('Failed to fetch posts');
    }
  };

  // CREATE
  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:4000/api/posts/${courseId}`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setContent('');
      fetchPosts();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Create failed');
    }
  };

  // DELETE
  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4000/api/posts/${courseId}/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Post deleted');
      fetchPosts();
    } catch (err) {
      setMessage('Delete failed');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Manage Posts</h3>
      {message && <p>{message}</p>}
      <textarea
        rows="3"
        placeholder="Write a new post..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <br/>
      <button onClick={handleCreate}>Create Post</button>
      <hr/>
      <ul>
        {posts.map((p) => (
          <li key={p._id}>
            {p.content}
            <button
              onClick={() => handleDelete(p._id)}
              style={{ marginLeft: 8 }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageCoursePosts;
