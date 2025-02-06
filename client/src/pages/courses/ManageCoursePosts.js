import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ManageCoursePosts() {
  const { courseId } = useParams();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [courseId]);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:4000/api/courses/${courseId}/posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts');
    }
  };

  const handleCreatePost = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:4000/api/courses/${courseId}/posts`,
        { content: newPost },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewPost('');
      fetchPosts();
    } catch (err) {
      console.error('Failed to create post');
    }
  };

  return (
    <div>
      <h3>Manage Posts/Announcements</h3>
      <div style={{ margin: '8px 0' }}>
        <textarea
          rows="3"
          placeholder="Write a new post/announcement..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <br/>
        <button onClick={handleCreatePost}>Post</button>
      </div>

      <hr/>
      <ul>
        {posts.map((p) => (
          <li key={p._id}>
            {p.content}
            <small> (posted on {new Date(p.createdAt).toLocaleString()})</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageCoursePosts;
